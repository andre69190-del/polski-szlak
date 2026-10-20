// JS-Syntax aller <script>-Blöcke in index.html (Idee aus BIOGLOW checks/check_syntax.mjs).
// Aufruf: node checks/check_syntax.mjs   -> Exit 1 bei Syntaxfehler
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const blocks = [...html.matchAll(/<script(?![^>]*type="application\/(?:ld\+)?json")[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
let fail = 0;
blocks.forEach((code, i) => {
  try { new vm.Script(code, { filename: `script#${i}` }); console.log(`  [OK] script#${i} (${code.length} Zeichen)`); }
  catch (e) { fail++; console.log(`  [!!] script#${i}: ${e.message}`); }
});
const json = html.match(/<script type="application\/json" id="ps-data">([\s\S]*?)<\/script>/);
try { JSON.parse(json[1]); console.log('  [OK] ps-data ist gültiges JSON'); } catch (e) { fail++; console.log('  [!!] ps-data: ' + e.message); }
const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (ld) { try { JSON.parse(ld[1]); console.log('  [OK] JSON-LD ist gültiges JSON'); } catch (e) { fail++; console.log('  [!!] JSON-LD: ' + e.message); } }
console.log(fail ? `FAIL: ${fail} Fehler` : 'PASS');
process.exit(fail ? 1 : 0);
