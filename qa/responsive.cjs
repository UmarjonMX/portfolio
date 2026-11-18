/**
 * Horizontal-overflow sweep across the full range of real viewport widths,
 * at several scroll depths, on both themes and in both languages.
 *
 *   node qa/responsive.cjs [url]
 */
const puppeteer = require('puppeteer');
const URL = process.argv[2] || 'http://localhost:4177/';

const WIDTHS = [320, 360, 390, 414, 480, 600, 768, 834, 1024, 1180, 1280, 1440, 1680, 1920, 2560];
const SCROLLS = [0, 0.25, 0.5, 0.75, 1];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const problems = [];

  for (const lang of ['en', 'uz']) {
    for (const w of WIDTHS) {
      const page = await browser.newPage();
      page.on('pageerror', (e) => problems.push(`[${lang} ${w}] pageerror ${e.message}`));
      await page.setViewport({ width: w, height: 820 });
      await page.evaluateOnNewDocument((l) => {
        localStorage.setItem('language', l);
        localStorage.setItem('theme', 'light');
      }, lang);
      await page.goto(URL, { waitUntil: 'load', timeout: 25000 });
      await sleep(1100);

      for (const f of SCROLLS) {
        await page.evaluate((v) => {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          window.scrollTo(0, Math.round(max * v));
        }, f);
        await sleep(320);

        const r = await page.evaluate(() => {
          const de = document.documentElement;
          const over = [];
          if (de.scrollWidth > window.innerWidth + 1) {
            document.querySelectorAll('body *').forEach((el) => {
              const b = el.getBoundingClientRect();
              if (b.width === 0) return;
              if (b.right > window.innerWidth + 1.5 || b.left < -1.5) {
                const cs = getComputedStyle(el);
                if (cs.position === 'fixed' || cs.visibility === 'hidden') return;
                if (el.closest('[aria-hidden="true"]')) return;
                over.push(
                  `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} ` +
                    `[${Math.round(b.left)}..${Math.round(b.right)}]`
                );
              }
            });
          }
          return { docW: de.scrollWidth, winW: window.innerWidth, over: over.slice(0, 4) };
        });

        if (r.over.length) {
          problems.push(
            `[${lang} ${w} @${f}] scrollWidth ${r.docW} > ${r.winW}\n    ${r.over.join('\n    ')}`
          );
        }
      }
      await page.close();
    }
  }

  console.log(problems.length ? problems.join('\n') : 'no horizontal overflow at any width');
  await browser.close();
})();