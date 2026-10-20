# Muttersprachler-Aufnahmen einbinden (Vorschlag L)

Die App kann echte Aufnahmen abspielen. Solange keine da sind, liest die Stimme des Geräts vor (wie bisher).

## So geht es

1. **Aufnehmen lassen:** eine polnische Muttersprachlerin / ein Muttersprachler spricht Wörter und Sätze ein, am besten ruhig, deutlich, normales Tempo. Ein Satz = eine Datei.
2. **Format:** MP3 (oder M4A), mono, 64–96 kbit/s, Stille am Anfang und Ende abschneiden. Dateinamen ohne Polnisch-Sonderzeichen, z. B. `audio/waw/dzien-dobry.mp3`.
3. **Ablegen:** im Ordner `audio/` (wird mit dem Docker-Image ausgeliefert).
4. **Eintragen:** in `src/data.json` im Block `"audio"`, Schlüssel ist genau der polnische Text, wie er in der App steht:

        "audio": {
          "Dzień dobry": "audio/waw/dzien-dobry.mp3",
          "Dziękuję bardzo.": "audio/waw/dziekuje-bardzo.mp3"
        }

5. `python -I build.py`, Checks laufen lassen, committen und pushen.

## Hinweise

- Bei „Langsam“ (Schnecke) und bei eingeschaltetem langsamen Vorlesen nimmt die App weiterhin die Gerätestimme, weil sie das Tempo regeln kann.
- Rechte klären: Die sprechende Person muss der Veröffentlichung zustimmen (schriftlich, mit Namen für das Impressum, falls gewünscht).
- Zusätzlich gibt es bei Sprechübungen den Knopf **„Mich aufnehmen und vergleichen“**: Die eigene Aufnahme bleibt nur im Browser (wird nicht hochgeladen) und wird direkt nach dem Abspielen verworfen; danach spricht das Vorbild.
