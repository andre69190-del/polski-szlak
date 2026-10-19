// Logik-Tests für src/core.js (node --test tests/)
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'src', 'core.js'), 'utf8'), ctx);
const C = ctx.PSCore;
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data.json'), 'utf8'));

test('norm: Kleinschreibung, Satzzeichen, Leerraum', () => {
  assert.equal(C.norm('  Dzień   dobry!  '), 'dzień dobry');
  assert.equal(C.norm('Jak się masz?'), 'jak się masz');
  assert.equal(C.norm('Żółw', true), 'zolw');
  assert.equal(C.norm('mam na imię …'), 'mam na imię');
});

test('checkAnswer: exakt, Akzente, Tippfehler, falsch', () => {
  assert.deepEqual({ ...C.checkAnswer('dziękuję', 'dziękuję') }, { ok: true, kind: 'exact' }); // Spread: Objekt kommt aus anderem vm-Realm
  const d = C.checkAnswer('dziekuje', 'dziękuję');
  assert.equal(d.kind, 'diacritics'); assert.equal(d.ok, true);
  assert.equal(C.checkAnswer('dziekuje', 'dziękuję', { hardcore: true }).ok, false);
  const ty = C.checkAnswer('dziękuje', 'dziękuję');
  assert.ok(ty.kind === 'diacritics' || ty.kind === 'typo');
  assert.equal(C.checkAnswer('przeprasam', 'przepraszam').kind, 'typo');
  assert.equal(C.checkAnswer('kot', 'pies').ok, false);
  assert.equal(C.checkAnswer('', 'pies').kind, 'empty');
  assert.equal(C.checkAnswer('kot', 'kos').ok, false, 'kurze Wörter: kein Tippfehler-Bonus');
});

test('checkAnswer: Varianten mit Schrägstrich', () => {
  assert.equal(C.checkAnswer('ona', 'on / ona').ok, true);
  assert.equal(C.checkAnswer('on', 'on / ona').ok, true);
  assert.equal(C.checkAnswer('moja', 'mój / moja').ok, true);
});

test('Zahlen 0–999 auf Polnisch', () => {
  const cases = { 0: 'zero', 1: 'jeden', 5: 'pięć', 11: 'jedenaście', 15: 'piętnaście', 20: 'dwadzieścia', 21: 'dwadzieścia jeden',
    44: 'czterdzieści cztery', 99: 'dziewięćdziesiąt dziewięć', 100: 'sto', 101: 'sto jeden', 250: 'dwieście pięćdziesiąt', 999: 'dziewięćset dziewięćdziesiąt dziewięć' };
  for (const [n, w] of Object.entries(cases)) assert.equal(C.numToPl(+n), w, n);
  assert.throws(() => C.numToPl(1000));
});

test('Złoty-Formen (1 / 2–4 / 5+ mit 12–14-Ausnahme)', () => {
  const exp = { 1: 'złoty', 2: 'złote', 4: 'złote', 5: 'złotych', 11: 'złotych', 12: 'złotych', 14: 'złotych', 21: 'złotych', 22: 'złote', 24: 'złote', 25: 'złotych', 32: 'złote', 112: 'złotych', 102: 'złote' };
  for (const [n, f] of Object.entries(exp)) assert.equal(C.zlotyForm(+n), f, n);
  assert.equal(C.priceWords(22), 'dwadzieścia dwa złote');
});

test('Spaced Repetition: Aufstieg, Absturz, Fälligkeit', () => {
  let c = C.srsUpdate(null, true, '2026-10-18');
  assert.equal(c.box, 1); assert.equal(c.due, '2026-10-19');
  c = C.srsUpdate(c, true, '2026-10-19'); assert.equal(c.box, 2); assert.equal(c.due, '2026-10-21');
  c = C.srsUpdate(c, true, '2026-10-21'); c = C.srsUpdate(c, true, '2026-10-25'); assert.equal(c.box, 4);
  c = C.srsUpdate(c, false, '2026-11-02'); assert.equal(c.box, 2); assert.equal(c.due, '2026-11-03'); assert.equal(c.wrong, 1);
  assert.ok(C.isDue(c, '2026-11-03')); assert.ok(!C.isDue(c, '2026-11-02'));
  let top = { box: 6, due: 'x', seen: 9, wrong: 0 }; top = C.srsUpdate(top, true, '2026-10-18'); assert.equal(top.box, 6);
});

test('Datum: Wochenschlüssel beginnt Montag, Monats-/Jahreswechsel', () => {
  assert.equal(C.weekKey('2026-10-18'), '2026-10-12'); // Sonntag -> Montag davor
  assert.equal(C.weekKey('2026-10-19'), '2026-10-19'); // Montag
  assert.equal(C.weekKey('2027-01-01'), '2026-12-28');
  assert.equal(C.addDays('2026-02-28', 1), '2026-03-01');
  assert.equal(C.addDays('2028-02-28', 1), '2028-02-29');
});

test('Wochen-Serie: verpasster Tag bricht nichts, verpasste Woche schon', () => {
  const a = {};
  ['2026-10-05', '2026-10-06', '2026-10-08'].forEach(d => a[d] = 1); // KW 41: 3 Tage
  ['2026-09-28', '2026-09-30', '2026-10-02'].forEach(d => a[d] = 1); // KW 40: 3 Tage
  assert.equal(C.weekStreak(a, 3, '2026-10-13'), 2, 'laufende Woche noch offen');
  ['2026-10-12', '2026-10-14', '2026-10-15'].forEach(d => a[d] = 1);
  assert.equal(C.weekStreak(a, 3, '2026-10-15'), 3, 'laufende Woche erfüllt');
  assert.equal(C.weekStreak(a, 4, '2026-10-15'), 0, 'höheres Ziel');
  assert.equal(C.totalDays(a), 9);
  assert.equal(C.weekStreak(a, 3, '2026-10-27'), 0, 'eine Woche komplett ausgelassen');
});

test('Zufall: deterministisch pro Seed (Tagesrätsel gleich für alle)', () => {
  const r1 = C.rng('daily-2026-10-18'), r2 = C.rng('daily-2026-10-18'), r3 = C.rng('daily-2026-10-19');
  const a = [r1(), r1(), r1()], b = [r2(), r2(), r2()], c = [r3(), r3(), r3()];
  assert.deepEqual(a, b); assert.notDeepEqual(a, c);
  const s = C.shuffle([1, 2, 3, 4, 5, 6], C.rng(1)); assert.equal(s.length, 6); assert.deepEqual([...s].sort(), [1, 2, 3, 4, 5, 6]);
});

test('XP und Stufen', () => {
  assert.deepEqual({ ...C.levelFromXp(0) }, { level: 1, into: 0, need: 100 });
  assert.equal(C.levelFromXp(100).level, 2);
  assert.equal(C.levelFromXp(299).level, 2);
  assert.equal(C.levelFromXp(300).level, 3);
  assert.equal(C.xpFor(false, 5, false), 0);
  assert.equal(C.xpFor(true, 1, false), 10);
  assert.equal(C.xpFor(true, 3, false), 14);
  assert.equal(C.xpFor(true, 50, false), 20, 'Kombo-Bonus gedeckelt');
  assert.equal(C.xpFor(true, 1, true), 20, 'strenger Modus doppelt');
});

test('Teilen-Text', () => {
  const s = C.shareText('2026-10-18', [true, false, true]);
  assert.match(s, /2\/3/); assert.match(s, /🟩⬜🟩/);
});

test('Satzbau: alle Sätze aus den Daten lassen sich aus ihren Wörtern zurückbauen', () => {
  for (const u of DATA.units) for (const s of u.sentences) {
    const tk = C.tokens(s[0]);
    assert.ok(C.sameSentence(tk.join(' '), s[0]), s[0]);
    assert.ok(tk.length >= 3, s[0]);
  }
});

test('Fall-Übungen: Lösung füllt die Lücke sinnvoll', () => {
  for (const c of DATA.cases) {
    assert.ok(c.opts.includes(c.a), c.s);
    assert.equal(c.s.split('___').length, 2, c.s);
  }
});

test('Backup-Validierung', () => {
  assert.equal(C.validateSave({ app: 'polski-szlak', xp: 10, cards: {} }), true);
  assert.equal(C.validateSave({ app: 'x', xp: 10, cards: {} }), false);
  assert.equal(C.validateSave({ app: 'polski-szlak', xp: -1, cards: {} }), false);
  assert.equal(C.validateSave(null), false);
});

/* ---------- 1.1: Schwierigkeit, Einstufung, Land und Leute ---------- */
test('Schwierigkeit: Stufen vollständig, Mischungen summieren auf 1', () => {
  for (const k of ['easy', 'medium', 'hard']) {
    const d = C.diffCfg(k), sum = d.mix.reduce((a, b) => a + b, 0);
    assert.ok(Math.abs(sum - 1) < 1e-9, k + ': ' + sum);
    assert.ok(d.boss.pass >= 50 && d.boss.lives >= 1, k);
  }
  assert.equal(C.diffCfg('quatsch'), C.diffCfg('easy'), 'unbekannte Stufe fällt auf leicht zurück');
  assert.ok(C.diffCfg('hard').strict && !C.diffCfg('easy').strict);
});

test('Fragetyp-Auswahl folgt der Mischung', () => {
  assert.equal(C.pickKind('easy', 0), 'pl2x');
  assert.equal(C.pickKind('easy', 0.999), 'type');
  assert.notEqual(C.pickKind('hard', 0), 'pl2x', 'schwer hat keine reinen Erkennungsfragen');
  assert.equal(C.pickKind('hard', 0.99), 'dictate');
});

test('Einstufung: erste Stadt mit Fehler', () => {
  assert.equal(C.placementStart([[true, true], [true, false], [true, true]]), 1);
  assert.equal(C.placementStart([[true, true], [true, true]]), 2);
  assert.equal(C.placementStart([[false, true]]), 0);
  assert.equal(C.placementStart([[true, true], []]), 1, 'unbeantwortete Stadt zählt nicht als bestanden');
});

test('Karte: Projektion umkehrbar, Entfernung plausibel', () => {
  const [x, y] = C.proj(21.01, 52.23), [lon, lat] = C.unproj(x, y);
  assert.ok(Math.abs(lon - 21.01) < 1e-9 && Math.abs(lat - 52.23) < 1e-9);
  const d = C.distKm(52.23, 21.01, 50.06, 19.94); // Warschau–Krakau
  assert.ok(d > 240 && d < 270, String(d));
});

test('Höher/Tiefer: Paare mit klarem Abstand, Zeitstrahl-Reihenfolge', () => {
  const items = [['a', 100], ['b', 105], ['c', 200]], r = C.rng('hl');
  for (let i = 0; i < 30; i++) {
    const p = C.hlPair(items, r); assert.ok(p, 'Paar gefunden');
    assert.ok(Math.max(p[0][1], p[1][1]) / Math.min(p[0][1], p[1][1]) >= 1.15);
  }
  assert.ok(C.orderOk([966, 1410, 1989]));
  assert.ok(!C.orderOk([1410, 966]));
});

test('Literki: Buchstabensalat ist eine echte Umstellung', () => {
  const r = C.rng('lit');
  for (const w of ['pierogi', 'Kraków', 'dziękuję']) {
    const s = C.scramble(w, r);
    assert.notEqual(s, w);
    assert.deepEqual(s.split('').sort(), w.split('').sort());
  }
});

test('Rechtschreibung: Fehlformen sind verschieden und nie das Original', () => {
  for (const w of ['góra', 'rzeka', 'chleb', 'żaba', 'może']) {
    assert.ok(C.spellWorthy(w), w);
    const m = C.misspell(w, 3, C.rng(w));
    assert.ok(m.length >= 1, w);
    const forms = m.map(x => x.w);
    assert.ok(!forms.includes(w), w);
    assert.equal(new Set(forms).size, forms.length, w);
  }
  assert.ok(!C.spellWorthy('to'));
});

/* ---------- 1.2: Państwa-Miasta ---------- */
test('Państwa-Miasta: Anfangsbuchstabe mit Ł/Ż-Gleichsetzung', () => {
  assert.ok(C.pmLetterOk('Łódź', 'L'));
  assert.ok(C.pmLetterOk('żurek', 'Z'));
  assert.ok(C.pmLetterOk('  Kraków ', 'K'));
  assert.ok(!C.pmLetterOk('Gdańsk', 'K'));
  assert.ok(!C.pmLetterOk('', 'K'));
});

test('Państwa-Miasta: bekannte Wörter, auch ohne Polnisch-Tastatur', () => {
  const list = DATA.pm.cats.find(c => c.id === 'miasto').words;
  assert.ok(C.pmKnown('Krakow', 'K', list), 'ohne Diakritika');
  assert.ok(C.pmKnown('bielsko-biała', 'B', list));
  assert.ok(!C.pmKnown('Kraków', 'W', list), 'falscher Buchstabe');
  assert.ok(!C.pmKnown('Kartoffelstadt', 'K', list));
});

test('Państwa-Miasta: Punkte 10 / 5 / 20 / 0', () => {
  assert.deepEqual([...C.pmScore(['Kot', 'koń', ''], [true, true, false])], [10, 10, 0]);
  assert.deepEqual([...C.pmScore(['kot', 'Kot', 'koza'], [true, true, true])], [5, 5, 10]);
  assert.deepEqual([...C.pmScore(['kot', 'xyz', ''], [true, false, false])], [20, 0, 0]);
  assert.deepEqual([...C.pmScore(['kot', 'kot'], [false, false])], [0, 0]);
});

test('Państwa-Miasta: jede Kategorie hat zu jedem Buchstaben mehrere Beispiele', () => {
  assert.ok(DATA.pm.cats.length >= 5);
  for (const L of DATA.pm.letters) for (const c of DATA.pm.cats) {
    const n = c.words.filter(w => C.pmLetterOk(w, L)).length;
    assert.ok(n >= 2, c.id + ' ' + L + ': ' + n);
  }
  for (const c of DATA.pm.cats) assert.equal(new Set(c.words.map(w => C.norm(w, true))).size, c.words.length, c.id + ' ohne Dubletten');
});

test('Duell-Code: Format, Parsen, Stufe im Code', () => {
  const code = C.duelNewCode(C.rng(7), 3);
  assert.match(code, /^[A-Z]{2,8}-\d{3}-3$/);
  assert.equal(C.duelParse(' kot 472 2 ').code, 'KOT-472-2');
  assert.equal(C.duelParse('KOT4721').diff, 'easy');
  assert.equal(C.duelParse('KOT-472-4'), null);
  assert.equal(C.duelParse(''), null);
});

test('Duell-Code: gleicher Code = exakt gleiche Fragen (sprach- und lernstandsunabhängig)', () => {
  const a = C.duelPlan(DATA, 'kot-472-2'), b = C.duelPlan(DATA, 'KOT 472 2');
  assert.equal(JSON.stringify(a.plan), JSON.stringify(b.plan));
  assert.equal(a.check, b.check);
  assert.equal(a.plan.length, 20);
  assert.notEqual(C.duelPlan(DATA, 'KOT-473-2').check, a.check);
  assert.notEqual(C.duelPlan(DATA, 'KOT-472-3').check, a.check);
  // Math.random darf keinen Einfluss haben
  const orig = Math.random; Math.random = () => 0.999;
  try { assert.equal(C.duelPlan(DATA, 'KOT-472-2').check, a.check); } finally { Math.random = orig; }
});

test('Duell-Code: Antwortoptionen eindeutig in PL, DE und EN', () => {
  for (const code of ['KOT-100-1', 'LAS-555-2', 'SER-999-3', 'ZUPA-321-1']) {
    const pl = C.duelPlan(DATA, code), n = C.diffCfg(pl.diff).opts;
    for (const it of pl.plan) {
      if (it.k !== 'w') continue;
      assert.equal(it.opts.length, n);
      assert.ok(it.opts.some(x => x[0] === it.item[0] && x[1] === it.item[1]));
      for (const lang of [0, 1, 2]) {
        const labels = it.opts.map(x => C.norm(DATA.units[x[0]].words[x[1]][lang]));
        assert.equal(new Set(labels).size, labels.length, code + ' Sprache ' + lang);
      }
    }
  }
});

test('Duell-Ergebnis: Text hin und zurück, Sieger mit Zeit als Tie-Break', () => {
  const txt = C.duelResultText('KOT-472-2', 'AB12', [1, 1, 0, 1], 133000);
  const r = C.duelReadResult(txt);
  assert.equal(r.code, 'KOT-472-2'); assert.equal(r.check, 'AB12'); assert.equal(r.right, 3); assert.equal(r.total, 4); assert.equal(r.ms, 133000);
  assert.equal(C.duelCompare({ right: 3, ms: 90000 }, { right: 2, ms: 10000 }), 1);
  assert.equal(C.duelCompare({ right: 3, ms: 90000 }, { right: 3, ms: 80000 }), -1);
  assert.equal(C.duelCompare({ right: 3, ms: 80000 }, { right: 3, ms: 80000 }), 0);
  assert.equal(C.duelReadResult('hallo'), null);
});

test('polLevel: Stufe nur, wenn alle darunter auch sitzen', function () {
  function L(a, b, c) { var r = []; [a, b, c].forEach(function (n, i) { for (var k = 0; k < 6; k++) r.push({ lv: i + 1, ok: k < n }); }); return r; }
  assert.equal(C.polLevel(L(6, 6, 6)), 3);
  assert.equal(C.polLevel(L(4, 4, 3)), 2);
  assert.equal(C.polLevel(L(3, 6, 6)), 0);
  assert.equal(C.polLevel(L(5, 2, 6)), 1);
  assert.equal(C.polLevel([]), 0);
});

test('Gemischtes Duell: P-Stufen, gleicher Stamm, Gewichtung', () => {
  const p = C.duelParse('kot 472 p3');
  assert.equal(p.code, 'KOT-472-P3'); assert.equal(p.base, 'KOT-472'); assert.equal(p.pol, true); assert.equal(p.weight, 3);
  assert.equal(C.duelParse('KOT-472-2').base, 'KOT-472');
  assert.equal(C.duelParse('KOT-472-P4'), null);
  assert.match(C.duelNewCode(C.rng(3), 'P2'), /^[A-Z]{2,8}-\d{3}-P2$/);
  const a = C.duelPlan(DATA, 'KOT-472-P2'), b = C.duelPlan(DATA, 'kot472p2');
  assert.equal(a.plan.length, 20); assert.equal(a.check, b.check);
  for (const it of a.plan) { const q = DATA.polacy[it.c][it.i]; assert.equal(q.lv, 2); assert.equal(it.opts.length, 4); assert.ok(it.opts.includes(q.a)); }
  assert.notEqual(C.duelPlan(DATA, 'KOT-472-P1').check, a.check);
  assert.equal(C.duelWeight('1'), 1); assert.equal(C.duelWeight('3'), 2); assert.equal(C.duelWeight('P3'), 3);
  // 10/20 auf Stufe 3 (20 P.) schlägt 15/20 auf Stufe 1 (15 P.)
  assert.equal(C.duelCompare({ right: 10, lv: '3', ms: 9e5 }, { right: 15, lv: '1', ms: 1000 }), 1);
  // gleiche Stufe: ungewichtet wie bisher
  assert.equal(C.duelCompare({ right: 10, lv: '2', ms: 1000 }, { right: 11, lv: '2', ms: 9e5 }), -1);
});

test('Duell-Ergebnis mit Name und Prüfsumme: Fälschung fällt auf, Rangliste', () => {
  const txt = C.duelResultText('KOT-472-P1', 'AB12', [1, 0, 1], 65000, { name: 'Ania', input: 'tap' });
  const r = C.duelReadResult(txt);
  assert.equal(r.name, 'Ania'); assert.equal(r.input, 'T'); assert.equal(r.lv, 'P1'); assert.equal(r.base, 'KOT-472'); assert.equal(r.signed, true);
  assert.equal(r.right, 2); assert.equal(r.ms, 65000);
  assert.equal(C.duelReadResult(txt.replace('2/3', '3/3')).signed, false);
  assert.equal(C.duelReadResult(txt.replace('Ania', 'Ola')).signed, false);
  assert.equal(C.duelReadResult('Polski Szlak ⚔ KOT-472-2 #AB12\n3/4 · 2:13').signed, false);
  let rank = {};
  rank = C.rankAdd(rank, { name: 'Ania', right: 12, total: 20, lv: '3' }, 1);
  rank = C.rankAdd(rank, { name: 'Ben', right: 15, total: 20, lv: '1' }, -1);
  rank = C.rankAdd(rank, { name: 'ania', right: 10, total: 20, lv: '2' }, 0);
  const list = C.rankList(rank);
  assert.equal(list.length, 2); assert.equal(list[0].name, 'ania'); assert.equal(list[0].g, 2); assert.equal(list[0].w, 1); assert.equal(list[0].d, 1); assert.equal(list[0].pts, 39);
});
