/**
 * One-off audit probe used during the audit pass.
 * Checks: skip-link visibility on focus, scroll-driven React renders,
 * i18n leakage of hardcoded English, heading order, overflow at breakpoints.
 *
 *   node qa_audit.cjs [url]
 */
const puppeteer = require('puppeteer');

const URL = process.argv[2] || 'http://localhost:4177/';
const out = [];
const log = (s) => out.push(s);

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));

  // ── 1. Skip link: does it become visible when focused?
  const skip = await page.evaluate(() => {
    const a = document.querySelector('a[href="#main-content"]');
    if (!a) return { found: false };
    a.focus();
    const cs = getComputedStyle(a);
    const r = a.getBoundingClientRect();
    return {
      found: true,
      focused: document.activeElement === a,
      width: Math.round(r.width),
      height: Math.round(r.height),
      clip: cs.clip || cs.clipPath,
      position: cs.position,
      overflow: cs.overflow,
    };
  });
  log('SKIP LINK: ' + JSON.stringify(skip));

  // ── 2. Heading order on the home page
  const headings = await page.evaluate(() =>
    Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map((h) => ({
      tag: h.tagName,
      text: (h.textContent || '').trim().slice(0, 48),
    }))
  );
  log('HEADINGS: ' + JSON.stringify(headings, null, 1));

  // ── 3. Scroll-driven renders (patch-free: count via React DevTools hook is
  //       unavailable, so instead measure long-task-ish main-thread churn by
  //       counting raf callbacks registered per frame is not possible either.
  //       Instead: check whether SceneManager re-renders by sampling the canvas
  //       element identity across scroll.
  const canvasBefore = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    return c ? c.__probe || (c.__probe = Math.random()) : null;
  });
  await page.evaluate(() => {
    window.__frames = 0;
    const tick = () => {
      window.__frames++;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  const t0 = Date.now();
  for (let i = 0; i < 30; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), i * 60);
    await new Promise((r) => setTimeout(r, 30));
  }
  const dt = Date.now() - t0;
  log(`SCROLL: 30 programmatic scrolls over ${dt}ms`);

  // ── 4. Hardcoded English that should be translated
  const english = await page.evaluate(() => {
    const needles = ['View Project', 'works', 'Preparing Document', 'Connect Network',
      'Default mail client opened', 'Opening mail client', 'Copy email address',
      'No commands matched', 'Built with', 'Resume'];
    const text = document.body.innerText;
    return needles.filter((n) => text.includes(n));
  });
  log('HARDCODED EN: ' + JSON.stringify(english));

  // ── 5. nav "Resume" anchor target
  const anchors = await page.evaluate(() =>
    Array.from(document.querySelectorAll('header a[href^="#"]')).map((a) => {
      const h = a.getAttribute('href');
      let target = h === '#' ? 'top' : 'MISSING';
      if (h !== '#') {
        const el = document.getElementById(h.slice(1));
        if (el) target = 'ok:' + el.tagName + '#' + el.id;
      }
      return { href: h, target };
    })
  );
  log('NAV ANCHORS: ' + JSON.stringify(anchors));

  // ── 6. Horizontal overflow at breakpoints
  for (const w of [320, 360, 390, 768, 1024, 1280, 1920]) {
    await page.setViewport({ width: w, height: 800 });
    await new Promise((r) => setTimeout(r, 400));
    const o = await page.evaluate(() => ({
      docW: document.documentElement.scrollWidth,
      winW: window.innerWidth,
      bodyW: document.body.scrollWidth,
    }));
    if (o.docW > o.winW + 1 || o.bodyW > o.winW + 1) {
      log(`OVERFLOW @${w}: ${JSON.stringify(o)}`);
    }
  }
  log('OVERFLOW check done');

  // ── 7. Command palette on a project page (navigation actions)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL + 'projects/anonymous-chat', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 800));
  const onProject = await page.evaluate(() => ({
    hasProjectsSection: !!document.getElementById('projects'),
    hasContactSection: !!document.getElementById('contact'),
  }));
  log('PROJECT PAGE SECTIONS: ' + JSON.stringify(onProject));

  log('CONSOLE ERRORS: ' + JSON.stringify(errors.slice(0, 10)));

  console.log(out.join('\n'));
  await browser.close();
})();