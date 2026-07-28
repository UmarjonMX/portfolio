const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    
    console.log("Navigating to http://localhost:5173...");
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    console.log("Waiting for Hero 3D & fonts...");
    await new Promise(r => setTimeout(r, 3000));
    
    // Take Hero Screenshot
    await page.screenshot({ path: '/home/umar/.gemini/antigravity/brain/d0934e35-d1ca-499e-b515-003834388c0e/screenshot_hero.png' });
    console.log("Hero screenshot saved!");

    // Scroll to Projects section
    await page.evaluate(() => {
      const el = document.getElementById('projects');
      if (el) el.scrollIntoView();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    
    // Take Projects Screenshot
    await page.screenshot({ path: '/home/umar/.gemini/antigravity/brain/d0934e35-d1ca-499e-b515-003834388c0e/screenshot_projects.png' });
    console.log("Projects screenshot saved!");

    await browser.close();
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
})();
