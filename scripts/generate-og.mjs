/**
 * Generates public/images/og.png — the 1200×630 social preview card.
 *
 * The site previously pointed `og:image` at its 48×48 favicon, so every share
 * on X, Facebook, LinkedIn, Telegram and iMessage rendered as a postage stamp.
 * Open Graph consumers do not accept SVG and do not crop reliably, so the card
 * is rasterised here with the browser already in the toolchain (Puppeteer).
 *
 *   npm run og
 */
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../public/images/og.png');

const html = `<!doctype html>
<html><head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@400;700;800&family=Josefin+Slab:wght@400;700&family=Libre+Baskerville:ital@1&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    background: #141416;
    color: #FAFAFA;
    font-family: 'Host Grotesk', sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 68px 76px;
    position: relative;
  }
  /* The same graphite → mineral field the WebGL background renders, expressed
     as a couple of soft radial washes so the card reads as the site. */
  body::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(900px 620px at 78% 8%, rgba(224,122,95,0.16), transparent 62%),
      radial-gradient(760px 560px at 12% 96%, rgba(120,132,150,0.16), transparent 60%);
  }
  .row { display: flex; align-items: center; justify-content: space-between; position: relative; }
  .mark { display: flex; align-items: center; gap: 16px; }
  .mark img { height: 52px; width: auto; }
  .mark span {
    font-family: 'Josefin Slab', serif;
    font-size: 15px; font-weight: 700; letter-spacing: 0.32em;
    text-transform: uppercase; color: rgba(250,250,250,0.42);
  }
  .tag {
    font-family: 'Josefin Slab', serif;
    font-size: 13px; font-weight: 700; letter-spacing: 0.34em;
    text-transform: uppercase; color: #E07A5F;
  }
  .rule { height: 1px; background: rgba(250,250,250,0.14); position: relative; margin-top: 30px; }
  .title {
    position: relative;
    font-size: 104px; line-height: 0.94; font-weight: 800;
    letter-spacing: -0.035em; text-transform: uppercase;
    margin-top: 34px;
  }
  .title em {
    display: block; font-style: normal; color: #E07A5F;
  }
  .foot {
    position: relative; display: flex; align-items: flex-end; justify-content: space-between; gap: 40px;
  }
  .kicker {
    font-family: 'Libre Baskerville', serif; font-style: italic;
    font-size: 25px; line-height: 1.42; color: rgba(250,250,250,0.74);
    max-width: 640px;
  }
  .meta {
    text-align: right;
    font-family: 'Josefin Slab', serif;
    font-size: 13px; font-weight: 700; letter-spacing: 0.22em;
    text-transform: uppercase; color: rgba(250,250,250,0.4);
    line-height: 2.1; white-space: nowrap;
  }
</style>
</head>
<body>
  <div>
    <div class="row">
      <div class="mark">
        <img src="http://localhost:0/__logo__" alt="" onerror="this.style.display='none'">
        <span>Umarjon MX</span>
      </div>
      <span class="tag">SH&#8211;01 // UZB</span>
    </div>
    <div class="rule"></div>
    <h1 class="title">Umar<em>Builds</em></h1>
  </div>

  <div class="foot">
    <p class="kicker">Building intelligent products that people actually use.</p>
    <div class="meta">
      AI &amp; Robotics Student<br>
      Software Developer &#183; Namangan
    </div>
  </div>
</body></html>`;

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

  // Inline the mark so the card does not depend on the dev server being up.
  const { readFile } = await import('node:fs/promises');
  const logo = await readFile(resolve(HERE, '../public/images/logo_dark.png'));
  const dataUrl = `data:image/png;base64,${logo.toString('base64')}`;

  await page.setContent(html.replace('http://localhost:0/__logo__', dataUrl), {
    waitUntil: 'networkidle0',
  });
  await page.evaluate(() => document.fonts.ready);

  await mkdir(dirname(OUT), { recursive: true });
  await page.screenshot({ path: OUT, type: 'png' });
  await browser.close();
  console.log(`wrote ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});