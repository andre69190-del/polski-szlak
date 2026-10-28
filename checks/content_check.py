#!/usr/bin/env python3
"""Inhaltsprüfung für src/data.json (Idee aus GeoQuest validate_content.py und BIOGLOW quiz_check.js).

Prüft u. a.:
- jede Stadt: id, Koordinaten in Polen, Titel/Tipp/Fakt/Kann-Satz zweisprachig
- Wörter: genau 3 Felder (pl, de, en), nichts leer, keine Dubletten pro Stadt, nur gültige Zeichen
- Sätze: Satzzeichen am Ende, Satzbau baubar (mind. 3 Wörter)
- Szenen: jede Stufe hat mind. 1 richtige und 1 falsche Option + Hinweis
- Fall-Übungen: Antwort steht unter den Optionen, Optionen eindeutig, genau eine Lücke
- Laute, Zungenbrecher, Krasnale vollständig
Aufruf: python3 checks/content_check.py   (Exit 1 bei Fehlern, Warnungen nur Hinweis)
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = json.load(open(os.path.join(ROOT, 'src', 'data.json'), encoding='utf-8'))
ERR, WARN = [], []
PL_OK = re.compile(r"^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9 ,.!?\-–…/()'„“{}|]+$")
GM = re.compile(r"\{([^{}|]*)\|([^{}|]*)\}")


def gok(s, where):
    """Sprecherform {männlich|weiblich}: Klammern vollständig, beide Seiten nicht leer, nach dem Ersetzen keine Reste"""
    if '{' not in s and '}' not in s and '|' not in s: return
    rest = GM.sub('x', s)
    if any(c in rest for c in '{}|'): e(f'{where}: Sprecherform-Klammern fehlerhaft: {s}')
    for a, b in GM.findall(s):
        if not a.strip() or not b.strip(): e(f'{where}: leere Sprecherform in {s}')
TRAILS = {'red', 'blue', 'green', 'yellow', 'black'}


def e(m): ERR.append(m)
def w(m): WARN.append(m)


def pair(x, where):
    if not (isinstance(x, list) and len(x) == 2 and all(isinstance(s, str) and s.strip() for s in x)):
        e(f'{where}: braucht [de, en], beide nicht leer')


ids = set()
ROUTE = [u for u in D['units'] if not u.get('pack')]
R1 = [u for u in ROUTE if u.get('r', 1) == 1]
R2 = [u for u in ROUTE if u.get('r') == 2]
if D['units'][:len(ROUTE)] != ROUTE: e('Einheiten-Reihenfolge: erst Route (Szlak 1, dann 2), Pakete am Ende')
if D['units'][:len(R1)] != R1: e('Einheiten-Reihenfolge: Szlak 1 muss vor Szlak 2 stehen')
for ui, u in enumerate(D['units']):
    W = f"Stadt {ui + 1} ({u.get('city')})"
    if u['id'] in ids: e(f'{W}: doppelte id {u["id"]}')
    ids.add(u['id'])
    if u.get('pack') and not u.get('ico'): e(f'{W}: Paket ohne Symbol (ico)')
    if not (14 <= u['lon'] <= 24.2 and 49 <= u['lat'] <= 54.9): e(f'{W}: Koordinaten außerhalb Polens')
    if u['trail'] not in TRAILS: e(f'{W}: unbekannte Szlak-Farbe {u["trail"]}')
    for k in ('title', 'can', 'tip', 'fact'): pair(u.get(k), f'{W}.{k}')
    if len(u['words']) < 15: e(f'{W}: nur {len(u["words"])} Wörter (min. 15)')
    seen = set()
    for wi, wd in enumerate(u['words']):
        if len(wd) != 3 or not all(isinstance(s, str) and s.strip() for s in wd):
            e(f'{W} Wort {wi}: braucht [pl, de, en]'); continue
        if wd[0].lower() in seen: e(f'{W}: Wort doppelt: {wd[0]}')
        seen.add(wd[0].lower())
        if not PL_OK.match(wd[0]): e(f'{W}: ungültige Zeichen in „{wd[0]}“')
        gok(wd[0], W)
        if wd[0] != wd[0].strip(): e(f'{W}: Leerzeichen am Rand in „{wd[0]}“')
    if len(u['sentences']) < 3: e(f'{W}: zu wenige Sätze')
    for s in u['sentences']:
        if len(s) != 3: e(f'{W}: Satz braucht [pl, de, en]'); continue
        if not re.search(r'[.!?]$', s[0]): e(f'{W}: Satz ohne Satzzeichen am Ende: {s[0]}')
        if len(s[0].split()) < 3: e(f'{W}: Satz zu kurz für Satzbau: {s[0]}')
        if not PL_OK.match(s[0]): e(f'{W}: ungültige Zeichen in Satz „{s[0]}“')
        gok(s[0], W)
    sc = u.get('scene')
    if not sc: e(f'{W}: keine Szene'); continue
    pair(sc.get('intro'), f'{W}.scene.intro'); pair(sc.get('outro'), f'{W}.scene.outro')
    if len(sc['steps']) < 3: e(f'{W}: Szene braucht mind. 3 Schritte')
    for si, st in enumerate(sc['steps']):
        if len(st['npc']) != 3: e(f'{W} Szene {si}: npc braucht [pl, de, en]')
        rights = [o for o in st['opts'] if o[3] == 1]
        wrongs = [o for o in st['opts'] if o[3] == 0]
        if not rights: e(f'{W} Szene {si}: keine richtige Antwort')
        if not wrongs: e(f'{W} Szene {si}: keine falsche Antwort')
        gok(st['npc'][0], W)
        for o in st['opts']:
            if len(o) != 4: e(f'{W} Szene {si}: Option braucht [pl, de, en, 0/1]')
            else: gok(o[0], W)
        pair(st.get('hint'), f'{W} Szene {si}.hint')

for ci, c in enumerate(D['cases']):
    W = f'Fall {ci + 1} ({c["s"]})'
    if c['s'].count('___') != 1: e(f'{W}: genau eine Lücke ___ nötig')
    if c['a'] not in c['opts']: e(f'{W}: Antwort {c["a"]} fehlt in den Optionen')
    if len(set(c['opts'])) != len(c['opts']): e(f'{W}: doppelte Optionen')
    if len(c['opts']) != 3: w(f'{W}: {len(c["opts"])} statt 3 Optionen')
    for k in ('case', 'why', 'tr'): pair(c.get(k), f'{W}.{k}')

for si, s in enumerate(D['sounds']):
    for k in ('g', 'de', 'en', 'ex'):
        if not s.get(k): e(f'Laut {si}: Feld {k} fehlt')
    pair(s.get('exm'), f'Laut {si}.exm')
gs = [s['g'] for s in D['sounds']]
if len(set(gs)) != len(gs): e('Laute: doppelte Grapheme')

for ti, tw in enumerate(D['twisters']):
    if len(tw) != 3: e(f'Zungenbrecher {ti}: braucht [pl, de, en]')
for ki, k in enumerate(D['krasnale']):
    if len(k) != 4 or not k[0].startswith('Krasnal '): e(f'Krasnal {ki}: braucht [Name, pl, de, en]')

# Wortschatz-Überschneidung zwischen Städten nur als Hinweis
allw = {}
for u in D['units']:
    for wd in u['words']:
        allw.setdefault(wd[0].lower(), []).append(u['id'])
for k, v in allw.items():
    if len(v) > 1: w(f'„{k}“ kommt in mehreren Städten vor: {", ".join(v)}')

if len(D['outline']) < 20 or D['outline'][0] != D['outline'][-1]: e('Umriss: zu wenige Punkte oder nicht geschlossen')

# Der Brief: genau ein Satz pro Stadt in Reiseroute-Reihenfolge, Ausblick (bridge) überall außer in der letzten Stadt
LT = D.get('letter') or {}
pair(LT.get('prolog'), 'Brief.prolog'); pair(LT.get('finale'), 'Brief.finale')
for name, LT, RU in (('Brief', LT, R1), ('Tagebuch', D.get('diary') or {}, R2)):
    if not RU: continue
    pair(LT.get('prolog'), f'{name}.prolog'); pair(LT.get('finale'), f'{name}.finale')
    if [l.get('u') for l in LT.get('lines', [])] != [u['id'] for u in RU]: e(f'{name}: braucht genau einen Satz pro Stadt in Routen-Reihenfolge')
    for li, l in enumerate(LT.get('lines', [])):
        if not PL_OK.match(l.get('pl', '')) or l.get('pl', '')[-1:] not in '.!?a': e(f'{name} Satz {li + 1}: ungültiger polnischer Text')
        pair(l.get('tr'), f'{name} Satz {li + 1}.tr')
        if li < len(RU) - 1: pair(l.get('bridge'), f'{name} Satz {li + 1}.bridge')

# Version 2.0: Missionen, Hören, Verb-Aspekt, Brief-Quiz, Aufnahmen
UIDS = [u['id'] for u in ROUTE]
PL_MIS = re.compile(r"^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9 ,.!?\-–…/()'„“:{}|]+$")
MI = D.get('missions') or {}
for uid in UIDS:
    m = MI.get(uid)
    if not m: e(f'Mission für {uid} fehlt'); continue
    if not PL_MIS.match(m.get('pl', '')): e(f'Mission {uid}: ungültiger polnischer Text')
    pair(m.get('d'), f'Mission {uid}.d')
LS = D.get('listen') or {}
for uid in UIDS:
    r = (LS.get('radio') or {}).get(uid)
    if not (isinstance(r, list) and len(r) == 2 and r[0].strip() and r[1].startswith('https://')): e(f'Radio für {uid}: braucht [Name, https-URL]')
if len(LS.get('learn') or []) < 3: e('listen.learn: mindestens 3 Angebote')
for li, x in enumerate(LS.get('learn') or []):
    if len(x) != 4 or not x[1].startswith('https://') or not all(str(v).strip() for v in x): e(f'listen.learn {li}: braucht [Name, https-URL, de, en]')
AS = D.get('aspects') or []
if len(AS) < 10: e(f'Verb-Aspekt: nur {len(AS)} Aufgaben (min. 10)')
for ai, c in enumerate(AS):
    W = f'Aspekt {ai + 1} ({c.get("s")})'
    if c['s'].count('___') != 1: e(f'{W}: genau eine Lücke ___ nötig')
    if len(c['opts']) != 2 or len(set(c['opts'])) != 2: e(f'{W}: braucht 2 verschiedene Optionen')
    if c['a'] not in c['opts']: e(f'{W}: Antwort fehlt in den Optionen')
    if c.get('pf') not in (0, 1): e(f'{W}: pf muss 0 oder 1 sein')
    if not PL_OK.match(c['s'].replace('___', 'x')): e(f'{W}: ungültige Zeichen')
    for k in ('why', 'tr'): pair(c.get(k), f'{W}.{k}')
LQ = D.get('letterQuiz') or []
nl_ = len((D.get('letter') or {}).get('lines', []))
if len(LQ) < 6: e('Brief-Quiz: zu wenige Fragen')
for qi, q in enumerate(LQ):
    if not (0 <= q.get('l', -1) < nl_): e(f'Brief-Quiz {qi + 1}: Satz-Index außerhalb')
    pair(q.get('q'), f'Brief-Quiz {qi + 1}.q')
    if len(q.get('o', [])) != 3: e(f'Brief-Quiz {qi + 1}: braucht 3 Optionen')
    for o in q.get('o', []): pair(o, f'Brief-Quiz {qi + 1}.o')
for k, v in (D.get('audio') or {}).items():
    if not (isinstance(v, str) and v.startswith('audio/') and os.path.exists(os.path.join(ROOT, v))): e(f'Aufnahme für „{k}“ fehlt: {v}')

# 3.0: Themen, Verben
UALL = {u['id'] for u in D['units']}
seen_in_theme = set()
for ti, th in enumerate(D.get('themes') or []):
    pair(th.get('t'), f'Thema {ti + 1}.t')
    if not th.get('ico') or not th.get('id'): e(f'Thema {ti + 1}: id/ico fehlt')
    for x in th.get('u', []):
        if x not in UALL: e(f'Thema {th.get("id")}: unbekannte Einheit {x}')
        seen_in_theme.add(x)
for x in sorted(UALL - seen_in_theme): w(f'Einheit {x} gehört zu keinem Thema')
for vi, v in enumerate(D.get('verbs') or []):
    W = f'Verb {vi + 1} ({v.get("inf")})'
    if len(v.get('pres', [])) != 6 or len(v.get('past', [])) != 5: e(f'{W}: braucht 6 Präsens- und 5 Vergangenheitsformen')
    if v.get('cls') not in ('am', 'i', 'uje', 'e', 'irr'): e(f'{W}: unbekannte Verbklasse {v.get("cls")}')
    for f in v.get('pres', []) + v.get('past', []) + [v.get('inf', '')]:
        if not PL_OK.match(f): e(f'{W}: ungültige Form {f}')
    if len(set(v.get('pres', []))) != 6: e(f'{W}: doppelte Präsensformen')
    if not v.get('de') or not v.get('en'): e(f'{W}: Übersetzung fehlt')

# 3.3: Szlak 3 – Buchkapitel (read) mit Verständnisfragen, Rahmen „book“
R3 = [u for u in ROUTE if u.get('r') == 3]
PL_READ = re.compile(r"^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9 ,.!?\-–…/()'„“”:{}|]+$")
if R3:
    if D['units'][:len(R1) + len(R2) + len(R3)] != R1 + R2 + R3: e('Einheiten-Reihenfolge: Szlak 1, 2, 3, dann Pakete')
    BK = D.get('book') or {}
    pair(BK.get('prolog'), 'book.prolog'); pair(BK.get('finale'), 'book.finale')
    for u in R3:
        W = f'Szlak 3 {u["id"]}'; rd = u.get('read')
        if not rd: e(f'{W}: Buchkapitel (read) fehlt'); continue
        pair(rd.get('t'), f'{W}.read.t')
        if len(rd.get('lines', [])) < 6: e(f'{W}: Kapitel zu kurz')
        for li, l in enumerate(rd.get('lines', [])):
            if not PL_READ.match(l.get('pl', '')): e(f'{W} Kapitel Satz {li + 1}: ungültige Zeichen: {l.get("pl")}')
            pair(l.get('tr'), f'{W} Kapitel Satz {li + 1}.tr')
        if len(rd.get('q', [])) < 3: e(f'{W}: mindestens 3 Verständnisfragen')
        for qi, q in enumerate(rd.get('q', [])):
            o = q.get('o', [])
            if len(o) != 3 or len(set(o)) != 3 or q.get('a') not in (0, 1, 2): e(f'{W} Frage {qi + 1}: braucht 3 verschiedene Optionen und a')
            pair(q.get('tr'), f'{W} Frage {qi + 1}.tr')
total = sum(len(u['words']) for u in D['units'])
print(f'  Städte {len(D["units"])} · Wörter {total} · Sätze {sum(len(u["sentences"]) for u in D["units"])} · '
      f'Szenen {sum(1 for u in D["units"] if u.get("scene"))} · Fälle {len(D["cases"])} · Laute {len(D["sounds"])}')
for m in WARN: print('  [WARN]', m)
for m in ERR: print('  [FAIL]', m)
print('PASS' if not ERR else f'FAIL: {len(ERR)} Fehler')
sys.exit(1 if ERR else 0)
