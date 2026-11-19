/**
 * Per-scroll-frame check: the navbar must not cause a React render or a
 * layout read while scrolling.
 *
 *   node qa_perf.cjs [url]
 */
const puppeteer = require('puppeteer');

const URL = process.argv[2] || 'http://localhost:4175/';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const problems = [];

  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h });
    await page.goto(URL, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    /* Count React commits attributable to the navbar during a smooth scroll.
       A commit shows up as a mutation of the nav's own DOM text/attributes, so
       the probe watches for attribute changes inside the nav subtree while the
       scroll position changes. MotionValues write inline styles on motion
       elements without committing, so style writes on the pieces themselves
       are excluded — only *other* attributes (class, aria, text) count. */
    const res = await page.evaluate(async () => {
      const nav = document.querySelector('header nav');
      const mutations = { attributes: 0, attributeNames: {}, childList: 0, characterData: 0 };
      const obs = new MutationObserver((records) => {
        for (const rec of records) {
          if (rec.type === 'attributes') {
            const name = rec.attributeName;
            /* Inline style on a piece is the MotionValue channel — expected. */
            if (name === 'style' && rec.target.hasAttribute('style')) {
              const styleProps = Object.keys(rec.target.style);
              const onlyGeometry =
                styleProps.length > 0 &&
                styleProps.every((p) =>
                  [
                    'transform',
                    'width',
                    'height',
                    'left',
                    'top',
                    'x',
                    'y',
                    'scale',
                    'padding-left',
                    'padding-right',
                    'padding-top',
                    'border-radius',
                    'border-top-left-radius',
                    'border-top-right-radius',
                    'border-bottom-left-radius',
                    'border-bottom-right-radius',
                    'border-color',
                    'border-left-color',
                    'border-right-color',
                    'border-top-color',
                    'border-bottom-color',
                    'background-color',
                    'opacity',
                    'gap',
                  ].includes(p)
                );
              if (onlyGeometry) continue;
            }
            mutations.attributes += 1;
            mutations.attributeNames[name] = (mutations.attributeNames[name] || 0) + 1;
          } else if (rec.type === 'childList') mutations.childList += 1;
          else mutations.characterData += 1;
        }
      });
      obs.observe(nav, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
      });

      /* Smooth scroll through the morph and past it. */
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const frames = [];
      let last = performance.now();
      let raf;
      const tick = () => {
        const now = performance.now();
        frames.push(now - last);
        last = now;
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      const steps = 90;
      for (let i = 0; i <= steps; i += 1) {
        window.scrollTo(0, Math.round((max * 0.06 * i) / steps));
        await new Promise((r) => requestAnimationFrame(r));
      }
      cancelAnimationFrame(raf);
      obs.disconnect();
      frames.shift();
      const sorted = [...frames].sort((a, b) => a - b);
      return {
        mutations,
        frames: frames.length,
        median: sorted[Math.floor(sorted.length / 2)],
        p95: sorted[Math.floor(sorted.length * 0.95)],
        worst: sorted.at(-1),
      };
    });

    console.log(`\n${w}x${h}`);
    console.log(`  non-geometry DOM mutations during scroll: ${res.mutations.attributes}`);
    console.log(`  childList: ${res.mutations.childList}  characterData: ${res.mutations.characterData}`);
    if (Object.keys(res.mutations.attributeNames).length) {
      console.log(`  attributes touched: ${JSON.stringify(res.mutations.attributeNames)}`);
    }
    console.log(
      `  frames: ${res.frames} median ${res.median.toFixed(1)}ms p95 ${res.p95.toFixed(1)}ms worst ${res.worst.toFixed(1)}ms`
    );
    if (res.mutations.childList) problems.push(`${w}: nav subtree rebuilt during scroll`);
    if (res.mutations.characterData) problems.push(`${w}: nav text rewritten during scroll`);
    if (res.mutations.attributes > 4) {
      problems.push(`${w}: ${res.mutations.attributes} non-style attribute writes during scroll`);
    }
    await page.close();
  }

  console.log('\n════ PROBLEMS ════');
  console.log(problems.length ? problems.join('\n') : 'none');
  await browser.close();
  process.exit(problems.length ? 1 : 0);
})();