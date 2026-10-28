#!/usr/bin/env python3
"""Auswertung der Prüfungen von Muttersprachlern (Prüfmodus ?review).

1. Supabase Studio → Table Editor → ps_feedback → Export → CSV  (oder SQL:
   select created_at, msg, ctx from ps_feedback where ctx like 'review|%' order by created_at;)
2. python3 tools/review_report.py ps_feedback.csv  > docs/PRUEFUNG_ERGEBNIS.md

Listet alle „✗ Do poprawy“-Hinweise mit dem aktuellen Text aus src/data.json und zählt die bestätigten Einträge.
"""
import csv, json, re, sys, pathlib, collections
ROOT = pathlib.Path(__file__).resolve().parent.parent
D = json.loads((ROOT / 'src' / 'data.json').read_text(encoding='utf-8'))
U = {u['id']: u for u in D['units']}

def current(k):
    p = k.split(':')
    try:
        if p[0] == 'w': w = U[p[1]]['words'][int(p[2])]; return '%s – %s' % (w[0], w[1])
        if p[0] == 's': w = U[p[1]]['sentences'][int(p[2])]; return '%s – %s' % (w[0], w[1])
    except Exception: pass
    return ''

rows = list(csv.DictReader(open(sys.argv[1], encoding='utf-8')))
ok, bad, who = set(), [], collections.Counter()
for r in rows:
    ctx, msg = r.get('ctx') or '', r.get('msg') or ''
    if not ctx.startswith('review|'): continue
    who[ctx.split('|')[1]] += 1
    if msg.startswith('REVIEW ✓'): ok.update(msg.split(': ', 1)[1].split())
    m = re.match(r'REVIEW ✗ \[([^\]]+)\] (.*)', msg, re.S)
    if m: bad.append((r.get('created_at', '')[:16], m.group(1), m.group(2), ctx.split('|')[1]))
print('# Ergebnis der Prüfung durch Muttersprachler\n')
print('- Prüfer:innen: ' + ', '.join('%s (%d Meldungen)' % kv for kv in who.items()))
print('- Bestätigt (✓): **%d** Einträge' % len(ok))
print('- Zu korrigieren (✗): **%d** Hinweise\n' % len(bad))
if bad:
    print('| Zeit | Schlüssel | Hinweis (Original → Korrektur) | Text jetzt | von |\n|---|---|---|---|---|')
    for t, k, txt, n in bad:
        print('| %s | `%s` | %s | %s | %s |' % (t, k, txt.replace('|', '/').replace('\n', ' '), current(k).replace('|', '/'), n))
print('\nKorrekturen bitte nur an derselben Position ändern (Fortschritts-Schutz, siehe docs/DATENSICHERUNG.md).')
