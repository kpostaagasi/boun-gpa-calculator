/**
 * BOUN GPA Calculator — i18n key consistency checker (Node)
 *
 * Verifies that every translation key actually used by the app exists in BOTH
 * the `tr` and `en` blocks of src/i18n.js, and that both blocks are symmetric
 * (no key defined in one language but missing in the other).
 *
 * Usage: node tests/check-i18n.mjs
 * Exit code 0 = consistent, 1 = problems found.
 */
import { readFileSync, readdirSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');

// --- Extract key sets from the tr/en blocks of src/i18n.js ---
const i18n = read('src/i18n.js');
const trStart = i18n.indexOf('tr: {');
const enStart = i18n.indexOf('en: {');
if (trStart < 0 || enStart < 0) {
    console.error('check-i18n: could not locate tr:/en: blocks in src/i18n.js');
    process.exit(1);
}
const trBody = i18n.slice(trStart + 5, enStart);
const enBody = i18n.slice(enStart + 5, i18n.indexOf('\n};', enStart));
// Keys may share a line ('day.mon': 'Pzt', 'day.tue': 'Sal'), so match anywhere
// in the block, not just at line starts. A quoted key is '…': — value strings
// never contain a quote followed by a colon.
const keysOf = (body) => [...body.matchAll(/'([^']+)':/g)].map((m) => m[1]);
const trKeys = new Set(keysOf(trBody));
const enKeys = new Set(keysOf(enBody));

// --- Collect keys actually used by the app ---
const used = new Set();
for (const m of read('index.html').matchAll(/data-i18n="([^"]+)"/g)) used.add(m[1]);
for (const file of readdirSync(new URL('src', root))) {
    if (!file.endsWith('.js')) continue;
    const src = read(`src/${file}`);
    for (const m of src.matchAll(/\bt\('([^']+)'/g)) used.add(m[1]);
}
// Dynamic prefixes like t('nav.' + mod.key) produce fragments ending in '.';
// those mean the namespace is used dynamically — drop the fragment itself.
const usedFinal = new Set([...used].filter((k) => !k.endsWith('.')));

// --- Diff ---
const problems = [];
const missingTr = [...usedFinal].filter((k) => !trKeys.has(k));
const missingEn = [...usedFinal].filter((k) => !enKeys.has(k));
const trOnly = [...trKeys].filter((k) => !enKeys.has(k));
const enOnly = [...enKeys].filter((k) => !trKeys.has(k));

if (missingTr.length) problems.push(`used but missing in tr: ${missingTr.join(', ')}`);
if (missingEn.length) problems.push(`used but missing in en: ${missingEn.join(', ')}`);
if (trOnly.length) problems.push(`defined in tr but not en: ${trOnly.join(', ')}`);
if (enOnly.length) problems.push(`defined in en but not tr: ${enOnly.join(', ')}`);

if (problems.length) {
    console.error(`check-i18n: ${problems.length} problem(s) found`);
    problems.forEach((p) => console.error('  - ' + p));
    process.exit(1);
}
console.log(`check-i18n: OK (${usedFinal.size} used keys, ${trKeys.size} tr / ${enKeys.size} en, symmetric)`);
