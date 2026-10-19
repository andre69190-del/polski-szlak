#!/usr/bin/env python3
"""Browser-Test mit Playwright/Chromium (Idee aus ARDOC e2e/app.spec.js und GeoQuest smoke_test.js).

Spielt jeden Modus einmal komplett durch, prüft auf JS-Fehler, horizontales Scrollen am Handy,
Speichern in localStorage, Freischalten per Stadtprüfung und Dark Mode.
Aufruf: python3 tests/ui_test.py [--shots]    (Screenshots nach tests/shots/)
Voraussetzung: pip install playwright && python3 -m playwright install chromium
"""
import os, sys, pathlib
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
URL = (ROOT / 'index.html').as_uri()
SHOTS = '--shots' in sys.argv
SHOT_DIR = ROOT / 'tests' / 'shots'
fails, oks, OPTQ = [], [], []


def ok(m): oks.append(m); print('  [OK]', m)
def bad(m): fails.append(m); print('  [!!]', m)


def play_through(page, max_steps=150):
    """Klickt sich durch eine Runde (erste Option, falsche Eingaben) bis zum Ergebnis-Bildschirm."""
    for _ in range(max_steps):
        if page.locator('.result').count():
            return True
        if page.locator('#nx').count() and page.locator('#nx').is_visible():
            page.click('#nx'); continue
        if page.locator('[data-c]').count():  # Memory: Brute-Force-Paarsuche
            first = page.locator('[data-c]:not([disabled])').first
            fid = first.get_attribute('data-c'); first.click()
            n = page.locator('[data-c]').count()
            for j in range(n):
                if str(j) == fid: continue
                if page.locator(f'[data-c="{j}"]').is_disabled(): continue
                page.click(f'[data-c="{j}"]')
                if page.locator('.result').count() or page.locator(f'[data-c="{fid}"]').is_disabled(): break
                page.wait_for_timeout(480); page.click(f'[data-c="{fid}"]')
            continue
        if page.locator('.opt:not([disabled])').count():
            # Options-Qualität (aus GeoQuest option_quality_test.js): keine doppelten Optionen, mind. 2
            texts = [t.strip().lower() for t in page.locator('.opts .opt').all_inner_texts()]
            if len(texts) < 2: OPTQ.append(f'nur {len(texts)} Option(en): {texts}')
            if len(set(texts)) != len(texts): OPTQ.append(f'doppelte Option: {texts}')
            page.locator('.opt:not([disabled])').first.click()
            continue
        if page.locator('#ans:not([disabled])').count():
            page.fill('#ans', 'xyz'); page.click('#tf button.primary'); continue
        if page.locator('[data-in]:not(.used)').count():
            page.locator('[data-in]:not(.used)').first.click()
            if page.locator('#chk:not([disabled])').count(): page.click('#chk')
            continue
        if page.locator('#sg').count(): page.click('#sg'); continue
        if page.locator('#fin').count(): page.click('#fin'); continue
        if page.locator('[data-o]').count():
            page.locator('[data-o]').first.click(); continue
        page.wait_for_timeout(100)
    return page.locator('.result').count() > 0


with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, locale='de-DE')
    page = ctx.new_page()
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'fonts.g' not in m.text and 'ERR_' not in m.text else None)
    # Headless hat kein Mikrofon: Spracherkennung abschalten -> Selbstbewertung wird getestet
    page.add_init_script("window.SpeechRecognition = undefined; window.webkitSpeechRecognition = undefined;")
    page.goto(URL)
    page.wait_for_selector('#ob-go')
    ok('Onboarding sichtbar')
    if SHOTS: SHOT_DIR.mkdir(exist_ok=True); page.screenshot(path=str(SHOT_DIR / '01_onboarding.png'), full_page=True)
    page.click('#ob-why [data-v="travel"]'); page.click('#ob-goal [data-v="3"]'); page.click('#ob-go')
    page.wait_for_selector('.city-head')
    ok('Nach Onboarding: Stadt Warszawa')

    modes = ['learn', 'scene', 'quiz', 'listen', 'type', 'build', 'cloze', 'match', 'speak']
    for m in modes:
        page.evaluate(f"() => window.PSApp.startMode('{m}', 0)")
        done = play_through(page)
        (ok if done else bad)(f'Stadtmodus {m} durchgespielt')
        page.evaluate("() => window.PSApp.go('home')")

    for m in ['review', 'daily', 'cases', 'sounds', 'prices', 'twister', 'mistakes']:
        page.evaluate(f"() => window.PSApp.startMode('{m}')")
        if m == 'mistakes' and not page.locator('.game, .result').count():
            ok('Fehlerheft leer -> Hinweis'); continue
        done = play_through(page)
        (ok if done else bad)(f'Übungsmodus {m} durchgespielt')
        page.evaluate("() => window.PSApp.go('home')")

    page.evaluate("() => window.PSApp.startMode('blitz')")
    page.wait_for_timeout(1500)
    page.evaluate("() => { for (let i=0;i<3;i++){ const o=document.querySelector('.opt:not([disabled])'); if(o) o.click(); } }")
    ok('Blitz startet mit Timer') if page.locator('#timer').count() else bad('Blitz ohne Timer')
    page.click('#quit')

    # Familienduell
    page.evaluate("() => window.PSApp.go('practice')")
    page.click('[data-mode="duel"]'); page.click('#dgo')
    done = play_through(page)
    (ok if done and page.locator('.result h2').count() else bad)('Familienduell mit Sieger/Unentschieden')
    page.evaluate("() => window.PSApp.go('home')")

    # Meine Wörter
    page.evaluate("() => window.PSApp.go('practice')"); page.click('[data-mode="mywords"]')
    for pl, de in [('kręgosłup', 'Wirbelsäule'), ('mięsień', 'Muskel'), ('staw', 'Gelenk'), ('rozciąganie', 'Dehnen')]:
        page.fill('#mw-pl', pl); page.fill('#mw-m', de); page.click('#mw-add')
    n = page.locator('[data-del]').count()
    (ok if n == 4 else bad)(f'Eigene Wörter angelegt ({n})')
    page.click('#mw-practice'); (ok if play_through(page) else bad)('Eigene Wörter geübt')

    # XSS-Schutz: Spielername mit HTML
    page.evaluate("() => window.PSApp.go('practice')"); page.click('[data-mode="duel"]')
    page.fill('#p0', '<img src=x onerror="window.__xss=1">'); page.click('#dgo')
    page.wait_for_timeout(200)
    (bad if page.evaluate("() => window.__xss === 1") else ok)('Spielername wird escaped (kein XSS)')
    page.click('#quit')

    # Stadtprüfung: Durchlauf bis zum Ergebnis, danach Freischalt-Darstellung auf der Karte
    page.evaluate("() => window.PSApp.startMode('boss', 0)")
    done = play_through(page)
    (ok if done else bad)('Stadtprüfung läuft bis zum Ergebnis')
    page.evaluate("""() => { const s = window.PSApp.state(); s.boss = {waw: 90}; s.unlocked = 1; }""")
    page.evaluate("() => window.PSApp.go('home')")
    (ok if page.locator('.node.done').count() == 1 and page.locator('.node.next').count() == 1 else bad)('Karte zeigt erledigte und nächste Stadt')

    # Speichern
    saved = page.evaluate("() => localStorage.getItem('polski_szlak_v1') !== null")
    (ok if saved else bad)('Fortschritt in localStorage gespeichert')
    page.reload(); page.wait_for_selector('.map')
    xp = page.evaluate("() => window.PSApp.state().xp")
    (ok if xp > 0 else bad)(f'Fortschritt nach Neuladen erhalten ({xp} XP)')

    # Horizontal-Scroll am Handy auf allen Hauptseiten
    for t in ['home', 'practice', 'album', 'me']:
        page.evaluate(f"() => window.PSApp.go('{t}')")
        w = page.evaluate("() => document.documentElement.scrollWidth - document.documentElement.clientWidth")
        (ok if w <= 0 else bad)(f'Kein horizontales Scrollen auf {t} (390px)')
        if SHOTS: page.screenshot(path=str(SHOT_DIR / f'02_{t}.png'), full_page=True)
    page.evaluate("() => window.PSApp.go('city', 0)")
    if SHOTS: page.screenshot(path=str(SHOT_DIR / '03_city.png'), full_page=True)
    page.evaluate("() => window.PSApp.startMode('build', 0)")
    if SHOTS: page.screenshot(path=str(SHOT_DIR / '04_build.png'))
    page.click('#quit')
    page.evaluate("() => window.PSApp.startMode('scene', 0)")
    page.locator('[data-o]').first.click()
    if SHOTS: page.screenshot(path=str(SHOT_DIR / '05_scene.png'), full_page=True)
    page.click('#quit')

    # Englisch als Basissprache
    page.evaluate("() => { window.PSApp.state().base='en'; window.PSApp.go('home'); }")
    (ok if 'Continue on the Szlak' in page.inner_text('#cta') else bad)('Englische Oberfläche')

    # Dark Mode
    page.emulate_media(color_scheme='dark'); page.evaluate("() => window.PSApp.go('home')")
    bg = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    (ok if bg == 'rgb(15, 21, 26)' else bad)(f'Dark Mode Hintergrund ({bg})')
    if SHOTS: page.screenshot(path=str(SHOT_DIR / '06_home_dark.png'), full_page=True)

    (ok if not OPTQ else bad)('Antwortoptionen eindeutig in allen Modi' + ('' if not OPTQ else ': ' + ' | '.join(OPTQ[:3])))
    real = [e for e in errors if 'speechSynthesis' not in e]
    (ok if not real else bad)('Keine JS-Fehler' + ('' if not real else ': ' + ' | '.join(real[:3])))
    b.close()

print(f'\n{len(oks)} OK, {len(fails)} Fehler')
print('PASS' if not fails else 'FAIL')
sys.exit(1 if fails else 0)
