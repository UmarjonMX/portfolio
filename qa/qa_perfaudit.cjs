/**
 * Scroll-performance probe: measures frame pacing while scrolling the home page
 * with the WebGL background on, and with the background suppressed.
 *
 *   node qa_perfaudit.cjs [url]
 */
const puppeteer = require('puppeteer');

const URL = process.argv[2] || 'http://localhost:4177/';

async function measure(page, label) {
  const res = await page.evaluate(async () => {
    const frames = [];
    let last = performance.now();
    let running = true;
    const tick = (now) => {
      frames.push(now - last);
      last = now;
      if (running) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    const t0 = performance.now();
    while (performance.now() - t0 < 3000) {
      const f = (performance.now() - t0) / 3000;
      window.scrollTo(0, Math.round(max * (f % 1)));
      await new Promise((r) => requestAnimationFrame(r));
    }
    running = false;

    const sorted = frames.slice(3).sort((a, b) => a - b);
    const pct = (p) => sorted[Math.floor(sorted.length * p)] || 0;
    return {
      frames: sorted.length,
      median: +pct(0.5).toFixed(2),
      p95: +pct(0.95).toFixed(2),
      max: +Math.max(...sorted).toFixed(2),
      over32ms: sorted.filter((f) => f > 32).length,
      over50ms: sorted.filter((f) => f > 50).length,
    };
  });
  console.log(label, JSON.stringify(res));
  return res;
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500));

  await measure(page, 'WITH WEBGL BG :');

  // Suppress the canvas entirely and re-measure: isolates the JS cost of the
  // background layer from the rest of the page.
  await page.evaluate(() => {
    document.querySelectorAll('canvas').forEach((c) => c.remove());
  });
  await measure(page, 'CANVAS REMOVED:');

  await browser.close();
})();