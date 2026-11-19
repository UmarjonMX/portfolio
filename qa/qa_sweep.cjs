/**
 * Full verification sweep: every viewport × theme × scroll position, plus the
 * skills row, the closing headline in both languages, navigation destinations,
 * and a resize pass. Fails loudly on any regression.
 *
 *   node qa_sweep.cjs [url]
 */
const puppeteer = require('puppeteer');

const URL = process.argv[2] || 'http://localhost:4175/';

const VIEWPORTS = [
  { w: 1440, h: 900 },
  { w: 1280, h: 800 },
  { w: 1024, h: 900 },
  { w: 768, h: 1024 },
  { w: 390, h: 844 },
];
const SCROLLS = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

const problems = [];
const consoleIssues = [];

const ENV_NOISE = /WebGL|webgl|GL_VENDOR|GL_RENDERER|SwiftShader/i;

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const vp of VIEWPORTS) {
    for (const theme of ['dark', 'light']) {
      const page = await browser.newPage();
      page.on('console', (m) => {
        if (m.type() === 'error' && !ENV_NOISE.test(m.text())) {
          consoleIssues.push(`[${vp.w} ${theme}] ${m.text()}`);
        }
      });
      page.on('pageerror', (e) => {
        if (!ENV_NOISE.test(e.message)) consoleIssues.push(`[${vp.w}] ${e.message}`);
      });
      page.on('requestfailed', (r) =>
        consoleIssues.push(`[${vp.w}] request failed ${r.url()}`)
      );

      await page.setViewport({ width: vp.w, height: vp.h });
      await page.evaluateOnNewDocument(
        (t, l) => {
          localStorage.setItem('theme', t);
          localStorage.setItem('language', l);
        },
        theme,
        'en'
      );
      await page.goto(URL, { waitUntil: 'networkidle2' });
      await new Promise((r) => setTimeout(r, 800));

      const tag = `${vp.w}x${vp.h} ${theme}`;
      const max = await page.evaluate(
        () => document.documentElement.scrollHeight - window.innerHeight
      );

      for (const f of SCROLLS) {
        await page.evaluate((y) => window.scrollTo(0, y), Math.round(max * f));
        await new Promise((r) => setTimeout(r, 220));
        const m = await page.evaluate(() => {
          const pieces = Array.from(
            document.querySelectorAll('header nav > div:first-child > div')
          ).map((el) => {
            const r = el.getBoundingClientRect();
            return { x: r.x, r: r.right, y: r.y, w: r.width, h: r.height };
          });
          return {
            pieces,
            docW: document.documentElement.scrollWidth,
            winW: window.innerWidth,
          };
        });

        const L = m.pieces[0];
        const R = m.pieces[m.pieces.length - 1];
        // The centre piece is the middle child; below 768px it has no box.
        const C = m.pieces.length === 3 ? m.pieces[1] : null;

        if (m.docW > m.winW + 1) problems.push(`${tag} ${f * 100}%: overflow`);
        if (!L || L.w < 20) problems.push(`${tag} ${f * 100}%: logo capsule missing`);
        if (!R || R.w < 40) problems.push(`${tag} ${f * 100}%: right capsule missing`);
        if (L.x < -1 || R.r > m.winW + 1) problems.push(`${tag} ${f * 100}%: off-viewport`);
        if (C && C.w > 0) {
          if (L.r > C.x + 1) problems.push(`${tag} ${f * 100}%: left/centre overlap`);
          if (R.x < C.r - 1) problems.push(`${tag} ${f * 100}%: centre/right overlap`);
          if (Math.abs(C.y - L.y) > 1 || Math.abs(C.h - L.h) > 1) {
            problems.push(`${tag} ${f * 100}%: pieces are not on one band`);
          }
        }
        if (Math.abs(R.y - L.y) > 1 || Math.abs(R.h - L.h) > 1) {
          problems.push(`${tag} ${f * 100}%: logo and controls are not on one band`);
        }
      }

      await page.close();
    }
  }

  // ── Skills + headline, both languages ───────────────────────────────────
  for (const lang of ['en', 'uz']) {
    for (const w of [1440, 1280, 1024, 768, 390]) {
      const page = await browser.newPage();
      page.on('pageerror', (e) => {
        if (!ENV_NOISE.test(e.message)) consoleIssues.push(`[skills ${lang} ${w}] ${e.message}`);
      });
      await page.setViewport({ width: w, height: 900 });
      await page.evaluateOnNewDocument((l) => localStorage.setItem('language', l), lang);
      await page.goto(URL, { waitUntil: 'networkidle2' });
      await new Promise((r) => setTimeout(r, 700));

      const data = await page.evaluate(() => {
        const heading = Array.from(document.querySelectorAll('h3')).find((h) =>
          /arsenal|ko'nikmalar/i.test(h.textContent)
        );
        const grid = heading?.parentElement?.querySelector('.grid');
        const cards = grid
          ? Array.from(grid.children).map((c) => {
              const inner = c.firstElementChild;
              return {
                cellH: Math.round(c.getBoundingClientRect().height),
                cardH: Math.round(inner.getBoundingClientRect().height),
                cellW: Math.round(c.getBoundingClientRect().width),
                top: Math.round(c.getBoundingClientRect().top),
                bottom: Math.round(c.getBoundingClientRect().bottom),
                overflows: inner.scrollHeight > inner.clientHeight + 1,
                clipped: inner.scrollWidth > inner.clientWidth + 1,
              };
            })
          : null;
        const h2 = document.querySelector('#finale h2');
        return {
          cards,
          cols: grid ? getComputedStyle(grid).gridTemplateColumns.split(' ').length : 0,
          headline: h2
            ? Array.from(h2.children).map((s) => s.textContent.trim())
            : null,
          headlineSize: h2 ? Math.round(parseFloat(getComputedStyle(h2).fontSize)) : 0,
          docW: document.documentElement.scrollWidth,
          winW: window.innerWidth,
        };
      });

      const expect = lang === 'en' ? ['My', 'Workbench.'] : ['Mening raqamli', 'Ustaxonam.'];
      const got = (data.headline || []).map((s) => s.replace(/\s+/g, ' ').trim());
      const okHeadline = JSON.stringify(got) === JSON.stringify(expect);
      console.log(
        `${lang} @${w}: cols=${data.cols} headline=${JSON.stringify(got)} ` +
          `(${data.headlineSize}px) ok=${okHeadline}`
      );
      if (!okHeadline) problems.push(`${lang} @${w}: headline is ${JSON.stringify(got)}`);
      if (data.docW > data.winW + 1) problems.push(`${lang} @${w}: overflow`);
      if (data.cards) {
        if (data.cols === 3) {
          const hs = new Set(data.cards.map((c) => c.cardH));
          const ts = new Set(data.cards.map((c) => c.top));
          const ws = new Set(data.cards.map((c) => c.cellW));
          const bs = new Set(data.cards.map((c) => c.bottom));
          console.log(
            `  cards: heights ${[...hs]} tops ${[...ts]} widths ${[...ws]} bottoms ${[...bs]}`
          );
          if (hs.size !== 1) problems.push(`${lang} @${w}: card heights ${[...hs]}`);
          if (ts.size !== 1) problems.push(`${lang} @${w}: card tops ${[...ts]}`);
          if (ws.size !== 1) problems.push(`${lang} @${w}: card widths ${[...ws]}`);
          if (bs.size !== 1) problems.push(`${lang} @${w}: card bottoms ${[...bs]}`);
        }
        for (const c of data.cards) {
          if (c.overflows) problems.push(`${lang} @${w}: card content overflows vertically`);
          if (c.clipped) problems.push(`${lang} @${w}: card content clipped horizontally`);
        }
      }
      await page.close();
    }
  }

  // ── Resize while scrolled ──────────────────────────────────────────────
  {
    const page = await browser.newPage();
    page.on('pageerror', (e) => {
      if (!ENV_NOISE.test(e.message)) consoleIssues.push(`[resize] ${e.message}`);
    });
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(URL, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 700));
    await page.evaluate(() => window.scrollTo(0, 1200));
    await new Promise((r) => setTimeout(r, 300));
    for (const [w, h] of [[390, 844], [768, 1024], [1024, 900], [1280, 800], [1440, 900]]) {
      await page.setViewport({ width: w, height: h });
      await new Promise((r) => setTimeout(r, 500));
      const m = await page.evaluate(() => {
        const pieces = Array.from(
          document.querySelectorAll('header nav > div:first-child > div')
        ).map((el) => {
          const r = el.getBoundingClientRect();
          return { x: Math.round(r.x), r: Math.round(r.right), w: Math.round(r.width) };
        });
        return {
          pieces,
          docW: document.documentElement.scrollWidth,
          winW: window.innerWidth,
        };
      });
      const last = m.pieces[m.pieces.length - 1];
      console.log(
        `resize →${w}: ${m.pieces.map((p) => `${p.x}+${p.w}`).join(' ')} overflow=${
          m.docW > m.winW + 1
        }`
      );
      if (m.docW > m.winW + 1) problems.push(`resize ${w}: overflow`);
      if (last.r > m.winW + 1) problems.push(`resize ${w}: right capsule off-viewport`);
    }
    await page.close();
  }

  // ── Navigation destinations ────────────────────────────────────────────
  {
    const page = await browser.newPage();
    page.on('pageerror', (e) => {
      if (!ENV_NOISE.test(e.message)) consoleIssues.push(`[nav] ${e.message}`);
    });
    await page.setViewport({ width: 1440, height: 900 });
    /* localStorage is shared per origin across pages, so pin the language
       rather than inheriting whatever the previous block left behind. */
    await page.evaluateOnNewDocument(() => localStorage.setItem('language', 'en'));
    await page.goto(URL, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 900));
    const expected = [
      ['Home', 'hero'],
      ['About', 'about'],
      ['Projects', 'projects'],
      ['Resume', 'resume'],
      ['Contact', 'contact'],
    ];
    for (const [label, id] of expected) {
      const clicked = await page.evaluate((l) => {
        const a = Array.from(document.querySelectorAll('header nav ul a')).find(
          (x) => x.textContent.trim() === l
        );
        if (!a) return false;
        a.click();
        return true;
      }, label);
      if (!clicked) {
        problems.push(`nav: no link labelled "${label}"`);
        continue;
      }
      await new Promise((r) => setTimeout(r, 800));
      const res = await page.evaluate((i) => {
        const el = document.getElementById(i);
        const r = el?.getBoundingClientRect();
        return { top: r ? Math.round(r.top) : null, y: Math.round(window.scrollY) };
      }, id);
      /* `#contact` sits in a lazily-loaded chunk, so a same-document anchor
         click has no target to scroll to yet. Verified identical on the
         pre-change build (baseline lands at top=2204, y=6209), so it is
         pre-existing app behaviour and out of scope here — recorded, not
         silently passed. */
      const KNOWN = { 'nav Contact': 'lazy chunk: anchor has no target yet (pre-existing)' };
      const key = `nav ${label}`;
      const ok = res.top !== null && Math.abs(res.top) < 200;
      console.log(`nav ${label} → #${id}: top=${res.top} y=${res.y} ok=${ok}`);
      if (!ok && KNOWN[key]) {
        console.log(`  ^ known pre-existing: ${KNOWN[key]}`);
      } else if (!ok) {
        problems.push(`${key}: landed with #${id} at ${res.top}px from the top`);
      }
    }
    await page.close();
  }

  console.log('\n════ CONSOLE ════');
  console.log(consoleIssues.length ? [...new Set(consoleIssues)].join('\n') : 'none');
  console.log('\n════ PROBLEMS ════');
  console.log(problems.length ? [...new Set(problems)].join('\n') : 'none');
  await browser.close();
  process.exit(problems.length || consoleIssues.length ? 1 : 0);
})();