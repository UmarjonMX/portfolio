const puppeteer = require('puppeteer');
(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: 'new', 
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    const port = process.env.PORT || process.argv[2] || '4178';
    const baseUrl = `http://localhost:${port}`;
    
    const ensureTheme = async (desiredTheme) => {
      const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
      if ((desiredTheme === 'dark' && !isDark) || (desiredTheme === 'light' && isDark)) {
        const btn = await page.$('button[aria-label="Toggle Theme"]');
        if (btn) {
          await btn.click();
          await new Promise(r => setTimeout(r, 2000));
        }
      }
    };

    // 1. Desktop — Dark — Hero
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(baseUrl, { waitUntil: 'load', timeout: 30000 });
    console.log(`Page loaded from ${baseUrl}`);
    await new Promise(r => setTimeout(r, 2000));
    await ensureTheme('dark');
    await page.screenshot({ path: '/tmp/desktop_dark_hero.png' });
    console.log('Saved /tmp/desktop_dark_hero.png');

    // 2. Desktop — Dark — Projects
    await page.evaluate(() => window.scrollTo(0, 1100));
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: '/tmp/desktop_dark_projects.png' });
    console.log('Saved /tmp/desktop_dark_projects.png');

    // 3. Desktop — Light — Hero
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 1000));
    await ensureTheme('light');
    await page.screenshot({ path: '/tmp/desktop_light_hero.png' });
    console.log('Saved /tmp/desktop_light_hero.png');

    // 4. Desktop — Light — Projects
    await page.evaluate(() => window.scrollTo(0, 1100));
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: '/tmp/desktop_light_projects.png' });
    console.log('Saved /tmp/desktop_light_projects.png');

    // 5. Mobile — Light — Hero
    await page.setViewport({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: '/tmp/mobile_light_hero.png' });
    console.log('Saved /tmp/mobile_light_hero.png');

    // 6. Mobile — Dark — Hero
    await ensureTheme('dark');
    await page.screenshot({ path: '/tmp/mobile_dark_hero.png' });
    console.log('Saved /tmp/mobile_dark_hero.png');

    await browser.close();
  } catch (err) {
    console.error(err);
    if (browser) await browser.close();
    process.exit(1);
  }
})();
