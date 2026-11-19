const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
  });

  const testDomain = async (url) => {
    console.log(`\n==================================================`);
    console.log(`TESTING DOMAIN: ${url}`);
    console.log(`==================================================`);
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    page.on('console', msg => {
      console.log(`[CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
    });

    page.on('pageerror', err => {
      console.log(`[PAGE EXCEPTION] ${err.toString()}`);
    });

    page.on('requestfailed', request => {
      console.log(`[NETWORK FAILED] ${request.url()} - ${request.failure().errorText}`);
    });

    page.on('response', response => {
      if (!response.ok()) {
        console.log(`[NETWORK ERROR] ${response.url()} - Status: ${response.status()}`);
      }
    });

    console.log(`Navigating...`);
    const response = await page.goto(url, { waitUntil: 'load' });
    console.log(`Initial page load status: ${response.status()}`);
    console.log(`Final URL (checking redirects): ${page.url()}`);
    
    console.log(`Testing interactions for 35 seconds...`);
    
    // 1. Move mouse around to trigger any interaction-based logic
    await page.mouse.move(100, 100);
    await page.mouse.move(500, 500);

    // 2. Scroll down and up
    for(let i=0; i<5; i++) {
      await page.evaluate(() => window.scrollBy(0, 500));
      await new Promise(r => setTimeout(r, 500));
    }
    for(let i=0; i<5; i++) {
      await page.evaluate(() => window.scrollBy(0, -500));
      await new Promise(r => setTimeout(r, 500));
    }

    // 3. Command Palette
    await page.keyboard.down('Control');
    await page.keyboard.press('k');
    await page.keyboard.up('Control');
    await new Promise(r => setTimeout(r, 1000));
    await page.keyboard.press('Escape');

    // 4. Toggle Theme (assuming there's a button, or via localStorage)
    await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label*="theme"], button[aria-label*="Theme"]');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Wait the rest of the 35 seconds
    console.log('Waiting an additional 25 seconds for any late crashes...');
    await new Promise(r => setTimeout(r, 25000));
    
    console.log(`Extracting HTML to check for ErrorBoundary...`);
    const html = await page.evaluate(() => document.body.innerHTML);
    if (html.includes('SH–ERR') || html.includes('SH-ERR') || html.includes('RUNTIME_EXCEPTION') || html.includes('RUNTIME-EXCEPTION')) {
      console.log('>>> 🚨 FOUND ERROR BOUNDARY IN HTML! 🚨 <<<');
      const snippet = await page.evaluate(() => {
        const errNode = document.body.innerText.match(/.{0,50}RUNTIME.{0,50}/gi);
        return errNode ? errNode.join(' | ') : 'Could not extract surrounding text';
      });
      console.log(`Error context: ${snippet}`);
    } else {
      console.log('>>> ✅ No error boundary found. Site is stable. <<<');
    }

    // Verify deployment contains SceneErrorBoundary by fetching index.js
    console.log(`Verifying deployment contains e6f386e (SceneErrorBoundary)...`);
    const scripts = await page.evaluate(() => Array.from(document.querySelectorAll('script[type="module"]')).map(s => s.src));
    for (const src of scripts) {
      if (src) {
        try {
          const js = await page.evaluate(async (scriptUrl) => {
            const res = await fetch(scriptUrl);
            return res.text();
          }, src);
          if (js.includes('SceneErrorBoundary') || js.includes('disabled to prevent app crash')) {
            console.log(`>>> ✅ VERIFIED: Found SceneErrorBoundary string in deployed chunk: ${src}`);
          }
        } catch(e) {
          console.log(`Could not fetch ${src}: ${e.message}`);
        }
      }
    }

    await page.close();
  };

  await testDomain('https://www.umarjonmx.uz');

  await browser.close();
})();
