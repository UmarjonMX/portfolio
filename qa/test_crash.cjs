const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER CONSOLE ERROR:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('BROWSER PAGE ERROR:', err.toString());
  });

  console.log('Navigating to https://umarjonmx.uz...');
  await page.goto('https://umarjonmx.uz', { waitUntil: 'load' });
  
  console.log('Testing interactions...');
  
  // 1. Move mouse around
  await page.mouse.move(100, 100);
  await page.mouse.move(200, 200);
  await page.mouse.move(500, 500);

  // 2. Open Command Palette (Ctrl+K)
  await page.keyboard.down('Control');
  await page.keyboard.press('k');
  await page.keyboard.up('Control');
  
  await new Promise(r => setTimeout(r, 1000));
  
  // 3. Close Command Palette
  await page.keyboard.press('Escape');

  await new Promise(r => setTimeout(r, 1000));

  // 4. Scroll through the page
  for(let i=0; i<10; i++) {
    await page.evaluate(() => window.scrollBy(0, 500));
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log('Waiting 5 more seconds...');
  await new Promise(r => setTimeout(r, 5000));
  
  console.log('Extracting HTML...');
  const html = await page.evaluate(() => document.body.innerHTML);
  if (html.includes('SH-ERR')) {
    console.log('FOUND ERROR BOUNDARY IN HTML!');
  } else {
    console.log('No error boundary found in HTML.');
  }

  await browser.close();
})();
