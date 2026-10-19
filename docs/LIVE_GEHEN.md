# Polski Szlak – live gehen, von überall aufs Handy, automatische Updates

Stand 18.10.2026. Ziel: Die App ist im Internet unter einer festen HTTPS-Adresse erreichbar (nicht nur im WLAN). Jede neue Version geht automatisch live. Der Spielstand der Spieler bleibt dabei erhalten.

---

## 1. Warum das WLAN-Setup nicht reicht

`serve_local.bat` (http://192.168.178.52:8788) hat drei Grenzen:
- Es funktioniert nur im eigenen WLAN und nur, solange der PC läuft.
- Es läuft über **http** ohne „s“. Deshalb gehen Offline-Modus, „Zum Startbildschirm“ und Mikrofon auf dem Handy nicht.
- Die Adresse kann sich ändern, und jede neue Adresse hat einen eigenen, leeren Spielstand (siehe Abschnitt 4).

Für „von überall“ braucht die App einen **statischen Webhost mit HTTPS**. Hochgeladen werden nur die App-Dateien: `index.html`, `sw.js`, `manifest.json`, `icon.svg` sowie die PNG-Icons `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` und `apple-touch-icon.png`. Das Dockerfile kopiert genau diese Dateien. Es gibt kein Backend und keine Datenbank, denn alles läuft im Handy.

---

## 2. Festgelegt: https://polski.arndt-software.de (Coolify, wie GeoQuest)

### Was schon fertig ist (im Projekt)
- [x] App als PWA: `manifest.json` (Name, Farben, `display: standalone`) und Service Worker `sw.js` für den Offline-Modus.
- [x] PNG-Icons für Android (192/512, maskable) und iPhone (`apple-touch-icon.png`, 180 px). iOS akzeptiert kein SVG-Icon.
- [x] iPhone-Tags `apple-mobile-web-app-capable` und `apple-mobile-web-app-title` in `index.html`.
- [x] `Dockerfile` und `deploy/nginx-container.conf`:
  - nginx, kein Cache auf `sw.js` und `index.html`
  - Mikrofon erlaubt
  - Sicherheits-Header gesetzt
- [x] Alle Pfade relativ, daher keine Codeänderung für die Domain nötig.

### Was du noch machen musst (einmalig, ca. 20–30 Minuten)
1. ~~GitHub-Repo~~ **erledigt 19.10.2026:** öffentlich unter https://github.com/andre69190-del/polski-szlak (Branch `main`). Backups, Entwürfe (`content_neu/`) und Zips sind per `.gitignore` ausgeschlossen.
2. ~~Projekt hochladen~~ **erledigt** (`git push -u origin main`). Künftige Updates: `git add . && git commit -m "…" && git push`.
3. ~~Cloudflare DNS~~ **nicht nötig:** Der Wildcard-Eintrag `*.arndt-software.de` zeigt schon auf den Coolify-Server (159.195.159.150, geprüft).
4. **Coolify** (wie bei GeoQuest):
   1. *+ New → Resource → Public Repository* (oder über die GitHub App), URL `https://github.com/andre69190-del/polski-szlak`, Branch `main`. Bei „Public Repository“ geht Auto Deploy nur mit Webhook; einfacher ist die GitHub App wie bei GeoQuest.
   2. Build Pack: **Dockerfile**. Ports Exposes: **80**.
   3. Domains: `https://polski.arndt-software.de`
   4. *Auto Deploy* **an** (Webhook). Danach geht jeder `git push` automatisch live.
   5. *Deploy* klicken und warten, bis der Status „Running“ ist. Das HTTPS-Zertifikat holt sich Traefik automatisch.
5. **Testen am PC:** Die Adresse `https://polski.arndt-software.de` muss laden, mit Schloss-Symbol und ohne Zertifikatsfehler.
6. **Handy – als App installieren:**
   - **Android/Chrome:** Adresse öffnen, im Menü ⋮ **„App installieren“** bzw. „Zum Startbildschirm hinzufügen“ wählen.
   - **iPhone/Safari:** Adresse öffnen, dann **Teilen → „Zum Home-Bildschirm“**. Nur Safari kann das auf dem iPhone.
7. **Offline testen:**
   1. Die App einmal mit Internet öffnen und kurz durchklicken (eine Stadt, ein Spiel).
   2. Dann den **Flugmodus** an, die App komplett schließen und vom Startbildschirm neu öffnen. Sie muss vollständig laufen.
8. **Rechtliches (öffentliche Seite in DE):**
   - **Impressum** und **Datenschutzerklärung** verlinken, z. B. dieselben wie auf arndt-software.de.
   - Inhalt Datenschutz: kein Server-Speicher, keine Cookies; Spielstand nur im Gerät; Google Fonts wird beim ersten Laden abgerufen.
   - Für DSGVO-strikt können die Schriften selbst gehostet werden. Claude kann das umbauen; dafür müssen die Schriftdateien einmal heruntergeladen werden.

### Wichtig für Offline
- Offline funktioniert **nur über HTTPS**, deshalb nicht im WLAN-Test (http).
- Die App ist **eine einzige Datei** mit allen Fragen, Texten und Logik darin. Nach dem ersten Öffnen liegt sie komplett im Cache.
- Ohne Internet fehlen nur die Schriftarten, falls sie beim ersten Laden nicht geladen wurden. Dann nimmt das Handy seine eigene Schrift. Die Sprachausgabe nutzt die Stimme des Handys und läuft meist auch offline. Die Spracherkennung (Mikro) braucht bei vielen Handys Internet; ohne Internet greift automatisch das Selbst-Bewerten.

### Allgemeiner Ablauf (Referenz)

Dort laufen schon GeoQuest und BIOGLOW, deshalb ist das der kürzeste Weg. Details stehen in `docs/DEPLOY.md`.

**Einmalig einrichten:**
1. **Git-Repo anlegen.** Der Projektordner ist noch kein Git-Repo.
   ```bash
   git init
   git add .
   git commit -m "Polski Szlak 1.3"
   ```
   Dann ein privates Repo auf GitHub anlegen und pushen (`git remote add origin …`, `git push -u origin main`).
2. **Coolify:** neue App aus dem Repo anlegen.
   - Build Pack: **Dockerfile** (liegt bei und baut nginx mit den 4 Dateien).
   - Port: **80**.
   - Domain: `https://polski.arndt-software.de`.
3. **Automatisch deployen einschalten:** in Coolify unter *Settings → Auto Deploy* (der GitHub-Webhook wird von Coolify angelegt). Ab dann löst jeder `git push` automatisch einen neuen Build aus.
4. **DNS bei Cloudflare:** A-Record `polski` → Server-IP, auf **„Nur DNS“** stellen. Dann holt sich Let's Encrypt das HTTPS-Zertifikat.
5. **Auf dem Handy:**
   - Adresse öffnen und **„Zum Startbildschirm hinzufügen“**. Danach sieht es aus wie eine echte App und funktioniert auch offline.
   - Einmal Flugmodus testen.

**Alternative ohne eigenen Server:** GitHub Pages, Netlify oder Vercel. Dort das Repo verbinden und als Ordner das Projekt-Hauptverzeichnis wählen; ein Build-Befehl ist nicht nötig, weil `index.html` schon fertig gebaut im Repo liegt. Auch dort geht jeder Push automatisch live, und HTTPS ist inklusive. **Wichtig:** Eine Domain einmal festlegen und behalten (siehe Abschnitt 4).

---

## 3. Wie Updates automatisch live gehen

**Ablauf pro neuer Version (macht Claude bzw. der Entwickler):**
1. Ändern in `src/` und mit `python -I build.py` bauen.
2. Alle Checks und Tests laufen lassen (`bash checks/run_all.sh --ui`).
3. In `sw.js` die `CACHE_NAME`-Version erhöhen, z. B. `polski-szlak-v1-6` → `v1-7`.
4. Eintrag in `docs/AENDERUNGSPROTOKOLL.md` schreiben.
5. `git commit` und `git push`. Coolify bzw. Pages baut neu, und die Version ist nach etwa 1 Minute online.

**Was auf dem Handy passiert (ohne Zutun der Spieler):**
- Der Service Worker lädt die Seite **zuerst aus dem Netz** („network-first“). Mit Internet bekommt man beim nächsten Öffnen also automatisch die neue Version.
- Ohne Internet kommt die zuletzt geladene Version aus dem Cache, und man kann trotzdem weiterspielen.
- Die neue `CACHE_NAME` sorgt dafür, dass alte Cache-Reste gelöscht werden (`activate`).
- Durch `skipWaiting()` und `clients.claim()` wird der neue Service Worker sofort aktiv; es gibt keine „hängende“ alte Version.
- nginx liefert `sw.js` und `index.html` mit `no-cache`, damit der Browser sie nicht selbst zwischenspeichert.

Falls ein Handy trotzdem die alte Version zeigt: App komplett schließen und neu öffnen. Notfalls in den Browser-Einstellungen die Website-Daten **nur für den Cache** löschen, nicht „alle Daten“ (siehe Abschnitt 4).

---

## 4. Der Spielstand bleibt erhalten – so funktioniert es

**Wo der Stand liegt:**
- Im Handy, im Browser-Speicher `localStorage` unter dem Schlüssel `polski_szlak_v1`.
- Er gehört zur **Adresse** (z. B. `https://polski.arndt-software.de`), nicht zur App-Version.

**Warum ein Update ihn nicht löscht:**
- Ein Update tauscht nur `index.html` und `sw.js` aus. `localStorage` wird davon nicht angefasst, denn der Service Worker löscht nur seinen eigenen Cache.
- Beim Laden wird der alte Stand mit den Standardwerten zusammengeführt: `Object.assign(fresh(), alterStand)`.
  - Neue Felder einer neuen Version (z. B. `input`, `plv`, `plBest`) bekommen Standardwerte.
  - Alles, was schon da war (XP, Karten, Städte, Bestwerte), bleibt.

**Regeln, damit das so bleibt (für jede künftige Änderung):**
1. Den Schlüssel `polski_szlak_v1` **nie umbenennen**.
2. Neue Felder **immer in `fresh()`** mit einem Standardwert anlegen. Bestehende Felder nicht umdeuten, sondern höchstens beim Laden umrechnen (Migration).
3. Die **Domain nicht wechseln.** Eine neue Adresse hat einen eigenen, leeren Speicher (so ist das Web gebaut). Wenn ein Umzug doch nötig ist: Vorher allen sagen, dass sie *Ich → Fortschritt sichern* nutzen sollen. Der kopierte Text lässt sich auf der neuen Adresse unter *Wiederherstellen* einfügen.
4. Auch der WLAN-Test (`192.168.178.52:8788`) ist eine **andere Adresse** als die Internet-Version. Spielstände von dort per Sichern/Wiederherstellen umziehen.

**Was Spieler wissen sollten:**
- „Browserdaten / Websitedaten löschen“ löscht auch den Spielstand.
- **iPhone/Safari:** Websites, die man 7 Tage nicht öffnet, darf Safari aufräumen. Mit **„Zum Home-Bildschirm“** gilt das nicht. Deshalb immer zum Home-Bildschirm hinzufügen.
- Ab und zu *Fortschritt sichern* und den Text irgendwo ablegen (Notizen, Mail an sich selbst). Das ist die Sicherung gegen Handyverlust.
- Die **Rangliste** (Duell-Code) liegt ebenfalls in diesem Spielstand und wird mitgesichert.

---

## 5. Kurz-Checkliste „neue Version live“

- [ ] `python -I build.py`
- [ ] `bash checks/run_all.sh --ui` → alles bestanden
- [ ] `sw.js` → `CACHE_NAME` erhöht
- [ ] Neue Spielstand-Felder in `fresh()` mit Standardwert, Schlüssel unverändert
- [ ] Änderungsprotokoll-Eintrag geschrieben
- [ ] `git push` → nach etwa 1 Minute online
- [ ] Handy: App öffnen, neue Version sichtbar, alter Spielstand noch da
