# Ergebnis der Prüfung durch Muttersprachler

- Prüfer:innen: Magdalena Arndt (5 Meldungen)
- Bestätigt (✓): **81** Einträge
- Zu korrigieren (✗): **0** Hinweise


Korrekturen bitte nur an derselben Position ändern (Fortschritts-Schutz, siehe docs/DATENSICHERUNG.md).

## Stand 03.11.2026

- Geprüft: Sopot komplett (30 Wörter, 9 Sätze, Szene) und Malbork (30 Wörter) – alles bestätigt, keine Korrektur.
- Offen im Bereich „Najpierw“: rund 1.680 von 1.765 Einträgen. Tempo laut Zeitstempeln: etwa 40 Einträge pro Minute.
- Die Einträge ohne Namen („?“, Text „Test“) stammten von den automatischen Tests (tests/ui_test.py) und werden nicht ausgewertet. Seit 03.11.2026 schicken die Tests nichts mehr an den Server.
- Aufräumen im Supabase Studio (SQL Editor):
  `delete from ps_feedback where ctx = 'review|?' or ctx like 'review|?|%';`
