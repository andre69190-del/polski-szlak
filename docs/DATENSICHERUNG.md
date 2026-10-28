# Polski Szlak – Lernstände sind sicher (ab 3.2)

Ziel: Bereits erreichte Ergebnisse dürfen **nie** verloren gehen, auch nicht durch ein Update, einen Fehler oder ein verlorenes Handy.

## Sechs Schutzschichten

| # | Schicht | Wo | Was sie abfängt |
|---|---|---|---|
| 1 | **Speichern bei jeder Antwort** | Gerät (localStorage) | Absturz, App schließen |
| 2 | **Automatische Sicherungen** | Gerät (`polski_szlak_bak`) | Fehler in einer neuen Version, versehentlicher Neustart. Eine pro Tag (7 Tage), vor jedem Update, vor Neustart, vor Zurückholen und vor dem ersten Abgleich. Der Stand mit dem meisten Fortschritt wird nie gelöscht. |
| 3 | **Rettung beim Start** | Gerät | Kaputter oder fehlender Spielstand: wird repariert oder aus der besten Sicherung geladen, nie still durch einen leeren ersetzt. Das Original bleibt unter `polski_szlak_rescue` liegen. |
| 4 | **Zurückholen = Zusammenführen** | App → Ich → „Dein Fortschritt ist sicher“ | Zurückholen (Sicherung, Datei, Text) fügt nur hinzu, was fehlt. Es kann nichts überschrieben werden. Dazu kommen „Als Datei speichern“ und „Datei laden“. |
| 5 | **Konto (Geräte-Abgleich)** | Server `ps_progress` | Verlorenes Handy, neues Gerät. Stände werden zusammengeführt (Maximum), zwei offene Tabs übernehmen gegenseitig den Fortschritt. |
| 6 | **Server-Sicherung** | Server `ps_progress_history` | Tages-Sicherung pro Konto (30 Tage). Ein Update mit weniger XP wird vom Server abgelehnt. |

Dazu fordert die App beim Browser „dauerhaften Speicher“ an (`navigator.storage.persist`), damit er den Stand nicht bei Platzmangel löscht.

## Schutz bei neuen Inhalten (für die Entwicklung)

Fortschritt hängt an IDs: Wortkarte = `Stadt-ID:Position`, Prüfungen und Szenen = Stadt-ID, Freischaltung = Reihenfolge der Route.
`checks/progress_lock.py` (läuft in `run_all.sh` und in GitHub Actions) verhindert:

- dass Städte entfernt oder umbenannt werden,
- dass die Reihenfolge der Route geändert wird (neue Städte nur hinten),
- dass Wörter gelöscht oder umsortiert werden (neue Wörter nur hinten anhängen; Rechtschreibkorrekturen sind erlaubt).

Neue Inhalte übernimmt man mit `python3 checks/progress_lock.py --update`.
Geprüft am 28.10.2026: Alle Versionen von 1.5 bis 3.1.4 sind zueinander verträglich, kein Wort hat seine Position gewechselt.

`tests/ui_test.py` prüft zusätzlich:

- Ein Spielstand aus 2.0 lädt vollständig.
- Vor einem Update wird gesichert.
- Ein kaputter Stand wird gerettet.
- Ein Neustart lässt sich zurückholen.
- Sicherung per Datei hin und zurück funktioniert.
- Beim Löschen eigener Wörter bleibt der Fortschritt der anderen Wörter richtig zugeordnet.

## Einmal auf dem Server einrichten (Andre, ca. 3 Minuten)

1. Supabase Studio öffnen: https://supabase.arndt-software.de → **SQL Editor** → **New query**.
2. Den kompletten Inhalt von `deploy/supabase_ps_progress_backup.sql` hineinkopieren und **Run** drücken.
3. Erwartet: „Success. No rows returned“. Die Meldungen „does not exist, skipping“ sind normal.

Empfohlen zusätzlich: In **Coolify → Supabase-Dienst → Datenbank (supabase-db) → Backups** eine tägliche Sicherung einschalten. Wo der Punkt im Menü steht, hängt von der Coolify-Version ab; wenn er fehlt, kurz Bescheid geben.

## Wenn doch einmal jemand Fortschritt vermisst

1. In der App: **Ich → Dein Fortschritt ist sicher → Automatische Sicherungen → Zurückholen**.
2. Mit Konto: **Ich → Jetzt abgleichen**.
3. Server (Studio, SQL): siehe Kommentar am Ende von `deploy/supabase_ps_progress_backup.sql`.
