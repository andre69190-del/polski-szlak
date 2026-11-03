#!/usr/bin/env python3
"""Prüfstand in die App übernehmen: Orte, deren Einträge ALLE von Muttersprachlern bestätigt sind, bekommen „✓ geprüft“
statt „Beta“ (src/data.json → "reviewed": {Stadt-ID: Vorname(n)}).

    python3 tools/review_apply.py feedback/*.csv      (Export aus Supabase: created_at, msg, ctx)

Neuester Stand pro Eintrag zählt; Einträge ohne Namen (Tests) werden ignoriert. Danach build.py laufen lassen."""
import csv, json, re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
P = ROOT / 'src' / 'data.json'
D = json.loads(P.read_text(encoding='utf-8'))
state = {}  # key -> (time, ok, who)
for fn in sys.argv[1:]:
    for r in csv.DictReader(open(fn, encoding='utf-8')):
        ctx, msg, t = r.get('ctx') or '', r.get('msg') or '', r.get('created_at') or ''
        if not ctx.startswith('review|'): continue
        who = ctx.split('|')[1].split(' ')[0]
        if who in ('', '?'): continue
        if msg.startswith('REVIEW ✓'): items = [(k, True) for k in msg.split(': ', 1)[1].split()]
        else:
            m = re.match(r'REVIEW ✗ \[([^\]]+)\]', msg); items = [(m.group(1), False)] if m else []
        for k, ok in items:
            if k not in state or state[k][0] <= t: state[k] = (t, ok, who)
def keys(u):
    i = u['id']; ks = ['w:%s:%d' % (i, n) for n in range(len(u['words']))] + ['s:%s:%d' % (i, n) for n in range(len(u['sentences']))]
    for si, st in enumerate((u.get('scene') or {}).get('steps', [])):
        ks.append('sc:%s:%d:n' % (i, si)); ks += ['sc:%s:%d:%d' % (i, si, oi) for oi in range(len(st['opts']))]
    if u.get('read'): ks += ['r:%s:%d' % (i, n) for n in range(len(u['read']['lines']))] + ['rq:%s:%d' % (i, n) for n in range(len(u['read']['q']))]
    return ks
rev = {}
for u in D['units']:
    ks = keys(u); st = [state.get(k) for k in ks]
    done = sum(1 for x in st if x and x[1]); bad = sum(1 for x in st if x and not x[1])
    if done == len(ks): rev[u['id']] = ', '.join(sorted({x[2] for x in st}))
    if done or bad: print('%-4s %-16s %3d/%3d bestätigt%s' % (u['id'], u['city'], done, len(ks), ' · %d zu korrigieren' % bad if bad else ''))
D['reviewed'] = rev
P.write_text(json.dumps(D, ensure_ascii=False, indent=1), encoding='utf-8')
print('OK  vollständig geprüft:', ', '.join(rev) or '–')
