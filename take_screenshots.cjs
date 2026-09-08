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
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(baseUrl, { waitUntil: 'load', timeout: 30000 });
    console.log(`Page loaded from ${baseUrl}`);
    await new Promise(r => setTimeout(r, 3000));
    
    // 1. Desktop Dark
    await page.screenshot({ path: '/tmp/hero_after_dark.png' });
    console.log('Saved /tmp/hero_after_dark.png');

    // 2. Desktop Light (toggle theme button)
    await page.click('button[aria-label="Toggle Theme"]');
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: '/tmp/hero_after_light.png' });
    console.log('Saved /tmp/hero_after_light.png');

    // 3. Mobile Light
    await page.setViewport({ width: 390, height: 844 });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: '/tmp/hero_after_mobile.png' });
    console.log('Saved /tmp/hero_after_mobile.png');

    // 4. Mobile Dark (toggle theme button back)
    await page.click('button[aria-label="Toggle Theme"]');
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: '/tmp/hero_after_mobile_dark.png' });
    console.log('Saved /tmp/hero_after_mobile_dark.png');

    await browser.close();
  } catch (err) {
    console.error(err);
    if (browser) await browser.close();
    process.exit(1);
  }
})();
