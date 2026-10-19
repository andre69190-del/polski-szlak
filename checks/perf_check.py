#!/usr/bin/env python3
"""Größe/Performance (Idee aus GeoQuest/BIOGLOW perf_check.py). Budget: index.html < 600 KB (1.4: +600 Fragen Dla Polaków; per gzip übertragen ~150 KB)."""
import os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
size = os.path.getsize(os.path.join(ROOT, 'index.html'))
budget = 600 * 1024
print(f'  index.html: {size / 1024:.0f} KB (Budget {budget // 1024} KB)')
print('PASS' if size <= budget else 'FAIL')
sys.exit(0 if size <= budget else 1)
