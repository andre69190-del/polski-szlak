# Polski Szlak – Veröffentlichen

> Schritt-für-Schritt-Anleitung für polski.arndt-software.de inkl. Offline-App: **docs/LIVE_GEHEN.md**

Ziel: **arndt-software.de**, gleiches Verfahren wie GeoQuest und BIOGLOW (Coolify auf dem eigenen Server, Traefik macht HTTPS).

Zwei Varianten, beide funktionieren ohne Codeänderung (alle Pfade sind relativ):
- **Subdomain** `polski.arndt-software.de` als eigene Coolify-App (empfohlen, wie geoquest.arndt-software.de und bioglow.arndt-software.de).
- **Unterordner** `arndt-software.de/polski/`: `index.html`, `sw.js`, `manifest.json`, `icon.svg` und die 4 PNG-Icons in den Ordner `polski/` der Homepage legen.

## Checkliste

1. `bash checks/run_all.sh --ui` → „GESAMT: alles bestanden“.
2. In `sw.js` die `CACHE_NAME`-Version erhöhen (`polski-szlak-v2` …), sonst sehen Nutzer evtl. die alte Version.
3. Eintrag in `docs/AENDERUNGSPROTOKOLL.md`.
4. Commit + Push ins Git-Repo.
5. In Coolify: neue App aus dem Repo, **Build Pack: Dockerfile**, **Ports Exposes: 80**, Domain `https://polski.arndt-software.de`.
6. DNS bei Cloudflare: `polski` → A-Record auf die Server-IP, **„Nur DNS“** (nicht proxied), damit Let's Encrypt funktioniert.
7. Nach dem Deploy auf dem Handy öffnen, „Zum Startbildschirm hinzufügen“, einmal offline testen.

## Hinweise

- Die nginx-Config erlaubt das Mikrofon für die eigene Seite (`microphone=(self)`), damit die Sprechübungen funktionieren. Kamera und Standort bleiben gesperrt.
- Ohne Server reicht auch: `index.html`, `sw.js`, `manifest.json`, `icon.svg` + PNG-Icons auf einen beliebigen statischen Host legen (Netlify, Vercel, GitHub Pages).
- Wenn Änderungen „nicht ankommen“: fast immer der Service-Worker-Cache. DevTools → Application → Service Workers → Unregister, dann neu laden (Lehre aus GeoQuest Phase 472).
- Impressum/Datenschutz: Die App speichert nichts auf dem Server und setzt keine Cookies. Google Fonts wird geladen; für eine DSGVO-strikte Variante die Schriften selbst hosten.
