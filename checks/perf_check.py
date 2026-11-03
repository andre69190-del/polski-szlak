#!/usr/bin/env python3
"""Größe/Performance (Idee aus GeoQuest/BIOGLOW perf_check.py).
Entscheidend für den ersten Start ist die übertragene Größe: nginx liefert gzip aus.
Budget: index.html gzip ≤ 230 KB und unkomprimiert ≤ 720 KB (3.7.1: Szlak 2/3 und Dla Polaków werden nachgeladen;
seit 3.7.1 zählt vor allem gzip – vorher 650 KB unkomprimiert)."""
import os, sys, gzip
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
raw = open(os.path.join(ROOT, 'index.html'), 'rb').read()
gz = len(gzip.compress(raw, 6))
ok = gz <= 230 * 1024 and len(raw) <= 720 * 1024
print(f'  index.html: {len(raw) / 1024:.0f} KB, per gzip {gz / 1024:.0f} KB (Budget 230 KB gzip / 720 KB)')
print('PASS' if ok else 'FAIL')
sys.exit(0 if ok else 1)
