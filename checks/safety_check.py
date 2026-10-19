#!/usr/bin/env python3
"""Sicherheit & Datenschutz (Idee aus BIOGLOW/ARDOC safety_check.py).
- keine Schlüssel/Secrets, kein eval/new Function, kein document.write
- innerHTML nur mit esc(): grobe Heuristik auf Benutzereingaben
- Netzwerk nur zu Google Fonts und zum eigenen Supabase (freiwilliger Geräte-Abgleich, anon-Schlüssel)
- nur https-Links
Aufruf: python3 checks/safety_check.py
"""
import os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
js = '\n'.join(re.findall(r'<script(?![^>]*application/json)[^>]*>(.*?)</script>', html, re.S))
fail, warn = [], []
for pat, msg in [(r'\beval\s*\(', 'eval()'), (r'new\s+Function\s*\(', 'new Function()'), (r'document\.write', 'document.write'),
                 (r'(api[_-]?key|secret|password|token)\s*[:=]\s*["\'][^"\']{8,}', 'möglicher Schlüssel im Code'),
                 (r'sk-[A-Za-z0-9]{20,}', 'API-Key-Muster')]:
    if re.search(pat, js, re.I): fail.append(msg)
if re.search(r'XMLHttpRequest|WebSocket\(', js): fail.append('XMLHttpRequest/WebSocket im App-Code')
# Netzwerk nur zum eigenen Supabase (freiwilliger Geräte-Abgleich) – und dort nur mit dem öffentlichen anon-Schlüssel
for m in re.finditer(r'\bfetch\s*\(([^,)]*)', js):
    if not m.group(1).strip().startswith('SB_URL'): fail.append('Netzwerkaufruf an fremdes Ziel: fetch(%s)' % m.group(1).strip()[:40])
mu = re.search(r"SB_URL = '([^']+)'", js)
if mu and mu.group(1) != 'https://supabase.arndt-software.de': fail.append('SB_URL zeigt nicht auf den eigenen Server')
mk = re.search(r"SB_KEY = '([^']+)'", js)
if mk:
    import base64, json
    try:
        pl = mk.group(1).split('.')[1]; pl += '=' * (-len(pl) % 4)
        role = json.loads(base64.urlsafe_b64decode(pl)).get('role')
    except Exception: role = None
    if role != 'anon': fail.append('SB_KEY ist kein öffentlicher anon-Schlüssel (role=%s)' % role)
    else: print('  [OK] Supabase-Schlüssel ist der öffentliche anon-Schlüssel')
for url in re.findall(r'(?:src|href)="(http[^"]+)"', html):
    if not url.startswith('https://'): fail.append(f'unsicherer Link {url}')
    elif not re.match(r'https://fonts\.(googleapis|gstatic)\.com', url): warn.append(f'externer Link {url}')
# Benutzereingaben dürfen nie direkt in innerHTML landen (echter XSS-Test: tests/ui_test.py)
if re.search(r'innerHTML\s*=\s*[^;]*\.value\b', js): fail.append('Eingabefeld-Wert direkt in innerHTML')
if 'function esc(' not in js: fail.append('Escape-Funktion esc() fehlt')
print(f'  esc()-Aufrufe: {js.count("esc(")}')
for m in warn: print('  [WARN]', m)
for m in fail: print('  [FAIL]', m)
print('PASS' if not fail else 'FAIL')
sys.exit(1 if fail else 0)
