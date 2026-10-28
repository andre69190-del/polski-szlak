#!/usr/bin/env python3
"""Sammelt alle polnischen Texte, die die App vorliest, und berechnet ihren Schlüssel (gleich wie audioKey() in app.js).
   python3 tools/audio_corpus.py  -> tools/audio_corpus.json  {key: text}"""
import json, re, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
D = json.loads((ROOT / 'src' / 'data.json').read_text(encoding='utf-8'))
GM = re.compile(r'\{([^{}|]*)\|([^{}|]*)\}')

def norm(t):
    return re.sub(r'\s+', ' ', str(t).replace('…', '')).strip().lower()

def fnv(s):
    h = 2166136261
    for ch in s.encode('utf-16-le').decode('utf-16-le'):
        for unit in ([ord(ch)] if ord(ch) < 0x10000 else [0xD800 + ((ord(ch) - 0x10000) >> 10), 0xDC00 + ((ord(ch) - 0x10000) & 0x3FF)]):
            h ^= unit; h = (h * 16777619) & 0xFFFFFFFF
    return '%08x' % h

def key(t): return fnv(norm(t))

texts = []
def add(t):
    if not t or not isinstance(t, str): return
    for g in (1, 2):
        s = GM.sub(lambda m: m.group(g), t)
        s = s.replace('…', '').strip()
        if s and re.search(r'[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ]', s): texts.append(s)

for u in D['units']:
    for w in u['words']: add(w[0])
    for s in u['sentences']: add(s[0])
    sc = u.get('scene')
    if sc:
        for st in sc['steps']:
            add(st['npc'][0]); [add(o[0]) for o in st['opts']]
    rd = u.get('read')
    if rd: [add(l['pl']) for l in rd['lines']]
for k in ('letter', 'diary'):
    for l in (D.get(k) or {}).get('lines', []): add(l['pl'])
for m in (D.get('missions') or {}).values(): add(m['pl'])
for x in D.get('twisters', []): add(x[0])
for c in D.get('cases', []) + D.get('aspects', []): add(c['s'].replace('___', c['a']))
out, seen = {}, set()
for t in texts:
    k = key(t)
    if k in out and norm(out[k]) != norm(t): raise SystemExit('Hash-Kollision: %r / %r' % (out[k], t))
    out[k] = t
(ROOT / 'tools' / 'audio_corpus.json').write_text(json.dumps(out, ensure_ascii=False, indent=0), encoding='utf-8')
print(len(out), 'Texte,', sum(len(t) for t in out.values()), 'Zeichen')
