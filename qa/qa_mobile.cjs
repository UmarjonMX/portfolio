/**
 * Mobile, keyboard and reduced-motion checks for the navbar.
 *
 *   node qa_mobile.cjs [url]
 */
const puppeteer = require('puppeteer');

const URL = process.argv[2] || 'http://localhost:4175/';
const problems = [];
const notes = [];

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // ── 390px: composition, menu, keyboard ─────────────────────────────────
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(URL, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 900));

    const state = async () =>
      page.evaluate(() => {
        const pieces = Array.from(
          document.querySelectorAll('header nav > div:first-child > div')
        );
        const visibleLinks = Array.from(document.querySelectorAll('header nav a')).filter(
          (a) => {
            const r = a.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
          }
        );
        const menu = document.getElementById('navbar-menu');
        return {
          docW: document.documentElement.scrollWidth,
          winW: window.innerWidth,
          pieces: pieces.map((el) => {
            const r = el.getBoundingClientRect();
            return { x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height) };
          }),
          headerLinksVisible: visibleLinks.length,
          menuHidden: menu.hasAttribute('hidden'),
          menuW: menu.getBoundingClientRect().width,
          docHeight: document.documentElement.scrollHeight,
        };
      });

    const top = await state();
    console.log('\n──── 390x844 ────');
    console.log(JSON.stringify(top));
    if (top.docW > top.winW + 1) problems.push(`390: overflow ${top.docW}>${top.winW}`);
    if (top.pieces[1].w > 0) problems.push('390: centre capsule present — 5 links should not show');
    if (top.headerLinksVisible > 2) problems.push('390: more than logo + controls visible');
    if (top.pieces[0].x < 0 || top.pieces[2].x + top.pieces[2].w > 390) {
      problems.push('390: a capsule is outside the viewport');
    }

    // Tap targets
    const taps = await page.evaluate(() => {
      const els = Array.from(
        document.querySelectorAll('header nav button, header nav a')
      ).filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      });
      return els.map((el) => {
        const r = el.getBoundingClientRect();
        return {
          label: el.getAttribute('aria-label') || el.textContent.trim().slice(0, 18),
          w: Math.round(r.width),
          h: Math.round(r.height),
        };
      });
    });
    console.log('tap targets:', JSON.stringify(taps));
    for (const t of taps) {
      if (t.h < 32) problems.push(`390: tap target "${t.label}" is ${t.h}px tall`);
    }

    // Open the menu by tapping the hamburger
    await page.evaluate(() => {
      const b = document.querySelector('button[aria-controls="navbar-menu"]');
      b.click();
    });
    await new Promise((r) => setTimeout(r, 350));
    const open = await page.evaluate(() => {
      const menu = document.getElementById('navbar-menu');
      const r = menu.getBoundingClientRect();
      const links = Array.from(menu.querySelectorAll('a'));
      return {
        hidden: menu.hasAttribute('hidden'),
        rect: { x: Math.round(r.x), w: Math.round(r.width), bottom: Math.round(r.bottom) },
        links: links.length,
        focusInside: menu.contains(document.activeElement),
        focused: document.activeElement?.textContent?.trim(),
        ariaExpanded: document
          .querySelector('button[aria-controls="navbar-menu"]')
          .getAttribute('aria-expanded'),
      };
    });
    console.log('menu open:', JSON.stringify(open));
    if (open.hidden) problems.push('390: menu did not open');
    if (!open.focusInside) problems.push('390: focus not moved into the menu');
    if (open.links !== 5) problems.push(`390: menu has ${open.links} links, expected 5`);
    if (open.rect.x < 0 || open.rect.x + open.rect.w > 390) problems.push('390: menu overflows');
    if (open.rect.bottom > 844) problems.push('390: menu extends past the viewport');
    if (open.ariaExpanded !== 'true') problems.push('390: aria-expanded not set');

    // Tab through the menu
    const order = [];
    for (let i = 0; i < 7; i += 1) {
      await page.keyboard.press('Tab');
      const f = await page.evaluate(() => ({
        text: document.activeElement?.textContent?.trim().slice(0, 18),
        inside: !!document.activeElement?.closest('#navbar-menu'),
      }));
      order.push(`${f.inside ? 'menu:' : 'page:'}${f.text}`);
    }
    console.log('tab order with menu open:', order.join(' → '));
    notes.push(`menu tab order: ${order.join(' → ')}`);

    // Escape closes and restores focus
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 250));
    const closed = await page.evaluate(() => ({
      hidden: document.getElementById('navbar-menu').hasAttribute('hidden'),
      focusOnToggle:
        document.activeElement === document.querySelector('button[aria-controls="navbar-menu"]'),
    }));
    console.log('after Escape:', JSON.stringify(closed));
    if (!closed.hidden) problems.push('390: Escape did not close the menu');
    if (!closed.focusOnToggle) problems.push('390: focus not restored to the trigger');

    // Outside click closes
    await page.evaluate(() =>
      document.querySelector('button[aria-controls="navbar-menu"]').click()
    );
    await new Promise((r) => setTimeout(r, 250));
    await page.mouse.click(195, 700);
    await new Promise((r) => setTimeout(r, 250));
    const outside = await page.evaluate(() =>
      document.getElementById('navbar-menu').hasAttribute('hidden')
    );
    if (!outside) problems.push('390: outside click did not close the menu');

    // Navigate via a menu link
    await page.evaluate(() =>
      document.querySelector('button[aria-controls="navbar-menu"]').click()
    );
    await new Promise((r) => setTimeout(r, 250));
    await page.evaluate(() => {
      const a = Array.from(document.querySelectorAll('#navbar-menu a')).find((x) =>
        /projects|loyihalar/i.test(x.textContent)
      );
      a.click();
    });
    await new Promise((r) => setTimeout(r, 900));
    const afterNav = await page.evaluate(() => ({
      y: Math.round(window.scrollY),
      projectsTop: Math.round(document.querySelector('#projects')?.getBoundingClientRect().top ?? NaN),
      menuHidden: document.getElementById('navbar-menu').hasAttribute('hidden'),
      heroChapter: Math.round(document.querySelector('#hero').getBoundingClientRect().top),
    }));
    console.log('after nav to Projects:', JSON.stringify(afterNav));
    if (!afterNav.menuHidden) problems.push('390: menu stayed open after navigating');
    if (!(afterNav.y > 1000)) problems.push(`390: nav link did not scroll (y=${afterNav.y})`);

    // Scrolled mobile composition
    await page.evaluate(() => window.scrollTo(0, 1200));
    await new Promise((r) => setTimeout(r, 350));
    const scrolled = await state();
    console.log('scrolled 390:', JSON.stringify(scrolled));
    if (scrolled.pieces[0].x !== 24) problems.push(`390: logo not at the inset (${scrolled.pieces[0].x})`);
    if (scrolled.pieces[2].x + scrolled.pieces[2].w > 390) problems.push('390: controls off-viewport');

    await page.close();
  }

  // ── Desktop keyboard + active state ────────────────────────────────────
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(URL, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 900));

    console.log('\n──── 1440x900 keyboard ────');
    const seq = [];
    for (let i = 0; i < 10; i += 1) {
      await page.keyboard.press('Tab');
      seq.push(
        await page.evaluate(() => {
          const el = document.activeElement;
          const cs = getComputedStyle(el);
          return `${el.tagName}:${(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 14)}[ring=${cs.outlineWidth}/${cs.boxShadow !== 'none' ? 'shadow' : '-'}]`;
        })
      );
    }
    console.log('tab order:', seq.join(' → '));
    notes.push(`desktop tab order: ${seq.join(' → ')}`);

    // Focus ring present on a link
    const ring = await page.evaluate(() => {
      const a = document.querySelector('header nav ul a');
      a.focus();
      const cs = getComputedStyle(a);
      return { outline: cs.outlineWidth, shadow: cs.boxShadow.slice(0, 60) };
    });
    console.log('link focus style:', JSON.stringify(ring));
    if (ring.outline === '0px' && ring.shadow === 'none') {
      problems.push('1440: no visible focus indicator on nav links');
    }

    // Hamburger is not a focus stop while the bar is unified
    const unifiedFocus = await page.evaluate(() => {
      const b = document.querySelector('button[aria-controls="navbar-menu"]');
      return { tabIndex: b.tabIndex, w: Math.round(b.parentElement.getBoundingClientRect().width) };
    });
    console.log('unified hamburger:', JSON.stringify(unifiedFocus));
    if (unifiedFocus.tabIndex !== -1) problems.push('1440: zero-width hamburger is still focusable');

    // Active state follows the scroll
    await page.evaluate(() => document.querySelector('#projects').scrollIntoView());
    await new Promise((r) => setTimeout(r, 1200));
    const active = await page.evaluate(() => {
      const cur = Array.from(document.querySelectorAll('header nav ul a')).filter(
        (a) => a.getAttribute('aria-current')
      );
      const chip = document.querySelector('header nav ul span[aria-hidden]');
      const ul = document.querySelector('header nav ul');
      const links = Array.from(ul.querySelectorAll('a'));
      const idx = links.indexOf(cur[0]);
      return {
        current: cur.map((a) => a.textContent.trim()),
        chipX: Math.round(parseFloat(getComputedStyle(chip).transform.split(',')[4]) || 0),
        chipW: Math.round(chip.getBoundingClientRect().width),
        linkX: Math.round(links[idx].getBoundingClientRect().x - ul.getBoundingClientRect().x),
        linkW: Math.round(links[idx].getBoundingClientRect().width),
      };
    });
    console.log('active state on Projects:', JSON.stringify(active));
    if (!active.current.length) problems.push('1440: no aria-current at Projects');
    if (Math.abs(active.chipX - active.linkX) > 3) {
      problems.push(`1440: active marker at ${active.chipX}, link at ${active.linkX}`);
    }

    // Marker moves when the section changes
    await page.evaluate(() => document.querySelector('#contact').scrollIntoView());
    await new Promise((r) => setTimeout(r, 1400));
    const moved = await page.evaluate(() => {
      const chip = document.querySelector('header nav ul span[aria-hidden]');
      const cur = document.querySelector('header nav ul a[aria-current]');
      return {
        chipX: Math.round(parseFloat(getComputedStyle(chip).transform.split(',')[4]) || 0),
        current: cur?.textContent.trim(),
      };
    });
    console.log('after scrolling to Contact:', JSON.stringify(moved));
    if (moved.current !== 'Contact') problems.push(`1440: aria-current is "${moved.current}" at Contact`);
    notes.push(`marker travelled to x=${moved.chipX} for ${moved.current}`);

    // Disclosure opens from the separated state
    const menuOpen = await page.evaluate(async () => {
      const b = document.querySelector('button[aria-controls="navbar-menu"]');
      b.click();
      await new Promise((r) => setTimeout(r, 300));
      const m = document.getElementById('navbar-menu');
      const r = m.getBoundingClientRect();
      return { hidden: m.hasAttribute('hidden'), x: Math.round(r.x), w: Math.round(r.width) };
    });
    console.log('desktop disclosure:', JSON.stringify(menuOpen));
    if (menuOpen.hidden) problems.push('1440: disclosure did not open');
    if (menuOpen.x + menuOpen.w > 1440) problems.push('1440: disclosure overflows the viewport');

    await page.close();
  }

  // ── Reduced motion ─────────────────────────────────────────────────────
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto(URL, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 900));

    const states = [];
    for (const y of [0, 300, 600, 900, 2000]) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await new Promise((r) => setTimeout(r, 220));
      states.push(
        await page.evaluate(() => {
          const els = Array.from(
            document.querySelectorAll('header nav > div:first-child > div')
          );
          return els.map((el) => {
            const r = el.getBoundingClientRect();
            return `${Math.round(r.x)}+${Math.round(r.width)}`;
          });
        })
      );
    }
    console.log('\n──── reduced motion @1440 ────');
    console.log('y=0/300/600/900/2000 →', states.map((s) => s.join(' ')).join('  |  '));
    if (new Set(states.map((s) => s.join(' '))).size > 2) {
      problems.push('reduced motion: navbar does not settle into two static states');
    }
    const content = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('header nav ul a')).filter((a) => {
        const r = a.getBoundingClientRect();
        return r.width > 0;
      });
      return { links: links.length, logo: !!document.querySelector('header nav img') };
    });
    console.log('content under reduced motion:', JSON.stringify(content));
    if (!content.links || !content.logo) problems.push('reduced motion: content missing');
    await page.close();
  }

  console.log('\n════ NOTES ════');
  notes.forEach((n) => console.log('  ' + n));
  console.log('\n════ PROBLEMS ════');
  console.log(problems.length ? problems.join('\n') : 'none');
  await browser.close();
  process.exit(problems.length ? 1 : 0);
})();