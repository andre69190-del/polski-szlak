# Polski Szlak – Test auf dem Handy im WLAN

## So geht's (2 Minuten)

1. Ordner `PolskiSzlak` nach `Desktop\Cowork` entpacken.
2. Doppelklick auf **`serve_local.bat`**. Das Fenster zeigt die Adresse, z. B. `http://192.168.178.23:8788`.
3. Fragt die Windows-Firewall: **„Private Netzwerke“ erlauben**.
4. Handy im selben WLAN, Adresse im Browser öffnen. Fertig.

Voraussetzung: Python ist installiert (wie bei GeoQuest).

## Was im WLAN-Test geht und was nicht

Über `http://` (ohne s) behandeln Browser die Seite als „unsicher“. Deshalb:

| Funktion | WLAN (http) | Live auf arndt-software.de (https) |
|---|---|---|
| Alle Spielmodi, Karte, Szenen, Album | ✓ | ✓ |
| Fortschritt speichern | ✓ (pro Adresse getrennt) | ✓ |
| Sprachausgabe (Vorlesen) | ✓, wenn das Handy eine polnische Stimme hat | ✓ |
| Spracherkennung (Sprechen-Modus) | ✗ → automatisch Selbstbewertung | ✓ in Chrome/Android, Safari teils |
| Offline / „Zum Startbildschirm“ als App | ✗ | ✓ |

**Android-Trick, um auch Mikrofon und Offline im WLAN zu testen:** In Chrome `chrome://flags/#unsafely-treat-insecure-origin-as-secure` öffnen, `http://192.168.178.23:8788` (deine Adresse) eintragen, aktivieren, Chrome neu starten. Auf dem iPhone gibt es das nicht, dort erst nach dem Go-live.

**Polnische Stimme fehlt?** Android: Einstellungen → System → Sprache → Text-in-Sprache → Google-Sprachdienste → Sprachdaten installieren → Polski. iPhone: Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen → Polnisch.

## Testliste (einmal durchgehen)

- [ ] Onboarding: Basissprache, Warum, Wochenziel
- [ ] Warszawa: Neue Wörter, Szene, Satzbau, Schreiben mit ą/ę-Tasten
- [ ] Lautsprecher-Knopf und Schnecke (langsam) spielen Polnisch ab
- [ ] Stadtprüfung bestehen → Łódź freigeschaltet, Postkarte im Album
- [ ] Tagesrätsel → „Ergebnis kopieren“ und in WhatsApp einfügen
- [ ] Familienduell mit 2 Namen
- [ ] Meine Wörter: 4 eigene anlegen und üben
- [ ] Hoch- und Querformat, Hell und Dunkel (Ich → Darstellung)
- [ ] Seite schließen, neu öffnen → Fortschritt noch da
- [ ] Englisch als Basissprache (Ich → Einstellungen)

Fehler gefunden? Kurz beschreiben (Modus, Stadt, was passiert ist), dann behebe ich es in `src/` und `bash checks/run_all.sh --ui` prüft, dass nichts anderes kaputtgeht.

## Automatische Tests auf dem PC

```bash
bash checks/run_all.sh          # Build + statische Checks + Logik-Tests (Python 3 + Node)
bash checks/run_all.sh --ui     # + Browser-Test, einmalig vorher:
                                #   pip install playwright
                                #   python -m playwright install chromium
```
Unter Windows in Git Bash ausführen (wie bei BIOGLOW).
