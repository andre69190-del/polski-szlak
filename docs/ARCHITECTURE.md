# Polski Szlak – Architektur

## In 30 Sekunden

```
src/data.json ─┐
src/core.js   ─┼─ build.py ──► index.html                    (Deploy, PWA)
src/app.js    ─┤             └► dist/polski_szlak_artifact.html (ohne PWA-Teile)
src/app.css   ─┤
src/shell.html ┘
```

- **Kein Framework, keine Abhängigkeiten.** Vanilla JS, eine Datei, ~140 KB.
- **Einzige externe Ressource:** Google Fonts (Bricolage Grotesque, Atkinson Hyperlegible). Ohne Netz greifen Systemschriften.
- **Daten bleiben auf dem Gerät** (`localStorage`, Schlüssel `polski_szlak_v1`).

## Dateien und Verantwortung

| Datei | Inhalt | Regel |
|---|---|---|
| `src/data.json` | Städte, Wörter, Sätze, Szenen, Fälle, Laute, Zungenbrecher, Krasnale, Umriss Polens | Nur hier Inhalte ändern |
| `src/core.js` | Reine Funktionen: Antwortprüfung, Zahlen/Złoty, Leitner-SRS, Datum/Woche, Zufall mit Seed, XP | **Kein DOM-Zugriff** – wird in Node getestet |
| `src/app.js` | Zustand, Rendering, alle Modi, Spiel-Engine | Benutzereingaben immer durch `esc()` |
| `src/app.css` | Tokens (hell/dunkel), Komponenten | Farben nur als Tokens |
| `src/shell.html` | `<title>`, Fonts, Platzhalter `/*CSS*/ /*DATA*/ /*CORE*/ /*APP*/ <!--PWA-->` | jeder Platzhalter genau einmal |

## Datenmodell (`src/data.json`)

```jsonc
{
  "outline": [[lon, lat], …],             // Umriss Polens, geschlossen
  "units": [{
    "id": "waw", "city": "Warszawa", "cityDe": "Warschau", "cityEn": "Warsaw",
    "lon": 21.01, "lat": 52.23,
    "trail": "red|blue|green|yellow|black", // Farbe der Wandermarkierung
    "title": [de, en], "can": [de, en], "tip": [de, en], "fact": [de, en],
    "words": [[pl, de, en], …],            // ≥ 15
    "sentences": [[pl, de, en], …],        // ≥ 3, mit Satzzeichen, ≥ 3 Wörter
    "scene": { "intro": [de,en], "outro": [de,en],
               "steps": [{ "npc": [pl,de,en], "opts": [[pl,de,en,1|0], …], "hint": [de,en] }] }
  }],
  "cases":    [{ "s": "Mam ___.", "base": "kot", "opts": [...], "a": "kota", "case": [de,en], "why": [de,en], "tr": [de,en] }],
  "sounds":   [{ "g": "cz", "de": …, "en": …, "ex": "czas", "exm": [de,en] }],
  "twisters": [[pl, de, en]],
  "krasnale": [[Name, pl, de, en]]
}
```

Alternativen im Wort mit ` / ` trennen (`"on / ona"`): beim Schreiben gilt jede Variante.

## Zustand (`localStorage`)

| Feld | Bedeutung |
|---|---|
| `base` | `de` oder `en` |
| `goal` | Wochenziel in Tagen (2–7) |
| `len` | Rundenlänge (6/10/15) |
| `xp`, `weekXp{Montag: xp}` | Punkte gesamt und je Woche |
| `cards{id: {box, due, seen, wrong}}` | Leitner-Karte je Wort (`waw:3`, `my:0` für eigene) |
| `active{YYYY-MM-DD: n}` | Lerntage (Grundlage für Wochenziel und Serie) |
| `unlocked`, `boss{id: %}`, `scenes{id}` | Reisefortschritt |
| `krasnale[]`, `mistakes[]`, `custom[]` | Sammlung, Fehlerheft, eigene Wörter |
| `daily{datum: {score, results}}` | Tagesrätsel |

## Lernlogik

- **Leitner-SRS:** Stufen 0–6, Abstände 0/1/2/4/8/16/32 Tage. Richtig = eine Stufe hoch; falsch = zurück auf 1 (bzw. 2 ab Stufe 3), morgen wieder fällig. „Sicher“ ab Stufe 4.
- **Antwortprüfung** (`checkAnswer`): exakt → richtig; nur Akzente fehlen → richtig mit Hinweis (strenger Modus: falsch); ein Tippfehler ab 5 Zeichen → richtig, halbe XP (streng: falsch).
- **Wochen-Serie** (`weekStreak`): zusammenhängende Wochen mit erfülltem Ziel. Die laufende Woche zählt erst, wenn erfüllt, bricht die Serie aber nie.
- **Lerntag:** eine abgeschlossene Runde mit ≥ 3 Antworten.
- **XP:** 10 pro richtige Antwort + Kombo-Bonus (2 je Folgetreffer, max. +10), strenger Schreibmodus ×2. Stufe n bei 50·n·(n+1) XP.
- **Tagesrätsel:** Zufall mit Seed `daily-YYYY-MM-DD` aus den freigeschalteten Städten.
- **Krasnal:** 30 % Chance nach einer Runde mit ≥ 5 Antworten, sicher nach bestandener Stadtprüfung.
- **Stadtprüfung:** 12 Fragen (8 gemischt, 2 Satzbau, 2 Lückensätze), 3 Leben, bestanden ab 60 % mit verbleibendem Leben.

## Spiel-Engine (`app.js`)

`startMode(mode, unitIndex)` baut eine Fragenliste und ruft `runGame(cfg)`. Fragetypen: `card`, `mc`, `type`, `build`, `speak`. Sonderabläufe: `runMatch` (Memory), `runScene` (Dialog), Familienduell über `cfg.players`; Państwa-Miasta als eigener Ablauf `startPM` → `pmPass` → `pmPlay` → `pmReview` → `pmScoreRound` (Daten in `D.pm`, Logik `pmLetterOk/pmKnown/pmScore` im Kern). `startMode` merkt sich den letzten Modus (`lastMode`), damit „Nochmal“ jeden Modus neu startet. `endGame()` bucht XP, Lerntag, Freischaltung, Postkarte und Krasnal und speichert.

Für Tests ist `window.PSApp = { state, startMode, go }` offen.

## Neue Stadt hinzufügen

1. Objekt in `units` ergänzen (Koordinaten, Szlak-Farbe, Inhalte zweisprachig).
2. `bash checks/run_all.sh` – `content_check.py` prüft alles.
3. Reihenfolge in `units` = Reihenfolge der Route auf der Karte.

## Qualitätssicherung

| Prüfung | Datei |
|---|---|
| JS-Syntax + JSON | `checks/check_syntax.mjs` |
| Inhalte | `checks/content_check.py` |
| Features im Build | `checks/check_features.sh` |
| Sicherheit/Datenschutz | `checks/safety_check.py` |
| Barrierefreiheit | `checks/a11y_check.py` |
| WCAG-Kontrast hell+dunkel | `checks/contrast_check.py` |
| Größe | `checks/perf_check.py` |
| Logik (29 Tests) | `tests/core.test.js` |
| Browser (34 Prüfungen, jeder Modus) | `tests/ui_test.py` |
