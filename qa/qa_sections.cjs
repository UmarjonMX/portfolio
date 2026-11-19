/**
 * Section-level geometry: navbar capsules vs. the sticky SectionHeader at the
 * real scroll positions of each section, in both languages.
 *
 *   node qa_sections.cjs [url]
 */
const puppeteer = require('puppeteer');

const URL = process.argv[2] || 'http://localhost:4175/';
const problems = [];

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const lang of ['en', 'uz']) {
    for (const [w, h] of [[1440, 900], [1280, 800], [768, 1024], [390, 844]]) {
      const page = await browser.newPage();
      await page.setViewport({ width: w, height: h });
      await page.evaluateOnNewDocument((l) => localStorage.setItem('language', l), lang);
      await page.goto(URL, { waitUntil: 'networkidle2' });
      await new Promise((r) => setTimeout(r, 900));

      console.log(`\n════ ${lang} ${w}x${h} ════`);
      const sections = await page.evaluate(() =>
        Array.from(document.querySelectorAll('[data-chapter]')).map((el) => ({
          id: el.dataset.chapter,
          top: el.getBoundingClientRect().top + window.scrollY,
        }))
      );

      for (const s of sections) {
        // Scroll so the section's top sits just under the navbar, which is
        // where the sticky SectionHeader is pinned.
        const y = Math.round(s.top - 40);
        await page.evaluate((yy) => window.scrollTo(0, yy), y);
        await new Promise((r) => setTimeout(r, 300));
        const m = await page.evaluate((id) => {
          const pieces = Array.from(
            document.querySelectorAll('header nav > div:first-child > div')
          )
            .map((el) => {
              const r = el.getBoundingClientRect();
              return r.width > 0 ? { x: Math.round(r.x), r: Math.round(r.right), b: Math.round(r.bottom) } : null;
            })
            .filter(Boolean);
          /* The sticky chapter marker specifically — the Hero and the finale
             also contain a full-height pinned stage, which is a different
             element entirely. */
          const marker = document.querySelector(`#${id} > .sticky.top-\\[88px\\]`);
          const mr = marker?.getBoundingClientRect();
          return {
            navBottom: Math.max(...pieces.map((p) => p.b)),
            navSpan: pieces.map((p) => `${p.x}-${p.r}`),
            marker: mr ? { top: Math.round(mr.top), bottom: Math.round(mr.bottom) } : null,
            docW: document.documentElement.scrollWidth,
            winW: window.innerWidth,
            overflowRight: pieces.some((p) => p.r > window.innerWidth + 1),
          };
        }, s.id);
        const clear = m.marker ? m.marker.top - m.navBottom : null;
        console.log(
          `  ${s.id.padEnd(12)} nav bottom ${String(m.navBottom).padStart(3)} ` +
            `marker top ${m.marker ? String(m.marker.top).padStart(4) : '  n/a'} ` +
            `gap ${clear === null ? ' n/a' : String(clear).padStart(4)}  nav ${m.navSpan.join(' ')}`
        );
        if (m.docW > m.winW + 1) problems.push(`${lang} ${w} ${s.id}: overflow`);
        if (m.overflowRight) problems.push(`${lang} ${w} ${s.id}: capsule past the right edge`);
        if (clear !== null && clear < 0) {
          problems.push(`${lang} ${w} ${s.id}: SectionHeader collides with navbar (${clear}px)`);
        }
      }

      // Language-specific navbar copy width
      const links = await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('header nav > div:first-child > div'));
        return {
          centreW: Math.round(els[1].getBoundingClientRect().width),
          rightW: Math.round(els[2].getBoundingClientRect().width),
          labels: Array.from(document.querySelectorAll('header nav ul a')).map((a) =>
            a.textContent.trim()
          ),
          overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        };
      });
      console.log(
        `  centre ${links.centreW}px  right ${links.rightW}px  labels ${links.labels.join('|')}  overflow=${links.overflow}`
      );
      if (links.overflow) problems.push(`${lang} ${w}: horizontal overflow with translated labels`);

      await page.close();
    }
  }

  console.log('\n════ PROBLEMS ════');
  console.log(problems.length ? [...new Set(problems)].join('\n') : 'none');
  await browser.close();
  process.exit(problems.length ? 1 : 0);
})();