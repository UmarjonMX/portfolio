/**
 * Measures whether the closing headline's glyphs actually fit the column.
 * The span is a block that fills the column, so its own box proves nothing —
 * the text has to be measured with a Range.
 *
 *   node qa/finale-fit.cjs [url]
 */
const puppeteer = require('puppeteer');
const URL = process.argv[2] || 'http://localhost:4177/';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let failures = 0;

  for (const lang of ['en', 'uz']) {
    for (const w of [1024, 1280, 1440, 1680, 1920, 2560]) {
      const page = await browser.newPage();
      await page.setViewport({ width: w, height: 900 });
      await page.evaluateOnNewDocument(
        (l) => localStorage.setItem('language', l),
        lang
      );
      await page.goto(URL, { waitUntil: 'load', timeout: 20000 });
      await sleep(1200);
      // Jump to the very end so the headline is fully revealed.
      await page.evaluate(() =>
        window.scrollTo(0, document.documentElement.scrollHeight)
      );
      await sleep(800);

      const m = await page.evaluate(() => {
        const h2 = document.querySelector('[data-chapter="finale"] h2');
        if (!h2) return null;
        const range = document.createRange();
        const rows = Array.from(h2.querySelectorAll(':scope > span')).map((s) => {
          range.selectNodeContents(s);
          const r = range.getBoundingClientRect();
          return {
            t: s.textContent,
            w: Math.round(r.width),
            right: Math.round(r.right),
            over: Math.max(0, Math.round(r.right - window.innerWidth)),
          };
        });
        return {
          fs: getComputedStyle(h2).fontSize,
          col: Math.round(h2.getBoundingClientRect().width),
          vw: window.innerWidth,
          rows,
        };
      });

      const bad = !m || m.rows.some((r) => r.over > 0);
      if (bad) failures++;
      console.log(
        bad ? 'OVERFLOW' : 'ok      ',
        lang,
        String(w).padStart(4),
        JSON.stringify(m)
      );
      await page.close();
    }
  }

  console.log(failures ? `${failures} overflow(s)` : 'no overflow at any width');
  await browser.close();
})();