# Magdalena hilft bei Polski Szlak – Anleitung

Zwei Aufgaben, beide freiwillig und in kleinen Portionen:

- **A. Gegenlesen**: Texte prüfen, am Handy, ab sofort möglich.
- **B. Einsprechen**: Szenen und Buchkapitel aufnehmen, nach Aufgabe A.

---

## A. Gegenlesen (Prüfmodus)

**Warum:** Alle Texte von Szlak 2 und 3 hat eine KI geschrieben. Sie sind grammatisch meist korrekt, klingen aber manchmal nach Lehrbuch statt nach echtem Polnisch.

**So geht es:**

1. Link öffnen, am Handy oder Laptop: **https://polski.arndt-software.de/?review**. Man braucht kein Konto, die Oberfläche ist auf Polnisch.
2. Oben einmal den Vornamen eintragen („Magda“). So ist klar, von wem die Hinweise kommen.
3. Die App beginnt automatisch mit **„Najpierw: Szlak 2, 3 i pakiety“**. Das ist der Teil, den noch niemand geprüft hat. Die Abschnitte oben lassen sich frei wählen, zum Beispiel „Książka (Szlak 3)“ für die Buchkapitel.
4. Bei jedem Eintrag stehen der polnische Text, darunter die deutsche und englische Übersetzung und ein Lautsprecher-Knopf.
   - **„✓ Poprawne“**: Der Text ist richtig und klingt natürlich. Es geht direkt weiter.
   - **„✗ Do poprawy“**: Kurz hineinschreiben, wie man es richtig oder natürlicher sagt, dann „Wyślij uwagę“.
   - **„Pomiń“**: überspringen, wenn sie unsicher ist.
   - **„↶ Cofnij ostatnie“**: den letzten Klick rückgängig machen.
5. Aufhören kann sie jederzeit. Der Stand bleibt auf ihrem Gerät gespeichert, und beim nächsten Mal geht es an derselben Stelle weiter. Ohne Internet werden die Ergebnisse später gesendet.

**Worauf achten (Wichtigkeit von oben nach unten):**

1. **Natürlichkeit:** Würde man das in Polen wirklich so sagen? Das ist das Wichtigste.
2. **Grammatik und Rechtschreibung**, auch die polnischen Buchstaben.
3. **Szenen:** Passt die richtige Antwort zur Situation? Die falschen Antworten sollen korrektes Polnisch sein, das nur nicht passt. Das steht auch beim Eintrag.
4. **Formen in Klammern**, zum Beispiel {byłem|byłam}: Die App zeigt die männliche und die weibliche Form. Beide prüfen.
5. **Die deutsche Übersetzung nur grob prüfen:** Passt die Bedeutung? Die englische Übersetzung kann sie ignorieren.

**Umfang:** 10–15 Minuten am Stück sind ideal. Lieber öfter kurz als einmal lang. Am wichtigsten ist Szlak 3 („Książka“ und die Orte von Jelenia Góra bis Wieliczka), dann Szlak 2.

**Danach (Andre oder Claude):** Supabase Studio → `ps_feedback` → Export als CSV. Andre schickt die Datei an Claude, und Claude baut alle Korrekturen ein. Der Fortschritt der Lernenden bleibt dabei erhalten, denn Korrekturen ändern nur den Text, nicht die Position.

---

## B. Einsprechen (Muttersprachler-Aufnahmen)

**Warum:** Eine echte Stimme aus Kraków ist für Szenen und Geschichten viel lebendiger als die Computerstimme. Für die über 1200 einzelnen Wörter reichen die Stimmen Gosia und Darek. Magdalena spricht nur, wo es am meisten bringt.

**Was, in dieser Reihenfolge:**

| Paket | Inhalt | Umfang | Aufnahmezeit ca. |
|---|---|---|---|
| 1 | Szenen Szlak 1 (Warszawa bis Wrocław): die Sätze der Gesprächspartner und die richtigen Antworten | ca. 90 Sätze | 15 Minuten |
| 2 | Buchkapitel „Klucz z Wieliczki“ (Szlak 3), 12 Kapitel × 9 Sätze | 108 Sätze | 15 Minuten |
| 3 | Szenen Szlak 2 und 3 | ca. 200 Sätze | 30 Minuten |
| 4 | optional: Beispielsätze der Städte | 360 Sätze | 45 Minuten |

Paket 2 erst einsprechen, wenn sie die Kapitel in Aufgabe A geprüft hat. Sonst wird ein Fehler mit aufgenommen.

**So geht es (nur Handy, keine Technik nötig):**

1. **Leselisten:** Claude erstellt pro Paket eine nummerierte Leseliste als Seite zum Ausdrucken oder zum Anzeigen auf einem zweiten Bildschirm. Darin steht ein Satz pro Zeile, Formen in Klammern sind bereits aufgelöst.
2. **Ort:** ein ruhiger Raum ohne Hall, zum Beispiel das Schlafzimmer, weil Vorhänge und Bett den Schall schlucken. Fenster zu, Fernseher aus.
3. **Handy:** etwa 20–30 cm vor den Mund, leicht seitlich, damit P- und B-Laute nicht ploppen. Am iPhone die App **„Sprachmemos“** nehmen. Unter Einstellungen → Sprachmemos → Audioqualität „Verlustfrei“ wählen, falls möglich.
4. **Pro Stadt oder Kapitel eine Aufnahme:**
   - Den Namen sagen, zum Beispiel „Warszawa“, dann **2 Sekunden Pause**.
   - Jeden Satz einmal sprechen, danach jeweils **2 Sekunden Pause**. Claude schneidet die Datei an diesen Pausen automatisch in einzelne Sätze.
   - Versprochen? Kein Problem: kurz Pause, den Satz noch einmal ganz sprechen und **„jeszcze raz“** davor sagen. Beim Schneiden wird die letzte Fassung genommen.
5. **Wie sprechen:** natürlich und freundlich, normales Alltagstempo, nicht übertrieben deutlich. In Szenen ruhig mit etwas Rolle: Kellnerin, Ärztin, Freundin. Bei Fragen die Stimme heben.
6. **Weitergeben:** Die Sprachmemos per AirDrop, WhatsApp („als Datei“) oder E-Mail an Andre schicken. Er legt sie in den Ordner `PolskiSzlak\_aufnahmen\` auf seinem Rechner.
7. **Danach (Claude):** schneiden, Lautstärke angleichen, Stille entfernen, in MP3 umwandeln, den Texten zuordnen und Stichproben anhören. In der App heißt die Stimme dann zum Beispiel „Magda (Kraków)“ und hat Vorrang vor Gosia und Darek.

**Zustimmung:** Weil ihre Stimme öffentlich in der App zu hören ist, braucht es eine kurze schriftliche Zustimmung, zum Beispiel per E-Mail: „Ich bin einverstanden, dass meine Aufnahmen in Polski Szlak veröffentlicht werden.“ Dazu kommt, ob ihr Vorname in der App und im Impressum stehen soll. Sie kann die Zustimmung jederzeit widerrufen, dann werden die Aufnahmen entfernt.

---

## Nachricht an Magdalena (zum Weiterleiten)

> Cześć Magda! Moja aplikacja do nauki polskiego potrzebuje Twojej pomocy – w dwóch krokach, w małych porcjach:
>
> **1. Sprawdzanie tekstów** (najpierw): otwórz https://polski.arndt-software.de/?review, wpisz swoje imię i klikaj: „✓ Poprawne” albo „✗ Do poprawy” (napisz krótko, jak powinno być). Najważniejsze: czy to brzmi naturalnie, tak jak się naprawdę mówi w Polsce. Tłumaczenie angielskie możesz pominąć. 10–15 minut od czasu do czasu wystarczy – aplikacja pamięta, gdzie skończyłaś.
>
> **2. Nagrania** (później): dostaniesz listę zdań. Nagraj je w „Dyktafonie” w telefonie – jedno miasto na jedno nagranie, po każdym zdaniu 2 sekundy przerwy. Jak się pomylisz, powiedz „jeszcze raz” i powtórz zdanie. Mów naturalnie, jak w rozmowie.
>
> Dziękuję! ❤️
