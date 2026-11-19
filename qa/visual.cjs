/**
 * Visual + behavioural regression capture.
 *   node qa/visual.cjs [url]
 */
const puppeteer = require('puppeteer');
const URL = process.argv[2] || 'http://localhost:4177/';

const VIEWS = [
  { name: 'home-light-top', w: 1440, h: 900, theme: 'light', y: 0 },
  { name: 'home-light-about', w: 1440, h: 900, theme: 'light', f: 0.22 },
  { name: 'home-light-projects', w: 1440, h: 900, theme: 'light', f: 0.42 },
  { name: 'home-light-resume', w: 1440, h: 900, theme: 'light', f: 0.62 },
  { name: 'home-light-contact', w: 1440, h: 900, theme: 'light', f: 0.82 },
  { name: 'home-dark-top', w: 1440, h: 900, theme: 'dark', y: 0 },
  { name: 'home-dark-projects', w: 1440, h: 900, theme: 'dark', f: 0.42 },
  { name: 'home-dark-contact', w: 1440, h: 900, theme: 'dark', f: 0.82 },
  { name: 'mobile-light-top', w: 390, h: 844, theme: 'light', y: 0 },
  { name: 'mobile-light-projects', w: 390, h: 844, theme: 'light', f: 0.42 },
  { name: 'mobile-dark-contact', w: 390, h: 844, theme: 'dark', f: 0.82 },
  { name: 'tablet-light-projects', w: 768, h: 1024, theme: 'light', f: 0.42 },
  { name: 'uz-light-top', w: 1440, h: 900, theme: 'light', y: 0, lang: 'uz' },
  { name: 'uz-light-resume', w: 1440, h: 900, theme: 'light', f: 0.62, lang: 'uz' },
];

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const issues = [];

  for (const v of VIEWS) {
    const page = await browser.newPage();
    page.on('pageerror', (e) => issues.push(`${v.name}: ${e.message}`));
    page.on('console', (m) => {
      if (m.type() === 'error' && !/WebGL|SwiftShader|GL_RENDERER/i.test(m.text()))
        issues.push(`${v.name}: console ${m.text()}`);
    });
    await page.setViewport({ width: v.w, height: v.h });
    await page.evaluateOnNewDocument((t, l) => {
      localStorage.setItem('theme', t);
      localStorage.setItem('language', l);
    }, v.theme, v.lang || 'en');
    await page.goto(URL, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    if (v.f !== undefined) {
      const max = await page.evaluate(
        () => document.documentElement.scrollHeight - window.innerHeight
      );
      await page.evaluate((y) => window.scrollTo(0, y), Math.round(max * v.f));
      await new Promise((r) => setTimeout(r, 900));
    }

    await page.screenshot({ path: `/tmp/shots/${v.name}.png` });
    await page.close();
  }

  // Project pages
  for (const slug of ['kitobiyot-12', 'anonymous-chat', '3d-portfolio', 'umars-blog']) {
    const page = await browser.newPage();
    page.on('pageerror', (e) => issues.push(`project ${slug}: ${e.message}`));
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${URL}projects/${slug}`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));
    await page.screenshot({ path: `/tmp/shots/project-${slug}.png` });
    const title = await page.title();
    console.log(`${slug} → "${title}"`);
    await page.close();
  }

  // Reduced motion
  {
    const page = await browser.newPage();
    page.on('pageerror', (e) => issues.push(`reduced: ${e.message}`));
    await page.setViewport({ width: 1440, height: 900 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto(URL, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));
    await page.screenshot({ path: '/tmp/shots/reduced-motion-top.png' });
    const max = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(max * 0.9));
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: '/tmp/shots/reduced-motion-end.png' });
    await page.close();
  }

  // Command palette
  {
    const page = await browser.newPage();
    page.on('pageerror', (e) => issues.push(`palette: ${e.message}`));
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(URL, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));
    await page.keyboard.down('Meta');
    await page.keyboard.press('KeyK');
    await page.keyboard.up('Meta');
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: '/tmp/shots/command-palette.png' });
    // Focus trap: Tab three times, focus must stay inside the dialog.
    const trap = [];
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('Tab');
      trap.push(
        await page.evaluate(() => {
          const d = document.querySelector('[role="dialog"]');
          return d ? d.contains(document.activeElement) : false;
        })
      );
    }
    console.log('focus trap (all should be true):', JSON.stringify(trap));
    await page.close();
  }

  console.log(issues.length ? 'ISSUES:\n' + issues.join('\n') : 'no page errors');
  await browser.close();
})();