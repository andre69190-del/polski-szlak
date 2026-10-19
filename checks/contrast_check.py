#!/usr/bin/env python3
"""WCAG-Kontrast für Hell- und Dunkel-Theme (Idee aus BIOGLOW contrast_check.py).
Liest die Tokens aus src/app.css und prüft zentrale Text/Fläche-Paare.
Ziel: >= 4.5 für Text, >= 3.0 für große/fette Elemente. FAIL unter 3.0.
"""
import os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
css = open(os.path.join(ROOT, 'src', 'app.css'), encoding='utf-8').read()


def tokens(block):
    return dict(re.findall(r'--([\w-]+):\s*(#[0-9a-fA-F]{6})', block))


light = tokens(css.split('@media')[0])
dark_block = re.search(r':root\[data-theme="dark"\]\s*\{(.*?)\}', css, re.S).group(1)
dark = dict(light); dark.update(tokens(dark_block))


def lum(h):
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (1, 3, 5))
    f = lambda c: c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)


def ratio(a, b):
    la, lb = sorted([lum(a), lum(b)], reverse=True)
    return (la + 0.05) / (lb + 0.05)


PAIRS = [('ink', 'bg', 4.5), ('ink', 'surface', 4.5), ('muted', 'surface', 4.5), ('muted', 'bg', 4.5),
         ('on-red', 'red', 4.5), ('red', 'surface', 3.0), ('amber', 'amber-soft', 4.5), ('good', 'good-soft', 4.5),
         ('bad', 'bad-soft', 4.5), ('ink', 'amber-soft', 4.5), ('ink', 'map-land', 4.5)]
fail = 0
for name, T in (('hell', light), ('dunkel', dark)):
    print(f'  Theme {name}:')
    for fg, bg, need in PAIRS:
        r = ratio(T[fg], T[bg]); ok = r >= need
        if r < 3.0: fail += 1
        print(f'    [{"OK" if ok else ("WARN" if r >= 3 else "FAIL")}] {fg} auf {bg}: {r:.2f}:1 (Ziel {need})')
print('PASS' if not fail else f'FAIL: {fail} Paare unter 3:1')
sys.exit(1 if fail else 0)
