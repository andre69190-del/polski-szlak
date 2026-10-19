# Polski Szlak – Qualitäts-Checks

Übernommen und angepasst aus BIOGLOW (`checks/`) und GeoQuest (`verify.py`, `validate_content.py`). Nur Python 3, Node und Bash nötig.

```bash
bash checks/run_all.sh        # Build + alle statischen Checks + Logik-Tests
bash checks/run_all.sh --ui   # zusätzlich Browser-Test (Playwright + Chromium)
```

| Skript | Prüft |
|---|---|
| `check_syntax.mjs` | JS-Syntax aller Script-Blöcke, `ps-data` ist gültiges JSON |
| `i18n_check.mjs` | DE/EN haben dieselben Schlüssel, jeder benutzte Text ist übersetzt (aus GeoQuest `i18n_test.js`) |
| `content_check.py` | Inhalte: Felder vollständig und zweisprachig, keine Dubletten, gültige Zeichen, Sätze baubar, Szenen mit richtiger und falscher Option, Fälle stimmig |
| `check_features.sh` | Alle 34 Kernfunktionen im Build vorhanden |
| `safety_check.py` | Kein eval, keine Schlüssel, kein Netzwerkaufruf, Eingaben nicht direkt in HTML |
| `a11y_check.py` | lang, Fokus, Reduced Motion, aria-Labels, Touch-Ziele, Tastatur auf der Karte |
| `contrast_check.py` | WCAG-Kontrast für 11 Farbpaare in Hell und Dunkel |
| `perf_check.py` | `index.html` unter 400 KB |
| `../tests/core.test.js` | 14 Logik-Tests (Antworten, Zahlen, Złoty, SRS, Wochen, Seeds, XP, Backup) |
| `../tests/ui_test.py` | 35 Browser-Prüfungen: jeder Modus komplett, keine doppelten Optionen, XSS, Speichern, Handy-Breite, EN, Dark Mode |

Jeder Check endet mit Exit-Code 0 (bestanden) oder 1 (Befund) – CI-tauglich.
