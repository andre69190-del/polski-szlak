# Was aus GeoQuest, BIOGLOW und ARDOC übernommen wurde

Geprüft am 18.10.2026 in `Cowork\Geoquest`, `Cowork\Bioglow` und `Cowork\ARDOC`.

## Übernommen

| Herkunft | Was | Wo in Polski Szlak |
|---|---|---|
| GeoQuest | **Eine Build-Quelle → eine Datei** (`gen.py` → `GeoQuest.html`) | `build.py` → `index.html` (+ Artifact-Version in `dist/`) |
| GeoQuest | **Zero-Bug-Policy**: jeder Platzhalter / jedes Replace genau einmal (`assert count==1`) | `build.py` `put()` |
| GeoQuest | Daten getrennt vom Code, beim Build eingesetzt (`data/*.json`) | `src/data.json` → `<script type="application/json" id="ps-data">` |
| GeoQuest | **Pflicht-Workflow** nach jeder Änderung (gen → verify → validate) | `bash checks/run_all.sh` |
| GeoQuest | `validate_content.py` (Inhaltsprüfung) | `checks/content_check.py` |
| GeoQuest | `option_quality_test.js` / `smoke_test.js` | `tests/ui_test.py` (spielt jeden Modus durch) |
| GeoQuest | **Service Worker network-first für Seitenaufrufe** (Fix aus Phase 589 gegen die Cache-Falle) | `sw.js` |
| GeoQuest | **Dockerfile + nginx-Container-Config für Coolify** (Traefik macht HTTPS) | `Dockerfile`, `deploy/nginx-container.conf` |
| GeoQuest | `serve_local.bat` (Handy-Test im WLAN) | `serve_local.bat` (Port 8788) |
| GeoQuest | `i18n_test.js` (Übersetzungen vollständig) | `checks/i18n_check.mjs` |
| GeoQuest | `option_quality_test.js` (keine doppelten/einzelnen Optionen) | Prüfung in `tests/ui_test.py`, für jede gespielte Frage |
| GeoQuest | `smoke_test.js` + `ingame_render_test.js` (jeder Modus/Screen läuft ohne Fehler) | `tests/ui_test.py` spielt jeden Modus im echten Browser durch und rendert alle Tabs |
| GeoQuest | Daily Challenge, Streak, XP, Liga | Tagesrätsel, Wochen-Serie, XP/Stufen, „Du gegen dich letzte Woche“ |
| GeoQuest | **Familienduell (Hot-Seat)** aus Phase 460 | Familienduell 2–4 Spieler |
| GeoQuest | **Sammelalbum** (Sticker, Zug-Depot) | Postkarten-Album + Krasnale |
| GeoQuest | **DS100-Hardcore-Eingabe** (Phase 297) | Strenger Schreibmodus: Akzente zählen, doppelte XP |
| GeoQuest | 4-Schritt-Onboarding (Sprache, wer, Interessen, Zeit) | 3-Schritt-Onboarding (Basissprache, Warum, Wochenziel) |
| GeoQuest | Übungsmodus ohne Wertung | Abbrechen ist jederzeit folgenlos |
| GeoQuest | Zweisprachig DE/EN | Basissprache DE oder EN, UI folgt mit |
| BIOGLOW | **Single-File-PWA, offline, lokal speichern** | ganze App in `index.html`, Fortschritt in `localStorage` |
| BIOGLOW | `checks/`-Ordner mit `run_all.sh`, je Check Exit-Code 0/1 | identische Struktur |
| BIOGLOW | `check_syntax.mjs`, `safety_check.py`, `a11y_check.py`, `contrast_check.py`, `perf_check.py` | gleiche Namen, angepasst |
| BIOGLOW | Kontrast-Befund (weiß auf hellem Grün zu schwach) als Lehre | Primärfarbe so gewählt, dass weiß darauf ≥ 4,5:1 hat |
| BIOGLOW | Missionen + tägliche Challenge mit Streak, Lernkarten, „Wer bin ich?“-Rätsel | Szenen pro Stadt, Tagesrätsel, Lern-Karten |
| BIOGLOW | Änderungsprotokoll als Beleg für Iteration | `docs/AENDERUNGSPROTOKOLL.md` |
| ARDOC | Zwei Nutzerstufen (Hobby ↔ Profi) | Normaler ↔ strenger Schreibmodus |
| ARDOC | Feld- vs. Labor-Modus (Handy vs. Desktop) | Mobile-first, eine Spalte, untere Navigation |
| ARDOC | Demo ohne Konto, Daten nur auf dem Gerät | Keine Anmeldung nötig, Backup per Text |
| ARDOC | Playwright-E2E (`e2e/app.spec.js`) | `tests/ui_test.py` |
| ARDOC/GeoQuest | `CLAUDE_SESSION_STARTER.md`, Handbuch, DEPLOY-Checkliste | `docs/CLAUDE_SESSION_STARTER.md`, `README.md`, `docs/DEPLOY.md` |

## Bewusst nicht übernommen

| Was | Warum nicht |
|---|---|
| Tages-Streak als Hauptzahl, Streak-Freeze | Forschung zeigt: gerissene Streaks vertreiben Nutzer, Reparatur senkt Motivation (siehe Konzept) |
| Globale Bestenliste / Liga gegen Fremde | Für Erwachsene, die eine Sprache lernen, eher Druck als Hilfe; ersetzt durch Vergleich mit sich selbst |
| Supabase-Cloud | Für die erste Version unnötig; später optional für Geräte-Sync (Roadmap) |
| Patch-System `patches/patch_NNN` | Bei 4 Quelldateien nicht nötig; Änderungen direkt in `src/`, Protokoll in `AENDERUNGSPROTOKOLL.md` |
| React/Vite-Stack aus ARDOC | Single-File reicht und ist einfacher zu hosten |
| Kinder-Modus mit Eltern-PIN | Zielgruppe zunächst Erwachsene; leicht nachrüstbar |
