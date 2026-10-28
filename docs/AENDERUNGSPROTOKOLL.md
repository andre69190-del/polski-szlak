# Polski Szlak – Änderungsprotokoll

## 3.2 · 28.10.2026 · Lernstände sind sicher

- Anforderung: Erreichte Ergebnisse dürfen nie verloren gehen (es gibt bereits Lernende). Details: docs/DATENSICHERUNG.md.
- **Automatische Sicherungen** auf dem Gerät (`polski_szlak_bak`): täglich (7 Tage), vor Update, Neustart, Zurückholen, erstem Abgleich; der beste Stand wird nie verdrängt.
- **Rettung beim Start:** kaputter/fehlender Stand → Reparatur (`C.repairSave`) oder beste Sicherung, nie still leer; Original bleibt in `polski_szlak_rescue`.
- **Zurückholen = Zusammenführen** (Sicherung, Datei, Text) – kann nichts überschreiben. Neu: „Als Datei speichern“ / „Datei laden“.
- **Speicher voll:** aktueller Stand geht vor, ältere Sicherungen werden gekürzt; Hinweis an den Nutzer. `navigator.storage.persist()`.
- **Zwei Tabs:** übernehmen den Fortschritt des anderen (storage-Ereignis) statt ihn zu überschreiben.
- **Fehler behoben:** Löschen eines eigenen Worts verschob den Fortschritt der folgenden eigenen Wörter.
- **Server:** `deploy/supabase_ps_progress_backup.sql` – Tages-Sicherung pro Konto (30 Tage), Rückschritt-Sperre (XP), Löschen entfernt auch Sicherungen. Lokal mit PostgreSQL 16 getestet.
- **Inhalte:** `checks/progress_lock.py` sperrt Stadt-IDs, Routen-Reihenfolge und Wort-Positionen. Alle Versionen 1.5–3.1.4 geprüft: verträglich.
- **Prüfmodus:** startet mit „Najpierw: Szlak 2, 3 i pakiety“; Auswertung `tools/review_report.py`.
- Tests: core 46, UI 94 (u. a. Spielstand aus 2.0, Update, kaputter Stand, Neustart zurückholen, Datei hin und zurück). Service Worker Cache v3-2.

## 3.1.4 · 28.10.2026 · Ton auf Apple (Ursache gefunden)

- Diagnose vom iPhone (iOS 18.7, installierte App): Stimme „Zosia“ gewählt, `start` und `ende` kommen, Dauer ca. 1 s – die Sprachausgabe läuft also, ist aber nicht zu hören.
- Ursache: Installierte Web-Apps laufen in der Audio-Sitzung „ambient“, die dem Stumm-Schalter folgt.
- **Fix:** `navigator.audioSession.type = 'playback'` (Safari 17+) vor jeder Ausgabe – Ton auch bei lautlos, wie bei Videos. Diagnose zeigt die Audio-Sitzung an. Service Worker Cache v3-1-4.

## 3.1.3 · 28.10.2026 · Ton auf Apple (zweiter Anlauf)

- Rückmeldung: Ton auf iPhone geht weiterhin nicht, „anfangs ging es“ (bis 2.0).
- **Stimmenwahl auf Apple wie bis 2.0:** erste polnische Stimme der Liste (Standardstimme des Systems) statt „System wählt“ (3.1.1) bzw. „beste Stimme“ (3.0). Eine unter Ich gewählte Stimme gilt auf Apple nur, wenn sie lokal ist.
- **Robuster gegen Safari-Eigenheiten:** `cancel()` nur, wenn wirklich etwas läuft, danach 80 ms warten; `resume()` bei pausierter Ausgabe; Satz-Objekte werden festgehalten; startet nach 1,5 s nichts, zweiter Versuch ohne feste Stimme.
- **Ton-Test mit Diagnose** (Ich → Stimme): Stimmenliste, gewählte Stimme, Status und Ablauf (start/ende/fehler) zum Abfotografieren.
- Mit nachgebautem iPhone (User-Agent + simulierte Sprachausgabe, auch „hängende“ Ausgabe) geprüft. Service Worker Cache v3-1-3.

## 3.1.2 · 28.10.2026 · Erst festigen, dann weiter

- Rückmeldung des Nutzers: Man kam in neue Städte, obwohl die Wörter der alten Stadt noch nicht vorkamen bzw. nicht gefestigt waren.
- **Reife-Bremse auf 100 %:** Die Stadtprüfung öffnet erst, wenn **alle** Wörter der Stadt gelernt sind und an zwei verschiedenen Tagen gesessen haben (`RIPE_SHARE = 1`). Vorzeitiges Starten mit Rückfrage entfällt (Hinweis statt Prüfung).
- **Weiter-Knopf:** führt immer zur ersten Stadt ohne bestandene Prüfung; übersprungene Städte zählen nicht mehr als geschafft.
- **Abfragen nur mit Bekanntem:** Quiz, Hören, Schreiben und Paare nutzen nur Wörter, die man schon kennengelernt hat; bei weniger als 4 geht es zuerst zu „Neue Wörter“.
- **Einstufungstest strenger:** 3 Fragen pro Stadt (1× Auswahl, 2× Schreiben), alle müssen stimmen.
- **Konto anlegen:** verständliche Meldung, wenn der Server keine Bestätigungs-Mail senden kann (vorher Zeitüberschreitung ohne Erklärung). Server-Einrichtung siehe docs/LIVE_GEHEN.md, Abschnitt 4b.
- **Mac:** Installationshinweis für Safari (Ablage → Zum Dock hinzufügen) und Chrome/Edge.
- Service Worker Cache v3-1-2.

## 3.1.1 · 28.10.2026 · Ton auf Apple-Geräten, „Was ist neu“

- **Behoben: kein Ton auf iPhone/iPad.** Die automatische Stimmenwahl aus 3.0 bevorzugte „verbesserte“ Stimmen; Apple listet im Browser auch nicht installierte Stimmen, die stumm bleiben. Auf Apple-Geräten wählt jetzt das System die polnische Stimme (nur `lang = pl-PL`), außer man wählt unter Ich → Stimme selbst. Zusätzlich Sicherheitsnetz: Bleibt eine Stimme stumm, wird sofort mit der Systemstimme wiederholt. Neue Option „Automatisch (empfohlen)“.
- **Neu: „Was ist neu“** (Ich → Was ist neu): Neuerungen aller Versionen in Alltagssprache (data.json → `news`). Nach einem Update erscheint einmal ein Hinweis auf der Startseite (`S.seenVer`), neue Nutzer sehen ihn nicht.
- KI-Funktion: Denk-Modelle (gpt-oss, qwen3) werden auf „wenig nachdenken“ gestellt, zweiter Versuch ohne JSON-Modus, Fehler landen in den Logs. Groq-Modell `openai/gpt-oss-120b` (llama-3.3 ist bei Groq nicht mehr verfügbar).
- 81 Browser-Prüfungen. Service Worker Cache v3-1-1.

## 3.1 · 28.10.2026 · KI-Gespräch (Beta), Fehlerbehebungen

- **KI-Gespräch (Beta):** Üben → KI-Gespräch und auf jeder Stadtseite. Rollenspiel zur Szene der Stadt (oder freies Gespräch), Niveau A1/A2 automatisch, Antworten werden vorgelesen, eigene Fehler werden korrigiert („Besser: …“ plus kurzer Tipp). Schreiben oder per Mikrofon sprechen. Nur mit Konto, Tageslimit pro Konto (Standard 40), keine Gesprächsinhalte gespeichert. Server: anbieterneutrale Supabase-Funktion `deploy/functions/ps-chat/index.ts` (OpenAI-kompatibel: Groq, Gemini, Mistral …), Zähler `deploy/supabase_ps_chat.sql`. Einrichtung: `docs/KI_GESPRAECH.md`. Bis dahin zeigt die App „wird gerade eingerichtet“.
- **Fehler behoben:** Eine offene Einführungs-Tour konnte über einem gerade gestarteten Spiel liegen bleiben und Antworten blockieren (im GitHub-Check aufgefallen). Prüfmodus: Rückmeldungen wurden vom Server abgelehnt (Sprache „pl“ war in `ps_feedback` nicht erlaubt), jetzt korrekt.
- **B1-Weg:** Vorschlag in `docs/ROADMAP_B1.md`.
- GitHub Actions auf aktuelle Versionen (Node 24). Datenschutz um das KI-Gespräch ergänzt. 78 Browser-Prüfungen. Service Worker Cache v3-1.

## 3.0 · 28.10.2026 · Szlak 2 (A2), Themen, Konjugation

- **Szlak 2 (A2):** zwölf neue Orte von Sopot bis Karpacz (Sopot, Malbork, Giżycko, Olsztyn, Płock, Częstochowa, Sandomierz, Ustrzyki Górne, Przemyśl, Tarnów, Opole, Karpacz), je **30 Wörter**, 9 Sätze, eine Szene, Grammatik-Tipp, Fakt, Mission und Regionalradio. Alltagsthemen: Urlaub erzählen, Sehenswürdigkeiten, **beim Arzt**, Wohnung, Verabredungen, Post/Bank/Amt, Meinung und Gefühle, Wandern und Notfall, Telefonieren, Restaurant und Kochen, Feste, Hobbys. Grammatik: Vergangenheit, Zukunft, Aspekt, Lokativ, Instrumental, Imperativ. Die Karte hat einen Umschalter Szlak 1 / Szlak 2. Wer Szlak 1 schon fertig hatte, bekommt Sopot automatisch frei.
- **Anias Postkarten:** Fortsetzung der Rahmengeschichte. Nach jeder Stadt auf Szlak 2 wird eine Karte lesbar (in der Vergangenheit erzählt), Finale auf der Śnieżka.
- **Themenpakete** (immer offen, nicht auf der Karte): Praxis-Polnisch (Physiotherapie, 40 Wörter), Notfall & Sicherheit, Kleine Wörter, Die 40 wichtigsten Verben.
- **Nach Thema:** Alle Lektionen aus Szlak 1, Szlak 2 und den Paketen nach Alltagsthemen gebündelt (z. B. Arztbesuch = Wrocław + Giżycko + Praxis + Notfall), mit „Neue Wörter“ und „Thema üben“. Gesperrte Städte lassen sich zum Lernen „trotzdem öffnen“, die Reihenfolge auf dem Szlak bleibt. Der Fortschritt zählt in beiden Ansichten.
- **Wortschatz:** 218 → **728 Wörter**, 108 → 252 Sätze.
- **Konjugations-Trainer** (Üben): 40 Verben, Gegenwart und Vergangenheit, nach Verbklassen, mit Verbtabellen zum Nachschlagen.
- **Sprecherform:** „Ich spreche als Mann / Frau“ (Onboarding und Ich). Inhalte schreiben Formen als {byłem|byłam}; die App zeigt die passende, beim Antworten gelten beide.
- **Aussprache je Wort:** Bei der Spracherkennung werden erkannte Wörter grün und fehlende rot markiert.
- **Prüfmodus für Muttersprachler:** polski.arndt-software.de/?review – alle polnischen Inhalte nacheinander mit ✓ / ✗ und Vorschlag (komplett auf Polnisch), Ergebnisse in ps_feedback. Link zum Teilen unter Ich.
- **Wochenrückblick** am Wochenanfang (Lerntage, neue und neu sichere Wörter, Vergleich zur Vorwoche, die 3 kniffligsten Wörter üben).
- **Kalender-Erinnerung:** wiederkehrender Termin als .ics-Datei für den eigenen Kalender (keine Push-Nachrichten).
- **Stimmen:** beste polnische Stimme wird automatisch gewählt, eigene Wahl unter Ich, Anleitung falls keine polnische Stimme installiert ist.
- **Technik:** Schriften selbst gehostet (keine Verbindung zu Google mehr); „Dla Polaków“ wird erst beim Öffnen geladen (data-polacy.json, danach offline); Duell-Code bleibt kompatibel (nur Szlak 1); GitHub Actions führt bei jedem Push alle Checks und den Browser-Test aus; Reife-Bremse vor der Stadtprüfung (8 von 10 Wörtern an zwei Tagen). 45 Logik-Tests, 72 Browser-Prüfungen. Service Worker Cache v3-0.

## 2.0 · 20.10.2026 · Alle Vorschläge umgesetzt

- **Mini-Missionen (H):** pro Stadt eine freiwillige Aufgabe im echten Leben (z. B. Warschau: „Dzień dobry! Dziękuję!“). Abhaken gibt einmalig +15 XP und Konfetti, danach Abzeichen „Mission erledigt“.
- **Echtes Polnisch hören (I):** in jeder Stadt ein Link zum Regionalradio (Polskie Radio, Radio Łódź … Radio Wrocław); unter „Polska“ fünf ausgewählte Hörangebote (Easy Polish, Real Polish, PolishPod101, TVP VOD, Mówiąc Inaczej). Externe Seiten öffnen in neuem Tab.
- **Fehler melden (J):** unter jeder Antwort und unter „Ich“. Speichert Text, Übung, Sprache und Version in `ps_feedback` (Supabase, nur Einfügen, kein Lesen über die API). Klappt das nicht, wird der Text kopiert und eine Mail-Adresse angezeigt. SQL: `deploy/supabase_ps_feedback.sql`.
- **Teilen (K):** Tagesrätsel, bestandene Stadtprüfung und Brief-Quiz über das Teilen-Menü des Geräts (sonst kopieren).
- **Muttersprachler-Aufnahmen (L):** Infrastruktur fertig (`data.json` → `audio`, Ordner `audio/`, Anleitung `docs/AUDIO_AUFNAHMEN.md`); noch keine Aufnahmen. Neu: „Mich aufnehmen und vergleichen“ in Sprechübungen (bleibt im Browser).
- **Verb-Aspekt (M):** neue Übung unter „Üben“, 16 Lückensätze vollendet/unvollendet mit Erklärung.
- **Google (N):** besserer Titel, Beschreibung, canonical, Open Graph, JSON-LD, ausführliches `<noscript>`, `robots.txt`, `sitemap.xml`.
- **Extras:** Konfetti bei Erfolgen (aus bei „Bewegung reduzieren“), Offline-/Abgleich-Anzeige im Kopf, einmalige Einführungs-Tour (unter „Ich“ wiederholbar).
- **Der Brief, Abschluss:** Szymek begrüßt am Anfang jeder Stadt-Szene mit seinem Ausblick (in Warschau: der Prolog); wenn alle 12 Sätze lesbar sind: „Brief selbst lesen“, 10 Verständnisfragen ohne Übersetzung.
- Datenschutz ergänzt (Fehler melden, Aufnahme, externe Links). core.js `mergeSave`: missions, tour, letterQuiz. 37 Tests, check_features +14, content_check prüft die neuen Daten, check_syntax prüft JSON-LD. Service Worker Cache v1-11.

## 1.9 · 19.10.2026 · Der Brief

- **Rahmengeschichte „Der Brief“:** Szymek, ein Krasnal-Briefträger aus Wrocław, bringt einen Brief auf Polnisch von Ania. Am Anfang ist er unlesbar (verschwommen); nach jeder geschafften Stadtprüfung (oder übersprungenen Stadt) wird ein Satz lesbar, 12 Sätze für 12 Städte.
- **Startseite:** Karte „✉ Der Brief“ mit Fortschritt (n/12) und dem Abzeichen „Neu im Brief“, sobald ein neuer Satz lesbar ist. Knopf „Brief lesen“.
- **Briefseite:** Szymeks Einleitung, alle Sätze mit Vorlesen und Übersetzung, gesperrte Sätze mit „lesbar nach Stadt“, neue Sätze rot markiert. Wenn alles lesbar ist: Finale am Bahnhof Wrocław Główny.
- **Ergebnis der Stadtprüfung:** Beim ersten Bestehen erscheint der neue Satz mit Übersetzung und Szymeks Ausblick auf die nächste Stadt.
- core.js: `letterRead`; `mergeSave` führt `letterSeen` zusammen. 36 Tests. content_check prüft den Brief. Service Worker Cache v1-10.
- Hinweis: Die polnischen Briefsätze sollten von einer Muttersprachlerin / einem Muttersprachler gegengelesen werden.

## 1.8 · 19.10.2026 · Weiter-Knopf, Ausblick, Willkommen zurück

- **Zur Startseite:** Das Logo „Polski Szlak“ oben ist jetzt überall ein Knopf zur Startseite (auch mitten im Spiel). Der erste Knopf unten heißt „Start“ statt „Szlak“.
- **Weiter-Knopf (Lesezeichen):** Auf der Startseite steht oben „Weiter auf dem Szlak: Stadt · Schritt“. Ein Tipp startet genau den nächsten offenen Schritt (Neue Wörter → Szene → Quiz → Sätze bauen → Stadtprüfung). Darunter „Als Nächstes: …“ und „Stadt ansehen →“. Auf der Stadtseite trägt die nächste Kachel das Abzeichen „Als Nächstes“.
- **Ausblick am Rundenende:** Nach jeder Runde zeigt ein Kasten „Als Nächstes · Stadt“ mit einem kurzen Einstieg in die nächste Szene und dem Knopf „Weiter →“ (Hemingway-Effekt: aufhören, wenn man weiß, wie es weitergeht).
- **Willkommen zurück:** Nach 7 oder mehr Tagen Pause erscheint einmal ein freundlicher Kasten ohne Vorwurf: „5 Wörter auffrischen“ (die 5 schwächsten bekannten Wörter) oder „Später“.
- **Das kann ich schon** (Tab Ich): Wörter sicher, Gespräche, geschaffte Städte, alle erreichten Kann-Sätze und was als Nächstes kommt.
- **Antwortart beim ersten Start:** Schreiben, Sprechen oder Antippen gleich im Onboarding wählen.
- Text „Über die App“ korrigiert: Ohne Konto bleibt alles auf dem Gerät, mit Konto wird abgeglichen.
- core.js: `daysSince`, `nextStep`; `mergeSave` führt auch die erledigten Schritte zusammen. 35 Tests. Service Worker Cache v1-9.

## 1.7 · 19.10.2026 · Geräte-Abgleich mit Konto

- **Geräte-Abgleich (freiwillig):** Unter **Ich → Geräte-Abgleich** mit E-Mail und Passwort anmelden oder ein Konto anlegen. Danach ist der Fortschritt auf Handy, Tablet und Laptop gleich. Es ist dasselbe Konto wie bei GeoQuest: das eigene Supabase (`supabase.arndt-software.de`), Tabelle `ps_progress` mit einer Zeile pro Konto (RLS, nur die eigene Zeile). SQL: `deploy/supabase_ps_progress.sql`.
- **Zusammenführen statt Überschreiben** (`mergeSave` in core.js): XP und Städte als Maximum, je Karte der Stand mit mehr Übung, Bestwerte als Maximum, eigene Wörter vereint, Krasnale/Szenen vereint. So geht auf keinem Gerät etwas verloren. Neuer Test (jetzt 33).
- Abgleich beim Start, beim Zurückkehren in die App, wenn das Netz wieder da ist, und 4 s nach jeder Änderung. Offline geht alles weiter wie bisher.
- Bestätigungs- und Passwort-Mails führen zurück in die App (Anmeldung wird übernommen, bei „Passwort vergessen“ erscheint das Feld für ein neues Passwort). „Abmelden“ und „Meine Daten vom Server löschen“ (mit Rückfrage).
- Beim ersten Start: Knopf „Schon ein Konto? Anmelden und Fortschritt laden“.
- Der alte Text-Export ist jetzt zugeklappt („Ohne Konto: Spielstand als Text übertragen“), mit dem richtigen Knopftext „Text kopieren“.
- Datenschutz um den Abschnitt „Geräte-Abgleich“ ergänzt. Service Worker (Cache v1-8) fragt Supabase nie aus dem Cache ab. Sicherheits-Check erlaubt Netzwerk nur zum eigenen Supabase und prüft, dass nur der öffentliche anon-Schlüssel im Code steht.

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
