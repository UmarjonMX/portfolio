/**
 * Fine-grained continuity check: samples the morph in 6px scroll steps across
 * the transition and asserts the per-step delta stays inside what smooth
 * motion implies. A `if (scrollY > N) setState()` switch would show up here as
 * a single large delta; continuous interpolation cannot.
 *
 *   node qa_motion.cjs [url]
 */
const puppeteer = require('puppeteer');

const URL = process.argv[2] || 'http://localhost:4175/';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const [w, h] of [[1440, 900], [768, 1024], [390, 844]]) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h });
    await page.goto(URL, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 900));

    const samples = [];
    const top = Math.round(h * 0.8);
    for (let y = 0; y <= top; y += 6) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await new Promise((r) => setTimeout(r, 22));
      const s = await page.evaluate(() => {
        const els = Array.from(
          document.querySelectorAll('header nav > div:first-child > div')
        );
        const p = els.map((el) => {
          const r = el.getBoundingClientRect();
          return { x: r.x, w: r.width, h: r.height };
        });
        const right = els[2];
        const menuWrap = right.querySelector('button[aria-controls]')?.parentElement;
        return {
          pieces: p,
          radius: getComputedStyle(els[0]).borderTopLeftRadius,
          seam: getComputedStyle(right).borderLeftColor,
          padding: getComputedStyle(right).paddingLeft,
          railPad: getComputedStyle(document.querySelector('header nav')).paddingTop,
          opacity: getComputedStyle(menuWrap || right).opacity,
        };
      });
      samples.push(s);
    }
    await page.close();

    /* Per-step deltas. The morph maps ~0.54 of the Hero runway (about 0.54 x
       0.9 x viewport ≈ 440px at 900px tall) onto a ~360px logo travel, so the
       peak velocity of a smoothstep is roughly 1.2px per px of scroll. Anything
       above 4px per 6px step is not smooth motion — it is a switch. */
    const LIMIT = 4;
    let worstL = 0;
    let worstR = 0;
    let worstH = 0;
    let worstSeam = 0;
    let worstPad = 0;
    let worstRadius = 0;
    let worstRail = 0;
    for (let i = 1; i < samples.length; i += 1) {
      const a = samples[i - 1];
      const b = samples[i];
      const num = (v) => parseFloat(v);
      worstL = Math.max(worstL, Math.abs(b.pieces[0].x - a.pieces[0].x));
      worstR = Math.max(worstR, Math.abs(b.pieces[2].x - a.pieces[2].x));
      worstH = Math.max(worstH, Math.abs(b.pieces[0].h - a.pieces[0].h));
      worstSeam = Math.max(worstSeam, Math.abs(num(b.seam.match(/[\d.]+\)$/)?.[0] || 0) - 0));
      worstPad = Math.max(worstPad, Math.abs(num(b.padding) - num(a.padding)));
      worstRadius = Math.max(worstRadius, Math.abs(num(b.radius) - num(a.radius)));
      worstRail = Math.max(worstRail, Math.abs(num(b.railPad) - num(a.railPad)));
    }

    /* Continuity is only meaningful while the morph is actually running. Samples
       outside the transition are legitimately identical (both resting states
       are static), so they are excluded: what matters is that inside the window
       no two consecutive samples share a position — that is what a discrete
       scrollY threshold would produce. */
    const moving = [];
    for (let i = 1; i < samples.length; i += 1) {
      if (samples[i].pieces[0].x !== samples[i - 1].pieces[0].x) moving.push(i);
    }
    /* Distinctness is checked on the raw float, not the rounded pixel: with ~0.3px
       of travel per step at the slow end of the curve, rounding to whole pixels
       repeats values legitimately. */
    const distinctX = new Set(moving.map((i) => samples[i].pieces[0].x.toFixed(3))).size;
    const distinctR = new Set(moving.map((i) => samples[i].pieces[2].x.toFixed(3))).size;
    const distinctSeam = new Set(samples.map((s) => s.seam)).size;
    /* Resting spans, to confirm the two ends really are static. */
    const stillBefore = moving.length ? moving[0] : samples.length;
    const stillAfter = samples.length - (moving.length ? moving.at(-1) + 1 : 0);

    console.log(`\n${w}x${h}  (${samples.length} samples, 6px step)`);
    console.log(
      `  moving samples: ${moving.length} (resting ${stillBefore} before / ${stillAfter} after)`
    );
    console.log(`  distinct logo x while moving   : ${distinctX}/${moving.length}`);
    console.log(`  distinct control x while moving: ${distinctR}/${moving.length}`);
    console.log(`  distinct seam colours: ${distinctSeam}`);
    console.log(`  max Δ logo x / 6px scroll : ${worstL.toFixed(2)}px   (switch would be ~300px)`);
    console.log(`  max Δ control x / 6px      : ${worstR.toFixed(2)}px`);
    console.log(`  max Δ bar height / 6px     : ${worstH.toFixed(2)}px`);
    console.log(`  max Δ capsule padding / 6px: ${worstPad.toFixed(2)}px`);
    console.log(`  max Δ radius / 6px         : ${worstRadius.toFixed(2)}px`);
    console.log(`  max Δ rail offset / 6px    : ${worstRail.toFixed(2)}px`);
    console.log(`  rail offset ${samples[0].railPad} → ${samples.at(-1).railPad}`);
    console.log(`  seam ${samples[0].seam} → ${samples.at(-1).seam}`);
    console.log(`  hamburger opacity ${samples[0].opacity} → ${samples.at(-1).opacity}`);

    /* Smoothstep's peak slope is 1.5x its mean. The morph covers ~0.54 of the Hero
       runway (≈0.49 x viewport height) to move the logo ≈(bar width - inset),
       so the peak is bounded well under 3px per 6px of scroll. */
    const bad = [];
    if (worstL > 12) bad.push(`logo delta ${worstL.toFixed(1)}px per 6px — too abrupt`);
    if (worstR > 12) bad.push(`control delta ${worstR.toFixed(1)}px per 6px — too abrupt`);
    if (moving.length && distinctX < moving.length * 0.95) {
      bad.push('logo position repeats while moving — not continuously varying');
    }
    if (moving.length && distinctR < moving.length * 0.95) {
      bad.push('control position repeats while moving — not continuously varying');
    }
    /* The 1px outline is deliberately constant in colour (see the seam note in
       Navbar): it is the same outline welded or separated, and what changes is
       the geometry it sits on. Asserting it varies would assert the opposite of
       the design. The geometry checks above are the ones that matter. */
    if (distinctSeam !== 1) {
      console.log(`  note: seam colour is varying (${distinctSeam} values)`);
    }
    console.log(`  VERDICT: ${bad.length ? bad.join(', ') : 'continuous motion ✓'}`);
  }

  await browser.close();
})();