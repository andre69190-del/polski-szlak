#!/usr/bin/env python3
"""Sicherheit & Datenschutz (Idee aus BIOGLOW/ARDOC safety_check.py).
- keine Schlüssel/Secrets, kein eval/new Function, kein document.write
- innerHTML nur mit esc(): grobe Heuristik auf Benutzereingaben
- keine Netzwerkaufrufe außer Google Fonts (App speichert nur lokal)
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
if re.search(r'\bfetch\s*\(|XMLHttpRequest|WebSocket\(', js): fail.append('Netzwerkaufruf im App-Code (App soll offline/lokal bleiben)')
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
