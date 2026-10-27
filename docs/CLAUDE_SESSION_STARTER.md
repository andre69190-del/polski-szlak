# Polski Szlak — Claude Session Starter

> Diesen Block an den Anfang der ersten Nachricht einer neuen Session kopieren.

```
Projekt: Polski Szlak – Single-File Polnisch-Lern-App (PWA), Basissprache DE oder EN
Ordner:  C:\Users\Andre\Desktop\Cowork\PolskiSzlak

Stand: Version 3.0 (28.10.2026) – aktueller Stand immer in docs/ARBEITSSTAND.md
- build.py ist die EINZIGE Build-Quelle → index.html (+ dist/polski_szlak_artifact.html)
- Inhalte NUR in src/data.json, Logik in src/core.js (ohne DOM), UI in src/app.js, CSS in src/app.css
- Szlak 1 (12 Städte, A1) + Szlak 2 (12 Orte, A2, "r": 2) + 4 Themenpakete ("pack": 1): 728 Wörter, 252 Sätze, 28 Szenen; 40 Verben (Konjugation); Sprecherform {m|f} in Inhalten
- Polska: 110 Wahr/Falsch, 100 Personen, 100 Jahreszahlen, 100 Orte, 6 Höher/Tiefer-Sets; Państwa-Miasta 8 Kategorien
- Mehrspieler: Familienduell (gleiche Fragen im Block), Duell-Code (2 Handys), Gegenüber (1 Handy, geteilt)
- Laufender Stand: docs/ARBEITSSTAND.md
- Zero-Bug-Policy: jeder Platzhalter/Replace genau einmal (assert count == 1)

Pflicht-Workflow nach JEDER Änderung:
1. bash checks/run_all.sh        → muss „alles bestanden“ zeigen
2. python3 tests/ui_test.py      → 35/35 OK
   Handy im WLAN: serve_local.bat (docs/HANDY_TEST.md)
3. Eintrag in docs/AENDERUNGSPROTOKOLL.md
4. Vor Deploy: CACHE_NAME in sw.js hochzählen

Designprinzipien (nicht verletzen, siehe docs/KONZEPT_UND_RECHERCHE.md):
- Wochenziel statt Tages-Streak, keine Push-Nachrichten, keine Käufe, keine Schuld-Texte
- „Wörter sicher“ und „Danach kannst du …“ als Fortschritt, XP nur nebenbei
- Benutzereingaben immer durch esc()
- Farben nur als Tokens (hell + dunkel), WCAG ≥ 4,5:1

Wichtige Dateien: README.md, docs/ARCHITECTURE.md, docs/UEBERNAHME.md, docs/DEPLOY.md
```

## Offene Roadmap

1. **Gegenlesen** aller polnischen Inhalte durch eine Muttersprachlerin (vor Veröffentlichung).
2. **Echtes Audio** von Muttersprachlern für Szenen (statt Geräte-Stimme).
3. **Verbaspekt-Modus** (robić/zrobić, pisać/napisać …).
4. **Mehr Städte** / zweite Reise (z. B. Masuren, Ostsee, Schlesien) mit A2-Inhalten.
5. **Optionaler Geräte-Sync** über das eigene Supabase (wie GeoQuest), nur mit Konto.
6. **KI-Gesprächspartner** für freie Szenen (nur mit Server-Proxy, kein Schlüssel im Client).
7. **Kinder-Modus** mit Eltern-PIN (aus GeoQuest übernehmen).
8. **Lernerinnerung**, die Nutzer selbst und ohne Schuld-Ton einstellen (Uhrzeit, Tage).
