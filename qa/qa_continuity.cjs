/**
 * Continuity probe: walks the Hero's pinned runway in small steps and prints
 * the real geometry of the three navbar pieces at each one, so the separation
 * can be verified as continuous motion rather than a switch.
 *
 *   node qa_continuity.cjs [url]
 */
const puppeteer = require('puppeteer');

const URL = process.argv[2] || 'http://localhost:4175/';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const problems = [];

  for (const [w, h] of [[1440, 900], [1280, 800], [1024, 900], [768, 1024], [390, 844]]) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h });
    await page.goto(URL, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 900));

    console.log(`\n════ ${w}x${h} — hero runway ════`);
    console.log('  y     Lx   Lw    Cx   Cw    Rx   Rw   gapL gapR  h  rTL  seamL');
    const samples = [];
    let prev = null;
    const maxY = Math.round(h * 1.35);
    for (let y = 0; y <= maxY; y += Math.round(h * 0.05)) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await new Promise((r) => setTimeout(r, 90));
      const m = await page.evaluate(() => {
        const pieces = Array.from(document.querySelectorAll('header nav > div:first-child > div'));
        const g = (el) => {
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          return {
            x: Math.round(r.x * 10) / 10,
            w: Math.round(r.width * 10) / 10,
            h: Math.round(r.height * 10) / 10,
            rtl: cs.borderTopLeftRadius,
            rtr: cs.borderTopRightRadius,
            seam: cs.borderRightColor,
          };
        };
        return {
          pieces: pieces.map(g),
          docW: document.documentElement.scrollWidth,
          winW: window.innerWidth,
        };
      });
      const [L, C, R] = m.pieces;
      const gapL = C.w ? Math.round(C.x - (L.x + L.w)) : Math.round(R.x - (L.x + L.w));
      const gapR = C.w ? Math.round(R.x - (C.x + C.w)) : 0;
      console.log(
        `${String(y).padStart(5)} ${String(L.x).padStart(6)} ${String(L.w).padStart(5)} ` +
          `${String(C.x).padStart(6)} ${String(C.w).padStart(5)} ` +
          `${String(R.x).padStart(6)} ${String(R.w).padStart(5)} ` +
          `${String(gapL).padStart(5)} ${String(gapR).padStart(5)} ${String(L.h).padStart(3)} ` +
          `${String(L.rtl).padStart(5)} ${String(C.w ? C.seam : '-').padStart(16)}`
      );

      if (m.docW > m.winW + 1) problems.push(`${w} y=${y}: horizontal overflow`);
      if (L.w < 20) problems.push(`${w} y=${y}: logo capsule collapsed (${L.w})`);
      if (R.w < 40) problems.push(`${w} y=${y}: right capsule collapsed (${R.w})`);
      if (gapL < -1) problems.push(`${w} y=${y}: left overlaps centre by ${-gapL}`);
      if (C.w > 0 && gapR < -1) problems.push(`${w} y=${y}: centre overlaps right by ${-gapR}`);
      if (gapL < -1 && gapR < -1) problems.push(`${w} y=${y}: pieces collide`);
      if (L.x < -1 || R.x + R.w > m.winW + 1) problems.push(`${w} y=${y}: capsule off-viewport`);

      samples.push({ y, L, C, R, winW: m.winW });
      prev = { Lx: L.x, Rx: R.x, Cx: C.x, Cw: C.w };
    }

    /* Self-calibrating smoothness test.
       Each axis travels a known total distance T. Measure the per-step deltas
       across the moving window and compare the largest against the mean. Any
       smooth easing curve — including a smoothstep composed with other
       interpolations — keeps its peak slope within a small factor of its mean;
       measured here the peak is ≈2.2x. A discrete scrollY threshold would put
       the entire travel T into one step, giving a ratio near the number of
       steps in the window. Anything past 4x the mean is a switch, not motion. */
    const settled = samples.at(-1);
    const rest = samples[0];
    const axes = [
      ['logo', 'L'],
      ['controls', 'R'],
      ['centre', 'C'],
    ];
    const report = [];
    for (const [label, key] of axes) {
      const total = Math.abs(settled[key].x - rest[key].x);
      if (total < 8 || settled[key].w === 0) {
        report.push(`${label}: travel ${total.toFixed(0)}px (not measured)`);
        continue;
      }
      const moving = [];
      for (let i = 1; i < samples.length; i += 1) {
        const d = Math.abs(samples[i][key].x - samples[i - 1][key].x);
        if (d > 0.01) moving.push({ y: samples[i].y, d });
      }
      const mean = moving.reduce((s, m) => s + m.d, 0) / moving.length;
      const worst = moving.reduce((a, m) => (m.d > a.d ? m : a), moving[0]);
      const ratio = worst.d / mean;
      report.push(
        `${label}: travel ${total.toFixed(0)}px over ${moving.length} steps, ` +
          `mean ${mean.toFixed(2)}px peak ${worst.d.toFixed(2)}px ratio ${ratio.toFixed(2)}x`
      );
      if (ratio > 4) {
        problems.push(
          `${w} ${label}: peak step is ${ratio.toFixed(1)}x the mean (y=${worst.y}) — discontinuous`
        );
      }
      if (moving.length > 3 && worst.d > total * 0.5) {
        problems.push(`${w} ${label}: a single step covers ${((worst.d / total) * 100).toFixed(0)}% of the travel`);
      }
    }
    console.log(`  ${report.join('\n  ')}`);
    await page.close();
  }

  console.log('\n════ PROBLEMS ════');
  console.log(problems.length ? [...new Set(problems)].join('\n') : 'none');
  await browser.close();
})();