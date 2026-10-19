#!/bin/bash
# Polski Szlak – alle Checks und Tests nacheinander (Muster aus BIOGLOW checks/run_all.sh).
#   bash checks/run_all.sh            -> Build + statische Checks + Logik-Tests
#   bash checks/run_all.sh --ui       -> zusätzlich Browser-Test (braucht Python-Playwright + Chromium)
cd "$(dirname "$0")/.." || exit 1
rc=0
run() { echo ""; echo "############################################################"; echo "# $1"; echo "############################################################"; shift; "$@" || rc=1; }
run "Build"                    python3 build.py
run "JS-Syntax"                node    checks/check_syntax.mjs
run "Inhalte"                  python3 checks/content_check.py
run "i18n DE/EN"                node    checks/i18n_check.mjs
run "Feature-Verifizierung"    bash    checks/check_features.sh
run "Safety / Datenschutz"     python3 checks/safety_check.py
run "Barrierefreiheit"         python3 checks/a11y_check.py
run "WCAG-Kontrast"            python3 checks/contrast_check.py
run "Performance / Größe"      python3 checks/perf_check.py
run "Logik-Tests (core.js)"    node    --test tests/core.test.js
if [ "$1" = "--ui" ]; then run "Browser-Test (Playwright)" python3 tests/ui_test.py; fi
echo ""; echo "############################################################"
[ "$rc" -eq 0 ] && echo "# GESAMT: alles bestanden ✓" || echo "# GESAMT: mindestens ein Check meldet Befunde (siehe oben)"
echo "############################################################"
exit $rc
