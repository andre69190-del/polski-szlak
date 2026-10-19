# Arbeitsstand (laufend gepflegt)

> Wird während jeder Session fortgeschrieben, damit bei einer Kontext-Komprimierung nichts verloren geht.
> Neue Session: zuerst diese Datei + docs/CLAUDE_SESSION_STARTER.md lesen.

## Aktuell: Version 1.3 (in Arbeit, 18.10.2026)

### Aufträge des Nutzers (wörtlich zusammengefasst)
1. „Zu wenige Fragen überall, z. B. die Fälle. Gehe auf 100 Fragen, wo möglich; auch Memory oder weitere Kategorien.“
2. 1-gegen-1 wie bei GeoQuest → gewählt: **Variante B „Duell-Code“** (jeder am eigenen Handy, gleicher Code = gleiche Fragen, kein Server, App bleibt offline).
3. **WICHTIG:** „Es müssen die gleichen Fragen sein – damit gab es bei GeoQuest lange Probleme.“
4. „Schreibe immer alles auf, damit bei einer Komprimierung nichts verloren geht“ → diese Datei.
6. **Danach (wenn alles live ist):** Variante A als NEUES Spiel bauen = geteilter Bildschirm an EINEM Handy
   (Handy liegt zwischen zwei Leuten, obere Hälfte 180° gedreht, gleiche Frage für beide, wer zuerst richtig tippt, bekommt den Punkt).
5. Danach alles im WLAN online: `serve_local.bat` ausführen (http://192.168.178.52:8788).
7. „Prüfe, ob wirklich die gleichen Fragen da sind – das Familienduell (vor Variante B) hatte unterschiedliche Fragen. Arbeite parallel.“
8. „Erweitere alles, wo sinnvoll, auf 100 Fragen.“
9. (nach Live) „Nicht unbedingt alles selber schreiben, sondern hauptsächlich sprechen oder lesen – als Option, z. B. beim Einstufungstest oder bei den Fragen.“ → Einstellung **Antwortart**: Schreiben / Sprechen / Antippen.
10. „Extra Kategorie für Leute aus Polen, die Polnisch können, zum Prüfen – als Schwierigkeit oder Einstufung Muttersprachler? Dann fehlen überall Fragen und Kategorien.“ → Konzept vorschlagen, Nutzer entscheidet.
11. „Gibt es eine Rangliste, die immer gespeichert wird? Wie vermeidet man, dass es unfair ist?“ → **GENEHMIGT (18.10.): bauen, NACHDEM Dla Polaków live ist.**
12. „Unterschiedliche Schwierigkeitsstufen sollen gegeneinander spielen können (dann andere Fragen, Spieler müssen das wissen). Einstufungstest vorher? Vorschläge?“ → **GENEHMIGT (18.10.): „Gemischtes Duell“ mit Gewichtung bauen, nach Dla Polaków.**
13. „Schreibe danach ein Dokument, wie alles live geht und von überall auf dem Handy abrufbar ist. Updates automatisch live, aktueller Stand der Spieler darf nicht verloren gehen.“ → **docs/LIVE_GEHEN.md geschrieben** (Coolify + Git-Push-Auto-Deploy bzw. GitHub Pages/Netlify; SW network-first; localStorage-Schlüssel nie ändern, Domain nicht wechseln, neue Felder in fresh()). Projekt ist noch KEIN Git-Repo → git init nötig, sobald Nutzer veröffentlichen will (Push/Hosting = Nutzer bestätigt).
14. „polski.arndt-software.de passt, soll auch als App offline funktionieren, schreibe alles, was gemacht werden muss.“ → LIVE_GEHEN.md Abschnitt 2 konkret (GitHub, Cloudflare, Coolify, Installieren, Offline-Test, Impressum/Datenschutz). PNG-Icons erzeugt (scratchpad/make_icons.py: icon-192/512, icon-maskable-512, apple-touch-icon 180) → manifest, build.py (apple-Tags), Dockerfile COPY, sw ASSETS. Checks + 30 Tests grün.
    Antwort an Nutzer: WLAN (http) = KEIN Offline (SW nur bei https registriert). Offline erst über polski.arndt-software.de.

### Design Rangliste + Gemischtes Duell (genehmigt, noch zu bauen)
- Rangliste LOKAL (kein Server, Safety-Check verbietet Netz): jedes Duell-Code-Ergebnis (eigenes + eingefügtes Gegner-Ergebnis) wird pro Spielername gespeichert (Siege, Punkte, Spiele, je Stufe). Teil des Backups (S-Objekt).
- Fairness: gleicher Code = gleiche Fragen, Stufe im Code, Prüfzeichen-Vergleich; Ergebnistext enthält Stufe + Antwortart (Antippen ≠ Schreiben) + Prüfsumme über Code+Ergebnis (bearbeitete Ergebnisse fallen auf); kein Joker/Überspringen; Zeit = Tie-Break; Rangliste getrennt/gewichtet nach Stufe.
- Gemischtes Duell: jeder Spieler wählt eigene Stufe → gleicher Seed, aber Fragen je Stufe verschieden; Startbildschirm zeigt klar „Gemischtes Duell: A Stufe x, B Stufe y – unterschiedliche Fragen“ + Prüfzeichen je Stufe. Gewichtung lv1 ×1, lv2 ×1,5, lv3 ×2. Empfohlene Stufe aus eigener Einstufung (Lerner) bzw. S.plv (Dla Polaków), änderbar. Optional Dla-Polaków-Stufen im Duell (Muttersprachler vs Lerner).

### Design Duell-Code (gegen das GeoQuest-Problem „verschiedene Fragen“)
- Code-Format `WORT-123-S` (S = Stufe 1/2/3). Die Stufe steckt im Code, nicht in den Einstellungen des Handys.
- Fragen hängen **nur** vom Code + Inhalt ab, nicht vom Lernfortschritt (alle Städte als Pool, feste Datenreihenfolge),
  nicht von der Basissprache (Ablenker werden über Wort-IDs gewählt, nicht über übersetzten Text), nicht von Math.random.
- Ein eigener Zufallsgenerator `C.rng('duel|' + code)`; das globale R wird während des Baus ersetzt.
- **Prüfzeichen** (4 Zeichen, Hash über die sprachunabhängige Fragen-Signatur) wird vor dem Start angezeigt:
  beide vergleichen es → bei Abweichung (z. B. andere App-Version) sieht man das sofort.
- Kein Überspringen, kein Joker. Ergebnis: Punkte + Zeit + Teiltext; Gegner-Ergebnis einfügen → Sieger (Zeit als Tie-Break).
- Core-Funktionen: `duelNewCode`, `duelParse`, `duelResultText`, `duelReadResult` (+ Tests auf Determinismus).

### Bekannter Altfehler (gefunden, mitbeheben)
- Tagesrätsel nutzt `poolOpen()` (freigeschaltete Städte) → zwei Personen bekommen an einem Tag verschiedene Fragen.
  Fix: Tagesrätsel ebenfalls auf festen Pool (alle Städte, nur Stadt 1–3?) bzw. gleiche Logik wie Duell.

### Fortschritt
- [x] Duell-Code FERTIG + getestet (29 Node-Tests grün; Browser: Prüfzeichen KOT-472-2 = 7T1A wie in Node, Vergleich/anderer Code/anderes Prüfzeichen ok, keine Konsolenfehler)
- [x] Fälle → 108 (92 neu via scratchpad/cases_add.py, alle 7 Fälle)
- [x] Inhalte (scratchpad/culture_add.py): Wahr/Falsch 18→110, Personen 12→30, Zeitleiste 17→40, Orte 16→40, Höher/Tiefer 3→6 Sets, Zungenbrecher 4→19 (Runde zieht 6), Laute 17→24
- [x] Memory-Themen: memo_w (Üben, alle offenen Städte), memo_p (Orte), memo_y (Jahreszahlen) – runMatch(list,ui,th) verallgemeinert via runMemo(mode)
- [x] PM: +Zawód, Roślina, Rzecz w domu (8 Kategorien), pro Spiel 5 zufällige (PM.cats)
- [x] Familienduell-FIX: startDuel zieht 5 Fragen EINMAL, jeder Spieler bekommt identische Kopien (gleiche Antwortreihenfolge) im Block nacheinander (cfg.block, Spielerwechsel nach 5). Browser: Anna/Ben exakt gleiche Fragen.
- [x] Build + alle Checks + 29 Tests grün (nach Duell-Fix)
- [x] Inhalte auf 100 – PARALLEL-Sessions schreiben nach content_neu/ (NICHT src/), danach hier einmischen + prüfen:
  - saetze.json (5 neue Sätze je Stadt → 108), zeit_orte.json (Zeitleiste +60, Orte +60 mit lon/lat), personen.json (+70 → 100)
  - bewusst NICHT auf 100: Laute (Alphabet begrenzt), Wörter pro Stadt (Lehrplan), Krasnale, Fakten-Tabelle
- [x] Eingemischt + geprüft: Sätze 108, Zeitleiste 100, Orte 100, Personen 100 (Backup scratchpad/data_before_merge100.json). Alle Checks + 29 Tests grün.
- [x] Duell-Code-Prüfung (Parallel-Session): bestanden – 180 Pläne deterministisch, Math.random 0×, DE/EN gleich, Browser 2 Profile gleiches Prüfzeichen 504P (KOT-472-2 nach Inhaltsausbau neu, alte 7T1A ungültig, normal)
- [x] Tagesrätsel: bewusst persönlich („heute für dich gleich“) – kein Fehler, nicht geändert
- [x] Änderungsprotokoll 1.3, Doku-Zahlen
- [x] Live im WLAN: http://192.168.178.52:8788 (Server-Tab läuft, liefert v1-3 + startFace)
- [x] Variante A = neues Spiel „Gegenüber“ (Kachel `face` in Üben): renderFaceSetup/faceQs/startFace, Overlay `.face` (obere Hälfte .flip 180°), pointerdown+click (Mehrfach-Touch), falsch = gesperrt, erster Richtiger = Punkt, beide falsch = Auflösung; Mix Wort pl→x, x→pl, Fälle, Wahr/Falsch, max 4 Optionen; 5/10/15 Fragen. Browser-Test 375×812 ok (10 Runden, gleiche Frage oben/unten, Nochmal/Beenden).
- [x] check_features: Memory-Themen, Familienduell gleiche Fragen, Gegenüber
- [x] sw.js CACHE v1-3
- [x] Auftrag 9 Antwortart: S.input write|speak|tap, drawInput → drawType/drawSayType/drawTapType, tapOpts(q) mit C.rng('tap|'+a) (q.alt bei Lücke/Fall), Umschalter .inp-switch, Hint-Joker nur bei Schreiben. Browser ok (Einstufung Antippen + Sprechen/Aufdecken). sw v1-4. Backup scratchpad/app_before_input.js
- [ ] Auftrag 10 Muttersprachler: Nutzer hat entschieden (18.10.): **eigener Bereich „Dla Polaków“ mit eigener Einstufung, Kategorien je ~100 Fragen, parallel arbeiten.**
  - Datenformat content_neu/polacy_<kat>.json: `[{"q": Frage (pl), "s": optional Satz mit ___, "a": richtig, "o": [3 falsche], "lv": 1|2|3, "x": kurze Erklärung (pl)}]`
  - lv: 1 = dobry, 2 = bardzo dobry, 3 = mistrz (je ~1/3)
  - Kategorien-IDs: ortografia, poprawnosc, aspekt, liczebniki, frazeologia, wiedza
  - Sessions: polacy-orto-popr (ortografia+poprawnosc), polacy-asp-licz (aspekt+liczebniki), polacy-fraz-wiedza (frazeologia+wiedza) → schreiben NUR content_neu/
  - [x] UI gebaut (scratchpad/polacy_ui.py, Backup app_before_polacy.js/core_before_polacy.js): Karte oben im Polska-Tab, renderPolacy (Stufe, Sterne, Test, Stufenwahl, 6 Kategorien + Mieszanka, Bestwerte S.plBest), startPolTest (18 = 6 Kat × 3 Stufen), C.polLevel (≥2/3 je Stufe, kumulativ, Test #30), S.plv. Einmischen: python -I scratchpad/polacy_merge.py <projekt>
  - Ich baue: Bereich in app.js (Tab/Kachel), Einstufung (je Kategorie 3 Fragen pro Stufe), Spiel pro Kategorie, Mix, Duell-Code-Stufe?, Daten in data.json "polacy"
- [x] Auftrag 10 LIVE (1.4, SW v1-5): 600 Fragen eingemischt (je Kat. 100, ~34/33/33; Backup scratchpad/data_before_polacy.json), Stichprobe ok. PLX/polUI: Spielbildschirme im Bereich polnisch (t() überschreibt), kein Krasnal im Bereich. perf-Budget 600 KB. Browser: Test 18 → bardzo dobry, Kategorie/Mix/mistrz, Bestwerte, Wróć ok, keine Konsolenfehler.
- [x] Auftrag 11+12 **LIVE als 1.5 (18.10.)**: Rangliste + gemischtes Duell. core.js: duelParse mit P1–P3 + base, duelPlan für P (data.polacy, 20 Fragen, k:'q'), duelWeight/duelScore, duelSign (Prüfsumme ~XXXX über code|check|name|right|total|secs|input), duelResultText(…, extra{name,input}), duelReadResult (+name,input,lv,base,signed; abwärtskompatibel), duelCompare gewichtet bei verschiedenen Stufen, rankAdd/rankList. app.js: S.name/S.rank/S.rankSeen in fresh(), Setup mit Name + 2 Stufen-Reihen (#d2lv, #d2lvp) + Empfehlung (duelRecLv) + rankBox(), duelQ k:'q', bindDuelResult: Stamm-/Prüfzeichen-Check (andere Stufe per duelPlan nachgerechnet), gewichtete Anzeige, Eintrag nur bei signed + Dedupe-Key. 32 Tests, alle Checks grün, Browser-Test ok (echt/gefälscht/doppelt/fremder Stamm/falsches Prüfzeichen). SW v1-6. Patch-Skripte: scratchpad/rank_core.py, rank_app.py; Backups core_before_rank.js, app_before_rank.js.

### Konzept Muttersprachler (Vorschlag)
- KEINE Schwierigkeitsstufe (die Städte-Route ist für Muttersprachler zu leicht), sondern eigener Bereich „Dla Polaków / Für Muttersprachler“ mit eigener Einstufung (Poziom: dobry / bardzo dobry / mistrz).
- Komplett auf Polnisch (UI-Texte pl), eigene Kategorien je ~100 Fragen: Ortografia (ó/u, rz/ż, ch/h, nie razem/osobno, wielka litera), Poprawna polszczyzna (häufige Fehler: wziąść→wziąć, poszłem→poszedłem, w każdym bądź razie), Aspekt & Verben, Zahlwörter (dwóch/dwie/dwoje, Deklination), Frazeologia/Przysłowia, Wiedza o Polsce (Geschichte, Literatur, Geografie für Profis).
- Spielformen wiederverwenden (MC, Wahr/Falsch, Lücke, Duell-Code mit Stufe M).

### Technische Notizen
- Patch-Skripte in den Scratchpad schreiben (Heredocs mit ’ brechen), `rep(a,b)` mit assert count==1.
- Safety-Check verbietet Schlüssel wie `*_secret`, `token` usw. und jeden Netzwerkzugriff.
- Checks: `node checks/check_syntax.mjs`, `node checks/i18n_check.mjs`, `python -I checks/*_check.py`, `bash checks/check_features.sh`, `node --test tests/core.test.js`.
