# Polski Szlak – Änderungsprotokoll

## 1.6 · 19.10.2026 · Install-Hinweis, Impressum, Datenschutz

- **„Als App installieren“:** Einmaliger Hinweis oben für 2 Sekunden (nach dem ersten Start, nicht in der installierten App; antippbar). Dauerhaft unter **Ich → Als App installieren**: Knopf „Jetzt installieren“ (Chrome/Edge/Android) bzw. Anleitung für iPhone/iPad und andere Browser; „läuft schon als App“, wenn installiert. Neues Spielstand-Feld `instHint`.
- **Impressum und Datenschutz** als eigene Seiten (`impressum.html`, `datenschutz.html`), verlinkt unter Ich → Über die App. Datenschutz nennt Server-Logs, localStorage, Service Worker, Google Fonts und die Spracherkennung des Browsers.
- Dockerfile, Service Worker (Cache v1-7) und nginx (`*.html` no-cache) um die zwei Seiten erweitert.

## 1.5 · 18.10.2026 · Rangliste und gemischtes Duell

- **Duell-Code mit 6 Stufen:** Lernende 1/2/3 und neu **P1/P2/P3 = Dla Polaków** (20 Fragen aus dem Muttersprachler-Bereich, Stufe dobry / bardzo dobry / mistrz). Empfohlene Stufe aus der eigenen Einstufung (Schwierigkeit bzw. Test poziomu), frei änderbar.
- **Gemischtes Duell:** gleicher Code-Stamm (z. B. KOT-472), jeder mit eigener Stufe (KOT-472-1 gegen KOT-472-P2). Unterschiedliche Fragen, richtige Antworten gewichtet: 1 ×1 · 2 ×1,5 · 3 ×2 · P1 ×2 · P2 ×2,5 · P3 ×3; bei Gleichstand entscheidet die Zeit. Das Prüfzeichen der anderen Stufe wird lokal nachgerechnet.
- **Ergebnistext mit Name, Antwortart und Prüfsumme** (`~XXXX`): nachträglich geänderte Ergebnisse werden erkannt. Hinweis, wenn mit unterschiedlicher Antwortart gespielt wurde. Alte Ergebnistexte bleiben lesbar.
- **Lokale Rangliste** (Üben → Duell): Spiele, Siege, Unentschieden, gewichtete Punkte je Name. Nur Ergebnisse mit gültiger Prüfsumme, jedes Duell nur einmal. Liegt im Spielstand, wird mit „Fortschritt sichern“ mitgesichert; löschbar mit Rückfrage. Kein Server.
- 2 neue Logiktests (jetzt 32). Neue Spielstand-Felder `name`, `rank`, `rankSeen` (mit Standardwert, alter Stand bleibt). Service-Worker-Cache auf v1-6.

## 1.4 · 18.10.2026 · „Dla Polaków“ für Muttersprachler, installierbare App

- **Neuer Bereich „Dla Polaków“** (Karte oben im Reiter Polska), komplett auf Polnisch, auch die Spielbildschirme: 6 Kategorien mit je 100 Fragen (Ortografia, Poprawna polszczyzna, Aspekt i czasowniki, Liczebniki, Frazeologia, Wiedza o Polsce), jeweils mit kurzer Erklärung.
- **Eigene Einstufung „Test poziomu“:** 18 Fragen (6 Kategorien × 3 Stufen) → Poziom dobry / bardzo dobry / mistrz. Eine Stufe gilt erst, wenn auch alle darunter zu mind. 2/3 sitzen. Stufe frei wählbar, Bestwerte je Kategorie und Stufe, Mieszanka (10 aus allen).
- **App-Icons als PNG** (Android 192/512 + maskable, iPhone 180) und iPhone-Tags → sauber „Zum Startbildschirm“ installierbar. Anleitung zum Veröffentlichen unter polski.arndt-software.de: docs/LIVE_GEHEN.md.
- 1 neuer Logiktest (jetzt 30), Größenbudget 400 → 600 KB (per gzip ~150 KB). Service-Worker-Cache auf v1-5.

## 1.3 · 18.10.2026 · Viel mehr Inhalte, Duell-Code, Gegenüber

- **Mehr Inhalte (Ziel ~100, wo sinnvoll):** Fall-Übungen 16 → 108, Übungssätze 48 → 108 (9 je Stadt), Wahr/Falsch 18 → 110, Wer bin ich? 12 → 100 Personen, Zeitstrahl 17 → 100 Jahreszahlen, Wo liegt das? 16 → 100 Orte, Höher/tiefer 3 → 6 Sets, Zungenbrecher 4 → 19 (Runde zieht 6), Laute 17 → 24. Bewusst nicht auf 100: Wörter je Stadt (Lehrplan), Laute (Alphabet), Krasnale.
- **Memory-Themen:** Wort-Memory (alle offenen Städte), Orte-Memory, Jahres-Memory.
- **Państwa-Miasta:** 3 neue Kategorien (Beruf, Pflanze, Ding im Haus), jedes Spiel nimmt 5 von 8 zufällig.
- **Duell-Code (2 Handys):** gleicher Code = exakt dieselben 20 Fragen, unabhängig von Fortschritt, Sprache und Zufall; Prüfzeichen zum Vergleichen, Ergebnis als Text austauschen. Beide Handys brauchen dieselbe App-Version (sonst anderes Prüfzeichen).
- **Familienduell-Fix:** Alle Spieler bekommen jetzt dieselben Fragen (gleiche Wörter, gleiche Antwortreihenfolge), nacheinander im Block – vorher bekam jeder andere Fragen.
- **Neues Spiel „Gegenüber“:** 2 Leute, 1 Handy, geteilter Bildschirm (obere Hälfte gedreht). Gleiche Frage für beide, wer zuerst richtig tippt, bekommt den Punkt; falsch getippt = gesperrt.
- **Antwortart (Ich → Einstellungen):** Schreiben / Sprechen / Antippen. Gilt für alle Schreib-Fragen (Einstufungstest, Lektionen, Übersetzen, Lücken, Fälle, Diktat). Unter jeder Schreib-Frage „Lieber: …“ zum direkten Umschalten. Sprechen: Mikro (pl-PL), ohne Mikro laut sagen → Aufdecken → selbst bewerten. Antippen: 4 Vorschläge, fest aus der Antwort abgeleitet (im Duell auf beiden Handys gleich). XP: Antippen 70 %, Selbstbewertung 80 %.
- 4 neue Logiktests (jetzt 29). Service-Worker-Cache auf v1-4.

## 1.2 · 18.10.2026 · Państwa-Miasta und „Nochmal“ für alle Modi

- Neues Familienspiel **Państwa-Miasta** (Stadt-Land-Fluss auf Polnisch) im Familienduell: 3 Runden, Kategorien Land, Stadt, Tier, Essen, Vorname; Timer je nach Schwierigkeit (90/60/45 s), Handy wird reihum weitergegeben.
- Automatische Auswertung gegen rund 500 polnische Wörter (Ł=L, Ż=Z, Eingabe ohne Akzente zählt). Unbekannte Wörter kann die Runde per Tipp gelten lassen; Beispiele zeigen, was möglich gewesen wäre. Punkte: einzigartig 10, doppelt 5, als Einzige/r gültig 20.
- Fehler behoben: „Nochmal“ nach Survival, Rechtschreibung, Wer bin ich?, Wahr/falsch, Zeitstrahl, Wo liegt das?, Höher/tiefer, Literki und Einstufung führte zur Startseite statt den Modus neu zu starten.
- 11 neue Logiktests (jetzt 25) für Schwierigkeit, Einstufung, Karte, Höher/tiefer, Literki, Rechtschreibung und Państwa-Miasta. Service-Worker-Cache auf v1-2.

## 1.1 · 18.10.2026 · Schwierigkeit, Überspringen, Land und Leute

- Drei Schwierigkeitsstufen (Leicht/Mittel/Schwer): Optionen, Fragetypen, Akzente, Übersetzung, Prüfung, XP-Faktor.
- Überspringen: einzelne Frage, ganze Stadt, Einstufungstest, Freie Reise.
- Neuer Reiter „Polska“: Wer bin ich?, Wahr oder falsch, Zeitstrahl, Wo liegt das?, Höher oder tiefer, Literki, Polen in Zahlen.
- Joker (50:50, Tipp, +10 s, montags je 3), Survival-Modus, Rechtschreib-Modus mit typischen Fehlern und Regeln.

## 1.0 · 18.10.2026 · Erste Version

- Recherche zu Abbruchgründen (Studien, Blogs, Foren) und zu Stärken anderer Apps → Designprinzipien.
- Bestand aus GeoQuest, BIOGLOW und ARDOC geprüft, Übernahmen dokumentiert (`docs/UEBERNAHME.md`).
- 12 Städte auf einer Polenkarte, je Thema, Wörter, Sätze, Szene, Tipp, Kann-Satz, Postkarten-Fakt.
- 10 Stadtmodi, 10 übergreifende Modi, Familienduell, eigene Wörter.
- Wochenziel, Wochen-Serie, frischer Start am Montag, Vergleich mit der Vorwoche, Postkarten, Krasnale.
- DE/EN als Basissprache, Hell/Dunkel, PWA offline, Backup per Text.
- Checks (Syntax, Inhalt, Features, Safety, A11y, Kontrast, Größe), 14 Logik-Tests, Browser-Test mit 34 Prüfungen.

### Nachtrag 18.10.2026

- GeoQuest-Tests nachgezogen: `serve_local.bat`, `checks/i18n_check.mjs`, Options-Qualität im Browser-Test (jetzt 35 Prüfungen).
- `docs/HANDY_TEST.md`: WLAN-Test, Grenzen ohne HTTPS, Testliste.
- Deploy-Ziel arndt-software.de festgelegt.

### Beim Testen gefunden und behoben

- Satz „Rachunek, proszę.“ hatte nur 2 Wörter und taugte nicht für den Satzbau → ersetzt durch „Czy mogę zapłacić kartą?“ (gefunden von `content_check.py` und `core.test.js`).
- Safety-Heuristik meldete harmlose Zeilen → auf echte Gefahr (Eingabewert direkt in `innerHTML`) geschärft; echter XSS-Test läuft im Browser-Test.
- Browser-Test behandelte Memory-Karten als Antwortknöpfe → Reihenfolge im Test korrigiert.
