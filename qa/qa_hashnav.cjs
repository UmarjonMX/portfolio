/**
 * Verifies that a Navbar link clicked on a project detail page actually lands
 * on the intended section of the home page.
 *
 *   node qa_hashnav.cjs [url]
 */
const puppeteer = require('puppeteer');
const URL = process.argv[2] || 'http://localhost:4177/';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL + 'projects/anonymous-chat', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 800));

  for (const label of ['Projects', 'About', 'Contact']) {
    await page.goto(URL + 'projects/anonymous-chat', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 600));
    await page.evaluate((l) => {
      const a = Array.from(document.querySelectorAll('header nav a'))
        .find((x) => x.textContent.trim().toLowerCase() === l.toLowerCase());
      if (a) a.click();
    }, label);
    await new Promise((r) => setTimeout(r, 1400));
    const res = await page.evaluate(() => {
      const el = document.getElementById(window.location.hash.slice(1));
      return {
        path: window.location.pathname + window.location.hash,
        scrollY: Math.round(window.scrollY),
        targetTop: el ? Math.round(el.getBoundingClientRect().top) : null,
      };
    });
    console.log(`click "${label}" ->`, JSON.stringify(res));
  }

  await browser.close();
})();