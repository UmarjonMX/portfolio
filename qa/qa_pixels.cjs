/**
 * Pixel-level check that the unified top state reads as ONE bar.
 *
 * Samples a horizontal scanline straight through the middle of the navbar and
 * reports the colour at every x. In the unified state the three pieces must be
 * one uninterrupted run of the surface colour, with no background showing
 * through at the seams. In the separated state the same scanline must show
 * three runs separated by background.
 *
 *   node qa_pixels.cjs [url]
 */
const puppeteer = require('puppeteer');

const URL = process.argv[2] || 'http://localhost:4175/';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const problems = [];

  for (const [w, h] of [[1440, 900], [768, 1024]]) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h });
    await page.goto(URL, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    const probe = async (label, scrollY) => {
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await new Promise((r) => setTimeout(r, 400));

      // Classify each column: surface if it is opaque enough to read as the
      // bar, otherwise background. Uses the element under the point, not a
      // screenshot, so it is exact and cheap.
      const runs = await page.evaluate(() => {
        const els = Array.from(
          document.querySelectorAll('header nav > div:first-child > div')
        );
        const nav = els[0].getBoundingClientRect();
        const yMid = nav.top + nav.height / 2;
        const row = [];
        for (let x = 0; x < window.innerWidth; x += 1) {
          const hit = document.elementFromPoint(x, yMid);
          const inside = hit && els.some((el) => el.contains(hit) || el === hit);
          row.push(inside ? 1 : 0);
        }
        /* Collapse into runs. */
        const out = [];
        let start = 0;
        for (let x = 1; x <= row.length; x += 1) {
          if (x === row.length || row[x] !== row[start]) {
            out.push({ v: row[start], x0: start, x1: x - 1, w: x - start });
            start = x;
          }
        }
        return { runs: out, navTop: Math.round(nav.top), navBottom: Math.round(nav.bottom) };
      });

      const surfaceRuns = runs.runs.filter((r) => r.v === 1 && r.w >= 1);
      console.log(`\n${label} @${w}x${h}  bar y=${runs.navTop}..${runs.navBottom}`);
      console.log(
        `  surface runs (≥1px): ${surfaceRuns.length} → ` +
          surfaceRuns.map((r) => `${r.x0}-${r.x1}(${r.w})`).join(' ')
      );
      const interiorBreaks = runs.runs.filter(
        (r) => r.v === 0 && r.x0 > 0 && r.x1 < w - 1 && r.w >= 2
      );
      if (interiorBreaks.length) {
        console.log(
          `  ✗ background shows through at: ${interiorBreaks
            .map((r) => `${r.x0}-${r.x1}`)
            .join(' ')}`
        );
      }
      return { surfaceRuns: surfaceRuns.length, interiorBreaks };
    };

    const top = await probe('UNIFIED (top of hero)', 0);
    const mid = await probe('SEPARATED (past the hero)', Math.round(h * 0.8));

    if (top.surfaceRuns !== 1) {
      problems.push(`${w}: unified state is ${top.surfaceRuns} runs, expected 1 continuous bar`);
    }
    if (top.interiorBreaks.length) {
      problems.push(`${w}: seams visible in the unified bar`);
    }
    if (mid.surfaceRuns !== 3) {
      problems.push(`${w}: separated state shows ${mid.surfaceRuns} pieces, expected 3`);
    }

    // Light theme too
    await page.evaluate(() => localStorage.setItem('theme', 'light'));
    await page.goto(URL, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));
    await probe('UNIFIED light', 0);
    await page.close();
  }

  console.log('\n════ PROBLEMS ════');
  console.log(problems.length ? problems.join('\n') : 'none');
  await browser.close();
  process.exit(problems.length ? 1 : 0);
})();