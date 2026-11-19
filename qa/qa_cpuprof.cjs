/**
 * CPU profile during scroll: shows where main-thread time actually goes.
 *
 *   node qa_cpuprof.cjs [url]
 */
const puppeteer = require('puppeteer');

const URL = process.argv[2] || 'http://localhost:4177/';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500));

  const client = await page.createCDPSession();
  await client.send('Profiler.enable');
  await client.send('Profiler.setSamplingInterval', { interval: 100 });
  await client.send('Profiler.start');

  await page.evaluate(async () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const t0 = performance.now();
    while (performance.now() - t0 < 4000) {
      const f = (performance.now() - t0) / 4000;
      window.scrollTo(0, Math.round(max * (f % 1)));
      await new Promise((r) => requestAnimationFrame(r));
    }
  });

  const { profile } = await client.send('Profiler.stop');

  // Self time per node, aggregated by function name.
  const self = new Map();
  const byId = new Map();
  profile.nodes.forEach((n) => byId.set(n.id, n));
  const counts = new Map();
  profile.samples.forEach((id) => counts.set(id, (counts.get(id) || 0) + 1));

  const total = profile.samples.length || 1;
  const dur = (profile.endTime - profile.startTime) / 1000;

  for (const [id, c] of counts) {
    const n = byId.get(id);
    if (!n) continue;
    const f = n.callFrame;
    const key = `${f.functionName || '(anon)'} @ ${(f.url || '').split('/').pop()}:${f.lineNumber}`;
    self.set(key, (self.get(key) || 0) + c);
  }

  const top = [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25);
  console.log(`samples=${total} duration=${dur.toFixed(0)}ms`);
  for (const [k, c] of top) {
    console.log(`${((c / total) * 100).toFixed(1).padStart(5)}%  ${k}`);
  }

  await browser.close();
})();