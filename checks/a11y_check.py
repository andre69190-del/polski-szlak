#!/usr/bin/env python3
"""Barrierefreiheit (statische Heuristik, Idee aus BIOGLOW a11y_check.py)."""
import os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
checks = [
    ('lang-Attribut am Dokument', r'<html lang="'),
    ('viewport mit viewport-fit', r'viewport-fit=cover'),
    ('sichtbarer Fokus', r':focus-visible'),
    ('Reduced Motion respektiert', r'prefers-reduced-motion'),
    ('aria-label an Icon-Buttons', r'icon-btn" id="say" aria-label'),
    ('aria-current in Navigation', r'aria-current="page"'),
    ('Live-Region für Feedback', r'role="status"'),
    ('polnischer Text mit lang="pl"', r'lang="pl"'),
    ('Mindestgröße Touch-Ziele 44px', r'min-height: 44px|height: 44px'),
    ('Tastatur auf Karte (Enter/Space)', r"e\.key === 'Enter'"),
    ('Lesbare Schrift (Atkinson Hyperlegible, selbst gehostet)', r"font-family:'Atkinson Hyperlegible'"),
]
fail = 0
for name, pat in checks:
    ok = re.search(pat, html) is not None
    fail += not ok
    print(f'  [{"OK" if ok else "!!"}] {name}')
print('PASS' if not fail else f'FAIL: {fail}')
sys.exit(1 if fail else 0)
