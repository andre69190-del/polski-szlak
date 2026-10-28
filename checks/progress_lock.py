#!/usr/bin/env python3
"""Polski Szlak – Fortschritts-Schutz für Inhalte.

Der Lernfortschritt hängt an IDs: Wortkarten heißen "<Stadt-ID>:<Position>", Prüfungen/Szenen/Missionen an der Stadt-ID,
die Freischaltung (unlocked) an der Reihenfolge der Route. Wer Wörter umsortiert, löscht oder Städte umbenennt,
ordnet den Fortschritt echter Lernender falsch zu oder verliert ihn.

Dieser Check vergleicht src/data.json mit checks/progress_lock.json:
  * keine Stadt-ID darf verschwinden,
  * die Reihenfolge der bisherigen Routen-Städte bleibt gleich (neue nur hinten bzw. nach der letzten Route),
  * kein Wort darf wegfallen; neue Wörter nur hinten anhängen,
  * an jeder bisherigen Position steht dasselbe Wort (Rechtschreib-Korrekturen sind erlaubt: ähnliche Schreibung).
Neue Inhalte übernehmen:  python3 checks/progress_lock.py --update
"""
import json, sys, difflib, pathlib, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
LOCK = ROOT / 'checks' / 'progress_lock.json'
data = json.loads((ROOT / 'src' / 'data.json').read_text(encoding='utf-8'))

def base(w):  # Gender-Marker {m|f} und Klammern ignorieren
    return re.sub(r'\{([^|}]*)\|[^}]*\}', r'\1', str(w)).strip().lower()

cur = {'route': [u['id'] for u in data['units'] if not u.get('pack')],
       'units': {u['id']: [base(w[0]) for w in u['words']] for u in data['units']}}

if '--update' in sys.argv or not LOCK.exists():
    if LOCK.exists():
        old = json.loads(LOCK.read_text(encoding='utf-8'))
        # auch beim Aktualisieren: nichts entfernen lassen
        gone = [i for i in old['units'] if i not in cur['units']]
        if gone: print('FEHLER: Städte würden entfernt:', gone); sys.exit(1)
    LOCK.write_text(json.dumps(cur, ensure_ascii=False, indent=0), encoding='utf-8')
    print('OK  progress_lock.json aktualisiert (%d Städte, %d Wörter)' % (len(cur['units']), sum(len(v) for v in cur['units'].values())))
    sys.exit(0)

old = json.loads(LOCK.read_text(encoding='utf-8')); errs = []
for uid in old['units']:
    if uid not in cur['units']: errs.append('Stadt %s fehlt (Fortschritt ginge verloren)' % uid); continue
    a, b = old['units'][uid], cur['units'][uid]
    if len(b) < len(a): errs.append('%s: %d statt %d Wörter – Wörter nie löschen, höchstens hinten anhängen' % (uid, len(b), len(a)))
    for i, (x, y) in enumerate(zip(a, b)):
        if x != y and difflib.SequenceMatcher(None, x, y).ratio() < 0.6:
            errs.append('%s:%d war „%s“, ist jetzt „%s“ – Karten-Fortschritt würde dem falschen Wort zugeordnet' % (uid, i, x, y))
if cur['route'][:len(old['route'])] != old['route']:
    errs.append('Reihenfolge der Route geändert – neue Städte nur hinten anfügen')
new = sum(len(v) for v in cur['units'].values()) - sum(len(v) for v in old['units'].values())
if errs:
    print('FEHLER Fortschritts-Schutz:'); [print('  -', e) for e in errs[:30]]; sys.exit(1)
print('OK  Fortschritt sicher: %d Städte, alle Wort-IDs stabil%s' % (len(old['units']), (' · %d neue Wörter (mit --update übernehmen)' % new) if new else ''))
