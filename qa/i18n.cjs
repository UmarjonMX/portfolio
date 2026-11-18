/**
 * Translation completeness: every `t('…')` key used in the source must resolve
 * to a real string (or array) in BOTH languages. A missing key renders as its
 * own path, which is visible in the UI — this makes it visible at build time.
 *
 *   node qa/i18n.cjs
 */
const fs = require('node:fs');
const path = require('node:path');

const SRC = path.resolve(__dirname, '../src');

// Evaluate the ESM default export without importing (it is plain data).
const text = fs.readFileSync(path.join(SRC, 'translations.js'), 'utf8');
const mod = text.replace(/export\s+default\s*/, 'return ');
const translations = new Function(mod)();

function resolve(lang, keyPath) {
  const keys = keyPath.split('.');
  let value = translations[lang];
  for (const k of keys) {
    if (value == null || value[k] === undefined) return undefined;
    value = value[k];
  }
  return value;
}

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(jsx?|mjs)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

const used = new Map();
for (const file of walk(SRC)) {
  const src = fs.readFileSync(file, 'utf8');
  for (const m of src.matchAll(/\bt\(\s*'([a-zA-Z0-9_.]+)'/g)) {
    if (!used.has(m[1])) used.set(m[1], []);
    used.get(m[1]).push(path.relative(SRC, file));
  }
}

const missing = [];
for (const [key, files] of [...used.entries()].sort()) {
  for (const lang of ['en', 'uz']) {
    const v = resolve(lang, key);
    if (v === undefined) missing.push(`${key}  [${lang}]  ← ${[...new Set(files)].join(', ')}`);
  }
}

// Keys defined in one language but not the other (project data excluded —
// slugs and titles legitimately differ per language).
function shape(obj, prefix = '') {
  const out = new Set();
  for (const [k, v] of Object.entries(obj || {})) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object') shape(v, p).forEach((x) => out.add(x));
    else out.add(p);
  }
  return out;
}
const enLeaves = shape(translations.en);
const uzLeaves = shape(translations.uz);
const onlyEn = [...enLeaves].filter((k) => !uzLeaves.has(k));
const onlyUz = [...uzLeaves].filter((k) => !enLeaves.has(k));

console.log(`keys used in source: ${used.size}`);
console.log(missing.length ? 'MISSING:\n  ' + missing.join('\n  ') : 'no missing keys');
console.log(onlyEn.length ? 'only in en: ' + onlyEn.join(', ') : 'en/uz key sets match');

process.exit(missing.length ? 1 : 0);