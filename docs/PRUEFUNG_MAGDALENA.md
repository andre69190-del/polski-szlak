# Gegenlesen durch Magdalena (Muttersprachlerin, Kraków)

## Für Andre: so geht's los

1. Magdalena diesen Link schicken: **https://polski.arndt-software.de/?review**. Er funktioniert am Handy oder Laptop, ohne Konto. Die Oberfläche ist komplett Polnisch.
2. Sie startet automatisch mit **„Najpierw: Szlak 2, 3 i pakiety“**. Das sind die Inhalte, die noch niemand geprüft hat. Szlak 1 kommt danach.
3. Pro Eintrag tippt sie „✓ Poprawne“ oder „✗ Do poprawy“ und schreibt kurz, wie es richtig heißt. Es geht automatisch weiter.
   - Fortschritt bleibt auf ihrem Gerät gespeichert.
   - Ohne Netz wird später gesendet.
   - 10 Minuten am Stück reichen völlig.
4. Auswerten (Andre oder ich):
   - Supabase Studio → Table Editor → `ps_feedback` → Export CSV.
   - Dann `python3 tools/review_report.py ps_feedback.csv`. Das ergibt eine Liste aller Korrekturen mit dem aktuellen Text. Die CSV kannst du mir auch einfach schicken, dann baue ich die Korrekturen ein.

Neue Inhalte (Szlak 3) bleiben als „Beta“ gekennzeichnet, bis Magdalena sie geprüft hat.

## Nachricht für Magdalena (zum Weiterleiten)

> Cześć Magda! Uczę się polskiego w aplikacji Polski Szlak, którą sam zbudowałem. Czy możesz czasem sprawdzić polskie teksty? To proste: otwórz ten link, przeczytaj zdanie i kliknij „✓ Poprawne” albo „✗ Do poprawy” (i napisz, jak powinno być). Najważniejsze: czy brzmi naturalnie, tak jak mówi się naprawdę w Polsce, a nie jak z podręcznika. Nawet 10 minut od czasu do czasu bardzo pomaga. Dziękuję! ❤️
> https://polski.arndt-software.de/?review

## Weitere Ideen mit Magdalena (Vorschläge)

- **Echte Stimme:** Magdalena spricht die wichtigsten Sätze ein, etwa die Szenen und die Lesetexte von Szlak 3. Die App spielt dann ihre Aufnahme statt der Computerstimme. Das ist schon vorbereitet (`data.json → audio`).
- **„Wie sagt man in Kraków?“:** kleine Karten mit Ausdrücken aus Kraków und Małopolska, die im Lehrbuch fehlen. Ein Beispiel ist „na polu“ statt „na dworze“.
- **Sprech-Mission mit ihr:** Pro Stadt gibt es eine Mission, die man nur mit einem echten Menschen erledigt, zum Beispiel „Erzähl Magda in 3 Sätzen von deinem Tag“. Sie bestätigt die Mission per Tipp.
