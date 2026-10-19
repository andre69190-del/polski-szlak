// i18n-Vollständigkeit (Idee aus GeoQuest i18n_test.js, Phase 519).
// Prüft: TX.de und TX.en haben dieselben Schlüssel, und jeder im Code benutzte t('…')-Schlüssel existiert in beiden.
// Aufruf: node checks/i18n_check.mjs   -> Exit 1 bei Lücken
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const src = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const start = src.indexOf('var TX = {'), end = src.indexOf('/* ---------- Zustand');
if (start < 0 || end < 0) { console.log('[!!] TX-Block nicht gefunden'); process.exit(1); }
const ctx = {}; vm.createContext(ctx);
vm.runInContext(src.slice(start, end).replace('var TX', 'globalThis.TX'), ctx);
const { de, en } = ctx.TX;
let fail = 0;
for (const k of Object.keys(de)) if (!(k in en)) { fail++; console.log(`  [!!] fehlt in EN: ${k}`); }
for (const k of Object.keys(en)) if (!(k in de)) { fail++; console.log(`  [!!] fehlt in DE: ${k}`); }
const used = new Set([...src.matchAll(/\bt\('([a-z_]+)'\)/g)].map(m => m[1]));
for (const k of used) if (!(k in de) || !(k in en)) { fail++; console.log(`  [!!] t('${k}') benutzt, aber nicht übersetzt`); }
for (const k of Object.keys(de)) if (typeof de[k] === 'string' && de[k] === en[k] && de[k].length > 12) console.log(`  [WARN] DE = EN bei ${k}: ${de[k]}`);
console.log(`  ${Object.keys(de).length} Schlüssel, ${used.size} im Code benutzt`);
console.log(fail ? `FAIL: ${fail} Lücken` : 'PASS');
process.exit(fail ? 1 : 0);
