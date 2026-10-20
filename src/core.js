/* Polski Szlak – Kernlogik (rein, ohne DOM). Wird von tests/core.test.js direkt geprüft.
   Alles hängt an globalThis.PSCore. */
(function (G) {
  'use strict';
  var DIA = { 'ą':'a','ć':'c','ę':'e','ł':'l','ń':'n','ó':'o','ś':'s','ź':'z','ż':'z','ä':'a','ö':'o','ü':'u','ß':'ss' };

  function stripDia(s) { return String(s).replace(/[ąćęłńóśźżäöüß]/g, function (c) { return DIA[c]; }); }

  /* Kleinschreibung, Satzzeichen weg, Leerraum zusammenfassen. lenient=true entfernt zusätzlich Diakritika. */
  function norm(s, lenient) {
    var t = String(s == null ? '' : s).toLowerCase()
      .replace(/[…]/g, ' ')
      .replace(/\([^)]*\)/g, ' ')
      .replace(/[.,!?;:"„“”'’«»()\-–—]/g, ' ')
      .replace(/\s+/g, ' ').trim();
    return lenient ? stripDia(t) : t;
  }

  /* "on / ona" → ["on","ona", "on / ona"]; "Katze / Kater" → ["katze","kater", …] */
  function variants(target) {
    var raw = String(target);
    var parts = raw.split(/\s*\/\s*/).filter(Boolean);
    var out = [norm(raw)];
    parts.forEach(function (p) { var n = norm(p); if (n && out.indexOf(n) < 0) out.push(n); });
    return out;
  }

  function lev(a, b) {
    a = String(a); b = String(b);
    if (a === b) return 0;
    var m = a.length, n = b.length, i, j, prev = [], cur = [];
    for (j = 0; j <= n; j++) prev[j] = j;
    for (i = 1; i <= m; i++) {
      cur = [i];
      for (j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[n];
  }

  /* Prüft eine getippte Antwort.
     kind: exact | diacritics (nur Akzente fehlen) | typo (1 Tippfehler, ab 5 Zeichen) | wrong
     ok:   true für exact; diacritics nur wenn !hardcore; typo nur wenn !hardcore */
  function checkAnswer(input, target, opts) {
    opts = opts || {};
    var inN = norm(input), vs = variants(target), i;
    if (!inN) return { ok: false, kind: 'empty' };
    for (i = 0; i < vs.length; i++) if (inN === vs[i]) return { ok: true, kind: 'exact' };
    var inL = stripDia(inN);
    for (i = 0; i < vs.length; i++) if (inL === stripDia(vs[i])) return { ok: !opts.hardcore, kind: 'diacritics', expected: vs[i] };
    for (i = 0; i < vs.length; i++) {
      var v = vs[i];
      if (v.length >= 5 && lev(inL, stripDia(v)) === 1) return { ok: !opts.hardcore, kind: 'typo', expected: v };
    }
    return { ok: false, kind: 'wrong', expected: vs[0] };
  }

  /* Zahlen 0–999 auf Polnisch */
  var ONES = ['zero','jeden','dwa','trzy','cztery','pięć','sześć','siedem','osiem','dziewięć'];
  var TEENS = ['dziesięć','jedenaście','dwanaście','trzynaście','czternaście','piętnaście','szesnaście','siedemnaście','osiemnaście','dziewiętnaście'];
  var TENS = ['','','dwadzieścia','trzydzieści','czterdzieści','pięćdziesiąt','sześćdziesiąt','siedemdziesiąt','osiemdziesiąt','dziewięćdziesiąt'];
  var HUND = ['','sto','dwieście','trzysta','czterysta','pięćset','sześćset','siedemset','osiemset','dziewięćset'];
  function numToPl(n) {
    n = Math.floor(n);
    if (n < 0 || n > 999) throw new Error('numToPl: 0..999');
    if (n < 10) return ONES[n];
    var parts = [], h = Math.floor(n / 100), r = n % 100;
    if (h) parts.push(HUND[h]);
    if (r >= 10 && r < 20) parts.push(TEENS[r - 10]);
    else {
      if (r >= 20) parts.push(TENS[Math.floor(r / 10)]);
      if (r % 10) parts.push(ONES[r % 10]);
    }
    return parts.join(' ');
  }
  /* 1 złoty · 2–4 złote (nicht 12–14) · sonst złotych */
  function zlotyForm(n) {
    if (n === 1) return 'złoty';
    var l = n % 10, t = n % 100;
    if (l >= 2 && l <= 4 && !(t >= 12 && t <= 14)) return 'złote';
    return 'złotych';
  }
  function priceWords(n) { return numToPl(n) + ' ' + zlotyForm(n); }

  /* Spaced Repetition (Leitner, 0–6). Intervalle in Tagen. */
  var INTERVALS = [0, 1, 2, 4, 8, 16, 32];
  var MASTERED_BOX = 4;
  function srsUpdate(card, correct, today) {
    card = card ? { box: card.box | 0, due: card.due, seen: (card.seen | 0), wrong: (card.wrong | 0) } : { box: 0, due: today, seen: 0, wrong: 0 };
    card.seen += 1;
    if (correct) card.box = Math.min(card.box + 1, INTERVALS.length - 1);
    else { card.box = card.box > 2 ? 2 : 1; card.wrong += 1; }
    card.due = addDays(today, correct ? INTERVALS[card.box] : 1);
    return card;
  }
  function isDue(card, today) { return !!card && card.due <= today; }

  /* Datum als YYYY-MM-DD in lokaler Zeit */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dayKey(d) { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseDay(k) { var p = k.split('-'); return new Date(+p[0], +p[1] - 1, +p[2], 12); }
  function addDays(k, n) { var d = parseDay(k); d.setDate(d.getDate() + n); return dayKey(d); }
  /* Woche beginnt Montag. Schlüssel = Datum des Montags. */
  function weekKey(k) { var d = parseDay(k), wd = (d.getDay() + 6) % 7; d.setDate(d.getDate() - wd); return dayKey(d); }
  function prevWeek(wk) { return addDays(wk, -7); }
  /* Tage seit dem letzten aktiven Tag (vor heute); -1 = noch nie aktiv */
  function daysSince(activeDays, todayKey) {
    var last = Object.keys(activeDays || {}).filter(function (k) { return k < todayKey; }).sort().pop();
    if (!last) return -1;
    return Math.round((parseDay(todayKey) - parseDay(last)) / 86400000);
  }
  /* Roter Faden pro Stadt: empfohlene Reihenfolge, nächster offener Schritt (null = Stadt geschafft) */
  var STEPS = ['learn', 'scene', 'quiz', 'build', 'boss'];
  function nextStep(st, uid) {
    var d = (st.done && st.done[uid]) || {};
    if (st.boss && st.boss[uid]) return null;
    for (var i = 0; i < STEPS.length; i++) {
      var m = STEPS[i];
      if (m === 'boss') return m;
      if (m === 'scene' ? !(st.scenes && st.scenes[uid]) : !d[m]) return m;
    }
    return 'boss';
  }
  /* Der Brief: ein Satz pro Stadt wird lesbar, sobald die Stadt geschafft (oder per Einstufung übersprungen) ist */
  function letterRead(lines, st) {
    return (lines || []).map(function (l) { return !!((st.boss && st.boss[l.u]) || (st.skipped && st.skipped[l.u])); });
  }
  function daysInWeek(activeDays, wk) {
    var c = 0; for (var i = 0; i < 7; i++) if (activeDays[addDays(wk, i)]) c++; return c;
  }
  /* Wochen-Serie: zusammenhängende Wochen mit erfülltem Wochenziel.
     Die laufende Woche zählt nur, wenn sie schon erfüllt ist – sie bricht die Serie aber nie. */
  function weekStreak(activeDays, goal, todayKey) {
    var wk = weekKey(todayKey), s = 0;
    if (daysInWeek(activeDays, wk) >= goal) s++;
    wk = prevWeek(wk);
    var guard = 0;
    while (daysInWeek(activeDays, wk) >= goal && guard++ < 520) { s++; wk = prevWeek(wk); }
    return s;
  }
  function totalDays(activeDays) { return Object.keys(activeDays || {}).length; }

  /* Deterministischer Zufall (für Tagesrätsel: alle bekommen dieselben Fragen) */
  function hash(str) { var h = 2166136261 >>> 0; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) {
    var a = typeof seed === 'number' ? seed >>> 0 : hash(String(seed));
    return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function shuffle(arr, r) { r = r || Math.random; var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function sample(arr, n, r) { return shuffle(arr, r).slice(0, n); }

  /* XP & Stufen: Stufe n braucht 50·n·(n+1) XP insgesamt */
  function xpForLevel(n) { return 50 * n * (n + 1); }
  function levelFromXp(xp) {
    var lv = 0; while (xp >= xpForLevel(lv + 1)) lv++;
    var base = xpForLevel(lv), next = xpForLevel(lv + 1);
    return { level: lv + 1, into: xp - base, need: next - base };
  }
  function comboBonus(combo) { return Math.min(Math.max(combo - 1, 0) * 2, 10); }
  function xpFor(correct, combo, hardcore) { if (!correct) return 0; return (10 + comboBonus(combo)) * (hardcore ? 2 : 1); }

  /* Teilen-Text fürs Tagesrätsel (wie Wordle) */
  function shareText(dateKey, results) {
    var good = results.filter(Boolean).length;
    var bar = results.map(function (r) { return r ? '🟩' : '⬜'; }).join('');
    return 'Polski Szlak · ' + dateKey + ' · ' + good + '/' + results.length + '\n' + bar;
  }

  /* Duell-Code: zwei Handys, gleicher Code = exakt gleiche Fragen.
     Format WORT-123-S (S = Stufe 1 leicht, 2 mittel, 3 schwer, P1–P3 = Dla Polaków). Die Stufe steckt im Code,
     damit nicht die Einstellung des Handys über die Fragen entscheidet.
     Gemischtes Duell: gleicher Stamm WORT-123, jeder seine eigene Stufe → andere Fragen, Punkte gewichtet. */
  var DUEL_WORDS = ['KOT', 'PIES', 'LAS', 'DOM', 'RYBA', 'SOWA', 'MOST', 'ZUPA', 'KAWA', 'LIS', 'ZAMEK', 'MAK', 'SER', 'OKO', 'LATO', 'ZIMA', 'KINO', 'RZEKA', 'GORA', 'MORZE'];
  var DUEL_DIFFS = ['easy', 'medium', 'hard'];
  var DUEL_WEIGHT = { '1': 1, '2': 1.5, '3': 2, 'P1': 2, 'P2': 2.5, 'P3': 3 };
  function duelNewCode(r, level) {
    r = r || Math.random;
    var w = DUEL_WORDS[Math.floor(r() * DUEL_WORDS.length)], n = 100 + Math.floor(r() * 900);
    var lv = DUEL_WEIGHT[String(level).toUpperCase()] ? String(level).toUpperCase() : '1';
    return w + '-' + n + '-' + lv;
  }
  function duelWeight(lv) { return DUEL_WEIGHT[String(lv)] || 1; }
  function duelParse(str) {
    var c = String(str || '').toUpperCase().replace(/[\s_.]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    var m = c.match(/^([A-Z]{2,8})-?(\d{3})-?(P?)-?([123])$/);
    if (!m) return null;
    var n = +m[4], lv = m[3] + n;
    return { code: m[1] + '-' + m[2] + '-' + lv, base: m[1] + '-' + m[2], lv: lv, pol: !!m[3], level: n, diff: m[3] ? 'hard' : DUEL_DIFFS[n - 1], weight: duelWeight(lv) };
  }
  /* Prüfzeichen über die sprachunabhängige Fragen-Signatur: beide Handys müssen dasselbe zeigen */
  function duelCheck(sig) { return ('0000' + hash(String(sig)).toString(36).toUpperCase()).slice(-4); }
  function fmtTime(ms) { var s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
  /* Prüfsumme über Code + Ergebnis: nachträglich geänderte Ergebnisse fallen auf (kein Kryptoschutz, aber gegen Tippen/Schummeln per Hand) */
  var INP_MARK = { write: 'W', speak: 'S', tap: 'T' };
  function duelName(n) { return String(n || '').replace(/[\n\r#~\/\u00b7:0-9]/g, '').replace(/\s+/g, ' ').trim().slice(0, 20); }
  function duelSign(code, check, name, right, total, secs, inp) { return duelCheck(['sig', code, check, duelName(name).toLowerCase(), right, total, secs, inp || ''].join('|')); }
  function duelResultText(code, check, results, ms, extra) {
    var good = results.filter(Boolean).length, x = extra || {}, name = duelName(x.name), inp = INP_MARK[x.input] || '', secs = Math.max(0, Math.round(ms / 1000));
    return 'Polski Szlak \u2694 ' + code + ' #' + check + '\n' + (name ? name + ' \u00b7 ' : '') + good + '/' + results.length + ' \u00b7 ' + fmtTime(ms) + (inp ? ' \u00b7 ' + inp : '') + '\n' +
      results.map(function (r) { return r ? '\ud83d\udfe9' : '\u2b1c'; }).join('') + '\n~' + duelSign(code, check, name, good, results.length, secs, inp);
  }
  function duelReadResult(text) {
    var t = String(text || ''), mc = t.match(/([A-Za-z]{2,8}-\d{3}-[Pp]?[123])/), ms = t.match(/(\d+)\s*\/\s*(\d+)/), mt = t.match(/(\d+):(\d{2})/), mk = t.match(/#([0-9A-Za-z]{4})/);
    if (!ms) return null;
    var line = t.match(/\n\s*([^\n\u00b7]*?)\s*\u00b7\s*\d+\s*\/\s*\d+/), mi = t.match(/\d:\d{2}\s*\u00b7\s*([WST])\b/), msg = t.match(/~([0-9A-Za-z]{4})/);
    var pc = mc ? duelParse(mc[1]) : null, o = { code: pc ? pc.code : null, base: pc ? pc.base : null, lv: pc ? pc.lv : null, check: mk ? mk[1].toUpperCase() : null, right: +ms[1], total: +ms[2], ms: mt ? (+mt[1] * 60 + +mt[2]) * 1000 : null,
      name: line ? duelName(line[1]) : '', input: mi ? mi[1] : '' };
    o.signed = !!(msg && pc && o.check && o.ms != null && msg[1].toUpperCase() === duelSign(o.code, o.check, o.name, o.right, o.total, o.ms / 1000, o.input));
    return o;
  }
  function duelScore(o) { return Math.round(o.right * duelWeight(o.lv) * 10) / 10; }
  /* Fragenplan fürs Duell: hängt NUR vom Code und den Inhalten ab – nicht vom Lernstand,
     nicht von der Basissprache, nicht von Math.random und nicht von der Stufe in den Einstellungen.
     Ablenker werden über Wort-Positionen gewählt und sind in PL, DE und EN verschieden. */
  var DUEL_MIX = { w: 10, c: 4, t: 3, p: 2, h: 1 };
  function duelPlan(data, code) {
    var pc = duelParse(code); if (!pc) return null;
    var r = rng('duel|' + pc.code), cfg = diffCfg(pc.diff), plan = [], i;
    if (pc.pol) {
      if (!data.polacy) return null;
      var pq = [];
      Object.keys(data.polacy).sort().forEach(function (c) { data.polacy[c].forEach(function (x, xi) { if (x.lv === pc.level) pq.push([c, xi]); }); });
      shuffle(pq, r).slice(0, 20).forEach(function (x) { var q = data.polacy[x[0]][x[1]]; plan.push({ k: 'q', c: x[0], i: x[1], opts: shuffle([q.a].concat(q.o), r) }); });
      return { code: pc.code, base: pc.base, lv: pc.lv, level: pc.level, pol: true, diff: pc.diff, plan: plan, check: duelCheck(JSON.stringify(plan)) };
    }
    var words = [];
    data.units.forEach(function (u, ui) { u.words.forEach(function (w, wi) { words.push([ui, wi]); }); });
    var W = function (x) { return data.units[x[0]].words[x[1]]; };
    var keys = function (w) { return ['p' + norm(w[0]), 'd' + norm(w[1]), 'e' + norm(w[2])]; };
    var idx = function (n) { var a = []; for (var k = 0; k < n; k++) a.push(k); return a; };
    shuffle(words, r).slice(0, DUEL_MIX.w).forEach(function (x, n) {
      var seen = {}, outs = [];
      keys(W(x)).forEach(function (k) { seen[k] = 1; });
      shuffle(words, r).forEach(function (y) {
        if (outs.length >= cfg.opts - 1) return;
        var ks = keys(W(y));
        if (ks.some(function (k) { return seen[k]; })) return;
        ks.forEach(function (k) { seen[k] = 1; }); outs.push(y);
      });
      plan.push({ k: 'w', dir: n % 2 ? 'x2pl' : 'pl2x', item: x, opts: shuffle([x].concat(outs), r) });
    });
    shuffle(idx(data.cases.length), r).slice(0, DUEL_MIX.c).forEach(function (ci) {
      plan.push({ k: 'c', i: ci, type: cfg.clozeType, opts: shuffle(data.cases[ci].opts, r) });
    });
    shuffle(idx(data.culture.tf.length), r).slice(0, DUEL_MIX.t).forEach(function (ti) { plan.push({ k: 't', i: ti }); });
    var people = data.culture.people;
    shuffle(idx(people.length), r).slice(0, DUEL_MIX.p).forEach(function (pi) {
      var others = people.map(function (x) { return x.name; }).filter(function (nm) { return nm !== people[pi].name; });
      plan.push({ k: 'p', i: pi, opts: shuffle([people[pi].name].concat(shuffle(others, r).slice(0, Math.max(3, cfg.opts - 1))), r) });
    });
    for (i = 0; i < DUEL_MIX.h; i++) {
      var hs = Math.floor(r() * data.culture.hl.length), pr = hlPair(data.culture.hl[hs].items, r);
      if (pr) plan.push({ k: 'h', i: hs, pair: [pr[0][0], pr[1][0]] });
    }
    plan = shuffle(plan, r);
    return { code: pc.code, base: pc.base, lv: pc.lv, level: pc.level, pol: false, diff: pc.diff, plan: plan, check: duelCheck(JSON.stringify(plan)) };
  }

  /* 1 = ich gewinne, -1 = Gegner, 0 = Gleichstand. Mehr richtig gewinnt, bei Gleichstand die schnellere Zeit. */
  function duelCompare(me, other) {
    if (me.lv && other.lv && me.lv !== other.lv) { var sa = duelScore(me), sb = duelScore(other); if (sa !== sb) return sa > sb ? 1 : -1; }
    else if (me.right !== other.right) return me.right > other.right ? 1 : -1;
    if (me.ms == null || other.ms == null) return 0;
    var a = Math.round(me.ms / 1000), b = Math.round(other.ms / 1000);
    return a === b ? 0 : (a < b ? 1 : -1);
  }

  /* Geräte-Abgleich: zwei Spielstände zusammenführen, ohne Fortschritt zu verlieren.
     Zähler und Rekorde = Maximum, Sammlungen = Vereinigung, Wortkarten = die mit mehr Wiederholungen,
     Einstellungen = vom zuletzt gespeicherten Stand (ts). Eigene Wörter werden angehängt, ihre Karten umnummeriert. */
  function mergeSave(a, b) {
    if (!validateSave(a)) return validateSave(b) ? b : a;
    if (!validateSave(b)) return a;
    var nw = (b.ts || 0) > (a.ts || 0) ? b : a, ol = nw === a ? b : a, o = JSON.parse(JSON.stringify(nw));
    function obj(x) { return x && typeof x === 'object' && !Array.isArray(x) ? x : {}; }
    function arr(x) { return Array.isArray(x) ? x : []; }
    function each(k, f) { var A = obj(nw[k]), B = obj(ol[k]), r = {}; Object.keys(A).concat(Object.keys(B)).forEach(function (i) { r[i] = i in A ? (i in B ? f(A[i], B[i]) : A[i]) : B[i]; }); o[k] = r; }
    function max(x, y) { return Math.max(+x || 0, +y || 0); }
    o.xp = max(nw.xp, ol.xp); o.unlocked = max(nw.unlocked, ol.unlocked); o.letterSeen = max(nw.letterSeen, ol.letterSeen);
    o.onboarded = !!(nw.onboarded || ol.onboarded); o.tour = !!(nw.tour || ol.tour); o.letterQuiz = max(nw.letterQuiz, ol.letterQuiz);
    if (ol.plv != null && (nw.plv == null || ol.plv > nw.plv)) o.plv = ol.plv;
    ['active', 'weekXp', 'boss', 'plBest', 'best'].forEach(function (k) { each(k, max); });
    ['scenes', 'skipped'].forEach(function (k) { each(k, function (x, y) { return !!(x || y); }); });
    each('done', function (x, y) { return Object.assign({}, y, x); });
    each('missions', function (x, y) { return x || y; });
    each('daily', function (x, y) { return ((y && y.score) || 0) > ((x && x.score) || 0) ? y : x; });
    each('rank', function (x, y) { return ((y && y.g) || 0) > ((x && x.g) || 0) ? y : x; });
    /* eigene Wörter: vom neueren Stand, fehlende vom älteren hinten anhängen */
    var custom = arr(nw.custom).slice(), mapOld = {}, keyOf = function (w) { return String(w && w[0]).toLowerCase() + '|' + String(w && w[1]).toLowerCase(); };
    var idx = {}; custom.forEach(function (w, i) { idx[keyOf(w)] = i; });
    arr(ol.custom).forEach(function (w, i) { var k = keyOf(w); if (!(k in idx)) { idx[k] = custom.length; custom.push(w); } mapOld[i] = idx[k]; });
    o.custom = custom;
    var oc = {}; Object.keys(obj(ol.cards)).forEach(function (id) { var m = /^my:(\d+)$/.exec(id); oc[m ? 'my:' + mapOld[m[1]] : id] = ol.cards[id]; });
    var na = obj(nw.cards), cards = {};
    Object.keys(na).concat(Object.keys(oc)).forEach(function (id) {
      var x = na[id], y = oc[id];
      cards[id] = !x ? y : !y ? x : ((y.seen | 0) > (x.seen | 0) || ((y.seen | 0) === (x.seen | 0) && (y.box | 0) > (x.box | 0))) ? y : x;
    });
    o.cards = cards;
    function union(k, lim) { var r = arr(nw[k]).slice(); arr(ol[k]).forEach(function (v) { if (r.indexOf(v) < 0) r.push(v); }); o[k] = lim ? r.slice(0, lim) : r; }
    union('krasnale'); union('rankSeen'); union('mistakes', 60);
    o.ts = max(nw.ts, ol.ts);
    return o;
  }

  /* Lokale Rangliste: pro Spielername Spiele, Siege, Unentschieden, gewichtete Punkte, je Stufe.
     res = 1 Sieg, 0 unentschieden, -1 Niederlage (aus Sicht dieses Spielers). */
  function rankAdd(rank, p, res) {
    var name = duelName(p.name) || '?', key = name.toLowerCase(), e = rank[key] || { name: name, g: 0, w: 0, d: 0, pts: 0, right: 0, total: 0, lv: {} };
    e.name = name; e.g++; if (res > 0) e.w++; else if (res === 0) e.d++;
    e.pts = Math.round((e.pts + duelScore(p)) * 10) / 10; e.right += p.right; e.total += p.total;
    e.lv[p.lv] = (e.lv[p.lv] || 0) + 1;
    rank[key] = e; return rank;
  }
  function rankList(rank) {
    return Object.keys(rank || {}).map(function (k) { return rank[k]; }).sort(function (a, b) { return b.w - a.w || b.pts - a.pts || a.g - b.g || (a.name < b.name ? -1 : 1); });
  }

  /* Satzbau: Wörter eines Satzes (Satzzeichen bleiben am Wort) */
  function tokens(sentence) { return String(sentence).trim().split(/\s+/); }
  function sameSentence(a, b) { return norm(a) === norm(b); }

  /* Ist ein Fortschritt-Export gültig? */
  function validateSave(obj) {
    if (!obj || typeof obj !== 'object') return false;
    if (obj.app !== 'polski-szlak') return false;
    if (typeof obj.xp !== 'number' || obj.xp < 0) return false;
    if (!obj.cards || typeof obj.cards !== 'object') return false;
    return true;
  }

  /* PATCH002: Schwierigkeitsstufen. mix = Anteile [Bedeutung wählen, Polnisch wählen, Hören, Schreiben, Diktat] */
  var DIFF = {
    easy:   { opts: 4, mix: [0.35, 0.25, 0.2, 0.2, 0],    strict: false, xp: 1,   boss: { n: 12, lives: 3, pass: 60 }, blitz: 60, clozeType: false, extraTiles: 0, hideTr: false },
    medium: { opts: 4, mix: [0.15, 0.2, 0.25, 0.25, 0.15], strict: false, xp: 1.5, boss: { n: 12, lives: 3, pass: 70 }, blitz: 50, clozeType: false, extraTiles: 1, hideTr: false },
    hard:   { opts: 6, mix: [0, 0.1, 0.15, 0.4, 0.35],    strict: true,  xp: 2,   boss: { n: 15, lives: 2, pass: 80 }, blitz: 45, clozeType: true,  extraTiles: 2, hideTr: true }
  };
  function diffCfg(level) { return DIFF[level] || DIFF.easy; }
  /* Welcher Fragetyp bei Zufallswert r? */
  function pickKind(level, r) {
    var mix = diffCfg(level).mix, kinds = ['pl2x', 'x2pl', 'listen', 'type', 'dictate'], acc = 0;
    for (var i = 0; i < mix.length; i++) { acc += mix[i]; if (r < acc) return kinds[i]; }
    return 'type';
  }
  /* Einstufung: Ergebnisse je Stadt [[ok,ok],[ok,false],…] → Index der ersten Stadt, die nicht sitzt */
  /* Dla Polaków: Stufe = höchste Stufe, bei der (wie bei allen darunter) mind. 2/3 richtig sind. items: [{lv, ok}] */
  function polLevel(items) {
    var level = 0;
    for (var lv = 1; lv <= 3; lv++) {
      var at = items.filter(function (x) { return x.lv === lv; });
      if (!at.length || at.filter(function (x) { return x.ok; }).length * 3 < at.length * 2) break;
      level = lv;
    }
    return level;
  }
  function placementStart(perCity) {
    for (var i = 0; i < perCity.length; i++) {
      var r = perCity[i] || [];
      if (!r.length || r.filter(Boolean).length < r.length) return i;
    }
    return perCity.length;
  }

  /* PATCH003: Karte, Entfernung, Höher/Tiefer, Zeitstrahl, Buchstabensalat */
  function proj(lon, lat) { return [(lon - 13.8) * 62, (55.1 - lat) * 100]; }
  function unproj(x, y) { return [x / 62 + 13.8, 55.1 - y / 100]; }
  function distKm(lat1, lon1, lat2, lon2) {
    var R = 6371, toR = Math.PI / 180, dLat = (lat2 - lat1) * toR, dLon = (lon2 - lon1) * toR;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * toR) * Math.cos(lat2 * toR) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(a));
  }
  /* Zwei Einträge mit klarem Abstand (≥ 15 %), damit gerundete Quellen nicht zur Falle werden */
  function hlPair(items, r) {
    r = r || Math.random;
    for (var tries = 0; tries < 200; tries++) {
      var a = items[Math.floor(r() * items.length)], b = items[Math.floor(r() * items.length)];
      if (a === b) continue;
      var hi = Math.max(a[1], b[1]), lo = Math.min(a[1], b[1]);
      if (hi / lo >= 1.15) return [a, b];
    }
    return null;
  }
  function orderOk(years) { for (var i = 1; i < years.length; i++) if (years[i] < years[i - 1]) return false; return true; }
  function scramble(word, r) {
    r = r || Math.random; var w = String(word), out = w;
    for (var i = 0; i < 20 && out === w; i++) out = shuffle(w.split(''), r).join('');
    return out;
  }

  /* PATCH005: typische Rechtschreibfehler erzeugen. Rückgabe: [{w: falsche Form, rule}] */
  var MUT = [
    ['ó', 'u', 'ou'], ['u', 'ó', 'ou'], ['rz', 'ż', 'rz'], ['ż', 'rz', 'rz'], ['ch', 'h', 'ch'], ['h', 'ch', 'ch'],
    ['ą', 'om', 'nasal'], ['ę', 'en', 'nasal'],
    ['ś', 'sz', 'soft'], ['sz', 'ś', 'soft'], ['ć', 'cz', 'soft'], ['cz', 'ć', 'soft'], ['ź', 'ż', 'soft'], ['si', 'ś', 'soft'], ['ci', 'ć', 'soft'],
    ['ą', 'a', 'dia'], ['ę', 'e', 'dia'], ['ł', 'l', 'dia'], ['ś', 's', 'dia'], ['ć', 'c', 'dia'], ['ń', 'n', 'dia'], ['ź', 'z', 'dia'], ['ż', 'z', 'dia'], ['ó', 'o', 'dia'],
    ['a', 'ą', 'dia'], ['e', 'ę', 'dia'], ['l', 'ł', 'dia'], ['o', 'ó', 'ou'], ['z', 'ż', 'dia'], ['s', 'ś', 'dia'], ['n', 'ń', 'dia'], ['c', 'ć', 'dia']
  ];
  var FINAL = [['b', 'p'], ['d', 't'], ['g', 'k'], ['w', 'f'], ['z', 's'], ['ż', 'sz'], ['dz', 'c']];
  /* Eine Regel an einer erlaubten Stelle anwenden, sonst null */
  function applyMut(w, m, r) {
    var spots = [], i = w.indexOf(m[0]);
    while (i >= 0) {
      var ok = true;
      if (m[0] === 'h' && (w[i - 1] === 'c' || w[i - 1] === 's')) ok = false;            /* h in ch/sh nicht */
      if (m[0] === 'u' && /[aeo]/.test(w[i - 1] || '')) ok = false;                         /* au/eu/ou nicht */
      if ((m[0] === 'si' || m[0] === 'ci') && !/[aeiouyąęó]/.test(w[i + 2] || '')) ok = false; /* nur vor Vokal sinnvoll */
      if (m[0] === 'ź' && w[i + 1] === 'd') ok = false;
      if ((m[0] === 'c' || m[0] === 's') && /[hz]/.test(w[i + 1] || '')) ok = false;            /* ch, cz, sz bleiben Paare */
      if (m[0] === 'z' && /[rscd]/.test(w[i - 1] || '')) ok = false;                         /* rz, sz, cz, dz bleiben Paare */
      if (m[0] === 'z' && m[1] === 'ż' && w[i + 1] === 'i') ok = false;
      if (ok) spots.push(i);
      i = w.indexOf(m[0], i + 1);
    }
    if (!spots.length) return null;
    var at = spots[Math.floor((r || Math.random)() * spots.length)];
    return w.slice(0, at) + m[1] + w.slice(at + m[0].length);
  }
  function finalDevoice(w) {
    var m = String(w).match(/^(.*?)([^\s?!.,]+)([?!.,]?)$/); if (!m) return null;
    var word = m[2];
    for (var i = 0; i < FINAL.length; i++) { var f = FINAL[i]; if (word.length > 2 && word.slice(-f[0].length) === f[0]) return m[1] + word.slice(0, -f[0].length) + f[1] + m[3]; }
    return null;
  }
  function misspell(word, n, r, exclude) {
    r = r || Math.random; n = n || 3; exclude = exclude || [];
    var w = String(word), out = [], seen = {}; seen[w] = 1;
    exclude.forEach(function (x) { seen[x] = 1; });
    function add(v, rule) { if (v && !seen[v]) { seen[v] = 1; out.push({ w: v, rule: rule }); } }
    add(finalDevoice(w), 'final');
    var muts = shuffle(MUT, r);
    for (var i = 0; i < muts.length && out.length < n; i++) add(applyMut(w, muts[i], r), muts[i][2]);
    for (var j = 0; out.length < n && j < out.length; j++)       /* Doppelfehler aus vorhandenen Varianten */
      for (var k = 0; k < muts.length && out.length < n; k++) add(applyMut(out[j].w, muts[k], r), out[j].rule);
    if (out.length < n) add(stripDia(w), 'dia');
    return shuffle(out, r).slice(0, n);
  }
  /* Hat das Wort eine echte Stolperfalle? */
  function spellWorthy(word) { return /ó|u|ż|rz|ch|h|ą|ę|ł|ś|ć|ń|ź|sz|cz/.test(word) && String(word).length >= 3; }

  /* Państwa-Miasta: Anfangsbuchstabe (Ł→L, Ż→Z), bekanntes Wort, Punkte (10 / 5 doppelt / 20 allein gültig) */
  function pmLetterOk(word, letter) { var w = stripDia(norm(word)); return !!w && w.charAt(0) === stripDia(String(letter).toLowerCase()); }
  function pmKnown(word, letter, list) {
    if (!pmLetterOk(word, letter)) return false;
    var w = norm(word, true);
    for (var i = 0; i < list.length; i++) if (norm(list[i], true) === w) return true;
    return false;
  }
  function pmScore(answers, valid) {
    var keys = answers.map(function (a, i) { return valid[i] ? norm(a, true) : null; });
    var nValid = keys.filter(Boolean).length;
    return keys.map(function (k) {
      if (!k) return 0;
      if (nValid === 1) return 20;
      return keys.filter(function (x) { return x === k; }).length > 1 ? 5 : 10;
    });
  }

  G.PSCore = {
    pmLetterOk: pmLetterOk, pmKnown: pmKnown, pmScore: pmScore,
    misspell: misspell, spellWorthy: spellWorthy,
    proj: proj, unproj: unproj, distKm: distKm, hlPair: hlPair, orderOk: orderOk, scramble: scramble,
    DIFF: DIFF, diffCfg: diffCfg, pickKind: pickKind, placementStart: placementStart, polLevel: polLevel,
    stripDia: stripDia, norm: norm, variants: variants, lev: lev, checkAnswer: checkAnswer,
    numToPl: numToPl, zlotyForm: zlotyForm, priceWords: priceWords,
    INTERVALS: INTERVALS, MASTERED_BOX: MASTERED_BOX, srsUpdate: srsUpdate, isDue: isDue,
    dayKey: dayKey, addDays: addDays, weekKey: weekKey, prevWeek: prevWeek, daysInWeek: daysInWeek, daysSince: daysSince, STEPS: STEPS, nextStep: nextStep, letterRead: letterRead,
    weekStreak: weekStreak, totalDays: totalDays,
    duelPlan: duelPlan, duelNewCode: duelNewCode, duelParse: duelParse, duelCheck: duelCheck, duelResultText: duelResultText, duelReadResult: duelReadResult, duelCompare: duelCompare, fmtTime: fmtTime, duelWeight: duelWeight, duelScore: duelScore, duelSign: duelSign, duelName: duelName, rankAdd: rankAdd, rankList: rankList, mergeSave: mergeSave,
    hash: hash, rng: rng, shuffle: shuffle, sample: sample,
    xpForLevel: xpForLevel, levelFromXp: levelFromXp, comboBonus: comboBonus, xpFor: xpFor,
    shareText: shareText, tokens: tokens, sameSentence: sameSentence, validateSave: validateSave
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
