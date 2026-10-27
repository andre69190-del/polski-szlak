# Polski Szlak

Polnisch lernen, Stadt für Stadt. Eine Reise über den „Szlak“ (polnisch: markierter Wanderweg) durch 24 Orte in zwei Etappen (Szlak 1 = A1, Szlak 2 = A2), dazu Themenpakete und eine Ansicht „Nach Thema“ – mit echten Gesprächen, kurzen Runden und ohne schlechtes Gewissen. Basissprache wahlweise **Deutsch** oder **Englisch**.

Warum nicht einfach Duolingo? Siehe [docs/KONZEPT_UND_RECHERCHE.md](docs/KONZEPT_UND_RECHERCHE.md).

## Schnellstart

- **Ausprobieren:** `index.html` im Browser öffnen. Fertig.
- **Auf dem Handy im WLAN:** `serve_local.bat` doppelklicken, angezeigte Adresse am Handy öffnen. Details: [docs/HANDY_TEST.md](docs/HANDY_TEST.md)
- **Nach einer Änderung:** `bash checks/run_all.sh` (Build + alle Checks + Tests)
- **Mit Browser-Test:** `bash checks/run_all.sh --ui` (braucht `pip install playwright && python3 -m playwright install chromium`)
- **Veröffentlichen auf arndt-software.de:** siehe [docs/DEPLOY.md](docs/DEPLOY.md)

## Was die App kann

**Die Reise:** Warszawa → Łódź → Poznań → Szczecin → Gdańsk → Toruń → Białystok → Lublin → Kraków → Zakopane → Katowice → Wrocław. Jede Stadt hat ein Thema, 18–19 Wörter, 4 Sätze, eine Szene, einen Grammatik-Tipp und einen „Danach kannst du …“-Satz. Die Stadtprüfung schaltet die nächste Stadt frei und bringt eine Postkarte mit echtem Fakt. Wer schon etwas kann, macht die Prüfung einer gesperrten Stadt direkt.

| Stadt | Thema |
|---|---|
| Warszawa | Erste Worte |
| Łódź | Das bin ich |
| Poznań | Zahlen und Preise (inkl. Złoty-Formen) |
| Szczecin | Im Café |
| Gdańsk | Familie |
| Toruń | Zeit und Tage |
| Białystok | Natur und Wetter |
| Lublin | Einkaufen und Farben |
| Kraków | In der Stadt (Wegbeschreibung) |
| Zakopane | Unterwegs (Zug, Hotel) |
| Katowice | Arbeit (Meetings, Projekte, Daten) |
| Wrocław | Körper und Gesundheit (inkl. Physiotherapie-Szene) |

**Szlak 2 (A2, ab 3.0):** Sopot (Urlaub erzählen) → Malbork (Sehenswürdigkeiten) → Giżycko (beim Arzt) → Olsztyn (Wohnung) → Płock (Verabredungen) → Częstochowa (Post, Bank, Amt) → Sandomierz (Meinung, Gefühle) → Ustrzyki Górne (Wandern, Notfall) → Przemyśl (Telefon, Termine) → Tarnów (Restaurant, Kochen) → Opole (Feste) → Karpacz (Hobbys, Erzählen). Je 30 Wörter. Rahmengeschichte: Anias Postkarten.

**Themenpakete:** Praxis-Polnisch (Physiotherapie) · Notfall & Sicherheit · Kleine Wörter · Die 40 wichtigsten Verben. **Nach Thema:** alle Lektionen nach Alltagsthemen gebündelt (z. B. Arztbesuch).

Insgesamt **728 Wörter**, 252 Sätze, 28 Szenen.

**Modi pro Stadt:** Neue Wörter · Szene · Quiz · Hören · Schreiben · Satzbau · Lückensatz · Paare · Sprechen · Stadtprüfung

**Übergreifend:** Konjugation (40 Verben) · Wiederholen (verteilte Wiederholung) · Tagesrätsel (teilbar) · Blitz 60 · Fall-Werkstatt (7 Fälle über Sätze) · Laut-Detektiv · Preise hören · Zungenbrecher · Familienduell · Fehlerheft · Meine Wörter

**Motivation ohne Druck:** Wochenziel statt Tages-Streak · Wochen-Serie · Lerntage gesamt (zählt nie runter) · „Wörter sicher“ · Montag = frischer Start · Du gegen dich letzte Woche · Postkarten · Krasnale (zufällige Sammelzwerge mit je einem neuen Wort) · keine Push-Nachrichten, keine Käufe

**Komfort:** Sprecherform Mann/Frau (byłem/byłam) · Aussprache je Wort · Stimmen-Auswahl · Kalender-Erinnerung · Wochenrückblick · Polnische Sonderzeichen-Tastatur · Akzente optional (oder streng mit doppelten XP) · Tippfehler-Toleranz · Sprachausgabe pl-PL, auch langsam · Spracherkennung wo verfügbar, sonst Selbstbewertung · Hell/Dunkel · offline als PWA · Backup per Text

## Ordner

```
polski-szlak/
├── index.html              ← generiert (NICHT von Hand bearbeiten)
├── build.py                ← einzige Build-Quelle
├── src/
│   ├── data.json           ← alle Lerninhalte
│   ├── core.js             ← reine Logik (testbar, ohne DOM)
│   ├── app.js              ← Oberfläche und Spielmodi
│   ├── app.css             ← Gestaltung (Tokens hell/dunkel)
│   └── shell.html          ← Gerüst mit Platzhaltern
├── checks/                 ← statische Prüfungen + run_all.sh
├── tests/                  ← Logik-Tests (node) + Browser-Test (Playwright)
├── sw.js · manifest.json · icon.svg
├── Dockerfile · deploy/    ← Coolify/Docker
└── docs/                   ← Konzept, Architektur, Übernahme, Deploy, Session-Starter, Protokoll
```

## Inhalte erweitern

Neue Wörter, Sätze oder eine neue Stadt kommen nur in `src/data.json`. Danach `bash checks/run_all.sh` – `content_check.py` meldet fehlende Übersetzungen, Dubletten, Szenen ohne richtige Antwort usw. Details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Vor einer Veröffentlichung

Die polnischen Inhalte von einer Muttersprachlerin gegenlesen lassen. Das ist der wichtigste offene Punkt. Dafür gibt es seit 3.0 den Prüfmodus: `https://polski.arndt-software.de/?review` (komplett auf Polnisch, Ergebnisse landen in `ps_feedback`).
