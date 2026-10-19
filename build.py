#!/usr/bin/env python3
"""Polski Szlak – Build (Prinzip aus GeoQuest gen.py: eine Quelle, eine generierte Datei).

    python3 build.py

Erzeugt:
  index.html                     -> Deploy-Version (PWA: Manifest + Service Worker)
  dist/polski_szlak_artifact.html -> Version ohne PWA-Teile (für Claude-Artifact/Vorschau)

Zero-Bug-Policy (aus GeoQuest übernommen): jeder Platzhalter muss genau einmal vorkommen.
"""
import json, os, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src')


def read(name):
    with open(os.path.join(SRC, name), encoding='utf-8') as f:
        return f.read()


def put(doc, placeholder, value):
    n = doc.count(placeholder)
    assert n == 1, f'Platzhalter {placeholder} kommt {n}x vor (erwartet 1)'
    return doc.replace(placeholder, value)


def main():
    data = json.loads(read('data.json'))          # validiert JSON beim Build
    data_txt = json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    shell = read('shell.html')
    for ph, val in [('/*CSS*/', read('app.css')), ('/*DATA*/', data_txt), ('/*CORE*/', read('core.js')), ('/*APP*/', read('app.js'))]:
        shell = put(shell, ph, val)

    pwa = ('<link rel="manifest" href="manifest.json">\n'
           '<link rel="icon" href="icon.svg" type="image/svg+xml">\n'
           '<link rel="apple-touch-icon" href="apple-touch-icon.png">\n'
           '<meta name="apple-mobile-web-app-capable" content="yes">\n'
           '<meta name="apple-mobile-web-app-title" content="Polski Szlak">')
    deploy = ('<!doctype html>\n<html lang="de" data-pwa="1">\n<head>\n<meta charset="utf-8">\n'
              '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
              '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}[hidden]{display:none!important}img{max-width:100%}</style>\n'
              + put(put(shell, '<!--PWA-->', pwa), '<div id="app"', '</head>\n<body>\n<div id="app"') + '\n</body>\n</html>\n')
    artifact = put(shell, '<!--PWA-->', '')

    with open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(deploy)
    os.makedirs(os.path.join(ROOT, 'dist'), exist_ok=True)
    with open(os.path.join(ROOT, 'dist', 'polski_szlak_artifact.html'), 'w', encoding='utf-8') as f:
        f.write(artifact)

    words = sum(len(u['words']) for u in data['units'])
    sents = sum(len(u['sentences']) for u in data['units'])
    print(f'OK  index.html {len(deploy)//1024} KB · {len(data["units"])} Städte · {words} Wörter · {sents} Sätze · '
          f'{len(data["cases"])} Fall-Übungen · {len(data["sounds"])} Laute')
    return 0


if __name__ == '__main__':
    sys.exit(main())
