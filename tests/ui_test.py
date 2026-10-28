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
# Über einen kleinen lokalen Webserver (wie im echten Betrieb): Schriften, Service Worker und Nachladen gehen nicht über file://
import http.server, threading, functools
_srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT)))
_srv.RequestHandlerClass.log_message = lambda *a: None
threading.Thread(target=_srv.serve_forever, daemon=True).start()
URL = 'http://127.0.0.1:%d/index.html' % _srv.server_address[1]
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

    # Regression: offene Einführungs-Tour darf nicht über einem Spiel liegen bleiben
    page.evaluate("() => { window.PSApp.state().tour = false; window.PSApp.go('home'); }"); page.wait_for_timeout(700)
    page.evaluate("() => window.PSApp.startMode('match', 0)"); page.wait_for_timeout(100)
    (ok if not page.locator('#tour').count() else bad)('Tour verschwindet, sobald ein Spiel startet')
    page.click('#quit'); page.evaluate("() => { window.PSApp.state().tour = true; }")

    # ---------- 3.0 ----------
    page.emulate_media(color_scheme='light')
    page.evaluate("() => { window.PSApp.state().base='de'; window.PSApp.go('home'); }")
    page.click('[data-mode="themes"]'); page.wait_for_selector('[data-th]')
    (ok if page.locator('[data-th]').count() >= 8 else bad)('Nach Thema: Themenliste')
    page.click('[data-th="arzt"]'); page.wait_for_selector('[data-tu]')
    (ok if page.locator('[data-tu]').count() == 5 else bad)('Thema Arzt: 5 Lektionen (Wrocław, Giżycko, Elbląg, Praxis, Notfall)')
    page.click('[data-mode="themelearn"]'); (ok if play_through(page) else bad)('Thema: neue Wörter')
    page.click('#home'); page.wait_for_selector('[data-tu]'); (ok if page.locator('h1').inner_text().startswith('Arzt') else bad)('Zurück landet im Thema')
    page.click('[data-mode="themeq"]'); (ok if play_through(page) else bad)('Thema üben')
    page.evaluate("() => window.PSApp.go('themes', 'arzt')"); page.wait_for_selector('[data-tu]')
    page.locator('[data-tu]').nth(1).click(); page.wait_for_selector('.city-head')
    (ok if 'szlak 2' in page.inner_text('.city-head').lower() else bad)('Giżycko zeigt Szlak 2')
    if page.locator('#open-city').count():
        page.click('#open-city'); page.wait_for_selector('.tiles [data-mode="learn"]'); ok('Gesperrte Stadt per „Trotzdem öffnen“ lernbar')
    else: bad('„Trotzdem öffnen“ fehlt')
    page.click('#back'); page.wait_for_selector('[data-tu]'); ok('Zurück von der Stadt ins Thema')
    page.locator('[data-tu]').nth(2).click(); page.wait_for_selector('.city-head')
    (ok if 'themenpaket' in page.inner_text('.city-head').lower() else bad)('Paket Praxis-Polnisch offen')
    for m in ['learn', 'scene', 'quiz', 'build', 'boss']:
        page.evaluate(f"() => window.PSApp.startMode('{m}', 24)")
        (ok if play_through(page) else bad)(f'Paket-Modus {m}')
    (ok if page.evaluate("() => window.PSApp.state().unlocked") < 12 else bad)('Paket-Prüfung schaltet keine Stadt frei')
    # Szlak 2: Freischalten, Karte, Postkarten
    page.evaluate("() => { const s = window.PSApp.state(); for (const id of ['waw','lod','poz','szc','gda','tor','bia','lub','kra','zak','kat','wro']) s.boss[id] = 80; s.unlocked = 11; localStorage.setItem('polski_szlak_v1', JSON.stringify(s)); }")
    page.reload(); page.wait_for_selector('.map')
    (ok if page.evaluate("() => window.PSApp.state().unlocked") == 12 else bad)('Nach ganz Szlak 1 ist Sopot frei (Altstand-Migration)')
    (ok if 'Sopot' in page.inner_text('#cta') else bad)('Weiter-Knopf zeigt Sopot')
    (ok if page.locator('#map-r').count() and page.locator('.map .node').count() == 12 else bad)('Karte: Szlak-Umschalter, 12 Orte')
    (ok if 'Postkarten' in page.inner_text('.letter-card') else bad)('Startseite zeigt Anias Postkarten')
    page.evaluate("() => window.PSApp.startMode('scene', 12)"); (ok if play_through(page) else bad)('Szene Sopot')
    page.evaluate("() => { const s = window.PSApp.state(); s.boss.sop = 90; s.unlocked = 13; window.PSApp.go('letter', 'diary'); }")
    (ok if page.locator('.lt-line:not(.locked)').count() == 1 else bad)('Erste Postkarte lesbar')
    # Sprecherform
    page.evaluate("() => window.PSApp.go('me')"); page.click('#s-g [data-v="f"]')
    page.evaluate("() => window.PSApp.go('city', 12)")
    txt = page.inner_text('main')
    (ok if 'byłam' in txt and '{' not in txt else bad)('Sprecherform weiblich: byłam, keine Klammern')
    page.evaluate("() => window.PSApp.go('me')"); page.click('#s-g [data-v="m"]')
    page.evaluate("() => window.PSApp.go('city', 12)"); (ok if 'byłem' in page.inner_text('main') else bad)('Sprecherform männlich: byłem')
    # Konjugation
    page.evaluate("() => window.PSApp.go('practice')"); page.click('[data-mode="conj"]'); page.wait_for_selector('#cj-go')
    page.locator('[data-cv]').first.click(); (ok if page.locator('.conj-tab').count() else bad)('Verbtabelle klappt auf')
    page.click('#cj-go'); (ok if play_through(page) else bad)('Konjugations-Runde')
    # Wochenrückblick + Kalender
    page.evaluate("() => { const s = window.PSApp.state(); const f = x => x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'); const d = new Date(); d.setDate(d.getDate() - 7); const k = f(d); d.setDate(d.getDate() - (d.getDay()+6)%7); s.wlog = {}; s.wlog[f(d)] = { n: 12, m: 3, r: 40, w: 10 }; s.active[k] = 1; s.wrSeen = ''; s.welcomeDay = f(new Date()); window.PSApp.go('home'); }")
    (ok if page.locator('#wr').count() else bad)('Wochenrückblick sichtbar')
    if page.locator('#wr-x').count(): page.click('#wr-x')
    (ok if not page.locator('#wr').count() else bad)('Wochenrückblick schließbar')
    page.evaluate("() => window.PSApp.go('me')")
    with page.expect_download() as dl: page.click('#rem-go')
    (ok if dl.value.suggested_filename.endswith('.ics') else bad)('Kalender-Datei (.ics) wird erzeugt')
    (ok if page.locator('#voice').count() else bad)('Stimmen-Bereich unter Ich')
    # Dla Polaków wird nachgeladen
    page.evaluate("() => window.PSApp.go('land')"); page.click('.pol-entry'); page.wait_for_timeout(800)
    (ok if page.evaluate("() => location.href") and page.locator('main').count() and 'Dla Polaków' in page.inner_text('main') else bad)('Dla Polaków nachgeladen')
    for t2 in ['home', 'themes', 'me']:
        page.evaluate(f"() => window.PSApp.go('{t2}')")
        w = page.evaluate("() => document.documentElement.scrollWidth - document.documentElement.clientWidth")
        (ok if w <= 0 else bad)(f'Kein horizontales Scrollen auf {t2} (390px, 3.0)')
        if SHOTS: page.screenshot(path=str(SHOT_DIR / f'30_{t2}.png'), full_page=True)
    # Prüfmodus für Muttersprachler
    rv = ctx.new_page(); rv.on('pageerror', lambda e: errors.append(str(e)))
    rv.goto(URL + '?review'); rv.wait_for_selector('.rv-card')
    (ok if 'Sprawdzanie' in rv.inner_text('h1') else bad)('Prüfmodus öffnet (polnisch)')
    k1 = rv.inner_text('.rv-card .eyebrow'); rv.click('#rv-ok'); rv.wait_for_timeout(100)
    (ok if rv.inner_text('.rv-card .eyebrow') != k1 else bad)('✓ springt zum nächsten Eintrag')
    rv.click('#rv-bad'); rv.fill('#rv-txt', 'Test'); rv.click('#rv-send'); rv.wait_for_timeout(1500)
    st = rv.evaluate("() => JSON.parse(localStorage.getItem('polski_szlak_review'))")
    (ok if st and len(st['res']) == 2 else bad)('Prüfergebnisse gespeichert (2)')
    rv.click('#rv-undo'); st = rv.evaluate("() => JSON.parse(localStorage.getItem('polski_szlak_review'))")
    (ok if len(st['res']) == 1 else bad)('Rückgängig im Prüfmodus')
    rv.close()

    # 3.1.2: übersprungene Stadt bleibt Ziel des Weiter-Knopfs, Prüfung erst nach Festigen
    page.evaluate("() => { const s = window.PSApp.state(); s._bk = JSON.stringify({b: s.boss, k: s.skipped, u: s.unlocked}); s.boss = {}; s.skipped = { waw: true, lod: true }; s.unlocked = 3; window.PSApp.go('home'); }")
    (ok if 'Warszawa' in page.inner_text('#cta') else bad)('Weiter führt zur übersprungenen Stadt Warszawa')
    page.evaluate("() => window.PSApp.go('city', 2)"); page.locator('.tiles [data-mode="boss"]').click(); page.wait_for_timeout(200)
    (ok if not page.locator('.game').count() else bad)('Stadtprüfung vor dem Festigen gesperrt')
    page.evaluate("() => { const s = window.PSApp.state(); const o = JSON.parse(s._bk); s.boss = o.b; s.skipped = o.k; s.unlocked = o.u; delete s._bk; }")

    # Was ist neu
    page.evaluate("() => { window.PSApp.state().seenVer = ''; window.PSApp.go('home'); }")
    (ok if page.locator('#nw').count() else bad)('Update-Hinweis auf der Startseite')
    page.click('#nw-all'); page.wait_for_selector('.news-ul')
    (ok if page.locator('.news-ul').count() >= 5 else bad)('Seite „Was ist neu“ mit allen Versionen')
    page.evaluate("() => window.PSApp.go('home')"); (ok if not page.locator('#nw').count() else bad)('Update-Hinweis nur einmal')

    # ---------- 3.1 KI-Gespräch (Server nachgebaut) ----------
    import json as _json
    def _sb(route):
        u = route.request.url
        if '/functions/v1/ps-chat' in u:
            b = _json.loads(route.request.post_data or '{}')
            if b.get('ping'): return route.fulfill(status=200, content_type='application/json', body='{"ok":true,"configured":true,"limit":40}')
            last = b['messages'][-1]['content']
            return route.fulfill(status=200, content_type='application/json', body=_json.dumps({'reply': 'Super! A co pijesz?', 'fix': 'Poproszę kawę.' if 'kawe' in last else '', 'hint': 'kawę (Akkusativ)', 'used': 3, 'limit': 40}))
        if '/rest/v1/ps_progress' in u: return route.fulfill(status=200, content_type='application/json', body='[]')
        return route.fulfill(status=200, content_type='application/json', body='{}')
    ch = ctx.new_page(); ch.on('pageerror', lambda e: errors.append(str(e)))
    ch.route('https://supabase.arndt-software.de/**', _sb)
    ch.goto(URL); ch.wait_for_selector('#app')
    ch.evaluate("() => { localStorage.setItem('polski_szlak_auth', JSON.stringify({ at: 'x', rt: 'y', exp: Date.now() + 3600000, email: 'test@example.org', uid: '00000000-0000-0000-0000-000000000001' })); }")
    ch.reload(); ch.wait_for_selector('.map')
    ch.evaluate("() => window.PSApp.startMode('chat', 0)"); ch.wait_for_selector('#ch-in')
    (ok if ch.locator('.chat-log .npc').count() == 1 else bad)('KI-Gespräch startet mit dem ersten Satz der Szene')
    ch.fill('#ch-in', 'Poprosze kawe'); ch.click('#ch-f button.primary'); ch.wait_for_selector('.chat-fix')
    (ok if 'A co pijesz' in ch.inner_text('.chat-log') and 'Poproszę kawę.' in ch.inner_text('.chat-fix') else bad)('KI-Antwort und Korrektur werden angezeigt')
    (ok if 'heute 3 von 40' in ch.inner_text('main') else bad)('Tageszähler sichtbar')
    w = ch.evaluate("() => document.documentElement.scrollWidth - document.documentElement.clientWidth")
    (ok if w <= 0 else bad)('KI-Gespräch ohne horizontales Scrollen')
    if SHOTS: ch.screenshot(path=str(SHOT_DIR / '31_chat.png'), full_page=True)
    ch.evaluate("() => { localStorage.removeItem('polski_szlak_auth'); }"); ch.reload(); ch.wait_for_selector('.map')
    ch.evaluate("() => window.PSApp.startMode('chat')"); ch.wait_for_selector('#ch-login')
    ok('Ohne Konto: Hinweis zur Anmeldung')
    ch.close()

    # ---------- 3.2 Lernstände sind sicher ----------
    sx = b.new_context(); sp = sx.new_page(); sp.on('pageerror', lambda e: errors.append(str(e)))
    sp.goto(URL); sp.wait_for_selector('#app')
    # a) alter Spielstand (Felder wie in 1.x/2.0, ohne neue Schlüssel) lädt vollständig
    OLD = '{"app":"polski-szlak","v":1,"base":"de","onboarded":true,"xp":412,"cards":{"waw:0":{"box":4,"seen":9,"due":"2026-01-01"},"waw:1":{"box":2,"seen":3,"due":"2026-01-01"}},"unlocked":2,"boss":{"waw":85,"lod":72},"scenes":{"waw":true},"krasnale":[1,2]}'
    sp.evaluate("(o) => { localStorage.clear(); localStorage.setItem('polski_szlak_v1', o); }", OLD); sp.reload(); sp.wait_for_selector('.map')
    st = sp.evaluate("() => { const s = window.PSApp.state(); return [s.xp, s.cards['waw:0'].box, s.boss.lod, s.unlocked, s.appVer]; }")
    (ok if st[:4] == [412, 4, 72, 2] and st[4] else bad)('Alter Spielstand (2.0) lädt vollständig: %s' % st)
    bk = sp.evaluate("() => JSON.parse(localStorage.getItem('polski_szlak_bak') || '[]').map(b => [b.why, b.d.xp])")
    (ok if bk and bk[0] == ['auto', 412] else bad)('Beim Start wird automatisch gesichert: %s' % bk)
    # b) Versions-Update → Sicherung „vor Update“
    sp.evaluate("() => { const s = JSON.parse(localStorage.getItem('polski_szlak_v1')); s.appVer = '3.1.4'; localStorage.setItem('polski_szlak_v1', JSON.stringify(s)); }"); sp.reload(); sp.wait_for_selector('.map')
    bk = sp.evaluate("() => JSON.parse(localStorage.getItem('polski_szlak_bak')).map(b => b.why)")
    (ok if 'update' in bk else bad)('Vor einem Update wird gesichert: %s' % bk)
    # c) kaputter Text im Speicher → letzte Sicherung wird geladen, Original aufbewahrt
    sp.evaluate("() => localStorage.setItem('polski_szlak_v1', '{kaputt')"); sp.reload(); sp.wait_for_selector('.map')
    st = sp.evaluate("() => [window.PSApp.state().xp, localStorage.getItem('polski_szlak_rescue'), JSON.parse(localStorage.getItem('polski_szlak_v1')).xp]")
    (ok if st == [412, '{kaputt', 412] else bad)('Beschädigter Stand: Sicherung geladen, Original aufbewahrt: %s' % st)
    # d) reparierbarer Stand (xp kaputt) → Karten bleiben
    sp.evaluate("() => { localStorage.removeItem('polski_szlak_bak'); localStorage.removeItem('polski_szlak_rescue'); localStorage.setItem('polski_szlak_v1', JSON.stringify({ app: 'polski-szlak', onboarded: true, xp: 'NaN', cards: { 'waw:0': { box: 3, seen: 5 } }, boss: { waw: 80 } })); }")
    sp.reload(); sp.wait_for_selector('.map')
    st = sp.evaluate("() => { const s = window.PSApp.state(); return [s.cards['waw:0'].box, s.boss.waw]; }")
    (ok if st[0] >= 3 and st[1] >= 80 else bad)('Reparierbarer Stand behält Karten und Prüfungen: %s' % st)
    # e) Neustart sichert vorher; Zurückholen fügt nur hinzu
    sp.evaluate("(o) => { localStorage.clear(); localStorage.setItem('polski_szlak_v1', o); }", OLD); sp.reload(); sp.wait_for_selector('.map')
    sp.evaluate("() => window.PSApp.go('me')"); sp.wait_for_selector('#safe')
    (ok if '412 XP' in sp.inner_text('#safe') else bad)('Ich: Abschnitt „Dein Fortschritt ist sicher“ zeigt den Stand')
    sp.click('#reset'); sp.click('#reset'); sp.wait_for_selector('#app')
    st = sp.evaluate("() => [window.PSApp.state().xp, JSON.parse(localStorage.getItem('polski_szlak_bak')).some(b => b.why === 'reset' && b.d.xp === 412)]")
    (ok if st == [0, True] else bad)('Neustart: vorher gesichert: %s' % st)
    sp.click('#ob-why [data-v="travel"]'); sp.click('#ob-goal [data-v="3"]'); sp.click('#ob-go'); sp.wait_for_timeout(500)
    if SHOTS: sp.screenshot(path=str(SHOT_DIR / '40_after_reset.png'), full_page=True)
    sp.evaluate("() => window.PSApp.go('me')"); sp.wait_for_selector('#safe')
    sp.click('#safe summary'); sp.locator('#safe [data-bk]').first.click(); sp.wait_for_timeout(300)
    st = sp.evaluate("() => { const s = window.PSApp.state(); return [s.xp, s.boss.lod, s.cards['waw:0'].box]; }")
    (ok if st == [412, 72, 4] else bad)('Zurückholen bringt alles wieder: %s' % st)
    # f) Datei speichern / laden
    with sp.expect_download() as dl: sp.click('#bk-file')
    import json as _j2, tempfile as _tf; path = _tf.mktemp(suffix='.json'); dl.value.save_as(path); d = _j2.load(open(path, encoding='utf-8'))
    (ok if d.get('xp') == 412 else bad)('Sicherung als Datei')
    sx.close(); sx = b.new_context(); sp = sx.new_page(); sp.on('pageerror', lambda e: errors.append(str(e))); sp.goto(URL); sp.wait_for_selector('#ob-go')
    sp.click('#ob-why [data-v="travel"]'); sp.click('#ob-goal [data-v="3"]'); sp.click('#ob-go'); sp.wait_for_timeout(500)
    sp.evaluate("() => window.PSApp.go('me')"); sp.wait_for_selector('#bk-in', state='attached'); sp.set_input_files('#bk-in', path); sp.wait_for_timeout(400)
    (ok if sp.evaluate("() => window.PSApp.state().xp") == 412 else bad)('Sicherungs-Datei laden')
    # g) eigene Wörter: Löschen verschiebt den Fortschritt der anderen nicht
    sp.evaluate("() => { const s = window.PSApp.state(); s.custom = [['a','A','A'],['b','B','B'],['c','C','C']]; s.cards['my:0'] = {box:1,seen:1}; s.cards['my:1'] = {box:2,seen:2}; s.cards['my:2'] = {box:5,seen:5}; localStorage.setItem('polski_szlak_v1', JSON.stringify(s)); }")
    sp.reload(); sp.wait_for_selector('#app'); sp.evaluate("() => window.PSApp.go('mywords')"); sp.wait_for_timeout(300)
    if sp.locator('[data-del="0"]').count():
        sp.click('[data-del="0"]')
        st = sp.evaluate("() => { const s = window.PSApp.state(); return [s.custom.map(w => w[0]).join(''), s.cards['my:0'] && s.cards['my:0'].box, s.cards['my:1'] && s.cards['my:1'].box, !!s.cards['my:2']]; }")
        (ok if st == ['bc', 2, 5, False] else bad)('Eigenes Wort löschen: Fortschritt der anderen bleibt richtig zugeordnet: %s' % st)
    else: bad('Eigene Wörter: Löschen-Knopf nicht gefunden')
    sx.close()

    # ---------- 3.3 Szlak 3 „Die Bücher“ und B1-Probeprüfung ----------
    tx = b.new_context(); tp = tx.new_page(); tp.on('pageerror', lambda e: errors.append(str(e)))
    tp.goto(URL); tp.wait_for_selector('#app')
    # Lernende am Ende von Szlak 2 (Spielstand von 3.2): nach dem Laden geht es in Jelenia Góra weiter, nichts geht verloren
    R2 = ['waw','lod','poz','szc','gda','tor','bia','lub','kra','zak','kat','wro','sop','mal','giz','ols','plo','cze','san','bie','prz','tar','opo','kar']
    tp.evaluate("(ids) => { const s = { app: 'polski-szlak', v: 1, base: 'de', onboarded: true, tour: true, xp: 5000, cards: { 'kar:3': { box: 4, seen: 7 } }, unlocked: 23, boss: {}, appVer: '3.2', seenVer: '3.3' }; ids.forEach(i => s.boss[i] = 80); localStorage.setItem('polski_szlak_v1', JSON.stringify(s)); }", R2)
    tp.reload(); tp.wait_for_selector('.map')
    st = tp.evaluate("() => { const s = window.PSApp.state(), D = window.PSApp.data(); return [D.units.length, D.units.findIndex(u => u.id === 'jel'), D.units.findIndex(u => u.id === 'kar'), D.units.findIndex(u => u.pack), s.unlocked, s.xp, s.cards['kar:3'].box]; }")
    (ok if st == [40, 24, 23, 36, 24, 5000, 4] else bad)('Szlak 3 nachgeladen, Reihenfolge stimmt, Stand von 3.2 bleibt, Jelenia Góra frei: %s' % st)
    (ok if tp.locator('#map-r button').count() == 3 and 'B1' in tp.inner_text('#map-r') else bad)('Karte: Szlak 1 · 2 · 3 (B1)')
    (ok if tp.locator('#book-open').count() == 1 and 'Klucz z Wieliczki' in tp.inner_text('main') else bad)('Startseite: Anias Buch mit Kapitel 1')
    tp.click('#book-open'); tp.wait_for_selector('.rd-pl')
    (ok if tp.locator('.rd-pl').count() == 9 and tp.locator('.rd-trl:not([hidden])').count() == 0 else bad)('Kapitel 1: 9 Sätze, Übersetzung zunächst verborgen')
    tp.click('#rd-tr'); (ok if tp.locator('.rd-trl:not([hidden])').count() == 9 else bad)('Übersetzung einblendbar')
    for qi in range(3):
        tp.evaluate("(qi) => { const u = window.PSApp.data().units.find(x => x.id === 'jel'); const a = u.read.q[qi].a; document.querySelector('.rd-q .opt[data-q=\"' + qi + '\"][data-k=\"' + a + '\"]').click(); }", qi)
    tp.click('#rd-check'); tp.wait_for_selector('.banner')
    st = tp.evaluate("() => [window.PSApp.state().read.jel, window.PSApp.state().xp]")
    (ok if st[0] == 100 and st[1] == 5040 else bad)('Verständnisfragen: 100 %%, +40 XP: %s' % st)
    tp.click('#back'); tp.wait_for_selector('.city-head')
    (ok if 'Beta' in tp.inner_text('.city-head') and tp.locator('[data-mode="read"] .badge').inner_text() == '100%' else bad)('Stadt: Beta-Hinweis und Kapitel-Ergebnis')
    # Spielstand mitten in Szlak 2: Szlak 3 bleibt zu
    tp.evaluate("() => { const s = window.PSApp.state(); s.unlocked = 15; s.boss = { waw: 80 }; localStorage.setItem('polski_szlak_v1', JSON.stringify(s)); }"); tp.reload(); tp.wait_for_selector('.map')
    (ok if tp.evaluate("() => window.PSApp.state().unlocked") == 15 and tp.locator('#book-open').count() == 0 else bad)('Mitten in Szlak 2: Szlak 3 noch zu, kein Buch')
    # B1-Probeprüfung komplett durchspielen
    tp.evaluate("() => window.PSApp.go('exam')"); tp.wait_for_selector('#ex-go'); tp.click('#ex-go')
    for _ in range(11):
        tp.wait_for_selector('[data-o]'); tp.locator('[data-o]').first.click(); tp.click('#ex-next')
    tp.wait_for_selector('.rd-q')
    for qi in range(3): tp.locator('.rd-q .opt[data-q="%d"]' % qi).first.click()
    tp.click('#ex-rcheck'); tp.click('#ex-next'); tp.wait_for_selector('#ex-txt')
    tp.fill('#ex-txt', 'Dzień dobry, od tygodnia nie działa ogrzewanie w moim mieszkaniu i jest bardzo zimno. Wczoraj dzwoniłem do hydraulika, ale nie odebrał. Czy mógłby Pan przysłać kogoś jutro rano, bo pracuję po południu? Pozdrawiam serdecznie, Andre')
    tp.click('#ex-wcheck'); tp.wait_for_selector('.ex-crit')
    (ok if tp.locator('.ex-crit li.ok').count() == 5 else bad)('Schreiben: alle 5 Kriterien erkannt')
    tp.click('#ex-next'); tp.wait_for_selector('[data-r]'); tp.click('[data-r="100"]'); tp.wait_for_selector('.ex-result')
    st = tp.evaluate("() => { const e = window.PSApp.state().exam; return [e.n, e.best > 0, Object.keys(e.last.sc).length]; }")
    (ok if st == [1, True, 5] else bad)('B1-Probeprüfung: fünf Teile, Ergebnis gespeichert: %s' % st)
    w = tp.evaluate("() => document.documentElement.scrollWidth - document.documentElement.clientWidth")
    (ok if w <= 0 else bad)('Probeprüfung ohne horizontales Scrollen')
    if SHOTS: tp.screenshot(path=str(SHOT_DIR / '50_exam_result.png'), full_page=True)
    # Prüfmodus enthält die Buchkapitel
    tp.goto(URL + '?review'); tp.wait_for_selector('#rv-sec')
    tp.wait_for_function("() => document.querySelector('#rv-sec') && /Książka/.test(document.querySelector('#rv-sec').innerText)")
    ok('Prüfmodus: Abschnitt „Książka (Szlak 3)“')
    tx.close()

    # ---------- 3.4 App-Stimmen Gosia / Darek (Tondateien) ----------
    vx = b.new_context(); vp = vx.new_page(); vp.on('pageerror', lambda e: errors.append(str(e)))
    vp.add_init_script("""window.__played = []; HTMLMediaElement.prototype.play = function () { window.__played.push(this.src); setTimeout(() => this.onended && this.onended(), 5); return Promise.resolve(); };
      window.__tts = []; try { const o = window.speechSynthesis; o.speak = (u) => window.__tts.push(u.text); } catch (e) {}""")
    vp.goto(URL); vp.wait_for_selector('#ob-go')
    vp.click('#ob-why [data-v="travel"]'); vp.click('#ob-goal [data-v="3"]'); vp.click('#ob-go'); vp.wait_for_timeout(400)
    vp.evaluate("() => window.PSApp.go('me')"); vp.wait_for_selector('#vs-src')
    vp.click('#vs-src [data-v="gosia"]'); vp.wait_for_timeout(500)
    pl = vp.evaluate("() => window.__played")
    (ok if pl and '/audio/gosia/' in pl[-1] else bad)('Stimme Gosia gewählt: Probehören spielt Tondatei: %s' % (pl[-1:] if pl else pl))
    vp.evaluate("() => window.PSApp.go('city', 0)"); vp.wait_for_selector('.li [data-say]')
    vp.locator('.li [data-say]').first.click(); vp.wait_for_timeout(200)
    pl = vp.evaluate("() => window.__played")
    import urllib.request
    code = urllib.request.urlopen(pl[-1]).status if pl else 0
    (ok if pl and '/audio/gosia/' in pl[-1] and code == 200 else bad)('Wort aus Warszawa: Datei vorhanden und abgespielt (%s)' % code)
    vp.evaluate("() => { const s = window.PSApp.state(); s.vsrc = 'darkman'; }")
    vp.locator('.li [data-say]').nth(1).click(); vp.wait_for_timeout(200)
    (ok if '/audio/darkman/' in vp.evaluate("() => window.__played")[-1] else bad)('Stimme Darek: Datei aus audio/darkman')
    vx.close()

    (ok if not OPTQ else bad)('Antwortoptionen eindeutig in allen Modi' + ('' if not OPTQ else ': ' + ' | '.join(OPTQ[:3])))
    real = [e for e in errors if 'speechSynthesis' not in e and 'supabase' not in e and 'Failed to load resource' not in e and 'CORS' not in e]
    (ok if not real else bad)('Keine JS-Fehler' + ('' if not real else ': ' + ' | '.join(real[:3])))
    b.close()

print(f'\n{len(oks)} OK, {len(fails)} Fehler')
print('PASS' if not fails else 'FAIL')
sys.exit(1 if fails else 0)
