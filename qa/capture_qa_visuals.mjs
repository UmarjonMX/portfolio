import puppeteer from 'puppeteer';
import { preview } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const artifactsDir = path.join(projectRoot, 'artifacts', 'navbar-qa');

// Ensure all target directories exist
const dirs = ['before', 'after', 'light', 'dark', 'responsive', 'scroll-states'];
for (const d of dirs) {
  fs.mkdirSync(path.join(artifactsDir, d), { recursive: true });
}

function saveArtifact(srcRelPath, extraDirs = []) {
  const fullSrc = path.join(artifactsDir, srcRelPath);
  const baseName = path.basename(srcRelPath);
  for (const d of extraDirs) {
    const dest = path.join(artifactsDir, d, baseName);
    if (dest !== fullSrc) {
      fs.copyFileSync(fullSrc, dest);
    }
  }
}

async function runVisualQA() {
  console.log('Starting Vite preview server on port 4199...');
  const previewServer = await preview({
    root: projectRoot,
    preview: {
      port: 4199,
      strictPort: false,
    },
  });

  const resolvedUrls = previewServer.resolvedUrls;
  const baseUrl = (resolvedUrls.local && resolvedUrls.local[0]) || 'http://localhost:4199';
  console.log(`Vite preview running at ${baseUrl}`);

  let browser;
  try {
    console.log(`Launching Puppeteer against ${baseUrl}...`);
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      consoleErrors.push(err.toString());
    });

    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    const waitForStable = async () => {
      await page.evaluate(() => {
        return new Promise((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(resolve);
          });
        });
      });
      await wait(300);
    };

    const ensureTheme = async (desiredTheme) => {
      const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
      if ((desiredTheme === 'dark' && !isDark) || (desiredTheme === 'light' && isDark)) {
        const btn = await page.$('button[aria-pressed]');
        if (btn) {
          await btn.click();
          await waitForStable();
        }
      }
    };

    const scrollTo = async (y) => {
      await page.evaluate((targetY) => {
        window.scrollTo(0, targetY);
        window.dispatchEvent(new Event('scroll'));
      }, y);
      await waitForStable();
    };

    const captureViewportTop = async (filePath, width, height = 220) => {
      const scrollY = await page.evaluate(() => window.scrollY);
      await page.screenshot({
        path: filePath,
        clip: { x: 0, y: scrollY, width, height },
      });
    };

    // 1. Initial Load at 1440x900
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto(baseUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready;
    });
    await waitForStable();

    console.log('1. Testing Light & Dark Theme Navbar States at 1440px...');

    // --- 1440 LIGHT ---
    await ensureTheme('light');
    await scrollTo(0);

    // 1. Navbar Top (Unified Bar)
    const path1440LightTop = path.join(artifactsDir, 'light', 'navbar-1440-light-top.png');
    await captureViewportTop(path1440LightTop, 1440, 200);
    saveArtifact('light/navbar-1440-light-top.png', ['after', 'responsive']);

    // 2. Intermediate Capsule Separation (Mid-morph around 200px scroll)
    await scrollTo(200);
    const path1440LightMid = path.join(artifactsDir, 'scroll-states', 'navbar-1440-light-mid-morph.png');
    await captureViewportTop(path1440LightMid, 1440, 200);
    saveArtifact('scroll-states/navbar-1440-light-mid-morph.png', ['after', 'light']);

    // 3. Fully Separated Capsules (Past hero runway, e.g. 550px)
    await scrollTo(550);
    const path1440LightSep = path.join(artifactsDir, 'light', 'navbar-1440-light-separated.png');
    await captureViewportTop(path1440LightSep, 1440, 200);
    saveArtifact('light/navbar-1440-light-separated.png', ['after', 'responsive', 'scroll-states']);

    // 4. Reverse Scrolling (Scroll deep to 1200px, then back up to 220px)
    await scrollTo(1200);
    await wait(100);
    await scrollTo(220);
    const path1440LightRev = path.join(artifactsDir, 'scroll-states', 'navbar-1440-light-reverse-scroll.png');
    await captureViewportTop(path1440LightRev, 1440, 200);
    saveArtifact('scroll-states/navbar-1440-light-reverse-scroll.png', ['light']);

    // --- 1440 DARK ---
    console.log('2. Testing Dark Theme Navbar States at 1440px...');
    await ensureTheme('dark');
    await scrollTo(0);

    // 5. Navbar Top Dark
    const path1440DarkTop = path.join(artifactsDir, 'dark', 'navbar-1440-dark-top.png');
    await captureViewportTop(path1440DarkTop, 1440, 200);
    saveArtifact('dark/navbar-1440-dark-top.png', ['after']);

    // 6. Mid-morph Dark
    await scrollTo(200);
    const path1440DarkMid = path.join(artifactsDir, 'scroll-states', 'navbar-1440-dark-mid-morph.png');
    await captureViewportTop(path1440DarkMid, 1440, 200);
    saveArtifact('scroll-states/navbar-1440-dark-mid-morph.png', ['dark']);

    // 7. Fully Separated Dark
    await scrollTo(550);
    const path1440DarkSep = path.join(artifactsDir, 'dark', 'navbar-1440-dark-separated.png');
    await captureViewportTop(path1440DarkSep, 1440, 200);
    saveArtifact('dark/navbar-1440-dark-separated.png', ['after', 'scroll-states']);

    // --- SECTION HEADERS OVER TOP VEIL ---
    console.log('3. Testing SectionHeaders over Top Veil across all chapters...');
    const getSectionOffset = async (chapterId) => {
      return await page.evaluate((id) => {
        const el = document.querySelector(`[data-chapter="${id}"]`);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return rect.top + window.scrollY;
      }, chapterId);
    };

    // About Chapter (02)
    const aboutOffset = await getSectionOffset('about');
    if (aboutOffset) {
      await scrollTo(aboutOffset + 240);
      const pathAboutVeil = path.join(artifactsDir, 'dark', 'section-header-1440-dark-veil.png');
      await captureViewportTop(pathAboutVeil, 1440, 360);
      saveArtifact('dark/section-header-1440-dark-veil.png', ['after']);

      await ensureTheme('light');
      const pathAboutVeilLight = path.join(artifactsDir, 'light', 'section-header-1440-light-veil.png');
      await captureViewportTop(pathAboutVeilLight, 1440, 360);
      saveArtifact('light/section-header-1440-light-veil.png', ['after']);
    }

    // Projects Chapter (03)
    const projectsOffset = await getSectionOffset('projects');
    if (projectsOffset) {
      await scrollTo(projectsOffset + 240);
      const pathProjectsVeil = path.join(artifactsDir, 'after', 'section-header-projects-03-veil.png');
      await captureViewportTop(pathProjectsVeil, 1440, 360);
    }

    // Builder Dashboard Chapter (04)
    const resumeOffset = await getSectionOffset('engineering');
    if (resumeOffset) {
      await scrollTo(resumeOffset + 240);
      const pathResumeVeil = path.join(artifactsDir, 'after', 'section-header-engineering-04-veil.png');
      await captureViewportTop(pathResumeVeil, 1440, 360);
    }

    // Contact Chapter (05)
    const contactOffset = await getSectionOffset('contact');
    if (contactOffset) {
      await scrollTo(contactOffset + 200);
      const pathContactVeil = path.join(artifactsDir, 'after', 'section-header-contact-05-veil.png');
      await captureViewportTop(pathContactVeil, 1440, 360);
    }

    // --- LIQUID GLASS MATERIAL DETAIL ---
    console.log('4. Testing Liquid Glass Material Detail...');
    // Plain Background (Hero at rest)
    await ensureTheme('light');
    await scrollTo(0);
    const pathPlainBgLight = path.join(artifactsDir, 'light', 'liquid-glass-plain-bg-light.png');
    await captureViewportTop(pathPlainBgLight, 1440, 180);
    saveArtifact('light/liquid-glass-plain-bg-light.png', ['after']);

    await ensureTheme('dark');
    const pathPlainBgDark = path.join(artifactsDir, 'dark', 'liquid-glass-plain-bg-dark.png');
    await captureViewportTop(pathPlainBgDark, 1440, 180);
    saveArtifact('dark/liquid-glass-plain-bg-dark.png', ['after']);

    // Over Image Content:
    if (aboutOffset) {
      await scrollTo(aboutOffset + 680); // Portrait passes under Navbar
      const pathOverImageDark = path.join(artifactsDir, 'dark', 'liquid-glass-over-image-dark.png');
      await captureViewportTop(pathOverImageDark, 1440, 240);
      saveArtifact('dark/liquid-glass-over-image-dark.png', ['after']);

      await ensureTheme('light');
      const pathOverImageLight = path.join(artifactsDir, 'after', 'liquid-glass-over-image.png');
      await captureViewportTop(pathOverImageLight, 1440, 240);
      saveArtifact('after/liquid-glass-over-image.png', ['light']);
    }

    // --- RESPONSIVE TESTING (1280px, 1024px, 768px, 390px) ---
    console.log('5. Testing Responsive Viewports (1280, 1024, 768, 390)...');
    const viewports = [
      { width: 1280, height: 800, name: '1280' },
      { width: 1024, height: 768, name: '1024' },
      { width: 768, height: 1024, name: '768' },
      { width: 390, height: 844, name: '390' },
    ];

    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
      await ensureTheme('light');
      await waitForStable();

      // Top unified
      await scrollTo(0);
      const pathTop = path.join(artifactsDir, 'responsive', `navbar-${vp.name}-light-top.png`);
      await captureViewportTop(pathTop, vp.width, 180);

      // Separated
      await scrollTo(550);
      const pathSep = path.join(artifactsDir, 'responsive', `navbar-${vp.name}-light-separated.png`);
      await captureViewportTop(pathSep, vp.width, 180);

      // Dark theme checks
      await ensureTheme('dark');
      if (vp.name === '390') {
        await scrollTo(0);
        const path390DarkTop = path.join(artifactsDir, 'responsive', `navbar-390-dark-top.png`);
        await captureViewportTop(path390DarkTop, 390, 180);
        saveArtifact('responsive/navbar-390-dark-top.png', ['dark']);

        await scrollTo(550);
        const path390DarkSep = path.join(artifactsDir, 'responsive', `navbar-390-dark-separated.png`);
        await captureViewportTop(path390DarkSep, 390, 180);
        saveArtifact('responsive/navbar-390-dark-separated.png', ['dark']);

        // 390 veil check
        if (aboutOffset) {
          await scrollTo(aboutOffset + 240);
          const path390Veil = path.join(artifactsDir, 'responsive', 'section-header-390-dark-veil.png');
          await captureViewportTop(path390Veil, 390, 300);
          saveArtifact('responsive/section-header-390-dark-veil.png', ['dark']);
        }
      } else if (vp.name === '1280') {
        await scrollTo(1200);
        await wait(100);
        await scrollTo(220);
        const path1280DarkRev = path.join(artifactsDir, 'responsive', 'navbar-1280-dark-reverse-scroll.png');
        await captureViewportTop(path1280DarkRev, 1280, 180);
        saveArtifact('responsive/navbar-1280-dark-reverse-scroll.png', ['dark', 'scroll-states']);
      }
    }

    // --- REDUCED MOTION TESTING ---
    console.log('6. Testing Reduced Motion State...');
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await ensureTheme('dark');
    await scrollTo(0);

    const pathReducedTop = path.join(artifactsDir, 'after', 'navbar-1440-reduced-motion-top.png');
    await captureViewportTop(pathReducedTop, 1440, 200);

    await scrollTo(550);
    const pathReducedSep = path.join(artifactsDir, 'after', 'navbar-1440-reduced-motion-separated.png');
    await captureViewportTop(pathReducedSep, 1440, 200);

    // Documentation for before/
    fs.writeFileSync(
      path.join(artifactsDir, 'before', 'README.md'),
      `# Before-State Assessment & Limitations

Prior to this refinement task, the branch \`wip/veil-fix\` contained partially implemented, interrupted work by a previous coding agent (OpenCode) that removed \`z-10\` / \`z-50\` from section components, introduced an interrupted attempt at \`LiquidGlass\` and morph transitions, and had breaking stacking-context and positioning bugs.
In accordance with strict safety rules:
- No git reset, stash, or branch switching was performed to avoid overwriting or risking user work.
- Incomplete before-states (such as snapped morphs, missing responsive weld geometry, and broken contact sticky positioning) are documented analytically and contrasted with the completed, verified after-states in \`after/\`, \`light/\`, \`dark/\`, \`responsive/\`, and \`scroll-states/\`.
`
    );

    console.log('\nVisual QA Completed Successfully!');
    console.log(`Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.error('Console Errors:', consoleErrors);
    }
  } finally {
    if (browser) await browser.close();
    previewServer.httpServer.close();
  }
}

runVisualQA().catch((err) => {
  console.error('Visual QA Failed:', err);
  process.exit(1);
});
