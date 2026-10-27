#!/usr/bin/env python3
"""Größe/Performance (Idee aus GeoQuest/BIOGLOW perf_check.py). Budget: index.html < 650 KB (3.0: Szlak 2 + Pakete inline, +100 KB; Dla Polaków wird als data-polacy.json nachgeladen; per gzip übertragen ~170 KB)."""
import os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
size = os.path.getsize(os.path.join(ROOT, 'index.html'))
budget = 650 * 1024
print(f'  index.html: {size / 1024:.0f} KB (Budget {budget // 1024} KB)')
print('PASS' if size <= budget else 'FAIL')
sys.exit(0 if size <= budget else 1)
