#!/usr/bin/env python3
"""Szlak 3 in src/data.json einfügen (nach Szlak 2, vor den Paketen). Mehrfach ausführbar."""
import json, pathlib, sys
HERE = pathlib.Path(__file__).resolve().parent; sys.path.insert(0, str(HERE))
import part1, part2, part3
ROOT = HERE.parent.parent; P = ROOT / 'src' / 'data.json'
D = json.loads(P.read_text(encoding='utf-8'))
units = part1.UNITS + part2.UNITS + part3.UNITS
ids = [u['id'] for u in units]
D['units'] = [u for u in D['units'] if u['id'] not in ids]
k = max(i for i, u in enumerate(D['units']) if not u.get('pack')) + 1
clean = []
for u in units:
    u = dict(u); m = u.pop('mission'); r = u.pop('radio')
    D['missions'][u['id']] = m; D['listen']['radio'][u['id']] = r; clean.append(u)
D['units'] = D['units'][:k] + clean + D['units'][k:]
D['book'] = part3.BOOK
th = {t['id']: t for t in D['themes']}
if 'natur' not in th:
    D['themes'].insert(len(D['themes']) - 1, {'id': 'natur', 'ico': '🌿', 't': ['Natur & Umwelt', 'Nature & environment'], 'u': ['bie']}); th = {t['id']: t for t in D['themes']}
for tid, us in part3.THEMES.items():
    for x in us:
        if x not in th[tid]['u']: th[tid]['u'].append(x)
P.write_text(json.dumps(D, ensure_ascii=False, indent=1), encoding='utf-8')
print('OK', len(clean), 'Orte eingefügt an Position', k, '· Wörter gesamt', sum(len(u['words']) for u in D['units']))
