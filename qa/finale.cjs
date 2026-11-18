/**
 * Walks the closing (FinalStatement) chapter and reports what is actually
 * visible at each step. Catches content that is present in the DOM but
 * rendered invisible by a progress-driven transform.
 *
 *   node qa/finale.cjs [url]
 */
const puppeteer = require('puppeteer');
const URL = process.argv[2] || 'http://localhost:4177/';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500));

  const bounds = await page.evaluate(() => {
    const el = document.querySelector('[data-chapter="finale"]');
    const r = el.getBoundingClientRect();
    return { start: Math.round(r.top + window.scrollY), height: Math.round(r.height) };
  });
  console.log('finale bounds', JSON.stringify(bounds));

  const docMax = await page.evaluate(
    () => document.documentElement.scrollHeight - window.innerHeight
  );
  console.log('doc scrollable', docMax);

  for (let i = 0; i <= 12; i++) {
    const y = Math.round(bounds.start + (bounds.height - 900) * (i / 12));
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await new Promise((r) => setTimeout(r, 260));
    const info = await page.evaluate(() => {
      const h2 = document.querySelector('[data-chapter="finale"] h2');
      const echo = document.querySelector('[data-chapter="finale"] h2')?.parentElement
        ?.previousElementSibling;
      const cs = h2 ? getComputedStyle(h2) : null;
      const spans = h2 ? Array.from(h2.querySelectorAll('span')).map((s) => {
        const c = getComputedStyle(s);
        return {
          t: (s.textContent || '').slice(0, 14),
          clip: c.clipPath,
          op: c.opacity,
        };
      }) : [];
      const kicker = document.querySelector('[data-chapter="finale"] a[href^="mailto"]');
      const kc = kicker ? getComputedStyle(kicker.parentElement) : null;
      return {
        scrollY: Math.round(window.scrollY),
        h2box: h2 ? Math.round(h2.getBoundingClientRect().top) : null,
        h2font: cs ? cs.fontSize : null,
        spans,
        echoOp: echo ? getComputedStyle(echo).opacity : null,
        kickerOp: kc ? kc.opacity : null,
      };
    });
    console.log(i, JSON.stringify(info));
    if (i === 8) await page.screenshot({ path: '/tmp/shots/finale-mid.png' });
  }

  await browser.close();
})();