/* Polski Szlak – Oberfläche & Spielmodi. Daten: #ps-data (JSON), Logik: PSCore (core.js). */
(function () {
  'use strict';
  var C = window.PSCore;
  var D = JSON.parse(document.getElementById('ps-data').textContent);
  var U = D.units;
  var KEY = 'polski_szlak_v1';
  var $app = document.getElementById('app');

  /* ---------- Texte (UI-Sprache = Basissprache) ---------- */
  var TX = {
    de: {
      nav_home: 'Start', nav_practice: 'Üben', nav_album: 'Album', nav_me: 'Ich',
      level: 'Stufe', week: 'Diese Woche', of: 'von', days: 'Tagen', wk_streak: 'Wochen in Folge',
      total_days: 'Lerntage gesamt', mastered: 'Wörter sicher', due: 'fällig', continue: 'Weiter auf dem Szlak',
      review: 'Wiederholen', review_d: 'Was dein Gedächtnis gerade vergisst', daily: 'Tagesrätsel', daily_d: '10 Fragen, heute für dich gleich',
      blitz: 'Blitz 60', blitz_d: 'Eine Minute, so viele wie möglich', cases: 'Fall-Werkstatt', cases_d: 'Die 7 Fälle mit Sätzen statt Tabellen',
      sounds: 'Laut-Detektiv', sounds_d: 'cz, sz, rz, ł, ą … richtig hören', twister: 'Zungenbrecher', twister_d: 'Sprich die Klassiker nach',
      prices: 'Preise hören', prices_d: 'Złoty-Beträge verstehen', duel: 'Familienduell', duel_d: '2–4 Leute an einem Handy',
      face: 'Gegenüber', face_d: '2 Leute, 1 Handy: wer tippt zuerst?', face_rules: 'Legt das Handy flach zwischen euch – jeder hat seine Bildschirmhälfte. Beide sehen dieselbe Frage. Wer zuerst richtig tippt, bekommt den Punkt. Falsch getippt = für diese Frage gesperrt.', face_n: 'Fragen', face_fast: 'war schneller', face_wrong: 'Falsch – gesperrt', face_point: '+1 Punkt!', face_nobody: 'Keiner wusste es', face_win: 'Gewonnen!', face_lose: 'Knapp verloren', face_quit: 'Beenden',
      mistakes: 'Fehlerheft', mistakes_d: 'Deine Stolpersteine gezielt', mywords: 'Meine Wörter', mywords_d: 'Eigene Vokabeln, z. B. aus deinem Beruf',
      learn: 'Neue Wörter', learn_d: 'Hören, sehen, merken', quiz: 'Quiz', quiz_d: 'Gemischte Fragen', listen: 'Hören', listen_d: 'Nur das Ohr zählt',
      type: 'Schreiben', type_d: 'Selbst tippen statt wählen', build: 'Satzbau', build_d: 'Sätze aus Wörtern bauen', cloze: 'Lückensatz', cloze_d: 'Das fehlende Wort finden',
      match: 'Paare', match_d: 'Memory gegen die Uhr', speak: 'Sprechen', speak_d: 'Laut nachsprechen', scene: 'Szene', scene_d: 'Ein echtes Gespräch vor Ort',
      boss: 'Stadtprüfung', boss_d: '12 Fragen, 3 Leben. Schaltet die nächste Stadt frei', locked: 'Noch gesperrt', test_out: 'Abkürzung: Prüfung direkt machen',
      can: 'Danach kannst du', tip: 'Kurz erklärt', words: 'Wortschatz', check: 'Prüfen', next: 'Weiter', skip: 'Überspringen', right: 'Richtig', wrong: 'Nicht ganz',
      solution: 'Lösung', almost_dia: 'Richtig, achte auf die polnischen Buchstaben', almost_typo: 'Fast, ein Tippfehler', listen_again: 'Nochmal hören', slow: 'Langsam',
      done: 'Fertig', score: 'Ergebnis', xp: 'XP', combo: 'Kombo', back: 'Zurück', home: 'Zur Karte', again: 'Nochmal', share: 'Ergebnis kopieren', copied: 'Kopiert',
      postcards: 'Postkarten', krasnale: 'Krasnale', krasnal_found: 'Du hast einen Krasnal gefunden', krasnal_hint: 'Die Bronzezwerge aus Wrocław verstecken sich nach Übungen. Jeder bringt ein neues Wort mit.',
      postcard_new: 'Neue Postkarte', unlocked: 'Neue Stadt freigeschaltet', passed: 'Bestanden', failed: 'Diesmal nicht. Die Fehler kommen in dein Fehlerheft.',
      settings: 'Einstellungen', base_lang: 'Ich lerne Polnisch über', goal: 'Wochenziel (Lerntage)', len: 'Länge einer Runde', short: 'Kurz', medium: 'Mittel', long: 'Lang',
      hardcore: 'Strenger Schreibmodus (Akzente zählen, doppelte XP)', theme: 'Darstellung', auto: 'Automatisch', light: 'Hell', dark: 'Dunkel',
      backup: 'Fortschritt sichern', backup_d: 'Kopiere diesen Text und füge ihn auf einem anderen Gerät wieder ein.', restore: 'Wiederherstellen', restored: 'Fortschritt geladen', bad_backup: 'Der Text ist kein gültiger Spielstand.',
      reset: 'Alles zurücksetzen', reset_q: 'Wirklich alles löschen? Tippe nochmal zum Bestätigen.',
      vs_last: 'Du gegen dich letzte Woche', this_w: 'diese Woche', last_w: 'letzte Woche',
      fresh: 'Neue Woche, frischer Start', fresh_d: 'Letzte Woche: {a} von {g} Lerntagen. Diese Woche zählt neu.', fresh_ok: 'Wochenziel letzte Woche erreicht. Stark.',
      pause_ok: 'Ein Tag Pause bricht hier nichts. Gezählt wird die Woche.',
      no_due: 'Gerade ist nichts fällig. Wir nehmen deine schwächsten Wörter.', empty_mistakes: 'Dein Fehlerheft ist leer.',
      add: 'Hinzufügen', pl: 'Polnisch', meaning: 'Bedeutung', mywords_empty: 'Noch keine eigenen Wörter. Füge Vokabeln hinzu, die du wirklich brauchst.', practice_mine: 'Meine Wörter üben', delete: 'Löschen',
      d2: 'Duell-Code (2 Handys)', d2_d: 'Jeder spielt am eigenen Handy. Gleicher Code = exakt dieselben 20 Fragen, egal wie weit ihr seid.', d2_new: 'Neuen Code erstellen', d2_code: 'Code', d2_bad: 'Code ungültig. Beispiel: KOT-472-1', d2_level: 'Stufe (steckt im Code)',
      d2_check: 'Prüfzeichen', d2_check_d: 'Vergleicht das Prüfzeichen, bevor ihr startet. Nur wenn beide dasselbe sehen, habt ihr dieselben Fragen – sonst bei beiden die App neu laden.', d2_send_code: 'Code teilen', d2_share: 'Ergebnis teilen', d2_time: 'Zeit',
      d2_paste: 'Ergebnis von deinem Gegenüber hier einfügen', d2_compare: 'Vergleichen', d2_win: 'Du gewinnst!', d2_lose: 'Dein Gegenüber gewinnt', d2_other_code: 'Anderer Code – das Ergebnis gehört nicht zu diesem Duell.', d2_other_check: 'Anderes Prüfzeichen – ihr hattet nicht dieselben Fragen. Bitte bei beiden die App neu laden.', d2_unreadable: 'Kein Ergebnis gefunden (z. B. „15/20 · 2:13“).', d2_same: 'Gleiche Fragen bestätigt',
      d2_name: 'Dein Name (für Ergebnis und Rangliste)', d2_me: 'Ich', d2_pol: 'Dla Polaków (Muttersprachler)', d2_learn: 'Lernende', d2_weight: 'Punkte ×',
      d2_mix: 'Gemischt spielen: Dein Gegenüber nimmt denselben Code mit eigener Stufe, z. B. KOT-472-1 gegen KOT-472-P2. Dann gibt es unterschiedliche Fragen, und die richtigen Antworten werden gewichtet: Stufe 1 ×1 · 2 ×1,5 · 3 ×2 · P1 ×2 · P2 ×2,5 · P3 ×3.',
      d2_rec: 'Empfohlen für dich', d2_mixed: 'Gemischtes Duell – unterschiedliche Fragen, Punkte gewichtet', d2_pts: 'Punkte', d2_inp_diff: 'Hinweis: Ihr habt mit unterschiedlicher Antwortart gespielt (W = Schreiben, S = Sprechen, T = Antippen).',
      d2_other_base: 'Anderer Code-Stamm – das Ergebnis gehört nicht zu diesem Duell.',
      rank: 'Rangliste', rank_d: 'Auf diesem Handy gespeichert (wird mit „Fortschritt sichern“ mitgesichert). Es zählen nur Ergebnisse mit gültiger Prüfsumme, jedes Duell nur einmal. Sortiert nach Siegen, dann Punkten.',
      rank_empty: 'Noch keine Duelle eingetragen. Nach einem Duell-Code-Spiel das Ergebnis deines Gegenübers einfügen und vergleichen.', rank_g: 'Spiele', rank_w: 'Siege', rank_d2: 'Unent.', rank_pts: 'Punkte', rank_clear: 'Rangliste löschen', rank_clear_q: 'Rangliste wirklich löschen?',
      rank_added: 'In die Rangliste eingetragen.', rank_dupe: 'Dieses Duell steht schon in der Rangliste.', rank_unsigned: 'Nicht in die Rangliste eingetragen: Das Ergebnis hat keine gültige Prüfsumme (verändert oder alte App-Version).',
      players: 'Spieler', start: 'Los geht’s', turn: 'ist dran', winner: 'gewinnt', tie: 'Unentschieden',
      duel_quiz: 'Wortquiz', pm: 'Państwa-Miasta', pm_d: 'Stadt-Land-Fluss auf Polnisch', pm_letter: 'Buchstabe', pm_pass: 'Gib das Handy an', pm_ready: 'Bereit – Buchstabe zeigen',
      pm_done: 'Fertig', pm_check: 'Auswertung', pm_count: 'Punkte zählen', pm_next_round: 'Nächste Runde', pm_round: 'Runde', pm_examples: 'Möglich wäre',
      pm_valid: 'gilt', pm_invalid: 'gilt nicht', pm_total: 'Gesamt', pm_lookaway: 'Die anderen schauen bitte weg.', pm_mode: 'Spiel',
      pm_rules: 'Zu jedem Buchstaben ein polnisches Wort pro Kategorie. Einzigartig = 10, doppelt = 5, als Einzige/r gültig = 20 Punkte. Unbekannte Wörter kann die Runde per Tipp gelten lassen. Jedes Spiel nimmt 5 zufällige Kategorien.',
      memo_w: 'Wort-Memory', memo_w_d: 'Paare aus allen offenen Städten', memo_p: 'Orte-Memory', memo_p_d: 'Ort und Beschreibung finden', memo_y: 'Jahres-Memory', memo_y_d: 'Jahreszahl und Ereignis verbinden',
      pol: 'Dla Polaków', pol_d: 'Mówisz po polsku? Sprawdź, jak dobrze – ortografia, poprawność, frazeologia i wiedza.',
      pol_intro: 'Strefa dla osób, dla których polski jest językiem ojczystym lub które znają go bardzo dobrze. Wszystko po polsku.',
      pol_lv: 'Twój poziom', pol_lvx: 'jeszcze bez testu', pol_lv0: 'podstawowy', pol_lv1: 'dobry', pol_lv2: 'bardzo dobry', pol_lv3: 'mistrz',
      pol_test: 'Test poziomu', pol_test_d: '18 pytań, po 3 z każdej kategorii – od łatwych do bardzo trudnych.',
      pol_qlv: 'Poziom pytań', pol_mix: 'Mieszanka', pol_mix_d: '10 pytań ze wszystkich kategorii', pol_res_up: 'Gratulacje! Nowy poziom', pol_res: 'Twój wynik testu',
      pol_c_ortografia: 'Ortografia', pol_c_ortografia_d: 'ó/u, rz/ż, ch/h, nie razem czy osobno',
      pol_c_poprawnosc: 'Poprawna polszczyzna', pol_c_poprawnosc_d: 'Typowe błędy: wziąć czy wziąść?',
      pol_c_aspekt: 'Aspekt i czasowniki', pol_c_aspekt_d: 'Dokonany, niedokonany, czasowniki ruchu',
      pol_c_liczebniki: 'Liczebniki', pol_c_liczebniki_d: 'Dwóch, dwie, dwoje – i odmiana',
      pol_c_frazeologia: 'Frazeologia', pol_c_frazeologia_d: 'Idiomy, przysłowia, skrzydlate słowa',
      pol_c_wiedza: 'Wiedza o Polsce', pol_c_wiedza_d: 'Literatura, historia, geografia, kultura',
      inp: 'Antworten durch', inp_write: 'Schreiben', inp_speak: 'Sprechen', inp_tap: 'Antippen', inp_rather: 'Lieber',
      inp_write_d: 'Du tippst die Antwort selbst ein – am meisten Lerneffekt.', inp_speak_d: 'Du sagst die Antwort laut (Mikro). Ohne Mikro: laut sagen, aufdecken, selbst bewerten.', inp_tap_d: 'Du wählst die Antwort aus vier Vorschlägen – nur lesen, nichts schreiben.',
      inp_say: 'Sag die Antwort auf Polnisch', inp_reveal: 'Aufdecken', inp_ok: 'Richtig gesagt', inp_no: 'Falsch gesagt', inp_selfq: 'Laut gesagt? Dann aufdecken und ehrlich bewerten.',
      speak_tap: 'Tippe aufs Mikro und sprich', speak_self: 'Sprich laut nach. Wie lief es?', speak_good: 'Gut', speak_retry: 'Nochmal', you_said: 'Erkannt',
      no_mic: 'Spracherkennung ist hier nicht verfügbar. Sprich laut nach und bewerte dich selbst.',
      tts_missing: 'Dein Gerät hat keine polnische Stimme. Der Text bleibt sichtbar.',
      ob_title: 'Polnisch lernen, Stadt für Stadt.', ob_sub: 'Eine Reise über den Szlak: 12 Städte, echte Gespräche, kurze Runden. Ohne Druck, ohne schlechtes Gewissen.',
      ob_why: 'Wofür lernst du?', why_travel: 'Reisen', why_family: 'Familie & Freunde', why_work: 'Arbeit', why_curious: 'Neugier',
      ob_goal: 'An wie vielen Tagen pro Woche willst du üben?', ob_go: 'Los nach Warszawa',
      hear: 'Was hörst du?', choose_meaning: 'Was bedeutet das?', choose_pl: 'Wie sagt man das auf Polnisch?', type_pl: 'Schreib es auf Polnisch', build_pl: 'Bau den Satz', fill: 'Welches Wort fehlt?',
      price_q: 'Welcher Betrag?', sound_q: 'Wie klingt der markierte Teil?', hear_word: 'Welches Wort hörst du?', case_q: 'Welche Form passt?',
      learned_today: 'Das kannst du jetzt sagen', pairs_left: 'Paare übrig', time_left: 'Sekunden',
      week_short: ['Mo','Di','Mi','Do','Fr','Sa','So'], city_progress: 'sicher', all_cities: 'Alle Städte',
      diff: 'Schwierigkeit', diff_easy: 'Leicht', diff_medium: 'Mittel', diff_hard: 'Schwer',
      diff_easy_d: 'Viel Auswahl, Akzente egal, Übersetzungen sichtbar.',
      diff_medium_d: 'Mehr Hören und Schreiben, Diktate, Prüfung ab 70 %. 1,5-fache XP.',
      diff_hard_d: 'Fast alles selbst schreiben, 6 Optionen, Akzente zählen, Übersetzungen versteckt, Prüfung 15 Fragen / 2 Leben / 80 %. Doppelte XP.',
      dictate: 'Schreib, was du hörst', translate_pl: 'Übersetze ins Polnische', show_tr: 'Übersetzung zeigen',
      skip_q: 'Frage überspringen', skip_city: 'Stadt überspringen', skip_city_d: 'Die nächste Stadt wird frei. Die Postkarte gibt es nur mit bestandener Prüfung.',
      skipped_city: 'Übersprungen', skipped_toast: 'Weiter geht\u2019s in', free_roam: 'Freie Reise: alle Städte sofort offen',
      placement: 'Einstufungstest', placement_d: 'Du kannst schon etwas? 2 Fragen pro Stadt, danach startest du dort, wo es hakt.',
      placement_res: 'Dein Start', placement_all: 'Alle Städte sitzen. Freie Reise ist an.',
      ob_diff: 'Wie schwer soll es sein?', ob_place: 'Ich kann schon etwas: Einstufungstest',
      nav_land: 'Polska', land: 'Land und Leute', land_d: 'Geschichte, Bräuche, Menschen und Orte. Jede Runde bringt Wissen, das du auf Reisen und im Gespräch brauchst.',
      facts: 'Polen in Zahlen', whoami: 'Wer bin ich?', whoami_d: 'Berühmte Polinnen und Polen erraten', tf: 'Wahr oder falsch?', tf_d: 'Bräuche, Alltag, Feiertage',
      timeline: 'Zeitstrahl', timeline_d: 'Polens Geschichte in die richtige Reihenfolge', pin: 'Wo liegt das?', pin_d: 'Orte auf der Karte finden',
      hl: 'Höher oder tiefer?', hl_d: 'Städte, Flüsse, Berge vergleichen', literki: 'Literki', literki_d: 'Buchstabensalat: das polnische Wort finden',
      t_true: 'Wahr', t_false: 'Falsch', more_clue: 'Noch ein Hinweis', clue: 'Hinweis', tap_order: 'Tippe die Ereignisse an, das älteste zuerst',
      tap_map: 'Tippe auf die Karte', km_off: 'km daneben', letters_q: 'Welches Wort steckt darin?', order_q: 'Reihenfolge',
      survival: 'Survival', survival_d: 'Wenige Sekunden pro Frage, 3 Leben, so weit du kommst', best: 'Rekord',
      j_5050: '50:50', j_freeze: '+10 s', j_hint: 'Tipp', jokers: 'Joker', jokers_d: 'Jeden Montag gibt es wieder 3 von jedem. 50:50 streicht zwei falsche Antworten, Tipp zeigt Anfangsbuchstaben, +10 s hält die Uhr an.',
      sec: 'Sek.',
      spell: 'Rechtschreibung', spell_d: 'ó oder u? rz oder ż? Die richtige Schreibweise finden', spell_q: 'Wie schreibt man es richtig?',
      rule_ou: 'ó und u klingen gleich. Die Schreibweise muss man sich merken.', rule_rz: 'rz und ż klingen gleich. Tipp: Wechselt das r in verwandten Wörtern (morze → morski), schreibt man rz.',
      rule_ch: 'ch und h klingen heute gleich. ch ist viel häufiger, h steht oft in Lehnwörtern (herbata, hotel).', rule_dia: 'Ohne Akzent ist es ein anderer Laut, manchmal sogar ein anderes Wort.', rule_nasal: 'ą und ę sind eigene Nasallaute und werden nicht als om/en geschrieben.', rule_soft: 'ś/ć/ź sind weich (Zunge vorn), sz/cz/ż hart. Vor Vokal schreibt man si/ci/zi statt ś/ć/ź.', rule_final: 'Am Wortende werden b, d, g, w, z stimmlos gesprochen (chleb klingt wie „chlep“), geschrieben bleibt der Originalbuchstabe.',
      sync: 'Geräte-Abgleich', sync_d: 'Mit einem Konto ist dein Fortschritt auf Handy, Tablet und Laptop gleich. Ohne Konto bleibt alles nur auf diesem Gerät.', sync_email: 'E-Mail', sync_pw: 'Passwort (mind. 8 Zeichen)', sync_login: 'Anmelden', sync_signup: 'Konto anlegen', sync_forgot: 'Passwort vergessen?', sync_as: 'Angemeldet als', sync_now: 'Jetzt abgleichen', sync_last: 'Zuletzt abgeglichen', sync_never: 'noch nicht', sync_busy: 'Gleiche ab …', sync_done: 'Abgeglichen ✓', sync_logout: 'Abmelden', sync_del: 'Meine Daten vom Server löschen', sync_del_q: 'Wirklich löschen? Nochmal tippen', sync_deleted: 'Daten auf dem Server gelöscht. Auf diesem Gerät bleibt alles.', sync_mail_sent: 'Fast fertig: Öffne den Link in der E-Mail. Danach bist du angemeldet.', sync_reset_sent: 'Wenn es das Konto gibt, kommt gleich eine E-Mail zum Zurücksetzen.', sync_newpw: 'Neues Passwort', sync_setpw: 'Passwort speichern', sync_pw_saved: 'Neues Passwort gespeichert ✓', sync_shared: 'Ein Konto für alle Apps auf arndt-software.de (z. B. auch GeoQuest).', sync_err_cred: 'E-Mail oder Passwort stimmt nicht.', sync_err_confirm: 'Bitte zuerst den Link in der Bestätigungs-Mail öffnen.', sync_err_exists: 'Für diese E-Mail gibt es schon ein Konto. Bitte anmelden.', sync_err_pw: 'Das Passwort ist zu kurz oder zu einfach.', sync_err_rate: 'Zu viele Versuche. Bitte später nochmal.', sync_err_net: 'Keine Verbindung zum Server. Dein Fortschritt bleibt auf dem Gerät und wird später abgeglichen.', sync_err: 'Das hat nicht geklappt', sync_ob: 'Schon ein Konto? Anmelden und Fortschritt laden', bk_more: 'Ohne Konto: Spielstand als Text übertragen', bk_copy: 'Text kopieren', inst: 'Als App installieren', inst_hint: 'Tipp: Als App installieren', inst_btn: 'Jetzt installieren', inst_d: 'Dann startet Polski Szlak wie eine App vom Startbildschirm, ohne Browserleiste, und läuft offline.', inst_done: 'Polski Szlak läuft schon als App. Gut so!', inst_ios: 'iPhone/iPad: In Safari unten auf das Teilen-Symbol (Viereck mit Pfeil) tippen, dann „Zum Home-Bildschirm“.', inst_other: 'Im Browsermenü (⋮ oder ⋯) „App installieren“ oder „Zum Startbildschirm hinzufügen“ wählen. Am Laptop: Symbol rechts in der Adressleiste.', legal: 'Impressum', privacy: 'Datenschutz',
      about: 'Über die App', about_d: 'Lern-Grundlagen: verteilte Wiederholung, aktives Abrufen, Sätze statt Listen, Wochenziel statt Tagesdruck. Läuft offline. Ohne Konto bleibt alles auf diesem Gerät; mit Konto wird dein Fortschritt zusätzlich zwischen deinen Geräten abgeglichen.', to_start: 'Zur Startseite', next_up: 'Als Nächstes', next_station: 'Nächste Station', go_on: 'Weiter', view_city: 'Stadt ansehen', trip_done: 'Du hast alle Städte geschafft. Gratulacje! Wiederholen hilft jetzt, damit alles sitzt.', step_learn: 'Neue Wörter kennenlernen', step_scene: 'Ein echtes Gespräch vor Ort führen', step_quiz: 'Die neuen Wörter festigen', step_build: 'Eigene Sätze bauen', step_boss: 'Die Stadtprüfung – danach geht die Reise weiter', wb_title: 'Willkommen zurück!', wb_d: 'Schön, dass du wieder da bist. Pausen gehören dazu, nichts ist verloren. Wir frischen kurz 5 Wörter auf, dann geht die Reise weiter.', wb_go: '5 Wörter auffrischen', wb_later: 'Später', cando: 'Das kann ich schon', cando_empty: 'Nach deiner ersten Stadtprüfung steht hier, was du auf Polnisch schon kannst.', cando_stats: '{w} Wörter sicher · {s} Gespräche geführt · {c} Städte geschafft', cando_next: 'Als Nächstes lernst du', ob_inp: 'Wie möchtest du antworten?', ob_inp_d: 'Kannst du jederzeit unter „Ich“ ändern. Bei jeder Schreibfrage gibt es außerdem „Lieber: …“.', letter: 'Der Brief', letter_start: 'Szymek, ein Krasnal aus Wrocław, hat dir einen Brief auf Polnisch gebracht. Noch kannst du ihn nicht lesen, aber nach jeder Stadt wird ein Satz lesbar.', letter_d: '{n} von {t} Sätzen kannst du schon lesen.', letter_new: 'Neu im Brief', letter_open: 'Brief lesen', letter_locked: 'lesbar nach {c}', letter_done: 'Du hast den ganzen Brief gelesen.', letter_from: 'Ein Brief aus Wrocław', mission: 'Mini-Mission', mission_d: 'Freiwillig und im echten Leben. Hak ab, wenn du es gemacht hast.', mission_done: 'Erledigt', mission_ok: 'Mission erledigt', mission_xp: 'Mission erledigt: +15 XP', hear: 'Echtes Polnisch hören', hear_d: 'Hör ein paar Minuten das Radio dieser Region. Du musst nicht alles verstehen: Melodie und einzelne Wörter reichen.', hear_more: 'Polnisch hören', hear_more_d: 'Echte Stimmen, echtes Tempo. Ausgewählte, frei zugängliche Angebote (externe Seiten).', ext: 'externe Seite', aspect: 'Verb-Aspekt', aspect_d: 'Vollendet oder unvollendet? piję oder wypiję', aspect_q: 'Welche Form passt?', asp_pf: 'vollendet (Ergebnis, einmal, fertig)', asp_ipf: 'unvollendet (Verlauf, Dauer, Gewohnheit)', rep: 'Fehler melden', rep_ph: 'Was stimmt nicht? (ohne persönliche Daten)', rep_send: 'Senden', rep_thanks: 'Danke! Die Meldung ist angekommen.', rep_fail: 'Senden hat nicht geklappt. Der Text ist kopiert, du kannst ihn per Mail schicken:', rep_empty: 'Bitte kurz beschreiben, was nicht stimmt.', rep_d: 'Ein Wort falsch übersetzt, ein Satz komisch? Sag Bescheid. Gesendet werden nur dein Text, die Übung und die App-Version.', share_boss: 'Ich habe die Stadtprüfung in {c} geschafft ({p} %)! Polnisch lernen Stadt für Stadt:', share_lq: 'Ich kann den Brief aus Wrocław auf Polnisch lesen ({p} %)! Polski Szlak:', rec: 'Mich aufnehmen und vergleichen', rec_stop: 'Aufnahme stoppen', offline: 'Offline', net_ok: 'Abgeglichen', net_busy: 'Gleiche ab …', net_err: 'Abgleich gestört', tour_next: 'Weiter', tour_skip: 'Überspringen', tour_done: 'Los geht’s', tour_again: 'Kurze Tour wiederholen', tour1: 'Hier geht deine Reise weiter. Der Knopf führt dich immer zum nächsten sinnvollen Schritt.', tour2: 'Die Karte: 12 Städte, jede mit eigenem Thema. Tippe eine Stadt an, um sie zu öffnen.', tour3: 'Der Brief: Nach jeder Stadt kannst du einen Satz mehr lesen.', tour4: 'Üben: Wiederholung, Tagesrätsel, Fälle, Verb-Aspekt und Spiele.', tour5: 'Ich: Einstellungen, Geräte-Abgleich und was du schon kannst.', lq: 'Brief selbst lesen', lq_d: 'Jetzt ohne Übersetzung: Lies jeden Satz und beantworte die Frage dazu.', lq_start: 'Verständnisfragen starten', lq_best: 'Bestes Ergebnis', lq_pass: 'Du verstehst Anias Brief auf Polnisch!'
    },
    en: {
      nav_home: 'Home', nav_practice: 'Practice', nav_album: 'Album', nav_me: 'Me',
      level: 'Level', week: 'This week', of: 'of', days: 'days', wk_streak: 'weeks in a row',
      total_days: 'Total study days', mastered: 'Words solid', due: 'due', continue: 'Continue on the Szlak',
      review: 'Review', review_d: 'What your memory is about to forget', daily: 'Daily puzzle', daily_d: '10 questions, fixed for today',
      blitz: 'Blitz 60', blitz_d: 'One minute, as many as you can', cases: 'Case workshop', cases_d: 'The 7 cases through sentences, not tables',
      sounds: 'Sound detective', sounds_d: 'Hear cz, sz, rz, ł, ą … properly', twister: 'Tongue twisters', twister_d: 'Say the classics out loud',
      prices: 'Hear prices', prices_d: 'Understand złoty amounts', duel: 'Family duel', duel_d: '2–4 people, one phone',
      face: 'Face-off', face_d: '2 people, 1 phone: who taps first?', face_rules: 'Lay the phone flat between you – each of you has one half of the screen. Both see the same question. The first correct tap wins the point. A wrong tap locks you out of that question.', face_n: 'Questions', face_fast: 'was faster', face_wrong: 'Wrong – locked', face_point: '+1 point!', face_nobody: 'Nobody knew it', face_win: 'You win!', face_lose: 'Close – you lose', face_quit: 'Quit',
      mistakes: 'Mistake book', mistakes_d: 'Target your stumbling blocks', mywords: 'My words', mywords_d: 'Your own vocabulary, e.g. from your job',
      learn: 'New words', learn_d: 'Hear, see, remember', quiz: 'Quiz', quiz_d: 'Mixed questions', listen: 'Listening', listen_d: 'Only your ears count',
      type: 'Writing', type_d: 'Type it yourself', build: 'Sentence builder', build_d: 'Build sentences from words', cloze: 'Fill the gap', cloze_d: 'Find the missing word',
      match: 'Pairs', match_d: 'Memory against the clock', speak: 'Speaking', speak_d: 'Say it out loud', scene: 'Scene', scene_d: 'A real conversation on location',
      boss: 'City test', boss_d: '12 questions, 3 lives. Unlocks the next city', locked: 'Still locked', test_out: 'Shortcut: take the test now',
      can: 'Afterwards you can', tip: 'In short', words: 'Vocabulary', check: 'Check', next: 'Next', skip: 'Skip', right: 'Correct', wrong: 'Not quite',
      solution: 'Answer', almost_dia: 'Correct, mind the Polish letters', almost_typo: 'Almost, one typo', listen_again: 'Hear again', slow: 'Slow',
      done: 'Done', score: 'Result', xp: 'XP', combo: 'Combo', back: 'Back', home: 'Back to map', again: 'Again', share: 'Copy result', copied: 'Copied',
      postcards: 'Postcards', krasnale: 'Krasnale', krasnal_found: 'You found a krasnal', krasnal_hint: 'Wrocław’s bronze dwarfs hide after practice sessions. Each one brings a new word.',
      postcard_new: 'New postcard', unlocked: 'New city unlocked', passed: 'Passed', failed: 'Not this time. Your mistakes go into your mistake book.',
      settings: 'Settings', base_lang: 'I learn Polish via', goal: 'Weekly goal (study days)', len: 'Round length', short: 'Short', medium: 'Medium', long: 'Long',
      hardcore: 'Strict typing (accents count, double XP)', theme: 'Appearance', auto: 'Automatic', light: 'Light', dark: 'Dark',
      backup: 'Back up progress', backup_d: 'Copy this text and paste it on another device.', restore: 'Restore', restored: 'Progress loaded', bad_backup: 'That text isn’t a valid save.',
      reset: 'Reset everything', reset_q: 'Really delete everything? Tap again to confirm.',
      vs_last: 'You vs. you last week', this_w: 'this week', last_w: 'last week',
      fresh: 'New week, fresh start', fresh_d: 'Last week: {a} of {g} study days. This week starts clean.', fresh_ok: 'You hit last week’s goal. Nice.',
      pause_ok: 'A day off breaks nothing here. The week is what counts.',
      no_due: 'Nothing is due right now. We’ll take your weakest words.', empty_mistakes: 'Your mistake book is empty.',
      add: 'Add', pl: 'Polish', meaning: 'Meaning', mywords_empty: 'No words of your own yet. Add vocabulary you actually need.', practice_mine: 'Practise my words', delete: 'Delete',
      d2: 'Duel code (2 phones)', d2_d: 'Each plays on their own phone. Same code = exactly the same 20 questions, whatever your progress.', d2_new: 'Create new code', d2_code: 'Code', d2_bad: 'Invalid code. Example: KOT-472-1', d2_level: 'Level (part of the code)',
      d2_check: 'Check mark', d2_check_d: 'Compare the check mark before you start. Only if both see the same one do you have the same questions – otherwise reload the app on both phones.', d2_send_code: 'Share code', d2_share: 'Share result', d2_time: 'Time',
      d2_paste: 'Paste your opponent’s result here', d2_compare: 'Compare', d2_win: 'You win!', d2_lose: 'Your opponent wins', d2_other_code: 'Different code – that result is not from this duel.', d2_other_check: 'Different check mark – you did not have the same questions. Please reload the app on both phones.', d2_unreadable: 'No result found (e.g. “15/20 · 2:13”).', d2_same: 'Same questions confirmed',
      d2_name: 'Your name (for result and leaderboard)', d2_me: 'Me', d2_pol: 'Dla Polaków (native speakers)', d2_learn: 'Learners', d2_weight: 'Points ×',
      d2_mix: 'Mixed play: your opponent uses the same code with their own level, e.g. KOT-472-1 vs KOT-472-P2. Then you get different questions and correct answers are weighted: level 1 ×1 · 2 ×1.5 · 3 ×2 · P1 ×2 · P2 ×2.5 · P3 ×3.',
      d2_rec: 'Recommended for you', d2_mixed: 'Mixed duel – different questions, weighted points', d2_pts: 'Points', d2_inp_diff: 'Note: you played with different answer modes (W = writing, S = speaking, T = tapping).',
      d2_other_base: 'Different code base – this result does not belong to this duel.',
      rank: 'Leaderboard', rank_d: 'Stored on this phone (included in “Back up progress”). Only results with a valid checksum count, each duel only once. Sorted by wins, then points.',
      rank_empty: 'No duels yet. After a duel-code game, paste your opponent’s result and compare.', rank_g: 'Games', rank_w: 'Wins', rank_d2: 'Draws', rank_pts: 'Points', rank_clear: 'Clear leaderboard', rank_clear_q: 'Really clear the leaderboard?',
      rank_added: 'Added to the leaderboard.', rank_dupe: 'This duel is already on the leaderboard.', rank_unsigned: 'Not added to the leaderboard: the result has no valid checksum (edited or old app version).',
      players: 'Players', start: 'Let’s go', turn: '’s turn', winner: 'wins', tie: 'It’s a tie',
      duel_quiz: 'Word quiz', pm: 'Państwa-Miasta', pm_d: 'Scattergories in Polish', pm_letter: 'Letter', pm_pass: 'Hand the phone to', pm_ready: 'Ready – show the letter',
      pm_done: 'Done', pm_check: 'Review', pm_count: 'Count points', pm_next_round: 'Next round', pm_round: 'Round', pm_examples: 'Possible answers',
      pm_valid: 'counts', pm_invalid: 'doesn’t count', pm_total: 'Total', pm_lookaway: 'Everyone else, please look away.', pm_mode: 'Game',
      pm_rules: 'One Polish word per category for each letter. Unique = 10, shared = 5, only valid answer = 20 points. The group can accept unknown words with a tap. Each game uses 5 random categories.',
      memo_w: 'Word memory', memo_w_d: 'Pairs from all open cities', memo_p: 'Places memory', memo_p_d: 'Match place and description', memo_y: 'Year memory', memo_y_d: 'Match year and event',
      pol: 'Dla Polaków', pol_d: 'Mówisz po polsku? Sprawdź, jak dobrze – ortografia, poprawność, frazeologia i wiedza.',
      pol_intro: 'Strefa dla osób, dla których polski jest językiem ojczystym lub które znają go bardzo dobrze. Wszystko po polsku.',
      pol_lv: 'Twój poziom', pol_lvx: 'jeszcze bez testu', pol_lv0: 'podstawowy', pol_lv1: 'dobry', pol_lv2: 'bardzo dobry', pol_lv3: 'mistrz',
      pol_test: 'Test poziomu', pol_test_d: '18 pytań, po 3 z każdej kategorii – od łatwych do bardzo trudnych.',
      pol_qlv: 'Poziom pytań', pol_mix: 'Mieszanka', pol_mix_d: '10 pytań ze wszystkich kategorii', pol_res_up: 'Gratulacje! Nowy poziom', pol_res: 'Twój wynik testu',
      pol_c_ortografia: 'Ortografia', pol_c_ortografia_d: 'ó/u, rz/ż, ch/h, nie razem czy osobno',
      pol_c_poprawnosc: 'Poprawna polszczyzna', pol_c_poprawnosc_d: 'Typowe błędy: wziąć czy wziąść?',
      pol_c_aspekt: 'Aspekt i czasowniki', pol_c_aspekt_d: 'Dokonany, niedokonany, czasowniki ruchu',
      pol_c_liczebniki: 'Liczebniki', pol_c_liczebniki_d: 'Dwóch, dwie, dwoje – i odmiana',
      pol_c_frazeologia: 'Frazeologia', pol_c_frazeologia_d: 'Idiomy, przysłowia, skrzydlate słowa',
      pol_c_wiedza: 'Wiedza o Polsce', pol_c_wiedza_d: 'Literatura, historia, geografia, kultura',
      inp: 'Answer by', inp_write: 'Typing', inp_speak: 'Speaking', inp_tap: 'Tapping', inp_rather: 'Rather',
      inp_write_d: 'You type the answer yourself – best for learning.', inp_speak_d: 'You say the answer out loud (mic). No mic: say it, reveal, rate yourself.', inp_tap_d: 'You pick the answer from four options – just read, no typing.',
      inp_say: 'Say the answer in Polish', inp_reveal: 'Reveal', inp_ok: 'Said it right', inp_no: 'Got it wrong', inp_selfq: 'Said it out loud? Then reveal and rate yourself honestly.',
      speak_tap: 'Tap the mic and speak', speak_self: 'Say it out loud. How did it go?', speak_good: 'Good', speak_retry: 'Again', you_said: 'Heard',
      no_mic: 'Speech recognition isn’t available here. Say it out loud and rate yourself.',
      tts_missing: 'Your device has no Polish voice. The text stays visible.',
      ob_title: 'Learn Polish, city by city.', ob_sub: 'A journey along the Szlak: 12 cities, real conversations, short rounds. No pressure, no guilt.',
      ob_why: 'Why are you learning?', why_travel: 'Travel', why_family: 'Family & friends', why_work: 'Work', why_curious: 'Curiosity',
      ob_goal: 'How many days a week do you want to practise?', ob_go: 'Off to Warszawa',
      hear: 'What do you hear?', choose_meaning: 'What does it mean?', choose_pl: 'How do you say it in Polish?', type_pl: 'Write it in Polish', build_pl: 'Build the sentence', fill: 'Which word is missing?',
      price_q: 'Which amount?', sound_q: 'How does the marked part sound?', hear_word: 'Which word do you hear?', case_q: 'Which form fits?',
      learned_today: 'You can now say', pairs_left: 'pairs left', time_left: 'seconds',
      week_short: ['Mo','Tu','We','Th','Fr','Sa','Su'], city_progress: 'solid', all_cities: 'All cities',
      diff: 'Difficulty', diff_easy: 'Easy', diff_medium: 'Medium', diff_hard: 'Hard',
      diff_easy_d: 'Lots of choices, accents optional, translations visible.',
      diff_medium_d: 'More listening and writing, dictation, test pass mark 70 %. 1.5× XP.',
      diff_hard_d: 'Write almost everything yourself, 6 options, accents count, translations hidden, test 15 questions / 2 lives / 80 %. Double XP.',
      dictate: 'Write what you hear', translate_pl: 'Translate into Polish', show_tr: 'Show translation',
      skip_q: 'Skip question', skip_city: 'Skip city', skip_city_d: 'Unlocks the next city. The postcard still needs a passed test.',
      skipped_city: 'Skipped', skipped_toast: 'On to', free_roam: 'Free travel: all cities open',
      placement: 'Placement test', placement_d: 'Already know some Polish? 2 questions per city, then you start where it gets tricky.',
      placement_res: 'Your start', placement_all: 'You know all cities. Free travel is on.',
      ob_diff: 'How hard should it be?', ob_place: 'I already know some: placement test',
      nav_land: 'Polska', land: 'Land and people', land_d: 'History, customs, people and places. Every round brings knowledge you need when travelling and talking.',
      facts: 'Poland in numbers', whoami: 'Who am I?', whoami_d: 'Guess famous Poles', tf: 'True or false?', tf_d: 'Customs, everyday life, holidays',
      timeline: 'Timeline', timeline_d: 'Put Polish history in order', pin: 'Where is it?', pin_d: 'Find places on the map',
      hl: 'Higher or lower?', hl_d: 'Compare cities, rivers, mountains', literki: 'Literki', literki_d: 'Letter salad: find the Polish word',
      t_true: 'True', t_false: 'False', more_clue: 'Another clue', clue: 'Clue', tap_order: 'Tap the events, oldest first',
      tap_map: 'Tap the map', km_off: 'km off', letters_q: 'Which word is hidden here?', order_q: 'Order',
      survival: 'Survival', survival_d: 'A few seconds per question, 3 lives, see how far you get', best: 'Record',
      j_5050: '50:50', j_freeze: '+10 s', j_hint: 'Hint', jokers: 'Jokers', jokers_d: 'Every Monday you get 3 of each again. 50:50 removes two wrong answers, Hint shows the first letters, +10 s stops the clock.',
      sec: 'sec',
      spell: 'Spelling', spell_d: 'ó or u? rz or ż? Find the correct spelling', spell_q: 'Which spelling is correct?',
      rule_ou: 'ó and u sound the same. You have to remember the spelling.', rule_rz: 'rz and ż sound the same. Tip: if related words have an r (morze → morski), write rz.',
      rule_ch: 'ch and h sound the same today. ch is much more common; h appears mostly in loanwords (herbata, hotel).', rule_dia: 'Without the accent it is a different sound, sometimes even a different word.', rule_nasal: 'ą and ę are nasal vowels of their own and are not written om/en.', rule_soft: 'ś/ć/ź are soft (tongue forward), sz/cz/ż hard. Before a vowel you write si/ci/zi instead of ś/ć/ź.', rule_final: 'At the end of a word b, d, g, w, z are pronounced voiceless (chleb sounds like "chlep"), but the spelling keeps the original letter.',
      sync: 'Device sync', sync_d: 'With an account your progress is the same on phone, tablet and laptop. Without one, everything stays on this device only.', sync_email: 'Email', sync_pw: 'Password (min. 8 characters)', sync_login: 'Sign in', sync_signup: 'Create account', sync_forgot: 'Forgot password?', sync_as: 'Signed in as', sync_now: 'Sync now', sync_last: 'Last synced', sync_never: 'not yet', sync_busy: 'Syncing …', sync_done: 'Synced ✓', sync_logout: 'Sign out', sync_del: 'Delete my data from the server', sync_del_q: 'Really delete? Tap again', sync_deleted: 'Server data deleted. Everything stays on this device.', sync_mail_sent: 'Almost done: open the link in the email. Then you are signed in.', sync_reset_sent: 'If the account exists, a reset email is on its way.', sync_newpw: 'New password', sync_setpw: 'Save password', sync_pw_saved: 'New password saved ✓', sync_shared: 'One account for all apps on arndt-software.de (e.g. GeoQuest too).', sync_err_cred: 'Email or password is wrong.', sync_err_confirm: 'Please open the link in the confirmation email first.', sync_err_exists: 'This email already has an account. Please sign in.', sync_err_pw: 'The password is too short or too simple.', sync_err_rate: 'Too many attempts. Please try again later.', sync_err_net: 'No connection to the server. Your progress stays on this device and will sync later.', sync_err: 'That did not work', sync_ob: 'Already have an account? Sign in and load progress', bk_more: 'Without an account: transfer progress as text', bk_copy: 'Copy text', inst: 'Install as app', inst_hint: 'Tip: install as an app', inst_btn: 'Install now', inst_d: 'Polski Szlak then starts like an app from your home screen, without the browser bar, and works offline.', inst_done: 'Polski Szlak is already running as an app. Nice!', inst_ios: 'iPhone/iPad: in Safari tap the Share icon (square with arrow), then “Add to Home Screen”.', inst_other: 'In the browser menu (⋮ or ⋯) choose “Install app” or “Add to Home screen”. On a laptop: icon on the right of the address bar.', legal: 'Legal notice', privacy: 'Privacy',
      about: 'About', about_d: 'Built on spaced repetition, active recall, sentences instead of lists, and a weekly goal instead of daily pressure. Works offline. Without an account everything stays on this device; with an account your progress is also synced between your devices.', to_start: 'Go to home screen', next_up: 'Up next', next_station: 'Next stop', go_on: 'Continue', view_city: 'View city', trip_done: 'You have completed every city. Gratulacje! Reviewing now helps everything stick.', step_learn: 'Get to know new words', step_scene: 'Have a real conversation on location', step_quiz: 'Practise the new words', step_build: 'Build your own sentences', step_boss: 'The city test – then the journey goes on', wb_title: 'Welcome back!', wb_d: 'Great to see you again. Breaks are part of it, nothing is lost. Let us refresh 5 words, then the journey continues.', wb_go: 'Refresh 5 words', wb_later: 'Later', cando: 'What I can already do', cando_empty: 'After your first city test, this shows what you can already do in Polish.', cando_stats: '{w} words mastered · {s} conversations · {c} cities done', cando_next: 'Next you will learn', ob_inp: 'How would you like to answer?', ob_inp_d: 'You can change this any time under “Me”. Every typing question also offers “Rather: …”.', letter: 'The letter', letter_start: 'Szymek, a Krasnal from Wrocław, has brought you a letter in Polish. You can’t read it yet, but after every city one more sentence becomes readable.', letter_d: 'You can already read {n} of {t} sentences.', letter_new: 'New in the letter', letter_open: 'Read the letter', letter_locked: 'readable after {c}', letter_done: 'You have read the whole letter.', letter_from: 'A letter from Wrocław', mission: 'Mini mission', mission_d: 'Optional, in real life. Tick it off when you have done it.', mission_done: 'Done', mission_ok: 'Mission done', mission_xp: 'Mission done: +15 XP', hear: 'Hear real Polish', hear_d: 'Listen to this region\'s radio for a few minutes. You don\'t have to understand everything: the melody and a few words are enough.', hear_more: 'Listen to Polish', hear_more_d: 'Real voices, real speed. Selected, freely available resources (external sites).', ext: 'external site', aspect: 'Verb aspect', aspect_d: 'Perfective or imperfective? piję or wypiję', aspect_q: 'Which form fits?', asp_pf: 'perfective (result, once, finished)', asp_ipf: 'imperfective (in progress, duration, habit)', rep: 'Report a mistake', rep_ph: 'What is wrong? (no personal data)', rep_send: 'Send', rep_thanks: 'Thank you! Your report has arrived.', rep_fail: 'Sending failed. The text has been copied, you can send it by email:', rep_empty: 'Please describe briefly what is wrong.', rep_d: 'A word translated wrongly, an odd sentence? Let us know. Only your text, the exercise and the app version are sent.', share_boss: 'I passed the city test in {c} ({p}%)! Learn Polish city by city:', share_lq: 'I can read the letter from Wrocław in Polish ({p}%)! Polski Szlak:', rec: 'Record myself and compare', rec_stop: 'Stop recording', offline: 'Offline', net_ok: 'Synced', net_busy: 'Syncing …', net_err: 'Sync problem', tour_next: 'Next', tour_skip: 'Skip', tour_done: 'Let’s go', tour_again: 'Repeat the short tour', tour1: 'Your journey continues here. This button always takes you to the next sensible step.', tour2: 'The map: 12 cities, each with its own topic. Tap a city to open it.', tour3: 'The letter: after every city you can read one more sentence.', tour4: 'Practice: review, daily puzzle, cases, verb aspect and games.', tour5: 'Me: settings, device sync and what you can already do.', lq: 'Read the letter yourself', lq_d: 'Now without translation: read each sentence and answer the question.', lq_start: 'Start the questions', lq_best: 'Best result', lq_pass: 'You understand Ania\'s letter in Polish!'
    }
  };

  /* ---------- Zustand ---------- */
  function fresh() {
    return { app: 'polski-szlak', v: 1, base: (navigator.language || 'de').slice(0, 2) === 'en' ? 'en' : 'de', onboarded: false, why: '', goal: 4, len: 10,
      xp: 0, cards: {}, active: {}, unlocked: 0, boss: {}, scenes: {}, krasnale: [], mistakes: [], custom: [], weekXp: {}, hardcore: false, slow: false,
      theme: 'auto', instHint: false, ts: 0, daily: {}, seenWeek: '', diff: 'easy', free: false, skipped: {}, jokers: { five0: 3, freeze: 3, hint: 3 }, jokerWeek: '', best: {}, input: 'write', plv: null, plBest: {}, name: '', rank: {}, rankSeen: [], done: {}, welcomeDay: '', missions: {}, tour: false, letterQuiz: 0 }; /* PATCH002 PATCH004 */
  }
  var S = load();
  function load() {
    try { var raw = localStorage.getItem(KEY); if (raw) { var o = JSON.parse(raw); if (C.validateSave(o)) return Object.assign(fresh(), o); } } catch (e) {}
    try { var h = window.claude && window.claude.hot && window.claude.hot.data; if (h && C.validateSave(h)) return Object.assign(fresh(), h); } catch (e) {}
    return fresh();
  }
  function saveLocal() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function save() { S.ts = Date.now(); saveLocal(); syncSoon(); }
  try { if (window.claude && window.claude.hot) window.claude.hot.snapshot(function () { return S; }); } catch (e) {}

  function diff() { return C.diffCfg(S.diff); }
  function isOpen(i) { return S.free || i <= S.unlocked; }
  /* Dla Polaków: Spieloberfläche komplett Polnisch (polUI an, solange man im Bereich ist) */
  var polUI = false, PLX = { again: 'Jeszcze raz', back: 'Wróć', best: 'Rekord', combo: 'Seria', done: 'Koniec', failed: 'Tym razem się nie udało.', home: 'Wróć', next: 'Dalej', passed: 'Zaliczone', right: 'Dobrze', score: 'Wynik', skip: 'Pomiń', skip_q: 'Pomiń pytanie', solution: 'Odpowiedź', wrong: 'Niestety nie', check: 'Sprawdź', share: 'Kopiuj wynik', copied: 'Skopiowano', start: 'Start', j_hint: 'Podpowiedź', jokers_d: 'Co poniedziałek znowu po 3 sztuki. 50:50 usuwa dwie złe odpowiedzi, +10 s zatrzymuje zegar.' };
  function t(k) { if (polUI && PLX[k] != null) return PLX[k]; var v = TX[S.base][k]; return v == null ? k : v; }
  function L(pair) { return S.base === 'en' ? pair[1] : pair[0]; }
  function meaning(w) { return S.base === 'en' ? w[2] : w[1]; }
  function cityName(u) { return S.base === 'en' ? u.cityEn : u.cityDe; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function today() { return C.dayKey(new Date()); }
  function applyTheme() { if (S.theme === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', S.theme); document.documentElement.lang = S.base; }

  /* ---------- Karten / Wörter ---------- */
  function allWords() {
    var out = [];
    U.forEach(function (u, ui) { u.words.forEach(function (w, i) { out.push({ id: u.id + ':' + i, w: w, u: ui }); }); });
    S.custom.forEach(function (w, i) { out.push({ id: 'my:' + i, w: w, u: -1 }); });
    return out;
  }
  function wordsOf(ui) { return U[ui].words.map(function (w, i) { return { id: U[ui].id + ':' + i, w: w, u: ui }; }); }
  function byId(id) { var a = allWords(); for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i]; return null; }
  function masteredCount(list) { return (list || allWords()).filter(function (x) { var c = S.cards[x.id]; return c && c.box >= C.MASTERED_BOX; }).length; }
  function dueList() { var d = today(); return allWords().filter(function (x) { return C.isDue(S.cards[x.id], d); }); }
  function openUnits() { var a = []; for (var i = 0; i < U.length; i++) if (isOpen(i)) a.push(i); return a; }
  function nextUnit() { for (var i = 0; i < U.length; i++) if (isOpen(i) && !S.boss[U[i].id] && !S.skipped[U[i].id]) return i; return Math.min(S.unlocked, U.length - 1); }
  function poolOpen() { var p = []; openUnits().forEach(function (ui) { p = p.concat(wordsOf(ui)); }); return p; }

  /* ---------- Sprachausgabe ---------- */
  var voice = null;
  function pickVoice() { try { var vs = speechSynthesis.getVoices(); voice = vs.filter(function (v) { return /^pl/i.test(v.lang); })[0] || null; } catch (e) {} }
  try { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; } catch (e) {}
  /* Muttersprachler-Aufnahmen (Vorschlag L): data.json "audio" ordnet Text -> Datei unter audio/ zu. Fehlt eine Aufnahme, spricht die Gerätestimme. */
  var curAudio = null;
  function audioFor(text) { var m = D.audio || {}, k = String(text).replace(/…/g, '').trim(); return m[k] || m[k.toLowerCase()] || null; }
  function speak(text, slow) {
    var src = !slow && !S.slow && audioFor(text);
    if (src) {
      try { if (curAudio) curAudio.pause(); speechSynthesis.cancel(); } catch (e) {}
      try { curAudio = new Audio(src); curAudio.play().catch(function () { curAudio = null; ttsSpeak(text, slow); }); return; } catch (e) {}
    }
    ttsSpeak(text, slow);
  }
  function ttsSpeak(text, slow) {
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(text).replace(/…/g, ''));
      u.lang = 'pl-PL'; if (voice) u.voice = voice; u.rate = (slow || S.slow) ? 0.7 : 0.95;
      speechSynthesis.speak(u);
    } catch (e) { toast(t('tts_missing')); }
  }

  /* ---------- Icons ---------- */
  var I = {
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>',
    dumb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z"/><path d="M4 19a2 2 0 0 1 2-2h13"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    spk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>',
    snail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18h13a5 5 0 1 0-5-5 2.5 2.5 0 1 0 2.5-2.5"/><path d="M16 18l3-6M19 12l1-3M19 12l-2-2"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 21V4"/><path d="M5 4h13v5H5"/><path d="M5 9h13v5H5" fill="currentColor" fill-opacity=".35"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>'
  };
  function blaze(tr) { return '<span class="blaze tr-' + tr + '" aria-hidden="true"><i></i><i></i><i></i></span>'; }
  function krasnalSvg() {
    return '<svg viewBox="0 0 56 64" aria-hidden="true"><path d="M28 2 14 26h28z" fill="var(--red)"/><circle cx="28" cy="31" r="9" fill="var(--amber)"/><path d="M18 34c2 10 18 10 20 0-3 6-17 6-20 0z" fill="var(--blaze-white)" stroke="var(--map-edge)"/><rect x="17" y="40" width="22" height="16" rx="5" fill="var(--t-green)"/><rect x="18" y="56" width="8" height="6" rx="2" fill="var(--ink)"/><rect x="30" y="56" width="8" height="6" rx="2" fill="var(--ink)"/></svg>';
  }

  /* ---------- Fortschritt buchen ---------- */
  function markActive() { var d = today(); S.active[d] = (S.active[d] || 0) + 1; }
  function addXp(n) { S.xp += n; var wk = C.weekKey(today()); S.weekXp[wk] = (S.weekXp[wk] || 0) + n; }
  function grade(id, ok) {
    if (!id) return;
    S.cards[id] = C.srsUpdate(S.cards[id], ok, today());
    if (!ok) { S.mistakes = S.mistakes.filter(function (m) { return m !== id; }); S.mistakes.unshift(id); S.mistakes = S.mistakes.slice(0, 60); }
    else if (S.cards[id].box >= 3) S.mistakes = S.mistakes.filter(function (m) { return m !== id; });
  }

  /* ---------- Toast ---------- */
  var toastT;
  function toast(msg) { var el = document.querySelector('.toast'); if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); } el.textContent = msg; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { el.hidden = true; }, 2200); }
  function copy(text) {
    try { navigator.clipboard.writeText(text).then(function () { toast(t('copied')); }, function () { fallbackCopy(text); }); } catch (e) { fallbackCopy(text); }
  }
  function fallbackCopy(text) { var ta = document.getElementById('copy-fallback'); if (ta) { ta.value = text; ta.hidden = false; ta.select(); } }

  /* ---------- Routing ---------- */
  var tab = 'home', view = null;
  function go(name, arg) { var tb = document.getElementById('tour'); if (tb) { tb.remove(); document.querySelectorAll('.tour-hl').forEach(function (e) { e.classList.remove('tour-hl'); }); } view = null; tab = name; polUI = name === 'polacy'; render(arg); window.scrollTo(0, 0); }

  function shell(inner, showNav) {
    var lv = C.levelFromXp(S.xp);
    var html = '<header class="top"><div class="top-in"><button type="button" class="brand" id="brand" title="' + esc(t('to_start')) + '" aria-label="Polski Szlak – ' + esc(t('to_start')) + '">' + blaze('red') + 'Polski Szlak</button>' +
      '<span class="chip num" title="' + t('level') + '">' + t('level') + ' ' + lv.level + '</span>' +
      '<span class="chip amber num">' + S.xp + ' ' + t('xp') + '</span>' + netChip() + '</div></header><main id="main">' + inner + '</main>';
    if (showNav !== false) {
      html += '<nav class="nav" aria-label="Navigation"><div class="nav-in">' +
        navBtn('home', I.map, t('nav_home')) + navBtn('practice', I.dumb, t('nav_practice')) + navBtn('land', I.flag, t('nav_land')) + navBtn('album', I.book, t('nav_album')) + navBtn('me', I.user, t('nav_me')) +
        '</div></nav>';
    }
    html += '<textarea id="copy-fallback" hidden aria-label="Copy"></textarea>';
    $app.innerHTML = html;
    $app.querySelectorAll('[data-nav]').forEach(function (b) { b.onclick = function () { go(b.getAttribute('data-nav')); }; });
    document.getElementById('brand').onclick = function () { if (G) { stopTimer(); G = null; } go('home'); };
    bindNet();
  }
  /* Kleine Anzeige im Kopf: offline, oder (mit Konto) Stand des Geräte-Abgleichs */
  function netChip() {
    var off = !navigator.onLine, st = off ? 'off' : (A && A.uid ? (syncBusy ? 'busy' : (syncErr ? 'err' : 'ok')) : '');
    if (!st) return '<span id="net" hidden></span>';
    var lab = t(st === 'off' ? 'offline' : 'net_' + st);
    return '<button type="button" id="net" class="chip net ' + st + '" title="' + esc(lab) + '" aria-label="' + esc(lab) + '"><i aria-hidden="true"></i>' + (st === 'off' ? '<span>' + esc(lab) + '</span>' : '') + '</button>';
  }
  function bindNet() { var n = document.getElementById('net'); if (n && n.tagName === 'BUTTON') n.onclick = function () { if (G) return; go('me'); setTimeout(function () { var y = document.getElementById('sync'); if (y) y.scrollIntoView({ block: 'center' }); }, 50); }; }
  function updateNet() { var n = document.getElementById('net'); if (!n) return; var tmp = document.createElement('div'); tmp.innerHTML = netChip(); n.replaceWith(tmp.firstChild); bindNet(); }
  try { window.addEventListener('online', function () { updateNet(); syncSoon(); }); window.addEventListener('offline', updateNet); } catch (e) {}
  function navBtn(k, ic, label) { return '<button data-nav="' + k + '"' + (tab === k ? ' aria-current="page"' : '') + '>' + ic + '<span>' + esc(label) + '</span></button>'; }

  function render(arg) {
    applyTheme();
    var jw = C.weekKey(today()); if (S.jokerWeek !== jw) { S.jokers = { five0: 3, freeze: 3, hint: 3 }; S.jokerWeek = jw; save(); }
    if (!S.onboarded) return renderOnboarding();
    if (tab === 'home') return renderHome();
    if (tab === 'city') return renderCity(arg);
    if (tab === 'practice') return renderPractice();
    if (tab === 'album') return renderAlbum();
    if (tab === 'me') return renderMe();
    if (tab === 'land') return renderLand();
    if (tab === 'mywords') return renderMyWords();
    if (tab === 'duel') return renderDuelSetup();
    if (tab === 'face') return renderFaceSetup();
    if (tab === 'polacy') return renderPolacy();
    if (tab === 'letter') return renderLetter();
  }

  /* ---------- Onboarding ---------- */
  function renderOnboarding() {
    if (obSync) {
      shell('<button class="btn ghost" id="ob-back" style="justify-self:start;padding-left:0">← ' + esc(t('back')) + '</button>' + syncBox(), false);
      document.getElementById('ob-back').onclick = function () { obSync = false; renderOnboarding(); };
      bindSync(); return;
    }
    shell('<section class="ob">' +
      '<div class="stack"><span class="eyebrow">Polski Szlak</span><div class="big">' + esc(t('ob_title')) + '</div><p class="muted">' + esc(t('ob_sub')) + '</p></div>' +
      '<div class="stack"><b>' + esc(TX.de.base_lang) + ' / ' + esc(TX.en.base_lang) + '</b><div class="seg" id="ob-base">' +
        segBtn('de', 'Deutsch', S.base === 'de') + segBtn('en', 'English', S.base === 'en') + '</div></div>' +
      '<div class="stack"><b>' + esc(t('ob_why')) + '</b><div class="seg" id="ob-why">' +
        ['travel', 'family', 'work', 'curious'].map(function (k) { return segBtn(k, t('why_' + k), S.why === k); }).join('') + '</div></div>' +
      '<div class="stack"><b>' + esc(t('ob_goal')) + '</b><div class="seg" id="ob-goal">' +
        [2, 3, 4, 5, 7].map(function (n) { return segBtn(String(n), String(n), S.goal === n); }).join('') + '</div><p class="small muted">' + esc(t('pause_ok')) + '</p></div>' +
      '<div class="stack"><b>' + esc(t('ob_diff')) + '</b><div class="seg" id="ob-diff">' + ['easy', 'medium', 'hard'].map(function (k) { return segBtn(k, t('diff_' + k), S.diff === k); }).join('') + '</div><p class="small muted">' + esc(t('diff_' + S.diff + '_d')) + '</p></div>' +
      '<div class="stack"><b>' + esc(t('ob_inp')) + '</b><div class="seg" id="ob-inp">' + ['write', 'speak', 'tap'].map(function (k) { return segBtn(k, t('inp_' + k), S.input === k); }).join('') + '</div><p class="small muted">' + esc(t('inp_' + S.input + '_d')) + ' ' + esc(t('ob_inp_d')) + '</p></div>' +
      '<button class="btn primary block" id="ob-go">' + esc(t('ob_go')) + '</button><button class="btn block" id="ob-place">' + esc(t('ob_place')) + '</button><button class="btn ghost block" id="ob-sync">' + esc(t('sync_ob')) + '</button></section>', false);
    document.getElementById('ob-sync').onclick = function () { obSync = true; renderOnboarding(); };
    bindSeg('ob-base', function (v) { S.base = v; renderOnboarding(); });
    bindSeg('ob-why', function (v) { S.why = v; renderOnboarding(); });
    bindSeg('ob-goal', function (v) { S.goal = +v; renderOnboarding(); });
    bindSeg('ob-diff', function (v) { S.diff = v; renderOnboarding(); });
    bindSeg('ob-inp', function (v) { S.input = v; renderOnboarding(); });
    document.getElementById('ob-place').onclick = function () { S.onboarded = true; S.seenWeek = C.weekKey(today()); save(); tab = 'home'; startMode('placement'); };
    document.getElementById('ob-go').onclick = function () { S.onboarded = true; S.seenWeek = C.weekKey(today()); save(); go('city', 0); };
  }
  function segBtn(v, label, on) { return '<button type="button" data-v="' + esc(v) + '" aria-pressed="' + (on ? 'true' : 'false') + '">' + esc(label) + '</button>'; }
  function bindSeg(id, fn) { document.querySelectorAll('#' + id + ' button').forEach(function (b) { b.onclick = function () { fn(b.getAttribute('data-v')); }; }); }

  /* ---------- Karte ---------- */
  function proj(lon, lat) { return C.proj(lon, lat); } /* PATCH003 */
  function mapSvg() {
    var pts = D.outline.map(function (p) { var q = proj(p[0], p[1]); return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' ');
    var route = U.map(function (u) { return proj(u.lon, u.lat); });
    var routeAll = route.map(function (q) { return q.join(','); }).join(' ');
    var doneUpTo = Math.min(S.unlocked, U.length - 1);
    var routeDone = route.slice(0, doneUpTo + 1).map(function (q) { return q.join(','); }).join(' ');
    var nodes = U.map(function (u, i) {
      var q = route[i], cls = 'node ' + (S.boss[u.id] ? 'done' : (isOpen(i) ? 'open' : 'locked')) + (i === nextUnit() && !S.boss[u.id] ? ' next' : '');
      var lx = q[0] + 16, anchor = 'start';
      if (q[0] > 520 || u.id === 'kat') { lx = q[0] - 16; anchor = 'end'; }
      return '<g class="' + cls + '" data-city="' + i + '" role="button" tabindex="0" aria-label="' + esc(u.city) + '">' +
        '<circle class="halo" cx="' + q[0] + '" cy="' + q[1] + '" r="24" fill="transparent"/>' +
        '<circle class="dot" cx="' + q[0] + '" cy="' + q[1] + '" r="10"/>' +
        '<text x="' + lx + '" y="' + (q[1] + 7) + '" text-anchor="' + anchor + '">' + esc(u.city) + '</text></g>';
    }).join('');
    return '<svg class="map" viewBox="-10 0 680 650" role="img" aria-label="' + esc(t('all_cities')) + '"><polygon class="land" points="' + pts + '"/>' +
      '<polyline class="route" points="' + routeAll + '"/>' + (doneUpTo > 0 ? '<polyline class="route-done" points="' + routeDone + '"/>' : '') + nodes + '</svg>';
  }

  function weekRing() {
    var wk = C.weekKey(today()), n = C.daysInWeek(S.active, wk), g = S.goal, r = 38, cx = 46, cy = 46, segs = '';
    for (var i = 0; i < g; i++) {
      var a0 = (i / g) * Math.PI * 2 - Math.PI / 2 + 0.06, a1 = ((i + 1) / g) * Math.PI * 2 - Math.PI / 2 - 0.06;
      var x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      var large = (a1 - a0) > Math.PI ? 1 : 0;
      segs += '<path d="M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + '" fill="none" stroke-width="9" stroke-linecap="round" stroke="' + (i < n ? 'var(--red)' : 'var(--line)') + '"/>';
    }
    return '<svg class="ring" viewBox="0 0 92 92" role="img" aria-label="' + n + ' ' + t('of') + ' ' + g + '">' + segs +
      '<text x="46" y="52" text-anchor="middle" font-size="22">' + Math.min(n, 99) + '/' + g + '</text></svg>';
  }

  function renderHome() {
    var d = today(), wk = C.weekKey(d), nUnit = nextUnit(), u = U[nUnit];
    var due = dueList().length, ws = C.weekStreak(S.active, S.goal, d);
    var banner = '', gap = C.daysSince(S.active, d), step = C.nextStep(S, u.id);
    if (gap >= 7 && S.welcomeDay !== d && Object.keys(S.cards).length) {
      banner = '<section class="card stack pop welcome" id="wb"><b class="big">' + esc(t('wb_title')) + '</b><p>' + esc(t('wb_d')) + '</p>' +
        '<div class="row"><button class="btn primary" id="wb-go">' + esc(t('wb_go')) + '</button><button class="btn ghost" id="wb-later">' + esc(t('wb_later')) + '</button></div></section>';
      S.welcomeDay = d; S.seenWeek = wk; save();
    } else if (S.seenWeek && S.seenWeek !== wk) {
      var lastN = C.daysInWeek(S.active, C.prevWeek(wk));
      banner = '<div class="banner pop"><strong>' + esc(t('fresh')) + '</strong><span>' + esc(lastN >= S.goal ? t('fresh_ok') : t('fresh_d').replace('{a}', lastN).replace('{g}', S.goal)) + '</span></div>';
      S.seenWeek = wk; save();
    }
    var lastXp = S.weekXp[C.prevWeek(wk)] || 0, thisXp = S.weekXp[wk] || 0, mx = Math.max(lastXp, thisXp, 1);
    var html = banner +
      '<section class="card hero"><div class="hero-top">' + weekRing() + '<div class="stack" style="gap:4px;min-width:0"><span class="eyebrow">' + esc(t('week')) + '</span>' +
      '<b class="num">' + ws + ' ' + esc(t('wk_streak')) + '</b><span class="small muted num">' + C.totalDays(S.active) + ' ' + esc(t('total_days')) + ' · ' + masteredCount() + ' ' + esc(t('mastered')) + '</span></div></div>' +
      '<button class="btn primary block" id="cta">' + blaze(u.trail) + esc(t('continue')) + ': ' + esc(u.city) + (step ? ' · ' + esc(t(step)) : '') + '</button>' +
      (step ? '<div class="row small" style="justify-content:space-between"><span class="muted">' + esc(t('next_up')) + ': ' + esc(t('step_' + step)) + '</span><button class="btn ghost small" id="cta-city" style="min-height:36px;padding:4px 0">' + esc(t('view_city')) + ' →</button></div>' : '') + '</section>' +
      letterCard() +
      '<section class="map-wrap card" style="padding:8px">' + mapSvg() + '</section>' +
      '<section class="tiles">' +
        tileBtn('review', t('review'), t('review_d'), due ? '<span class="badge num">' + due + ' ' + esc(t('due')) + '</span>' : '') +
        tileBtn('daily', t('daily'), t('daily_d'), S.daily[d] ? '<span class="badge good num">' + S.daily[d].score + '/10</span>' : '') +
      '</section>' +
      '<section class="card stack"><span class="eyebrow">' + esc(t('vs_last')) + '</span>' +
        '<div class="row small"><span style="width:110px">' + esc(t('this_w')) + '</span><div class="bar" style="flex:1"><i style="width:' + (thisXp / mx * 100) + '%"></i></div><b class="num">' + thisXp + '</b></div>' +
        '<div class="row small"><span style="width:110px">' + esc(t('last_w')) + '</span><div class="bar muted" style="flex:1"><i style="width:' + (lastXp / mx * 100) + '%"></i></div><b class="num">' + lastXp + '</b></div>' +
      '</section>';
    shell(html);
    document.getElementById('cta').onclick = function () { if (step && isOpen(nUnit)) startMode(step, nUnit); else go('city', nUnit); };
    var cc = document.getElementById('cta-city'); if (cc) cc.onclick = function () { go('city', nUnit); };
    var lo = document.getElementById('letter-open'); if (lo) lo.onclick = function () { go('letter'); };
    var wg = document.getElementById('wb-go'); if (wg) wg.onclick = function () { startMode('welcome'); };
    var wl = document.getElementById('wb-later'); if (wl) wl.onclick = function () { var w = document.getElementById('wb'); if (w) w.remove(); };
    bindTiles();
    if (!S.tour && !banner) setTimeout(function () { if (tab === 'home' && !view) startTour(); }, 400);
    document.querySelectorAll('[data-city]').forEach(function (g) {
      var open = function () { go('city', +g.getAttribute('data-city')); };
      g.onclick = open; g.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } };
    });
  }
  function tileBtn(k, title, desc, extra) { return '<button class="tile" data-mode="' + k + '"><span class="t">' + esc(title) + '</span><span class="d">' + esc(desc) + '</span>' + (extra || '') + '</button>'; }
  function bindTiles(ui) { document.querySelectorAll('[data-mode]').forEach(function (b) { b.onclick = function () { startMode(b.getAttribute('data-mode'), ui); }; }); }

  /* ---------- Stadt ---------- */
  function renderCity(ui) {
    ui = ui == null ? 0 : ui; var u = U[ui], locked = !isOpen(ui);
    var list = wordsOf(ui), m = masteredCount(list);
    var html = '<section class="city-head"><button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('home')) + '</button>' +
      '<div class="row">' + blaze(u.trail) + '<span class="eyebrow">' + (ui + 1) + ' / ' + U.length + ' · ' + esc(cityName(u)) + '</span></div>' +
      '<div class="pl">' + esc(u.city) + '</div><h2>' + esc(L(u.title)) + '</h2>' +
      '<div class="row small muted num"><div class="bar" style="flex:1;max-width:240px"><i style="width:' + (m / list.length * 100) + '%"></i></div>' + m + '/' + list.length + ' ' + esc(t('city_progress')) + (S.boss[u.id] ? ' · <span class="badge good">' + esc(t('passed')) + '</span>' : (S.skipped[u.id] ? ' · <span class="badge">' + esc(t('skipped_city')) + '</span>' : '')) + '</div></section>' +
      '<section class="card stack"><span class="eyebrow">' + esc(t('can')) + '</span><p>' + esc(L(u.can)) + '</p></section>';
    if (locked) {
      html += '<section class="card stack"><b>' + esc(t('locked')) + '</b><button class="btn primary" data-mode="boss">' + esc(t('test_out')) + '</button><button class="btn" id="skip-city">' + esc(t('skip_city')) + '</button><p class="small muted">' + esc(t('skip_city_d')) + '</p></section>';
    } else {
      var nst = C.nextStep(S, u.id), nx = function (k) { return k === nst ? '<span class="badge next">' + esc(t('next_up')) + '</span>' : ''; };
      html += '<section class="tiles">' +
        tileBtn('learn', t('learn'), t('learn_d'), nx('learn')) + tileBtn('scene', t('scene'), t('scene_d'), S.scenes[u.id] ? '<span class="badge good">✓</span>' : nx('scene')) +
        tileBtn('quiz', t('quiz'), t('quiz_d'), nx('quiz')) + tileBtn('listen', t('listen'), t('listen_d')) +
        tileBtn('type', t('type'), t('type_d')) + tileBtn('build', t('build'), t('build_d'), nx('build')) +
        tileBtn('cloze', t('cloze'), t('cloze_d')) + tileBtn('match', t('match'), t('match_d')) +
        tileBtn('speak', t('speak'), t('speak_d')) + tileBtn('boss', t('boss'), t('boss_d'), S.boss[u.id] ? '<span class="badge good num">' + S.boss[u.id] + '%</span>' : nx('boss')) +
        '</section>';
      if (!S.boss[u.id] && ui < U.length - 1) html += '<button class="btn ghost" id="skip-city" style="justify-self:start">' + esc(t('skip_city')) + ' →</button>';
      html += missionBox(u);
    }
    html += '<section class="tip"><span class="eyebrow">' + esc(t('tip')) + '</span><p>' + esc(L(u.tip)) + '</p></section>' + radioBox(u) +
      '<section class="card"><span class="eyebrow">' + esc(t('words')) + '</span><div class="list">' +
      list.map(function (x) {
        var c = S.cards[x.id], b = c ? c.box : 0, dots = '';
        for (var i = 1; i <= C.MASTERED_BOX; i++) dots += '<i class="' + (b >= i ? 'on' : '') + '"></i>';
        return '<div class="li"><button class="icon-btn" data-say="' + esc(x.w[0]) + '" aria-label="' + esc(t('listen_again')) + '">' + I.spk + '</button>' +
          '<div class="grow"><div class="pl-word">' + esc(x.w[0]) + '</div><div class="small muted">' + esc(meaning(x.w)) + '</div></div><span class="box-dots" aria-hidden="true">' + dots + '</span></div>';
      }).join('') + '</div></section>';
    shell(html);
    document.getElementById('back').onclick = function () { go('home'); };
    document.querySelectorAll('[data-say]').forEach(function (b) { b.onclick = function () { speak(b.getAttribute('data-say')); }; });
    bindTiles(ui);
    var sk = document.getElementById('skip-city'); if (sk) sk.onclick = function () { skipCity(ui); };
    var mi = document.getElementById('mis'); if (mi) mi.onclick = function () {
      if (S.missions[u.id]) return;
      S.missions[u.id] = today(); addXp(15); markActive(); save(); toast(t('mission_xp')); confetti(); renderCity(ui);
    };
  }
  /* Mini-Mission (Vorschlag H): freiwillige Aufgabe im echten Leben, eine pro Stadt */
  function missionBox(u) {
    var m = D.missions && D.missions[u.id]; if (!m) return '';
    var done = S.missions && S.missions[u.id];
    return '<section class="card stack mission"><div class="row" style="justify-content:space-between"><span class="eyebrow">' + esc(t('mission')) + '</span>' + (done ? '<span class="badge good">✓ ' + esc(t('mission_ok')) + '</span>' : '') + '</div>' +
      '<p class="lt-pl" lang="pl">' + esc(m.pl) + '</p><p class="small">' + esc(L(m.d)) + '</p>' +
      (done ? '' : '<p class="small muted">' + esc(t('mission_d')) + '</p><button class="btn" id="mis" style="justify-self:start">✓ ' + esc(t('mission_done')) + ' · +15 XP</button>') + '</section>';
  }
  /* Echtes Polnisch hören (Vorschlag I): Radio der Region, externe Seite */
  function extLink(name, url, cls) { return '<a class="' + (cls || 'btn') + '" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(name) + ' <span aria-hidden="true">↗</span><span class="sr-only"> (' + esc(t('ext')) + ')</span></a>'; }
  function radioBox(u) {
    var r = D.listen && D.listen.radio && D.listen.radio[u.id]; if (!r) return '';
    return '<section class="card stack"><span class="eyebrow">' + esc(t('hear')) + '</span><p class="small">' + esc(t('hear_d')) + '</p>' + extLink(r[0], r[1]).replace('class="btn"', 'class="btn" style="justify-self:start"') + '</section>';
  }
  function skipCity(ui) {
    for (var i = 0; i <= ui; i++) if (!S.boss[U[i].id]) S.skipped[U[i].id] = true;
    if (ui < U.length - 1) S.unlocked = Math.max(S.unlocked, ui + 1);
    save(); toast(t('skipped_toast') + ' ' + U[Math.min(ui + 1, U.length - 1)].city); go('city', Math.min(ui + 1, U.length - 1));
  }

  /* ---------- Üben ---------- */
  function renderPractice() {
    var due = dueList().length;
    var html = '<h1>' + esc(t('nav_practice')) + '</h1><section class="tiles">' +
      tileBtn('review', t('review'), t('review_d'), due ? '<span class="badge num">' + due + ' ' + esc(t('due')) + '</span>' : '') +
      tileBtn('daily', t('daily'), t('daily_d')) + tileBtn('blitz', t('blitz'), t('blitz_d')) + tileBtn('survival', t('survival'), t('survival_d'), S.best.survival ? '<span class="badge num">' + esc(t('best')) + ' ' + S.best.survival + '</span>' : '') + tileBtn('cases', t('cases'), t('cases_d')) + tileBtn('aspect', t('aspect'), t('aspect_d')) + tileBtn('spell', t('spell'), t('spell_d')) +
      tileBtn('sounds', t('sounds'), t('sounds_d')) + tileBtn('prices', t('prices'), t('prices_d')) +
      tileBtn('twister', t('twister'), t('twister_d')) + tileBtn('memo_w', t('memo_w'), t('memo_w_d')) + tileBtn('duel', t('duel'), t('duel_d')) + tileBtn('face', t('face'), t('face_d')) +
      tileBtn('mistakes', t('mistakes'), t('mistakes_d'), S.mistakes.length ? '<span class="badge num">' + S.mistakes.length + '</span>' : '') +
      tileBtn('mywords', t('mywords'), t('mywords_d'), S.custom.length ? '<span class="badge num">' + S.custom.length + '</span>' : '') +
      '</section>';
    shell(html); bindTiles();
  }

  /* ---------- Land und Leute ---------- */
  function renderLand() {
    var K = D.culture;
    var html = '<h1>' + esc(t('land')) + '</h1><p class="muted">' + esc(t('land_d')) + '</p>' +
      (D.polacy ? '<button class="card pol-entry" data-mode="polacy" lang="pl"><span class="pol-flag" aria-hidden="true"></span><span class="stack" style="gap:2px;text-align:left"><b>' + esc(t('pol')) + '</b><span class="small muted">' + esc(t('pol_d')) + '</span>' +
        (S.plv != null ? '<span class="small"><b>' + esc(t('pol_lv')) + ':</b> ' + esc(t('pol_lv' + S.plv)) + '</span>' : '') + '</span></button>' : '') +
      '<section class="tiles">' + tileBtn('whoami', t('whoami'), t('whoami_d')) + tileBtn('tf', t('tf'), t('tf_d')) + tileBtn('timeline', t('timeline'), t('timeline_d')) +
      tileBtn('pin', t('pin'), t('pin_d')) + tileBtn('hl', t('hl'), t('hl_d')) + tileBtn('literki', t('literki'), t('literki_d')) +
      tileBtn('memo_p', t('memo_p'), t('memo_p_d')) + tileBtn('memo_y', t('memo_y'), t('memo_y_d')) + '</section>' +
      '<section class="card"><span class="eyebrow">' + esc(t('facts')) + '</span><div class="list">' +
      K.facts.map(function (f) { return '<div class="li"><span class="grow muted small">' + esc(S.base === 'en' ? f[1] : f[0]) + '</span><b class="num" style="text-align:right">' + esc(f[2]) + '</b></div>'; }).join('') + '</div></section>' +
      (D.listen && D.listen.learn ? '<section class="card stack" id="hear-more"><span class="eyebrow">' + esc(t('hear_more')) + '</span><p class="small muted">' + esc(t('hear_more_d')) + '</p><div class="list">' +
        D.listen.learn.map(function (x) { return '<div class="li"><div class="grow">' + extLink(x[0], x[1], 'ext') + '<div class="small muted">' + esc(S.base === 'en' ? x[3] : x[2]) + '</div></div></div>'; }).join('') + '</div></section>' : '');
    shell(html); bindTiles();
  }

  /* ---------- Album ---------- */
  function renderAlbum() {
    var html = '<h1>' + esc(t('nav_album')) + '</h1><section class="stack"><h2>' + esc(t('postcards')) + ' <span class="muted num">' + Object.keys(S.boss).length + '/' + U.length + '</span></h2><div class="grid2">' +
      U.map(function (u, i) {
        var got = !!S.boss[u.id];
        return '<article class="postcard tr-' + u.trail + (got ? '' : ' locked') + '"><div class="pc-top"><div class="row" style="justify-content:space-between;align-items:start"><div><div class="pl">' + esc(u.city) + '</div><div class="small muted">' + esc(L(u.title)) + '</div></div><div class="stamp">' + (got ? 'PL' : (i + 1)) + '</div></div></div>' +
          '<div class="pc-bot">' + (got ? esc(L(u.fact)) : '<span class="muted">' + esc(t('locked')) + '</span>') + '</div></article>';
      }).join('') + '</div></section>' +
      '<section class="stack"><h2>' + esc(t('krasnale')) + ' <span class="muted num">' + S.krasnale.length + '/' + D.krasnale.length + '</span></h2><p class="small muted">' + esc(t('krasnal_hint')) + '</p><div class="grid3">' +
      D.krasnale.map(function (k, i) {
        var got = S.krasnale.indexOf(i) >= 0;
        return '<div class="card krasnal' + (got ? '' : ' locked') + '">' + krasnalSvg() + '<b class="small">' + (got ? esc(k[0]) : '?') + '</b>' + (got ? '<span class="small muted">' + esc(k[1]) + ' = ' + esc(S.base === 'en' ? k[3] : k[2]) + '</span>' : '') + '</div>';
      }).join('') + '</div></section>';
    shell(html);
  }

  /* ---------- Ich / Einstellungen ---------- */
  /* ---------- Der Brief (Rahmengeschichte) ---------- */
  function letterLines() { return (D.letter && D.letter.lines) || []; }
  function unitById(id) { for (var i = 0; i < U.length; i++) if (U[i].id === id) return U[i]; return null; }
  function letterCard() {
    var lines = letterLines(), n = C.letterRead(lines, S).filter(Boolean).length, tot = lines.length, isNew = n > (S.letterSeen || 0);
    if (!tot) return '';
    return '<section class="card stack letter-card"><div class="row" style="justify-content:space-between"><span class="eyebrow">✉ ' + esc(t('letter')) + '</span>' +
      (isNew ? '<span class="badge next">' + esc(t('letter_new')) + '</span>' : '<span class="small muted num">' + n + '/' + tot + '</span>') + '</div>' +
      '<p class="small">' + esc(n ? (n === tot && !isNew ? t('letter_done') : t('letter_d').replace('{n}', n).replace('{t}', tot)) : t('letter_start')) + '</p>' +
      '<div class="bar"><i style="width:' + (n / tot * 100) + '%"></i></div><button class="btn" id="letter-open" style="justify-self:start">' + esc(t('letter_open')) + ' →</button></section>';
  }
  function letterLineHtml(l, readable, fresh) {
    if (!readable) { var u = unitById(l.u); return '<div class="lt-line locked"><p class="lt-pl" aria-hidden="true">' + esc(l.pl) + '</p><p class="small muted">' + esc(t('letter_locked').replace('{c}', u ? u.city : '')) + '</p></div>'; }
    return '<div class="lt-line' + (fresh ? ' fresh' : '') + '"><div class="row" style="align-items:start"><p class="lt-pl grow" lang="pl">' + esc(l.pl) + '</p><button class="icon-btn" data-say="' + esc(l.pl) + '" aria-label="' + esc(t('listen_again')) + '">' + I.spk + '</button></div><p class="small muted">' + esc(L(l.tr)) + '</p></div>';
  }
  function renderLetter() {
    var lines = letterLines(), rd = C.letterRead(lines, S), n = rd.filter(Boolean).length, seen = S.letterSeen || 0, all = n === lines.length, k = 0;
    var html = '<button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('home')) + '</button><h1>' + esc(t('letter')) + '</h1>' +
      '<section class="card row letter-szymek" style="align-items:start"><div class="krasnal" style="padding:0">' + krasnalSvg() + '</div><p class="small scene-intro grow">' + esc(L(D.letter.prolog)) + '</p></section>' +
      '<article class="card stack letter" aria-label="' + esc(t('letter_from')) + '"><span class="eyebrow">' + esc(t('letter_from')) + ' · <span class="num">' + n + '/' + lines.length + '</span></span>' +
      lines.map(function (l, i) { var fresh = rd[i] && ++k > seen; return letterLineHtml(l, rd[i], fresh && seen > 0); }).join('') + '</article>' +
      (all ? '<section class="card stack next-box pop"><span class="eyebrow">Wrocław</span><p>' + esc(L(D.letter.finale)) + '</p></section>' +
        (D.letterQuiz ? '<section class="card stack letter-card"><span class="eyebrow">✉ ' + esc(t('lq')) + '</span><p class="small">' + esc(t('lq_d')) + '</p>' + (S.letterQuiz ? '<p class="small muted num">' + esc(t('lq_best')) + ': ' + S.letterQuiz + ' %</p>' : '') +
          '<button class="btn primary" id="lq" style="justify-self:start">' + esc(t('lq_start')) + ' →</button></section>' : '') : '');
    shell(html);
    var lqb = document.getElementById('lq'); if (lqb) lqb.onclick = function () { startMode('letterquiz'); };
    if (n !== seen) { S.letterSeen = n; save(); }
    document.getElementById('back').onclick = function () { go('home'); };
    document.querySelectorAll('[data-say]').forEach(function (b) { b.onclick = function () { speak(b.getAttribute('data-say')); }; });
  }
  /* Nach der ersten bestandenen Stadtprüfung: der neue Satz, dazu Szymeks Ausblick oder das Finale */
  function letterNewBox(uid) {
    var lines = letterLines(), i = -1;
    for (var j = 0; j < lines.length; j++) if (lines[j].u === uid) i = j;
    if (i < 0) return '';
    var l = lines[i], all = C.letterRead(lines, S).every(Boolean);
    return '<div class="card stack letter-card pop" style="text-align:left;width:100%"><span class="eyebrow">✉ ' + esc(t('letter_new')) + '</span>' +
      '<p class="lt-pl" lang="pl">' + esc(l.pl) + '</p><p class="small muted">' + esc(L(l.tr)) + '</p>' +
      '<p class="small scene-intro">' + esc(L((all || !l.bridge) ? D.letter.finale : l.bridge)) + '</p>' +
      '<button class="btn" id="letter-res" style="justify-self:start">' + esc(t('letter_open')) + ' →</button></div>';
  }

  /* Szymek am Anfang jeder Stadt-Szene: sein Ausblick aus der vorigen Stadt (in Warschau: der Prolog) */
  function szymekBubble(ui) {
    if (!D.letter) return '';
    var txt = null;
    if (ui === 0) txt = D.letter.prolog;
    else { var pu = U[ui - 1].id; letterLines().forEach(function (l) { if (l.u === pu && l.bridge) txt = l.bridge; }); }
    if (!txt) return '';
    return '<div class="szymek row pop"><div class="krasnal" style="padding:0">' + krasnalSvg() + '</div><p class="small grow">' + (ui ? '<b>Szymek:</b> ' : '') + esc(L(txt)) + '</p></div>';
  }

  /* ---------- Fehler melden (Vorschlag J): Text + Übungs-Kontext in public.ps_feedback, sonst per Mail ---------- */
  var APP_VER = '2.0', SITE = 'https://polski.arndt-software.de/', FB_MAIL = 'farndt691@gmail.com';
  function reportHtml(id) {
    return '<details class="report" id="' + id + '"><summary class="small">⚑ ' + esc(t('rep')) + '</summary><div class="stack" style="margin-top:8px">' +
      '<textarea maxlength="1000" rows="3" aria-label="' + esc(t('rep')) + '" placeholder="' + esc(t('rep_ph')) + '"></textarea>' +
      '<button type="button" class="btn" style="justify-self:start">' + esc(t('rep_send')) + '</button><p class="small muted" role="status"></p></div></details>';
  }
  function bindReport(id, ctx) {
    var el = document.getElementById(id); if (!el) return;
    var ta = el.querySelector('textarea'), b = el.querySelector('button'), st = el.querySelector('[role=status]');
    ta.onkeydown = function (e) { e.stopPropagation(); };
    b.onclick = function () {
      var msg = ta.value.trim(); if (!msg) { st.textContent = t('rep_empty'); return; }
      b.disabled = true; st.textContent = t('sync_busy');
      sbFetch('/rest/v1/ps_feedback', { method: 'POST', prefer: 'return=minimal', body: { msg: msg.slice(0, 1000), ctx: String(ctx).slice(0, 500), lang: S.base, ver: APP_VER } })
        .then(function () { st.textContent = t('rep_thanks'); ta.value = ''; b.disabled = false; },
          function () { b.disabled = false; copy(msg + '\n\n[' + ctx + ' · ' + APP_VER + ']'); st.innerHTML = esc(t('rep_fail')) + ' <a href="mailto:' + FB_MAIL + '?subject=Polski%20Szlak%20Feedback">' + FB_MAIL + '</a>'; });
    };
  }

  /* ---------- Teilen (Vorschlag K): Teilen-Menü des Geräts, sonst kopieren ---------- */
  function shareOut(text) {
    if (navigator.share) { navigator.share({ text: text }).catch(function (e) { if (!e || e.name !== 'AbortError') copy(text); }); return; }
    copy(text);
  }

  /* ---------- Konfetti bei Erfolgen (nicht bei „Bewegung reduzieren“) ---------- */
  function confetti() {
    try { if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return; } catch (e) {}
    var box = document.createElement('div'), cols = ['var(--red)', 'var(--amber)', 'var(--t-green)', 'var(--t-blue)', 'var(--t-yellow)'], h = '';
    box.className = 'confetti'; box.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < 46; i++) h += '<i style="left:' + Math.round(Math.random() * 100) + '%;background:' + cols[i % cols.length] + ';animation-delay:' + (Math.random() * 0.5).toFixed(2) + 's;animation-duration:' + (1.6 + Math.random() * 1.2).toFixed(2) + 's;transform:rotate(' + Math.round(Math.random() * 360) + 'deg)"></i>';
    box.innerHTML = h; document.body.appendChild(box);
    setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); }, 3200);
  }

  /* ---------- Aufnehmen und vergleichen (zu Vorschlag L): eigene Stimme, danach das Vorbild ---------- */
  function recHtml() { return (window.MediaRecorder && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ? '<button type="button" class="btn ghost" id="rec" style="justify-self:start">● ' + esc(t('rec')) + '</button>' : ''; }
  function bindRec(text) {
    var b = document.getElementById('rec'); if (!b) return; var mr = null;
    b.onclick = function () {
      if (mr && mr.state === 'recording') { mr.stop(); return; }
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        var chunks = []; mr = new MediaRecorder(stream);
        mr.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
        mr.onstop = function () {
          stream.getTracks().forEach(function (tr) { tr.stop(); });
          b.textContent = '● ' + t('rec');
          var url = URL.createObjectURL(new Blob(chunks, { type: mr.mimeType || 'audio/webm' })), au = new Audio(url);
          au.onended = function () { URL.revokeObjectURL(url); setTimeout(function () { speak(text); }, 300); };
          au.play().catch(function () { speak(text); });
        };
        mr.start(); b.textContent = '■ ' + t('rec_stop');
        setTimeout(function () { if (mr && mr.state === 'recording') mr.stop(); }, 6000);
      }, function () { toast(t('no_mic')); });
    };
  }

  /* ---------- Kurze Einführungs-Tour (einmalig, unter „Ich“ wiederholbar) ---------- */
  function startTour() {
    var steps = [['#cta', 'tour1'], ['.map-wrap', 'tour2'], ['.letter-card', 'tour3'], ['[data-nav="practice"]', 'tour4'], ['[data-nav="me"]', 'tour5']], i = 0;
    var old = document.getElementById('tour'); if (old) old.remove();
    var box = document.createElement('div'); box.id = 'tour'; box.className = 'tour card stack pop'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Tour');
    document.body.appendChild(box);
    function clear() { document.querySelectorAll('.tour-hl').forEach(function (e) { e.classList.remove('tour-hl'); }); }
    function end() { clear(); box.remove(); S.tour = true; save(); }
    function paint() {
      clear();
      var el = document.querySelector(steps[i][0]), last = i === steps.length - 1;
      if (el) { el.classList.add('tour-hl'); try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {} }
      box.innerHTML = '<span class="eyebrow num">' + (i + 1) + ' / ' + steps.length + '</span><p>' + esc(t(steps[i][1])) + '</p><div class="row"><button class="btn primary" id="tour-n">' + esc(last ? t('tour_done') : t('tour_next')) + '</button>' + (last ? '' : '<button class="btn ghost" id="tour-x">' + esc(t('tour_skip')) + '</button>') + '</div>';
      document.getElementById('tour-n').onclick = function () { if (last) end(); else { i++; paint(); } };
      var x = document.getElementById('tour-x'); if (x) x.onclick = end;
      try { document.getElementById('tour-n').focus({ preventScroll: true }); } catch (e) {}
    }
    paint();
  }

  function candoBox() {
    var done = U.filter(function (u) { return S.boss[u.id]; }), nu = U[nextUnit()], ns = C.nextStep(S, nu.id);
    var stats = t('cando_stats').replace('{w}', masteredCount()).replace('{s}', Object.keys(S.scenes).length).replace('{c}', done.length);
    return '<section class="card stack" id="cando"><h2>' + esc(t('cando')) + '</h2><p class="small muted num">' + esc(stats) + '</p>' +
      (done.length ? '<div class="list">' + done.map(function (u) { return '<div class="li"><span class="badge good">✓</span><div class="grow"><b>' + esc(u.city) + '</b><div class="small">' + esc(L(u.can)) + '</div></div></div>'; }).join('') + '</div>'
        : '<p class="small muted">' + esc(t('cando_empty')) + '</p>') +
      (ns ? '<p class="small"><b>' + esc(t('cando_next')) + ' (' + esc(nu.city) + '):</b> ' + esc(L(nu.can)) + '</p>' : '') + '</section>';
  }
  var resetArmed = false;
  function renderMe() {
    var lv = C.levelFromXp(S.xp);
    var html = '<h1>' + esc(t('nav_me')) + '</h1>' +
      '<section class="card stack"><div class="row" style="justify-content:space-between"><b>' + esc(t('level')) + ' ' + lv.level + '</b><span class="small muted num">' + lv.into + ' / ' + lv.need + ' ' + t('xp') + '</span></div><div class="bar amber"><i style="width:' + (lv.into / lv.need * 100) + '%"></i></div>' +
      '<div class="stats3"><div class="stat"><b class="num">' + masteredCount() + '</b><span class="small muted">' + esc(t('mastered')) + '</span></div><div class="stat"><b class="num">' + C.totalDays(S.active) + '</b><span class="small muted">' + esc(t('total_days')) + '</span></div><div class="stat"><b class="num">' + C.weekStreak(S.active, S.goal, today()) + '</b><span class="small muted">' + esc(t('wk_streak')) + '</span></div></div></section>' +
      candoBox() + installBox() + syncBox() +
      '<section class="card stack"><h2>' + esc(t('settings')) + '</h2>' +
      '<div class="stack"><b>' + esc(t('base_lang')) + '</b><div class="seg" id="s-base">' + segBtn('de', 'Deutsch', S.base === 'de') + segBtn('en', 'English', S.base === 'en') + '</div></div>' +
      '<div class="stack"><b>' + esc(t('goal')) + '</b><div class="seg" id="s-goal">' + [2, 3, 4, 5, 7].map(function (n) { return segBtn(String(n), String(n), S.goal === n); }).join('') + '</div></div>' +
      '<div class="stack"><b>' + esc(t('diff')) + '</b><div class="seg" id="s-diff">' + ['easy', 'medium', 'hard'].map(function (k) { return segBtn(k, t('diff_' + k), S.diff === k); }).join('') + '</div><p class="small muted">' + esc(t('diff_' + S.diff + '_d')) + '</p></div>' +
      '<div class="stack"><b>' + esc(t('inp')) + '</b><div class="seg" id="s-inp">' + ['write', 'speak', 'tap'].map(function (k) { return segBtn(k, t('inp_' + k), S.input === k); }).join('') + '</div><p class="small muted">' + esc(t('inp_' + S.input + '_d')) + '</p></div>' +
      '<label class="row"><input type="checkbox" id="s-free"' + (S.free ? ' checked' : '') + '> ' + esc(t('free_roam')) + '</label>' +
      '<button class="btn" id="s-place" style="justify-self:start">' + esc(t('placement')) + '</button><p class="small muted">' + esc(t('placement_d')) + '</p>' +
      '<div class="stack"><b>' + esc(t('len')) + '</b><div class="seg" id="s-len">' + segBtn('6', t('short'), S.len === 6) + segBtn('10', t('medium'), S.len === 10) + segBtn('15', t('long'), S.len === 15) + '</div></div>' +
      '<div class="stack"><b>' + esc(t('theme')) + '</b><div class="seg" id="s-theme">' + segBtn('auto', t('auto'), S.theme === 'auto') + segBtn('light', t('light'), S.theme === 'light') + segBtn('dark', t('dark'), S.theme === 'dark') + '</div></div>' +
      '<label class="row"><input type="checkbox" id="s-hard"' + (S.hardcore ? ' checked' : '') + '> ' + esc(t('hardcore')) + '</label>' +
      '<label class="row"><input type="checkbox" id="s-slow"' + (S.slow ? ' checked' : '') + '> ' + esc(t('slow')) + ' (TTS)</label></section>' +
      '<section class="card stack"><h2>' + esc(t('jokers')) + '</h2><div class="row"><span class="chip num">' + esc(t('j_5050')) + ' ' + S.jokers.five0 + '</span><span class="chip num">' + esc(t('j_hint')) + ' ' + S.jokers.hint + '</span><span class="chip num">' + esc(t('j_freeze')) + ' ' + S.jokers.freeze + '</span></div><p class="small muted">' + esc(t('jokers_d')) + '</p></section>' +
      '<section class="card"><details><summary class="small" style="cursor:pointer;font-weight:700">' + esc(t('bk_more')) + '</summary><div class="stack" style="margin-top:10px"><p class="small muted">' + esc(t('backup_d')) + '</p><textarea id="bk" aria-label="' + esc(t('backup')) + '">' + esc(JSON.stringify(S)) + '</textarea>' +
      '<div class="row"><button class="btn" id="bk-copy">' + esc(t('bk_copy')) + '</button><button class="btn" id="bk-restore">' + esc(t('restore')) + '</button></div></div></details></section>' +
      '<section class="card stack"><h2>' + esc(t('about')) + '</h2><p class="small">' + esc(t('about_d')) + '</p><p class="small"><a href="impressum.html">' + esc(t('legal')) + '</a> · <a href="datenschutz.html">' + esc(t('privacy')) + '</a></p><button class="btn ghost" id="tour-again" style="justify-self:start;padding-left:0">' + esc(t('tour_again')) + '</button><p class="small muted">' + esc(t('rep_d')) + '</p>' + reportHtml('rep-me') + '<button class="btn" id="reset" style="justify-self:start;color:var(--bad)">' + esc(resetArmed ? t('reset_q') : t('reset')) + '</button></section>';
    shell(html);
    bindSeg('s-base', function (v) { S.base = v; save(); renderMe(); });
    bindSeg('s-goal', function (v) { S.goal = +v; save(); renderMe(); });
    bindSeg('s-len', function (v) { S.len = +v; save(); renderMe(); });
    bindSeg('s-theme', function (v) { S.theme = v; save(); renderMe(); });
    bindSync();
    var ib = document.getElementById('s-inst'); if (ib && ib.tagName === 'BUTTON') ib.onclick = doInstall;
    document.getElementById('s-hard').onchange = function (e) { S.hardcore = e.target.checked; save(); };
    document.getElementById('s-slow').onchange = function (e) { S.slow = e.target.checked; save(); };
    bindSeg('s-diff', function (v) { S.diff = v; save(); renderMe(); });
    bindSeg('s-inp', function (v) { S.input = v; save(); renderMe(); });
    document.getElementById('s-free').onchange = function (e) { S.free = e.target.checked; save(); };
    document.getElementById('s-place').onclick = function () { startMode('placement'); };
    document.getElementById('bk-copy').onclick = function () { copy(JSON.stringify(S)); };
    document.getElementById('bk-restore').onclick = function () {
      try { var o = JSON.parse(document.getElementById('bk').value); if (!C.validateSave(o)) throw 0; S = Object.assign(fresh(), o); save(); toast(t('restored')); renderMe(); } catch (e) { toast(t('bad_backup')); }
    };
    bindReport('rep-me', 'Ich / allgemein');
    document.getElementById('tour-again').onclick = function () { S.tour = false; save(); go('home'); };
    document.getElementById('reset').onclick = function () { if (!resetArmed) { resetArmed = true; renderMe(); return; } resetArmed = false; S = fresh(); save(); render(); };
  }

  /* ---------- Geräte-Abgleich über das eigene Supabase (wie GeoQuest, gleiches Konto) ----------
     Freiwillig: ohne Anmeldung verlässt nichts das Gerät. Mit Anmeldung: Spielstand als JSON in public.ps_progress
     (nur eigene Zeile, RLS), beim Start/Wiederkommen/Speichern abgleichen. Zusammenführen statt überschreiben (C.mergeSave). */
  var SB_URL = 'https://supabase.arndt-software.de', SB_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4NDgxMTAwMCwiZXhwIjo0OTQwNDg0NjAwLCJyb2xlIjoiYW5vbiJ9.kMAlX4dS_sXjH6dsLoICMKnwyHFLAAuEwum7zuJh2DQ', AUTH_KEY = 'polski_szlak_auth';
  var A = null; try { A = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); } catch (e) {}
  var syncBusy = false, syncTimer = null, syncMsg = '', syncErr = '', syncDelArmed = false, syncRecovery = false, obSync = false;
  function saveAuth() { try { if (A) localStorage.setItem(AUTH_KEY, JSON.stringify(A)); else localStorage.removeItem(AUTH_KEY); } catch (e) {} }
  function sbFetch(path, o) {
    o = o || {}; var h = { apikey: SB_KEY, 'Content-Type': 'application/json' };
    if (o.auth && A) h.Authorization = 'Bearer ' + A.at; if (o.prefer) h.Prefer = o.prefer;
    return fetch(SB_URL + path, { method: o.method || 'GET', headers: h, body: o.body ? JSON.stringify(o.body) : undefined }).then(function (r) {
      return r.text().then(function (txt) {
        var j = null; try { j = txt ? JSON.parse(txt) : null; } catch (e) {}
        if (!r.ok) { var er = new Error((j && (j.msg || j.error_description || j.message || j.error)) || ('HTTP ' + r.status)); er.status = r.status; er.code = j && (j.error_code || j.code || j.error); throw er; }
        return j;
      });
    }, function () { var er = new Error('net'); er.code = 'net'; throw er; });
  }
  function setSession(j) {
    var u = j.user || {};
    A = { at: j.access_token, rt: j.refresh_token, exp: Date.now() + ((+j.expires_in || 3600) - 60) * 1000, email: u.email || (A && A.email) || '', uid: u.id || (A && A.uid) || '', last: A && A.last };
    saveAuth();
  }
  function sbToken() {
    if (!A) return Promise.reject(new Error('auth'));
    if (Date.now() < A.exp) return Promise.resolve();
    return sbFetch('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: A.rt } }).then(setSession, function (e) {
      if (e.status === 400 || e.status === 401) { A = null; saveAuth(); } throw e;
    });
  }
  function syncErrText(e) {
    var c = String((e && e.code) || ''), m = String((e && e.message) || '');
    if (c === 'net' || !navigator.onLine) return t('sync_err_net');
    if (c === 'invalid_credentials' || /invalid login/i.test(m)) return t('sync_err_cred');
    if (c === 'email_not_confirmed' || /not confirmed/i.test(m)) return t('sync_err_confirm');
    if (c === 'user_already_exists' || /already registered/i.test(m)) return t('sync_err_exists');
    if (c === 'weak_password' || (/password/i.test(m) && e.status === 422)) return t('sync_err_pw');
    if ((e && e.status === 429) || /rate limit/i.test(m)) return t('sync_err_rate');
    return t('sync_err') + ' (' + m.slice(0, 80) + ')';
  }
  function syncSoon() { if (!A) return; clearTimeout(syncTimer); syncTimer = setTimeout(syncNow, 4000); }
  function syncNow() {
    if (!A || !A.uid || syncBusy) return Promise.resolve();
    if (!navigator.onLine) { syncErr = t('sync_err_net'); refreshSyncBox(); return Promise.resolve(); }
    syncBusy = true; syncErr = ''; refreshSyncBox();
    var before = JSON.stringify(S);
    return sbToken().then(function () { return sbFetch('/rest/v1/ps_progress?select=data&user_id=eq.' + encodeURIComponent(A.uid), { auth: true }); })
      .then(function (rows) {
        var remote = rows && rows[0] && rows[0].data;
        if (remote && C.validateSave(remote)) { S = Object.assign(fresh(), C.mergeSave(S, remote)); saveLocal(); }
        return sbFetch('/rest/v1/ps_progress?on_conflict=user_id', { method: 'POST', auth: true, prefer: 'resolution=merge-duplicates,return=minimal', body: { user_id: A.uid, data: S } });
      })
      .then(function () { A.last = Date.now(); saveAuth(); syncMsg = t('sync_done'); }, function (e) { syncErr = syncErrText(e); })
      .then(function () {
        syncBusy = false;
        if (JSON.stringify(S) !== before && !view) render(); else refreshSyncBox();
      });
  }
  function afterLogin(j) { setSession(j); syncMsg = ''; syncErr = ''; obSync = false; return syncNow().then(function () { render(); }); }
  /* Rückkehr aus Bestätigungs- oder Passwort-Mail: Tokens stehen im #-Teil der Adresse */
  function sbFromHash() {
    var h = location.hash || ''; if (!/[#&](access_token|error)/.test(h)) return;
    var q = {}; h.slice(1).split('&').forEach(function (kv) { var i = kv.indexOf('='); if (i > 0) q[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1).replace(/\+/g, ' ')); });
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    if (q.error || q.error_description) { syncErr = t('sync_err') + ' (' + String(q.error_description || q.error).slice(0, 80) + ')'; if (S.onboarded) tab = 'me'; else obSync = true; return; }
    if (!q.access_token) return;
    A = { at: q.access_token, rt: q.refresh_token, exp: Date.now() + ((+q.expires_in || 3600) - 60) * 1000, email: '', uid: '' };
    syncRecovery = q.type === 'recovery'; if (S.onboarded) tab = 'me';
    sbFetch('/auth/v1/user', { auth: true }).then(function (u) { A.email = u.email || ''; A.uid = u.id || ''; saveAuth(); return syncNow().then(function () { render(); }); },
      function (e) { A = null; saveAuth(); syncErr = syncErrText(e); refreshSyncBox(); });
  }
  function syncBox() {
    var h = '<section class="card stack" id="sync"><h2>' + esc(t('sync')) + '</h2>';
    if (A && A.uid) {
      h += '<p class="small">' + esc(t('sync_as')) + ' <b>' + esc(A.email) + '</b></p>' +
        '<p class="small muted" role="status">' + esc(syncBusy ? t('sync_busy') : syncErr || ((syncMsg ? syncMsg + ' · ' : '') + t('sync_last') + ': ' + (A.last ? new Date(A.last).toLocaleString(S.base === 'en' ? 'en-GB' : 'de-DE', { dateStyle: 'short', timeStyle: 'short' }) : t('sync_never')))) + '</p>' +
        (syncRecovery ? '<label class="fld">' + esc(t('sync_newpw')) + '<input type="password" id="sy-npw" autocomplete="new-password" minlength="8"></label><button class="btn primary" id="sy-setpw" style="justify-self:start">' + esc(t('sync_setpw')) + '</button>' : '') +
        '<div class="row"><button class="btn primary" id="sy-now"' + (syncBusy ? ' disabled' : '') + '>' + esc(t('sync_now')) + '</button><button class="btn" id="sy-out">' + esc(t('sync_logout')) + '</button></div>' +
        '<button class="btn ghost" id="sy-del" style="justify-self:start;color:var(--bad)">' + esc(syncDelArmed ? t('sync_del_q') : t('sync_del')) + '</button>';
    } else {
      h += '<p class="small muted">' + esc(t('sync_d')) + '</p>' +
        '<label class="fld">' + esc(t('sync_email')) + '<input type="email" id="sy-mail" autocomplete="email" inputmode="email"></label>' +
        '<label class="fld">' + esc(t('sync_pw')) + '<input type="password" id="sy-pw" autocomplete="current-password" minlength="8"></label>' +
        '<div class="row"><button class="btn primary" id="sy-in"' + (syncBusy ? ' disabled' : '') + '>' + esc(t('sync_login')) + '</button><button class="btn" id="sy-up"' + (syncBusy ? ' disabled' : '') + '>' + esc(t('sync_signup')) + '</button></div>' +
        '<button class="btn ghost" id="sy-forgot" style="justify-self:start;padding-left:0">' + esc(t('sync_forgot')) + '</button>' +
        (syncErr || syncMsg ? '<p class="small" role="status">' + esc(syncErr || syncMsg) + '</p>' : '') +
        '<p class="small muted">' + esc(t('sync_shared')) + ' <a href="datenschutz.html">' + esc(t('privacy')) + '</a></p>';
    }
    return h + '</section>';
  }
  function refreshSyncBox() {
    updateNet();
    var el = document.getElementById('sync'); if (!el) return;
    var keep = {}; ['sy-mail', 'sy-pw', 'sy-npw'].forEach(function (id) { var i = document.getElementById(id); if (i) keep[id] = i.value; });
    var tmp = document.createElement('div'); tmp.innerHTML = syncBox(); el.replaceWith(tmp.firstChild);
    Object.keys(keep).forEach(function (id) { var i = document.getElementById(id); if (i) i.value = keep[id]; });
    bindSync();
  }
  function bindSync() {
    function $(id) { return document.getElementById(id); }
    function creds() { return { email: ($('sy-mail').value || '').trim(), password: $('sy-pw').value || '' }; }
    function fail(e) { syncBusy = false; syncErr = syncErrText(e); syncMsg = ''; refreshSyncBox(); }
    function busy() { syncBusy = true; syncErr = ''; syncMsg = ''; refreshSyncBox(); }
    var redirect = encodeURIComponent(location.origin + location.pathname);
    if ($('sy-in')) $('sy-in').onclick = function () {
      var c = creds(); if (!c.email || !c.password) return;
      busy(); sbFetch('/auth/v1/token?grant_type=password', { method: 'POST', body: c }).then(function (j) { syncBusy = false; return afterLogin(j); }, fail);
    };
    if ($('sy-up')) $('sy-up').onclick = function () {
      var c = creds(); if (!c.email) return; if (c.password.length < 8) { syncErr = t('sync_err_pw'); refreshSyncBox(); return; }
      busy(); sbFetch('/auth/v1/signup?redirect_to=' + redirect, { method: 'POST', body: c }).then(function (j) {
        syncBusy = false;
        if (j && j.access_token) return afterLogin(j);
        if (j && Array.isArray(j.identities) && !j.identities.length) syncErr = t('sync_err_exists'); else syncMsg = t('sync_mail_sent');
        refreshSyncBox();
      }, fail);
    };
    if ($('sy-forgot')) $('sy-forgot').onclick = function () {
      var c = creds(); if (!c.email) { $('sy-mail').focus(); return; }
      busy(); sbFetch('/auth/v1/recover?redirect_to=' + redirect, { method: 'POST', body: { email: c.email } }).then(function () { syncBusy = false; syncMsg = t('sync_reset_sent'); refreshSyncBox(); }, fail);
    };
    if ($('sy-now')) $('sy-now').onclick = function () { syncNow(); };
    if ($('sy-setpw')) $('sy-setpw').onclick = function () {
      var pw = $('sy-npw').value || ''; if (pw.length < 8) { syncErr = t('sync_err_pw'); refreshSyncBox(); return; }
      sbToken().then(function () { return sbFetch('/auth/v1/user', { method: 'PUT', auth: true, body: { password: pw } }); })
        .then(function () { syncRecovery = false; syncErr = ''; syncMsg = t('sync_pw_saved'); refreshSyncBox(); }, fail);
    };
    if ($('sy-out')) $('sy-out').onclick = function () {
      var at = A && A.at; clearTimeout(syncTimer);
      if (at) fetch(SB_URL + '/auth/v1/logout', { method: 'POST', headers: { apikey: SB_KEY, Authorization: 'Bearer ' + at } }).catch(function () {});
      A = null; saveAuth(); syncMsg = ''; syncErr = ''; syncDelArmed = false; syncRecovery = false; refreshSyncBox();
    };
    if ($('sy-del')) $('sy-del').onclick = function () {
      if (!syncDelArmed) { syncDelArmed = true; refreshSyncBox(); return; }
      syncDelArmed = false;
      sbToken().then(function () { return sbFetch('/rest/v1/ps_progress?user_id=eq.' + encodeURIComponent(A.uid), { method: 'DELETE', auth: true }); })
        .then(function () { var at = A.at; clearTimeout(syncTimer); fetch(SB_URL + '/auth/v1/logout', { method: 'POST', headers: { apikey: SB_KEY, Authorization: 'Bearer ' + at } }).catch(function () {}); A = null; saveAuth(); syncMsg = t('sync_deleted'); refreshSyncBox(); }, fail);
    };
  }
  window.addEventListener('online', function () { syncNow(); });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible' && A && (!A.last || Date.now() - A.last > 60000)) syncNow(); });

  /* ---------- Als App installieren: einmaliger Hinweis + Bereich unter „Ich“ ---------- */
  var instEvt = null;
  function isStandalone() { try { return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch (e) { return false; } }
  function isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
  function installBox() {
    var body = isStandalone() ? '<p class="small muted">' + esc(t('inst_done')) + '</p>' :
      (instEvt ? '<button class="btn primary" id="s-inst" style="justify-self:start">' + esc(t('inst_btn')) + '</button><p class="small muted">' + esc(t('inst_d')) + '</p>' :
        '<p class="small muted" id="s-inst">' + esc(isIOS() ? t('inst_ios') : t('inst_other')) + '</p><p class="small muted">' + esc(t('inst_d')) + '</p>');
    return '<section class="card stack" id="inst"><h2>' + esc(t('inst')) + '</h2>' + body + '</section>';
  }
  function doInstall() {
    if (!instEvt) { go('me'); var el = document.getElementById('inst'); if (el) el.scrollIntoView(); return; }
    var e = instEvt; e.prompt(); e.userChoice.then(function () { instEvt = null; if (document.getElementById('inst')) renderMe(); }, function () {});
  }
  function refreshInstallBox() { if (document.getElementById('inst')) renderMe(); }
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); instEvt = e; refreshInstallBox(); });
  window.addEventListener('appinstalled', function () { instEvt = null; S.instHint = true; save(); refreshInstallBox(); });
  /* Einmalig 2 Sekunden einblenden, nicht in der installierten App, nicht während der Einstufung beim ersten Start */
  function installHint() {
    if (S.instHint || !S.onboarded || isStandalone()) return;
    S.instHint = true; save();
    var el = document.createElement('button'); el.className = 'inst-hint'; el.type = 'button';
    el.textContent = '📲 ' + t('inst_hint'); el.onclick = function () { el.remove(); doInstall(); };
    document.body.appendChild(el);
    setTimeout(function () { el.classList.add('out'); setTimeout(function () { el.remove(); }, 400); }, 2000);
  }

  /* ---------- Meine Wörter ---------- */
  function renderMyWords() {
    var html = '<button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('back')) + '</button><h1>' + esc(t('mywords')) + '</h1>' +
      '<section class="card stack"><label class="fld">' + esc(t('pl')) + '<input type="text" id="mw-pl" autocomplete="off" lang="pl"></label>' +
      '<label class="fld">' + esc(t('meaning')) + '<input type="text" id="mw-m" autocomplete="off"></label><button class="btn primary" id="mw-add">' + esc(t('add')) + '</button></section>' +
      '<section class="card">' + (S.custom.length ? '<div class="list">' + S.custom.map(function (w, i) {
        return '<div class="li"><button class="icon-btn" data-say="' + esc(w[0]) + '" aria-label="' + esc(t('listen_again')) + '">' + I.spk + '</button><div class="grow"><div class="pl-word">' + esc(w[0]) + '</div><div class="small muted">' + esc(meaning(w)) + '</div></div><button class="icon-btn" data-del="' + i + '" aria-label="' + esc(t('delete')) + '">' + I.x + '</button></div>';
      }).join('') + '</div>' : '<p class="muted">' + esc(t('mywords_empty')) + '</p>') + '</section>' +
      (S.custom.length >= 4 ? '<button class="btn primary block" id="mw-practice">' + esc(t('practice_mine')) + '</button>' : '');
    shell(html);
    document.getElementById('back').onclick = function () { go('practice'); };
    document.getElementById('mw-add').onclick = function () {
      var p = document.getElementById('mw-pl').value.trim(), m = document.getElementById('mw-m').value.trim();
      if (!p || !m) return; S.custom.push([p, m, m]); save(); renderMyWords();
    };
    document.querySelectorAll('[data-say]').forEach(function (b) { b.onclick = function () { speak(b.getAttribute('data-say')); }; });
    document.querySelectorAll('[data-del]').forEach(function (b) { b.onclick = function () { var i = +b.getAttribute('data-del'); S.custom.splice(i, 1); delete S.cards['my:' + i]; save(); renderMyWords(); }; });
    var pr = document.getElementById('mw-practice'); if (pr) pr.onclick = function () { startMode('mine'); };
  }

  /* ================================================================
     Fragen bauen
     ================================================================ */
  var R = Math.random;
  function distractors(x, pool, n, field) {
    var key = function (y) { return field === 'pl' ? y.w[0] : meaning(y.w); };
    var mine = key(x), seen = {}; seen[C.norm(mine)] = 1;
    var out = [];
    C.shuffle(pool, R).forEach(function (y) { var k = key(y); if (out.length < n && !seen[C.norm(k)]) { seen[C.norm(k)] = 1; out.push(k); } });
    return out;
  }
  function qMC(x, pool, dir) {
    if (dir === 'pl2x') return { type: 'mc', id: x.id, ask: t('choose_meaning'), big: x.w[0], say: x.w[0], a: meaning(x.w), opts: C.shuffle([meaning(x.w)].concat(distractors(x, pool, diff().opts - 1, 'm')), R) };
    return { type: 'mc', id: x.id, ask: t('choose_pl'), big: meaning(x.w), a: x.w[0], say: null, sayAfter: x.w[0], opts: C.shuffle([x.w[0]].concat(distractors(x, pool, diff().opts - 1, 'pl')), R) };
  }
  function qListen(x, pool) { return { type: 'mc', id: x.id, ask: t('hear'), big: '', say: x.w[0], hideText: true, reveal: x.w[0], a: meaning(x.w), opts: C.shuffle([meaning(x.w)].concat(distractors(x, pool, diff().opts - 1, 'm')), R) }; }
  function qDictate(x) { return { type: 'type', id: x.id, ask: t('dictate'), big: '', say: x.w[0], hideText: true, reveal: x.w[0] + ' = ' + meaning(x.w), a: x.w[0] }; }
  function qTranslate(s) { return { type: 'type', id: null, ask: t('translate_pl'), big: L([s[1], s[2]]), a: s[0] }; }
  function qType(x) { return { type: 'type', id: x.id, ask: t('type_pl'), big: meaning(x.w), a: x.w[0] }; }
  function qBuild(s, extra) {
    var tk = C.tokens(s[0]);
    if (!extra && diff().extraTiles) { var others = []; U.forEach(function (u) { u.sentences.forEach(function (x) { if (x[0] !== s[0]) others = others.concat(C.tokens(x[0])); }); }); extra = C.sample(others.filter(function (w) { return tk.indexOf(w) < 0; }), diff().extraTiles, R); }
    var pool = tk.concat(extra || []);
    return { type: 'build', id: null, ask: t('build_pl'), big: L([s[1], s[2]]), a: s[0], tiles: C.shuffle(pool, R) };
  }
  function qCloze(s, unitWords) {
    var tk = C.tokens(s[0]), cand = [];
    tk.forEach(function (w, i) { if (C.norm(w).length >= 3) cand.push(i); });
    var idx = cand[Math.floor(R() * cand.length)], ans = tk[idx].replace(/[.,!?]/g, '');
    var others = C.shuffle(unitWords.map(function (x) { return x.w[0]; }).filter(function (w) { return w.indexOf(' ') < 0 && C.norm(w) !== C.norm(ans); }), R).slice(0, 3);
    var shown = tk.map(function (w, i) { return i === idx ? '___' + (w.match(/[.,!?]+$/) || [''])[0] : w; }).join(' ');
    if (diff().clozeType) return { type: 'type', id: null, ask: t('fill'), sentence: shown, sub: L([s[1], s[2]]), a: ans, sayAfter: s[0], alt: others };
    return { type: 'mc', id: null, ask: t('fill'), sentence: shown, sub: L([s[1], s[2]]), a: ans, sayAfter: s[0], opts: C.shuffle([ans].concat(others), R) };
  }
  /* Verb-Aspekt (Vorschlag M): vollendet / unvollendet im Satz */
  function qAspect(c) { return { type: 'mc', id: null, plOpts: true, ask: t('aspect_q') + ' (' + c.base + ')', sentence: c.s, sub: L(c.tr), a: c.a, opts: C.shuffle(c.opts.slice(), R), explain: t(c.pf ? 'asp_pf' : 'asp_ipf') + ': ' + L(c.why), sayAfter: c.s.replace('___', c.a) }; }
  /* Brief selbst lesen: polnischer Satz ohne Übersetzung, Frage in der Basissprache */
  function qLetter(x) { var l = letterLines()[x.l]; return { type: 'mc', id: null, fixed: true, ask: L(x.q), sentence: l.pl, say: l.pl, a: L(x.o[0]), opts: C.shuffle(x.o.map(L), R), explain: L(l.tr) }; }
  function qCase(c) { if (diff().clozeType) return { type: 'type', id: null, ask: t('case_q') + ' (' + c.base + ')', sentence: c.s, sub: L(c.tr), a: c.a, alt: c.opts, explain: L(c.case) + ': ' + L(c.why), sayAfter: c.s.replace('___', c.a) }; return { type: 'mc', id: null, ask: t('case_q') + ' (' + c.base + ')', sentence: c.s, sub: L(c.tr), a: c.a, opts: C.shuffle(c.opts.slice(), R), explain: L(c.case) + ': ' + L(c.why), sayAfter: c.s.replace('___', c.a) }; }
  function qPrice() {
    var n = 1 + Math.floor(R() * 99), w = C.priceWords(n), opts = [n], guard = 0;
    while (opts.length < 4 && guard++ < 50) { var m = Math.max(1, Math.min(99, n + [-10, -2, -1, 1, 2, 10, 11, -11, 20][Math.floor(R() * 9)])); if (opts.indexOf(m) < 0) opts.push(m); }
    return { type: 'mc', id: null, ask: t('price_q'), big: '', say: w, hideText: true, reveal: w, a: n + ' zł', opts: C.shuffle(opts, R).map(function (o) { return o + ' zł'; }) };
  }
  function qSound(sd) {
    var others = C.shuffle(D.sounds.filter(function (o) { return o.g !== sd.g; }), R).slice(0, 2).map(function (o) { return o[S.base]; });
    return { type: 'mc', id: null, ask: t('sound_q') + ' „' + sd.g + '“', big: sd.ex, say: sd.ex, sub: L(sd.exm), a: sd[S.base], opts: C.shuffle([sd[S.base]].concat(others), R) };
  }
  function qHearWord(pool) {
    var x = pool[Math.floor(R() * pool.length)];
    return { type: 'mc', id: x.id, ask: t('hear_word'), big: '', say: x.w[0], hideText: true, reveal: x.w[0] + ' = ' + meaning(x.w), a: x.w[0], opts: C.shuffle([x.w[0]].concat(distractors(x, pool, 3, 'pl')), R) };
  }
  function qWho(p) {
    var names = D.culture.people.map(function (x) { return x.name; }).filter(function (n) { return n !== p.name; });
    return { type: 'mc', id: null, ask: t('whoami'), clues: p.clues.map(L), shown: 1, a: p.name, opts: C.shuffle([p.name].concat(C.sample(names, Math.max(3, diff().opts - 1), R)), R), sayAfter: p.name };
  }
  function qTF(s) { return { type: 'mc', id: null, ask: t('tf'), big: L([s[1], s[2]]), small: true, a: s[0] ? t('t_true') : t('t_false'), opts: [t('t_true'), t('t_false')], explain: L([s[3], s[4]]), fixed: true }; }
  function qHL(set) {
    var pr = C.hlPair(set.items, R); if (!pr) return null; var hi = pr[0][1] > pr[1][1] ? pr[0] : pr[1];
    return { type: 'mc', id: null, ask: L(set.q), big: '', a: hi[0], opts: [pr[0][0], pr[1][0]], fixed: true, plOpts: true, explain: pr[0][0] + ': ' + pr[0][1].toLocaleString(S.base) + ' · ' + pr[1][0] + ': ' + pr[1][1].toLocaleString(S.base) + ' ' + L(set.unit) };
  }
  function qOrder(evts) { return { type: 'order', id: null, ask: t('tap_order'), items: C.shuffle(evts, R) }; }
  function qPin(pl) { return { type: 'pin', id: null, ask: t('tap_map'), big: pl.name, sub: pl.desc, target: pl }; }
  function qLetters(x) { return { type: 'type', id: x.id, ask: t('letters_q'), big: C.scramble(x.w[0].toUpperCase(), R).split('').join(' '), bigPl: true, sub: meaning(x.w), a: x.w[0] }; }
  function placesAll() { return D.culture.places.map(function (p) { return { name: p[0], desc: L([p[1], p[2]]), lon: p[3], lat: p[4] }; }).concat(U.map(function (u) { return { name: u.city, desc: cityName(u), lon: u.lon, lat: u.lat }; })); }
  function qSpell(x, pool) {
    var word = x.w[0], bad = C.misspell(word, diff().opts - 1, R, pool.map(function (y) { return y.w[0]; }));
    var rules = {}; bad.forEach(function (b) { rules[b.rule] = 1; });
    var why = Object.keys(rules).map(function (k) { return t('rule_' + k); }).join(' ');
    return { type: 'mc', id: x.id, ask: t('spell_q'), big: meaning(x.w), say: S.diff === 'hard' ? null : word, a: word, opts: C.shuffle([word].concat(bad.map(function (b) { return b.w; })), R), plOpts: true, explain: why, sayAfter: word };
  } /* PATCH005 */
  function qSpeak(s) { return { type: 'speak', id: null, ask: t('speak_tap'), big: s[0], sub: L([s[1], s[2]]), a: s[0] }; }

  function mixedFor(list, pool, n) {
    var qs = [], items = C.shuffle(list, R);
    for (var i = 0; i < n; i++) {
      var x = items[i % items.length], k = C.pickKind(S.diff, R());
      if (k === 'pl2x') qs.push(qMC(x, pool, 'pl2x'));
      else if (k === 'x2pl') qs.push(qMC(x, pool, 'x2pl'));
      else if (k === 'listen') qs.push(qListen(x, pool));
      else if (k === 'dictate') qs.push(qDictate(x));
      else qs.push(qType(x));
    }
    return qs;
  }
  function sentencesOf(uis) { var s = []; uis.forEach(function (ui) { s = s.concat(U[ui].sentences); }); return s; }

  /* ================================================================
     Modi starten
     ================================================================ */
  var lastMode = null;
  function startMode(mode, ui) {
    lastMode = { m: mode, ui: ui };
    var n = S.len, u = ui != null ? U[ui] : null, list = ui != null ? wordsOf(ui) : null, pool = poolOpen(), qs;
    if (pool.length < 8) pool = pool.concat(wordsOf(Math.min(1, U.length - 1)));
    if (mode === 'learn') {
      var newOnes = list.filter(function (x) { return !S.cards[x.id]; }), pick = (newOnes.length ? newOnes : C.shuffle(list, R)).slice(0, 6);
      qs = pick.map(function (x) { return { type: 'card', id: x.id, big: x.w[0], sub: meaning(x.w), say: x.w[0] }; })
        .concat(C.shuffle(pick, R).map(function (x) { return qMC(x, list, 'pl2x'); }))
        .concat(C.shuffle(pick, R).slice(0, 3).map(function (x) { return qMC(x, list, 'x2pl'); }));
      return runGame({ title: t('learn'), qs: qs, unit: ui });
    }
    if (mode === 'quiz') return runGame({ title: t('quiz'), qs: mixedFor(list, list, n), unit: ui });
    if (mode === 'listen') return runGame({ title: t('listen'), qs: C.shuffle(list, R).slice(0, n).map(function (x) { return qListen(x, list); }), unit: ui });
    if (mode === 'type') return runGame({ title: t('type'), qs: C.shuffle(list, R).slice(0, n).map(qType), unit: ui });
    if (mode === 'build') return runGame({ title: t('build'), qs: C.shuffle(u.sentences, R).map(function (s) { return qBuild(s); }), unit: ui });
    if (mode === 'cloze') return runGame({ title: t('cloze'), qs: C.shuffle(u.sentences, R).map(function (s) { return qCloze(s, list); }), unit: ui });
    if (mode === 'speak') return runGame({ title: t('speak'), qs: u.sentences.map(qSpeak), unit: ui });
    if (mode === 'match') return runMatch(list, ui);
    if (mode === 'scene') return runScene(ui);
    if (mode === 'boss') {
      var bc = diff().boss, ss = C.shuffle(u.sentences, R);
      qs = mixedFor(list, list, bc.n - 4).concat(ss.slice(0, 2).map(function (s) { return S.diff === 'easy' ? qBuild(s) : qTranslate(s); })).concat(ss.slice(2, 4).map(function (s) { return qCloze(s, list); }));
      return runGame({ title: t('boss') + ' · ' + u.city, qs: C.shuffle(qs, R), unit: ui, boss: true, lives: bc.lives, pass: bc.pass });
    }
    if (mode === 'welcome') {
      var wsrc = allWords().filter(function (x) { return S.cards[x.id]; }).sort(function (a, b) { return S.cards[a.id].box - S.cards[b.id].box; }).slice(0, 5);
      if (wsrc.length < 2) wsrc = pool.slice(0, 5);
      return runGame({ title: t('wb_title'), qs: mixedFor(wsrc, pool.concat(wsrc), 5) });
    }
    if (mode === 'review' || mode === 'mistakes' || mode === 'mine') {
      var src;
      if (mode === 'review') { src = dueList(); if (!src.length) { toast(t('no_due')); src = allWords().filter(function (x) { return S.cards[x.id]; }).sort(function (a, b) { return S.cards[a.id].box - S.cards[b.id].box; }); if (!src.length) src = pool; } }
      else if (mode === 'mistakes') { src = S.mistakes.map(byId).filter(Boolean); if (!src.length) { toast(t('empty_mistakes')); return; } }
      else { src = S.custom.map(function (w, i) { return { id: 'my:' + i, w: w, u: -1 }; }); }
      src = src.slice(0, Math.max(n, 6));
      return runGame({ title: t(mode === 'mine' ? 'mywords' : mode), qs: mixedFor(src, mode === 'mine' ? src : pool.concat(src), Math.min(n, Math.max(src.length, 4))) });
    }
    if (mode === 'daily') {
      var d = today(), r0 = C.rng('daily-' + d), saved = R; R = r0;
      var src2 = C.sample(pool, 8, r0), sents = sentencesOf(openUnits());
      qs = src2.slice(0, 6).map(function (x, i) { return i % 2 ? qMC(x, pool, 'x2pl') : qListen(x, pool); }).concat(C.sample(sents, 2, r0).map(function (s) { return qBuild(s); }))
        .concat([qTF(D.culture.tf[Math.floor(r0() * D.culture.tf.length)]), qWho(D.culture.people[Math.floor(r0() * D.culture.people.length)])]);
      R = saved;
      return runGame({ title: t('daily'), qs: qs, daily: d });
    }
    if (mode === 'blitz') return runGame({ title: t('blitz'), qs: mixedFor(pool, pool, 80).filter(function (q) { return q.type === 'mc'; }), timer: diff().blitz });
    if (mode === 'spell') { var need = diff().opts - 1, sp = pool.filter(function (x) { return C.spellWorthy(x.w[0]) && C.misspell(x.w[0], need, C.rng(x.w[0])).length >= need; }); return runGame({ title: t('spell'), qs: C.sample(sp, Math.min(n, sp.length), R).map(function (x) { return qSpell(x, pool); }) }); }
    if (mode === 'survival') return runGame({ title: t('survival'), qs: mixedFor(pool, pool, 300).filter(function (q) { return q.type === 'mc'; }), lives: 3, survival: S.diff === 'hard' ? 6 : (S.diff === 'medium' ? 8 : 12) });
    if (mode === 'whoami') return runGame({ title: t('whoami'), qs: C.sample(D.culture.people, Math.min(n, 6), R).map(qWho) });
    if (mode === 'tf') return runGame({ title: t('tf'), qs: C.sample(D.culture.tf, Math.min(n, D.culture.tf.length), R).map(qTF) });
    if (mode === 'timeline') { qs = []; for (var ti = 0; ti < 4; ti++) qs.push(qOrder(C.sample(D.culture.timeline, S.diff === 'hard' ? 5 : 4, R))); return runGame({ title: t('timeline'), qs: qs }); }
    if (mode === 'pin') return runGame({ title: t('pin'), qs: C.sample(placesAll(), Math.min(n, 8), R).map(qPin) });
    if (mode === 'hl') { qs = []; for (var hi2 = 0; hi2 < Math.min(n, 10); hi2++) { var qh = qHL(D.culture.hl[hi2 % D.culture.hl.length]); if (qh) qs.push(qh); } return runGame({ title: t('hl'), qs: qs }); }
    if (mode === 'literki') return runGame({ title: t('literki'), qs: C.sample(pool.filter(function (x) { return x.w[0].indexOf(' ') < 0 && x.w[0].length >= 4 && x.w[0].length <= 10; }), Math.min(n, 8), R).map(qLetters) });
    if (mode === 'placement') {
      qs = [];
      U.forEach(function (uu, i) { var w = C.sample(wordsOf(i), 2, R); var a = qMC(w[0], wordsOf(i), 'x2pl'), b = qType(w[1]); a.city = i; b.city = i; qs.push(a, b); });
      return runGame({ title: t('placement'), qs: qs, placement: true });
    }
    if (mode === 'aspect') return runGame({ title: t('aspect'), qs: C.shuffle(D.aspects, R).slice(0, Math.min(n, D.aspects.length)).map(qAspect) });
    if (mode === 'letterquiz') return runGame({ title: t('lq'), qs: C.shuffle(D.letterQuiz, R).map(qLetter), letterQuiz: true, back: 'letter' });
    if (mode === 'cases') return runGame({ title: t('cases'), qs: C.shuffle(D.cases, R).slice(0, Math.min(n, D.cases.length)).map(qCase) });
    if (mode === 'sounds') {
      qs = C.shuffle(D.sounds, R).slice(0, 6).map(qSound);
      for (var k = 0; k < 4; k++) qs.push(qHearWord(pool));
      return runGame({ title: t('sounds'), qs: C.shuffle(qs, R) });
    }
    if (mode === 'prices') { qs = []; for (var p = 0; p < n; p++) qs.push(qPrice()); return runGame({ title: t('prices'), qs: qs }); }
    if (mode === 'memo_w' || mode === 'memo_p' || mode === 'memo_y') return runMemo(mode);
    if (mode === 'twister') return runGame({ title: t('twister'), qs: C.sample(D.twisters, Math.min(6, D.twisters.length), R).map(qSpeak) });
    if (mode === 'duel') { tab = 'duel'; return renderDuelSetup(); }
    if (mode === 'face') { tab = 'face'; return renderFaceSetup(); }
    if (mode === 'polacy') { tab = 'polacy'; return renderPolacy(); }
    if (mode === 'mywords') { tab = 'mywords'; return renderMyWords(); }
  }

  /* ================================================================
     Spiel-Engine
     ================================================================ */
  var G = null;
  function runGame(cfg) {
    if (!cfg.players) cfg.mode = cfg.mode || lastMode;
    G = { cfg: cfg, i: 0, qs: cfg.qs, combo: 0, best: 0, right: 0, wrong: 0, xp: 0, results: [], lives: cfg.lives || 0, learned: [], start: Date.now(), ended: false, timerId: null, players: cfg.players || null, pi: 0, pscore: cfg.players ? cfg.players.map(function () { return 0; }) : null };
    view = 'game';
    if (cfg.timer) { G.left = cfg.timer; G.timerId = setInterval(function () { G.left--; var el = document.getElementById('timer'); if (el) el.textContent = G.left; if (G.left <= 0) { clearInterval(G.timerId); endGame(); } }, 1000); }
    drawQ();
  }
  function gameTop() {
    var g = G, pct = g.cfg.timer ? (g.left / g.cfg.timer * 100) : (g.i / g.qs.length * 100), lives = '';
    if (g.cfg.lives) { lives = '<span class="lives" aria-label="' + g.lives + '">'; for (var i = 0; i < g.cfg.lives; i++) lives += '<i class="' + (i < g.lives ? '' : 'off') + '"></i>'; lives += '</span>'; }
    return '<div class="game-top"><button class="icon-btn" id="quit" aria-label="' + esc(t('back')) + '">' + I.x + '</button><div class="bar"><i style="width:' + pct + '%"></i></div>' +
      (g.cfg.timer ? '<span class="timer num" id="timer">' + g.left + '</span>' : '') + (g.cfg.survival ? '<span class="timer num" id="qtimer">' + g.cfg.survival + '</span>' : '') + lives + (g.combo > 1 ? '<span class="combo num">×' + g.combo + '</span>' : '') + '</div>' +
      (g.players ? '<div class="banner"><strong>' + esc(g.players[g.pi]) + ' ' + esc(t('turn')) + '</strong></div>' : '');
  }
  function drawQ() {
    if (!G || G.ended) return;
    if (G.i >= G.qs.length) return endGame();
    var q = G.qs[G.i], html = '<section class="game">' + gameTop() + '<div class="prompt"><span class="eyebrow">' + esc(G.cfg.title) + (q.ask ? ' · ' + esc(q.ask) : '') + '</span>';
    if (q.big && !q.hideText) html += '<div class="' + (q.small ? 'sentence' : 'big') + '" lang="' + (q.bigPl ? 'pl' : (q.type === 'type' || q.small || q.type === 'pin' || q.ask === t('choose_pl') ? S.base : 'pl')) + '">' + esc(q.big) + '</div>';
    if (q.clues) html += '<ol class="clues">' + q.clues.slice(0, q.shown).map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ol>' + (q.shown < q.clues.length ? '<button class="btn ghost" id="more" style="justify-self:start;padding-left:0">+ ' + esc(t('more_clue')) + '</button>' : '');
    if (q.sentence) html += '<div class="sentence" lang="pl">' + esc(q.sentence).replace('___', '<span class="blank" aria-label="gap">&nbsp;</span>') + '</div>';
    if (q.sub) html += '<div class="muted">' + esc(q.sub) + '</div>';
    if (q.say) html += '<div class="row"><button class="icon-btn" id="say" aria-label="' + esc(t('listen_again')) + '">' + I.spk + '</button><button class="icon-btn" id="say-slow" aria-label="' + esc(t('slow')) + '">' + I.snail + '</button></div>';
    html += '</div><div id="jk" class="row"></div><div id="area"></div><div id="fb"></div></section>';
    shell(html, false);
    document.getElementById('quit').onclick = function () { stopTimer(); var cu = G.cfg.unit; G = null; if (cu != null) go('city', cu); else go(tab === 'city' ? 'home' : tab); };
    if (q.say) { document.getElementById('say').onclick = function () { speak(q.say); }; document.getElementById('say-slow').onclick = function () { speak(q.say, true); }; speak(q.say); }
    var area = document.getElementById('area');
    if (q.type !== 'card' && !G.cfg.timer && !G.players && !G.cfg.boss && !G.cfg.placement && !G.cfg.survival && !G.cfg.duel) {
      var fbEl = document.getElementById('fb'); fbEl.insertAdjacentHTML('afterend', '<button class="btn ghost" id="qskip" style="justify-self:start">' + esc(t('skip_q')) + ' →</button>');
      document.getElementById('qskip').onclick = function () { G.i++; drawQ(); };
    }
    var mb = document.getElementById('more'); if (mb) mb.onclick = function () { q.shown++; drawQ(); };
    renderJokers(q); startQTimer(q);
    if (q.type === 'order') return drawOrder(q, area);
    if (q.type === 'pin') return drawPin(q, area);
    if (q.type === 'card') return drawCard(q, area);
    if (q.type === 'mc') return drawMC(q, area);
    if (q.type === 'type') return drawInput(q, area);
    if (q.type === 'build') return drawBuild(q, area);
    if (q.type === 'speak') return drawSpeak(q, area);
  }
  function stopTimer() { if (G && G.timerId) clearInterval(G.timerId); stopQTimer(); }
  function stopQTimer() { if (G && G.qtId) { clearInterval(G.qtId); G.qtId = null; } }
  function startQTimer(q) {
    if (!G.cfg.survival || q.type !== 'mc') return;
    stopQTimer(); G.qLeft = G.cfg.survival;
    G.qtId = setInterval(function () {
      G.qLeft--; var el = document.getElementById('qtimer'); if (el) el.textContent = Math.max(G.qLeft, 0);
      if (G.qLeft <= 0) { stopQTimer(); var area = document.getElementById('area'); if (!area) return;
        area.querySelectorAll('.opt').forEach(function (bb) { bb.disabled = true; if (C.norm(q.opts[+bb.getAttribute('data-i')]) === C.norm(q.a)) bb.classList.add('right'); });
        answer(q, false, q.a, '\u23F1'); }
    }, 1000);
  }
  function renderJokers(q) {
    var jk = document.getElementById('jk'); if (!jk || G.players || G.cfg.placement || G.cfg.duel) return;
    var J = S.jokers, h = '';
    if (q.type === 'mc' && q.opts && q.opts.length >= 3 && J.five0 > 0) h += '<button class="chip" id="j5050" title="' + esc(t('jokers_d')) + '">' + esc(t('j_5050')) + ' <span class="num muted">' + J.five0 + '</span></button>';
    if (q.type === 'type' && (S.input || 'write') === 'write' && J.hint > 0) h += '<button class="chip" id="jhint" title="' + esc(t('jokers_d')) + '">' + esc(t('j_hint')) + ' <span class="num muted">' + J.hint + '</span></button>';
    if ((G.cfg.survival || G.cfg.timer) && J.freeze > 0) h += '<button class="chip" id="jfreeze" title="' + esc(t('jokers_d')) + '">' + esc(t('j_freeze')) + ' <span class="num muted">' + J.freeze + '</span></button>';
    jk.innerHTML = h;
    var b1 = document.getElementById('j5050'); if (b1) b1.onclick = function () {
      var wrong = [].slice.call(document.querySelectorAll('#area .opt:not([disabled])')).filter(function (b) { return C.norm(q.opts[+b.getAttribute('data-i')]) !== C.norm(q.a); });
      C.shuffle(wrong, R).slice(0, Math.max(1, Math.floor(wrong.length * 2 / 3))).forEach(function (b) { b.disabled = true; b.style.opacity = '.35'; });
      J.five0--; q.jf = 0.6; b1.remove(); save();
    };
    var b2 = document.getElementById('jhint'); if (b2) b2.onclick = function () {
      var inp = document.getElementById('ans'); var n = Math.max(1, Math.ceil(q.a.length / 4));
      if (inp) { inp.value = q.a.slice(0, n); inp.focus(); }
      J.hint--; q.jf = 0.5; b2.remove(); save();
    };
    var b3 = document.getElementById('jfreeze'); if (b3) b3.onclick = function () {
      if (G.cfg.survival) G.qLeft += 10; else G.left += 10;
      J.freeze--; b3.remove(); save();
    };
  }

  function drawCard(q, area) {
    area.innerHTML = '<button class="btn primary block" id="nx">' + esc(t('next')) + '</button>';
    document.getElementById('nx').onclick = function () { if (!S.cards[q.id]) S.cards[q.id] = { box: 0, due: today(), seen: 0, wrong: 0 }; G.i++; drawQ(); };
  }
  function drawMC(q, area) {
    area.innerHTML = '<div class="opts">' + q.opts.map(function (o, i) { return '<button class="opt" data-i="' + i + '" lang="' + (looksPl(o, q) ? 'pl' : S.base) + '">' + esc(o) + '</button>'; }).join('') + '</div>';
    area.querySelectorAll('.opt').forEach(function (b) {
      b.onclick = function () {
        var pick = q.opts[+b.getAttribute('data-i')], ok = C.norm(pick) === C.norm(q.a);
        area.querySelectorAll('.opt').forEach(function (bb) { bb.disabled = true; if (C.norm(q.opts[+bb.getAttribute('data-i')]) === C.norm(q.a)) bb.classList.add('right'); });
        if (!ok) b.classList.add('wrong');
        answer(q, ok, ok ? '' : q.a, '', q.clues ? [1, 0.7, 0.4][q.shown - 1] : 1);
      };
    });
  }
  function looksPl(o, q) { if (q.plOpts || q.clues) return true; if (q.fixed) return false; return q.ask === t('choose_pl') || q.ask === t('fill') || q.ask === t('hear_word') || (q.ask || '').indexOf(t('case_q')) === 0; }
  function plKeys() { return '<div class="pl-keys" aria-label="Polish letters">' + ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'].map(function (c) { return '<button type="button" data-k="' + c + '">' + c + '</button>'; }).join('') + '</div>'; }
  /* Antwortart (Einstellung S.input): Schreib-Fragen auch per Sprechen oder Antippen beantworten.
     Antippen-Optionen sind fest aus der Antwort abgeleitet (eigener Zufall) – im Duell-Code auf beiden Handys gleich. */
  function drawInput(q, area) {
    var m = S.input || 'write';
    if (m === 'tap') drawTapType(q, area); else if (m === 'speak') drawSayType(q, area); else drawType(q, area);
    var other = ['write', 'speak', 'tap'].filter(function (k) { return k !== m; });
    area.insertAdjacentHTML('beforeend', '<div class="row small muted inp-switch">' + esc(t('inp_rather')) + ': ' + other.map(function (k) { return '<button type="button" class="btn ghost" data-inp="' + k + '">' + esc(t('inp_' + k)) + '</button>'; }).join('') + '</div>');
    area.querySelectorAll('[data-inp]').forEach(function (b) { b.onclick = function () { S.input = b.getAttribute('data-inp'); save(); area.innerHTML = ''; drawInput(q, area); }; });
  }
  function tapOpts(q) {
    var r = C.rng('tap|' + q.a), a = C.norm(q.a), seen = {}, out = [], src;
    seen[a] = 1;
    if (q.alt && q.alt.length) src = q.alt;
    else { src = []; U.forEach(function (u, i) { wordsOf(i).forEach(function (x) { src.push(x.w[0]); }); if (q.a.indexOf(' ') >= 0) u.sentences.forEach(function (x) { src.push(x[0]); }); }); }
    var words = q.a.split(' ').length;
    C.shuffle(src, r).sort(function (x, y) { return Math.abs(x.split(' ').length - words) - Math.abs(y.split(' ').length - words); }).forEach(function (o) {
      var k = C.norm(o); if (out.length < 3 && !seen[k]) { seen[k] = 1; out.push(o); }
    });
    return C.shuffle([q.a].concat(out), r);
  }
  function drawTapType(q, area) {
    var opts = tapOpts(q);
    area.innerHTML = '<div class="opts">' + opts.map(function (o, i) { return '<button class="opt" data-i="' + i + '" lang="pl">' + esc(o) + '</button>'; }).join('') + '</div>';
    area.querySelectorAll('.opt').forEach(function (b) {
      b.onclick = function () {
        var ok = C.norm(opts[+b.getAttribute('data-i')]) === C.norm(q.a);
        area.querySelectorAll('button').forEach(function (bb) { bb.disabled = true; if (bb.hasAttribute('data-i') && C.norm(opts[+bb.getAttribute('data-i')]) === C.norm(q.a)) bb.classList.add('right'); });
        if (!ok) b.classList.add('wrong');
        if (ok) speak(q.a);
        answer(q, ok, ok ? '' : q.a, '', 0.7);
      };
    });
  }
  function drawSayType(q, area) {
    var Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    function lock() { area.querySelectorAll('button').forEach(function (b) { b.disabled = true; }); }
    function selfRate() {
      area.innerHTML = '<p class="small muted">' + esc(t('inp_selfq')) + '</p><button class="btn primary block" id="srev">' + esc(t('inp_reveal')) + '</button>';
      document.getElementById('srev').onclick = function () {
        area.innerHTML = '<div class="big" lang="pl">' + esc(q.a) + '</div><div class="row"><button class="btn primary" id="sok" style="flex:1">' + esc(t('inp_ok')) + '</button><button class="btn" id="sno" style="flex:1">' + esc(t('inp_no')) + '</button></div>';
        speak(q.a);
        document.getElementById('sok').onclick = function () { lock(); answer(q, true, '', '', 0.8); };
        document.getElementById('sno').onclick = function () { lock(); answer(q, false, q.a); };
      };
    }
    if (!Rec) return selfRate();
    area.innerHTML = '<button class="btn primary block" id="mic">' + I.mic + esc(t('inp_say')) + '</button><p id="heard" class="small muted"></p><button type="button" class="btn ghost" id="sself" style="justify-self:start">' + esc(t('inp_reveal')) + '</button>';
    document.getElementById('sself').onclick = selfRate;
    document.getElementById('mic').onclick = function () {
      try {
        var rec = new Rec(); rec.lang = 'pl-PL'; rec.interimResults = false; rec.maxAlternatives = 3;
        rec.onresult = function (e) {
          var alts = []; for (var i = 0; i < e.results[0].length; i++) alts.push(e.results[0][i].transcript);
          var ok = alts.some(function (a) { var r = C.checkAnswer(a, q.a, {}); return r.ok || C.lev(C.norm(a, true), C.norm(q.a, true)) <= Math.max(1, Math.round(q.a.length * 0.15)); });
          document.getElementById('heard').textContent = t('you_said') + ': ' + (alts[0] || '');
          lock(); if (ok) speak(q.a);
          answer(q, ok, ok ? '' : q.a);
        };
        rec.onerror = function () { selfRate(); };
        rec.start();
      } catch (e) { selfRate(); }
    };
  }
  function drawType(q, area) {
    area.innerHTML = '<form id="tf" class="stack"><input class="answer-in" id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" lang="pl" aria-label="' + esc(t('type_pl')) + '">' + plKeys() +
      '<div class="row"><button class="btn primary" style="flex:1">' + esc(t('check')) + '</button><button type="button" class="btn ghost" id="skip">' + esc(t('skip')) + '</button></div></form>';
    var inp = document.getElementById('ans'); try { inp.focus(); } catch (e) {}
    area.querySelectorAll('[data-k]').forEach(function (b) { b.onclick = function () { var s = inp.selectionStart || inp.value.length; inp.value = inp.value.slice(0, s) + b.getAttribute('data-k') + inp.value.slice(inp.selectionEnd || s); inp.focus(); inp.setSelectionRange(s + 1, s + 1); }; });
    document.getElementById('skip').onclick = function () { lockForm(); answer(q, false, q.a); };
    document.getElementById('tf').onsubmit = function (e) {
      e.preventDefault(); if (!inp.value.trim()) return;
      var r = C.checkAnswer(inp.value, q.a, { hardcore: G && G.cfg.duel ? C.diffCfg(G.cfg.duel.diff).strict : (S.hardcore || diff().strict) }); lockForm();
      var note = r.kind === 'diacritics' ? t('almost_dia') + ': ' + q.a : r.kind === 'typo' ? t('almost_typo') + ': ' + q.a : '';
      answer(q, r.ok, r.ok ? '' : q.a, note, r.kind === 'typo' ? 0.5 : 1);
    };
    function lockForm() { inp.disabled = true; area.querySelectorAll('button').forEach(function (b) { b.disabled = true; }); }
  }
  function drawBuild(q, area) {
    var picked = [];
    function paint() {
      area.innerHTML = '<div class="tiles-build" id="bt" aria-live="polite">' + picked.map(function (ti, k) { return '<button class="wtile" data-out="' + k + '" lang="pl">' + esc(q.tiles[ti]) + '</button>'; }).join('') + '</div>' +
        '<div class="tiles-pool">' + q.tiles.map(function (w, i) { return '<button class="wtile' + (picked.indexOf(i) >= 0 ? ' used' : '') + '" data-in="' + i + '" lang="pl">' + esc(w) + '</button>'; }).join('') + '</div>' +
        '<button class="btn primary block" id="chk"' + (picked.length ? '' : ' disabled') + '>' + esc(t('check')) + '</button>';
      area.querySelectorAll('[data-in]').forEach(function (b) { b.onclick = function () { picked.push(+b.getAttribute('data-in')); paint(); }; });
      area.querySelectorAll('[data-out]').forEach(function (b) { b.onclick = function () { picked.splice(+b.getAttribute('data-out'), 1); paint(); }; });
      document.getElementById('chk').onclick = function () {
        var built = picked.map(function (i) { return q.tiles[i]; }).join(' '), ok = C.sameSentence(built, q.a);
        area.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
        answer(q, ok, ok ? '' : q.a);
        if (ok) speak(q.a);
      };
    }
    paint();
  }
  function drawOrder(q, area) {
    var picked = [];
    function paint() {
      area.innerHTML = '<div class="opts">' + q.items.map(function (e, i) { var k = picked.indexOf(i); return '<button class="opt" data-ord="' + i + '"' + (k >= 0 ? ' disabled' : '') + '>' + (k >= 0 ? '<span class="num" style="color:var(--red)">' + (k + 1) + '. </span>' : '') + esc(L([e[1], e[2]])) + '</button>'; }).join('') + '</div>';
      area.querySelectorAll('[data-ord]').forEach(function (b) { b.onclick = function () {
        picked.push(+b.getAttribute('data-ord'));
        if (picked.length < q.items.length) return paint();
        paint(); area.querySelectorAll('button').forEach(function (x) { x.disabled = true; });
        var ok = C.orderOk(picked.map(function (i) { return q.items[i][0]; }));
        var sorted = q.items.slice().sort(function (a, b) { return a[0] - b[0]; });
        q.reveal = sorted.map(function (e) { return e[0] + ': ' + L([e[1], e[2]]); }).join(' · ');
        answer(q, ok, '');
      }; });
    }
    paint();
  }
  function drawPin(q, area) {
    var pts = D.outline.map(function (p) { var c = proj(p[0], p[1]); return c[0].toFixed(1) + ',' + c[1].toFixed(1); }).join(' ');
    area.innerHTML = '<div class="card" style="padding:8px"><svg class="map" id="pinmap" viewBox="-10 0 680 650" role="img" aria-label="' + esc(t('tap_map')) + '" style="cursor:crosshair"><polygon class="land" points="' + pts + '"/><g id="pinlayer"></g></svg></div>';
    var svg = document.getElementById('pinmap'), done = false;
    svg.addEventListener('click', function (ev) {
      if (done) return; done = true;
      var pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY; var m = svg.getScreenCTM(); var p = m ? pt.matrixTransform(m.inverse()) : { x: 330, y: 320 };
      var ll = C.unproj(p.x, p.y), tg = q.target, d = C.distKm(ll[1], ll[0], tg.lat, tg.lon), tp = proj(tg.lon, tg.lat);
      document.getElementById('pinlayer').innerHTML = '<line x1="' + p.x + '" y1="' + p.y + '" x2="' + tp[0] + '" y2="' + tp[1] + '" stroke="var(--route)" stroke-width="3" stroke-dasharray="4 6"/>' +
        '<circle cx="' + p.x + '" cy="' + p.y + '" r="10" fill="var(--amber)"/><circle cx="' + tp[0] + '" cy="' + tp[1] + '" r="12" fill="var(--red)" stroke="var(--surface)" stroke-width="3"/>';
      var lim = S.diff === 'hard' ? 50 : (S.diff === 'medium' ? 70 : 100), ok = d <= lim;
      answer(q, ok, '', Math.round(d) + ' ' + t('km_off'), ok ? Math.max(0.3, 1 - d / (lim * 1.5)) : 1);
    });
  }
  function drawSpeak(q, area) {
    var Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    function selfRate(msg) {
      area.innerHTML = (msg ? '<p class="small muted">' + esc(msg) + '</p>' : '') + '<p>' + esc(t('speak_self')) + '</p><div class="row"><button class="btn primary" id="sg" style="flex:1">' + esc(t('speak_good')) + '</button><button class="btn" id="sr" style="flex:1">' + esc(t('speak_retry')) + '</button></div>';
      document.getElementById('sg').onclick = function () { answer(q, true, ''); };
      document.getElementById('sr').onclick = function () { speak(q.a, true); };
    }
    speak(q.a);
    area.insertAdjacentHTML('afterend', recHtml()); bindRec(q.a);
    if (!Rec) return selfRate(t('no_mic'));
    area.innerHTML = '<button class="btn primary block" id="mic">' + I.mic + esc(t('speak_tap')) + '</button><p id="heard" class="small muted"></p>';
    document.getElementById('mic').onclick = function () {
      try {
        var rec = new Rec(); rec.lang = 'pl-PL'; rec.interimResults = false; rec.maxAlternatives = 3;
        rec.onresult = function (e) {
          var alts = []; for (var i = 0; i < e.results[0].length; i++) alts.push(e.results[0][i].transcript);
          var best = alts[0] || '', ok = alts.some(function (a) { var r = C.checkAnswer(a, q.a, {}); return r.ok || C.lev(C.norm(a, true), C.norm(q.a, true)) <= Math.max(2, Math.round(q.a.length * 0.15)); });
          document.getElementById('heard').textContent = t('you_said') + ': ' + best;
          answer(q, ok, ok ? '' : q.a);
        };
        rec.onerror = function () { selfRate(t('no_mic')); };
        rec.start();
      } catch (e) { selfRate(t('no_mic')); }
    };
  }

  function answer(q, ok, solution, note, factor) {
    var g = G; if (!g) return; stopQTimer();
    factor = (factor == null ? 1 : factor) * (q.jf || 1);
    if (ok) { g.combo++; g.best = Math.max(g.best, g.combo); g.right++; } else { g.combo = 0; g.wrong++; if (g.cfg.lives) g.lives--; }
    var xp = Math.round(C.xpFor(ok, g.combo, S.hardcore && !diff().strict && q.type === 'type') * factor * diff().xp);
    g.xp += xp; g.results.push(ok);
    if (g.players) { if (ok) g.pscore[g.pi] += 1; }
    if (q.id && !g.players) grade(q.id, ok);
    if (ok && q.id && g.learned.length < 3) { var x = byId(q.id); if (x) g.learned.push(x.w); }
    if (!ok && q.sayAfter) speak(q.sayAfter);
    if (ok && q.sayAfter && q.type === 'mc') speak(q.sayAfter);
    if (g.cfg.timer) { g.i++; setTimeout(function () { if (G === g) drawQ(); }, ok ? 250 : 900); return; } /* PATCH007 */
    var fb = document.getElementById('fb'), html = '<div class="feedback ' + (ok ? 'ok' : 'no') + ' pop" role="status"><span class="h">' + esc(ok ? t('right') : t('wrong')) + (ok && xp ? ' <span class="num small">+' + xp + ' XP</span>' : '') + '</span>';
    if (note) html += '<span>' + esc(note) + '</span>';
    if (solution) html += '<span>' + esc(t('solution')) + ': <b lang="pl">' + esc(solution) + '</b></span>';
    if (q.reveal) html += '<span lang="pl">' + esc(q.reveal) + '</span>';
    if (q.explain) html += '<span class="small">' + esc(q.explain) + '</span>';
    html += '</div><button class="btn primary block" id="nx" style="margin-top:12px">' + esc(t('next')) + '</button>' + (polUI || g.players ? '' : reportHtml('rep-q'));
    fb.innerHTML = html;
    bindReport('rep-q', g.cfg.title + ' | ' + [q.ask, q.big, q.sentence, q.a].filter(function (v) { return v != null && v !== ''; }).map(String).join(' | ') + (solution ? ' | ' + solution : '') + ' | ' + (ok ? 'ok' : 'falsch'));
    var nx = document.getElementById('nx'); try { nx.focus({ preventScroll: true }); } catch (e) {}
    nx.onclick = function () {
      if (g.cfg.lives && g.lives <= 0) return endGame();
      if (g.cfg.placement && g.results.length >= 4 && g.results.slice(-4).every(function (r) { return !r; })) return endGame();
      if (g.players) g.pi = g.cfg.block ? Math.floor((g.i + 1) / g.cfg.block) % g.players.length : (g.pi + 1) % g.players.length;
      g.i++; drawQ();
    };
  }

  function endGame() {
    var g = G; if (!g || g.ended) return; g.ended = true; stopTimer();
    var total = g.right + g.wrong, pct = total ? Math.round(g.right / total * 100) : 0, extras = '', shareTxt = '', party = false;
    if (!g.players) { addXp(g.xp); if (total >= 3 || g.cfg.timer) markActive(); }
    if (g.cfg.daily) { S.daily[g.cfg.daily] = { score: g.right, results: g.results }; }
    if (g.cfg.survival) { S.best = S.best || {}; if (g.right > (S.best.survival || 0)) { S.best.survival = g.right; extras += '<div class="banner pop"><strong>' + esc(t('best')) + ': ' + g.right + '</strong></div>'; } }
    if (g.cfg.boss) {
      var u = U[g.cfg.unit], passed = g.lives > 0 && g.i >= g.qs.length - 1 && pct >= (g.cfg.pass || 60);
      if (passed) {
        var first = !S.boss[u.id];
        S.boss[u.id] = Math.max(S.boss[u.id] || 0, pct);
        if (g.cfg.unit >= S.unlocked && g.cfg.unit < U.length - 1) { S.unlocked = g.cfg.unit + 1; extras += '<div class="banner pop"><strong>' + esc(t('unlocked')) + ': ' + esc(U[S.unlocked].city) + '</strong></div>'; }
        if (first) extras += '<div class="card stack pop"><span class="eyebrow">' + esc(t('postcard_new')) + '</span><b>' + esc(u.city) + '</b><p class="small">' + esc(L(u.fact)) + '</p></div>' + letterNewBox(u.id);
        shareTxt = t('share_boss').replace('{c}', u.city).replace('{p}', pct) + ' ' + SITE; party = true;
        extras += maybeKrasnal(true);
      } else extras += '<p class="muted">' + esc(t('failed')) + '</p>';
    } else if (!g.players && !polUI && total >= 5) extras += maybeKrasnal(false);
    if (g.cfg.unit != null && !g.players && lastMode && lastMode.ui === g.cfg.unit && total >= 1) { var did = U[g.cfg.unit].id; S.done = S.done || {}; S.done[did] = S.done[did] || {}; S.done[did][lastMode.m] = 1; }
    save();
    if (g.cfg.placement) {
      var per = U.map(function () { return []; });
      g.qs.forEach(function (q, i) { if (i < g.results.length) per[q.city].push(g.results[i]); });
      var st = C.placementStart(per);
      if (st >= U.length) { S.free = true; S.unlocked = U.length - 1; extras += '<div class="banner pop"><strong>' + esc(t('placement_all')) + '</strong></div>'; }
      else { for (var pi2 = 0; pi2 < st; pi2++) if (!S.boss[U[pi2].id]) S.skipped[U[pi2].id] = true; S.unlocked = Math.max(S.unlocked, st); extras += '<div class="banner pop"><strong>' + esc(t('placement_res')) + ': ' + esc(U[st].city) + '</strong><span>' + esc(L(U[st].title)) + '</span></div>'; }
      save();
    }
    if (g.cfg.polTest) {
      var newLv = C.polLevel(g.qs.slice(0, g.results.length).map(function (q, i) { return { lv: q.lvq, ok: g.results[i] }; })), up = S.plv == null || newLv > S.plv;
      S.plv = newLv; save();
      extras += '<div class="banner pop" lang="pl"><strong>' + esc(up && newLv > 0 ? t('pol_res_up') : t('pol_res')) + ': ' + esc(t('pol_lv' + newLv)) + '</strong></div>';
    }
    if (g.cfg.letterQuiz && total) {
      S.letterQuiz = Math.max(S.letterQuiz || 0, pct); save();
      if (pct >= 80) { extras += '<div class="banner pop"><strong>' + esc(t('lq_pass')) + '</strong></div>'; shareTxt = t('share_lq').replace('{p}', pct) + ' ' + SITE; party = true; }
    }
    if (g.cfg.daily) shareTxt = C.shareText(g.cfg.daily, g.results);
    if (!g.players && total >= 5 && pct === 100) party = true;
    if (g.cfg.polKey && total) { S.plBest[g.cfg.polKey] = Math.max(S.plBest[g.cfg.polKey] || 0, pct); save(); }
    var title = g.cfg.boss ? (g.lives > 0 && pct >= (g.cfg.pass || 60) ? t('passed') : t('score')) : t('done');
    var learned = g.learned.length ? '<div class="card stack" style="text-align:left;width:100%"><span class="eyebrow">' + esc(t('learned_today')) + '</span>' + g.learned.map(function (w) { return '<div><b lang="pl">' + esc(w[0]) + '</b> <span class="muted">· ' + esc(meaning(w)) + '</span></div>'; }).join('') + '</div>' : '';
    var duelRes = '';
    if (g.players) {
      var max = Math.max.apply(null, g.pscore), win = g.players.filter(function (p, i) { return g.pscore[i] === max; });
      duelRes = '<div class="card stack" style="width:100%;text-align:left">' + g.players.map(function (p, i) { return '<div class="row" style="justify-content:space-between"><b>' + esc(p) + '</b><span class="num">' + g.pscore[i] + '</span></div>'; }).join('') + '</div><h2>' + esc(win.length > 1 ? t('tie') : win[0] + ' ' + t('winner')) + '</h2>';
    }
    if (g.cfg.duel) { g.ms = Date.now() - g.start; extras = duelResultBox(g) + extras; }
    var outlook = (!g.players && !g.cfg.duel && !polUI) ? outlookBox(g) : '';
    var html = '<section class="result pop"><span class="eyebrow">' + esc(g.cfg.title) + '</span><h1>' + esc(title) + '</h1>' +
      (g.players ? duelRes : '<div class="score num">' + g.right + '/' + total + '</div>') +
      '<div class="stats3"><div class="stat"><b class="num">+' + g.xp + '</b><span class="small muted">' + t('xp') + '</span></div><div class="stat"><b class="num">' + pct + '%</b><span class="small muted">' + esc(t('right')) + '</span></div><div class="stat"><b class="num">×' + g.best + '</b><span class="small muted">' + esc(t('combo')) + '</span></div></div>' +
      extras + learned + outlook +
      (shareTxt && !polUI ? '<button class="btn" id="share">' + esc(t(navigator.share ? 'd2_share' : 'share')) + '</button>' : '') +
      '<div class="row" style="width:100%"><button class="btn" id="again" style="flex:1">' + esc(t('again')) + '</button><button class="btn' + (outlook.indexOf('next-step') >= 0 ? '' : ' primary') + '" id="home" style="flex:1">' + esc(t(g.cfg.back && g.cfg.unit == null ? 'back' : 'home')) + '</button></div></section>';
    shell(html);
    var cfg = g.cfg;
    document.getElementById('home').onclick = function () { G = null; go(cfg.unit != null ? 'city' : (cfg.back || 'home'), cfg.unit); };
    document.getElementById('again').onclick = function () { G = null; if (cfg.duel) { tab = 'duel'; return renderDuelSetup(); } if (cfg.players) return startDuel(cfg.players); if (cfg.rerun) return cfg.rerun(); var c2 = Object.assign({}, cfg); restart(c2); };
    var sh = document.getElementById('share'); if (sh) sh.onclick = function () { shareOut(shareTxt); };
    if (party) confetti();
    var nxb = document.getElementById('next-step'); if (nxb) nxb.onclick = function () { G = null; var nui = +nxb.getAttribute('data-ui'); if (isOpen(nui)) startMode(nxb.getAttribute('data-step'), nui); else go('city', nui); };
    var lr = document.getElementById('letter-res'); if (lr) lr.onclick = function () { G = null; go('letter'); };
    if (cfg.duel) bindDuelResult(g);
  }
  /* Ausblick: was als Nächstes kommt – mit dem Szenen-Anfang der nächsten Stadt als kleiner Spannungsbogen */
  function outlookBox(g) {
    var cu = g.cfg.unit, ui = (cu != null && !S.boss[U[cu].id]) ? cu : nextUnit(), u = U[ui], step = C.nextStep(S, u.id);
    if (!step) return U.every(function (x) { return S.boss[x.id]; }) ? '<div class="card stack next-box" style="text-align:left;width:100%"><span class="eyebrow">' + esc(t('next_up')) + '</span><p>' + esc(t('trip_done')) + '</p></div>' : '';
    var newCity = cu != null && ui !== cu, teaser = (newCity || step === 'scene') && u.scene ? '<p class="small scene-intro">' + esc(L(u.scene.intro)) + '</p>' : '';
    return '<div class="card stack next-box pop" style="text-align:left;width:100%"><span class="eyebrow">' + esc((newCity ? t('next_station') : t('next_up')) + ' · ' + u.city) + '</span>' + teaser +
      '<b>' + esc(t('step_' + step)) + '</b><button class="btn primary" id="next-step" data-ui="' + ui + '" data-step="' + esc(step) + '">' + esc(t('go_on')) + ' →</button></div>';
  }
  function restart(cfg) {
    if (cfg.mode) return startMode(cfg.mode.m, cfg.mode.ui);
    var map = { }; map[t('learn')] = 'learn'; map[t('quiz')] = 'quiz'; map[t('listen')] = 'listen'; map[t('type')] = 'type'; map[t('build')] = 'build'; map[t('cloze')] = 'cloze'; map[t('speak')] = 'speak';
    var m = map[cfg.title]; if (m) return startMode(m, cfg.unit);
    if (cfg.boss) return startMode('boss', cfg.unit);
    if (cfg.daily) return startMode('daily');
    if (cfg.timer) return startMode('blitz');
    var t2 = cfg.title, keys = ['review', 'mistakes', 'cases', 'sounds', 'prices', 'twister'];
    for (var i = 0; i < keys.length; i++) if (t(keys[i]) === t2) return startMode(keys[i]);
    if (t2 === t('mywords')) return startMode('mine');
    go('home');
  }
  function maybeKrasnal(sure) {
    var missing = D.krasnale.map(function (k, i) { return i; }).filter(function (i) { return S.krasnale.indexOf(i) < 0; });
    if (!missing.length) return '';
    if (!sure && R() > 0.3) return '';
    var i = missing[Math.floor(R() * missing.length)], k = D.krasnale[i]; S.krasnale.push(i);
    return '<div class="card krasnal pop" style="width:100%">' + krasnalSvg() + '<span class="eyebrow">' + esc(t('krasnal_found')) + '</span><b lang="pl">' + esc(k[0]) + '</b><span class="small muted"><span lang="pl">' + esc(k[1]) + '</span> = ' + esc(S.base === 'en' ? k[3] : k[2]) + '</span></div>';
  }

  /* ---------- Paare (Memory) ---------- */
  /* Memory-Themen: Paare aus allen offenen Städten, Orten oder Jahreszahlen */
  function runMemo(mode) {
    var back = mode === 'memo_w' ? 'practice' : 'land', pairs;
    if (mode === 'memo_w') pairs = C.shuffle(poolOpen(), R).slice(0, 6).map(function (x) { return { a: x.w[0], b: meaning(x.w), pl: true, id: x.id }; });
    else if (mode === 'memo_p') pairs = C.sample(D.culture.places, 6, R).map(function (x) { return { a: x[0], b: L([x[1], x[2]]), pl: true }; });
    else pairs = C.sample(D.culture.timeline, 6, R).map(function (x) { return { a: String(x[0]), b: L([x[1], x[2]]), pl: false }; });
    runMatch(null, null, { pairs: pairs, title: t(mode), back: back, rerun: function () { runMemo(mode); } });
  }
  function runMatch(list, ui, th) {
    var pick = th ? th.pairs : C.shuffle(list, R).slice(0, 6), cards = [];
    pick.forEach(function (x, i) { cards.push({ k: i, s: 0, txt: th ? x.a : x.w[0], pl: th ? x.pl : true }); cards.push({ k: i, s: 1, txt: th ? x.b : meaning(x.w), pl: false }); });
    cards = C.shuffle(cards, R);
    var sel = null, gone = {}, wrong = 0, start = Date.now();
    var title = th ? th.title : t('match');
    G = { cfg: { title: title, unit: th ? null : ui }, ended: false };
    function paint() {
      var left = pick.length - Object.keys(gone).length / 2;
      shell('<section class="game"><div class="game-top"><button class="icon-btn" id="quit" aria-label="' + esc(t('back')) + '">' + I.x + '</button><div class="bar"><i style="width:' + ((pick.length - left) / pick.length * 100) + '%"></i></div><span class="small num">' + left + ' ' + esc(t('pairs_left')) + '</span></div>' +
        '<div class="match-grid' + (th && !th.pairs[0].pl ? ' long' : '') + '">' + cards.map(function (c, i) { return '<button class="opt' + (gone[i] ? ' gone' : '') + (sel === i ? ' sel' : '') + '" data-c="' + i + '" lang="' + (c.pl ? 'pl' : S.base) + '"' + (gone[i] ? ' disabled' : '') + '>' + esc(c.txt) + '</button>'; }).join('') + '</div></section>', false);
      document.getElementById('quit').onclick = function () { G = null; if (th) go(th.back); else go('city', ui); };
      document.querySelectorAll('[data-c]').forEach(function (b) {
        b.onclick = function () {
          var i = +b.getAttribute('data-c'), c = cards[i];
          if (c.pl) speak(c.txt);
          if (sel === null) { sel = i; return paint(); }
          if (sel === i) { sel = null; return paint(); }
          var a = cards[sel];
          if (a.k === c.k && a.s !== c.s) { gone[sel] = 1; gone[i] = 1; if (pick[c.k].id) grade(pick[c.k].id, true); sel = null; if (Object.keys(gone).length === cards.length) return finish(); return paint(); }
          wrong++; b.classList.add('wrong'); setTimeout(function () { sel = null; paint(); }, 450);
        };
      });
    }
    function finish() {
      var secs = Math.round((Date.now() - start) / 1000), xp = Math.max(20, 80 - secs - wrong * 5);
      G = { cfg: { title: title, unit: th ? null : ui, rerun: th ? th.rerun : function () { runMatch(list, ui); } }, i: 1, qs: [1], right: pick.length, wrong: wrong, xp: xp, best: pick.length, results: [], learned: th ? [] : pick.slice(0, 3).map(function (x) { return x.w; }), ended: false };
      endGame();
    }
    paint();
  }

  /* ---------- Szene ---------- */
  function runScene(ui) {
    var u = U[ui], sc = u.scene, step = 0, log = [], errors = 0;
    G = { cfg: { title: t('scene') }, ended: false };
    function paint(fbHtml) {
      var html = '<section class="game"><div class="game-top"><button class="icon-btn" id="quit" aria-label="' + esc(t('back')) + '">' + I.x + '</button><div class="bar"><i style="width:' + (step / sc.steps.length * 100) + '%"></i></div></div>' +
        '<p class="scene-intro">' + esc(L(sc.intro)) + '</p>' + (step === 0 && !log.length ? szymekBubble(ui) : '') + log.join('');
      if (step < sc.steps.length) {
        var st = sc.steps[step];
        html += '<div class="npc pop"><div class="row" style="flex-wrap:nowrap"><button class="icon-btn" id="say" aria-label="' + esc(t('listen_again')) + '">' + I.spk + '</button><b lang="pl">' + esc(st.npc[0]) + '</b></div>' + (diff().hideTr ? '<button class="btn ghost small" id="show-tr" style="justify-self:start;min-height:36px;padding:4px 0">' + esc(t('show_tr')) + '</button><span class="small muted" id="npc-tr" hidden>' : '<span class="small muted">') + esc(L([st.npc[1], st.npc[2]])) + '</span></div>' +
          '<div class="opts" id="so">' + st.opts.map(function (o, i) { return '<button class="opt" data-o="' + i + '" lang="pl">' + esc(o[0]) + '</button>'; }).join('') + '</div><div id="fb">' + (fbHtml || '') + '</div>';
      } else {
        html += '<div class="banner pop"><strong>' + esc(L(sc.outro)) + '</strong></div><button class="btn primary block" id="fin">' + esc(t('next')) + '</button>';
      }
      html += '</section>';
      shell(html, false);
      document.getElementById('quit').onclick = function () { G = null; go('city', ui); };
      if (step < sc.steps.length) {
        var st2 = sc.steps[step];
        document.getElementById('say').onclick = function () { speak(st2.npc[0]); };
        var stb = document.getElementById('show-tr'); if (stb) stb.onclick = function () { document.getElementById('npc-tr').hidden = false; stb.hidden = true; };
        if (!fbHtml) speak(st2.npc[0]);
        document.querySelectorAll('[data-o]').forEach(function (b) {
          b.onclick = function () {
            var o = st2.opts[+b.getAttribute('data-o')];
            if (o[3]) {
              speak(o[0]);
              log.push('<div class="npc"><b lang="pl">' + esc(st2.npc[0]) + '</b><span class="small muted">' + esc(L([st2.npc[1], st2.npc[2]])) + '</span></div><div class="me"><b lang="pl">' + esc(o[0]) + '</b><div class="small muted">' + esc(L([o[1], o[2]])) + '</div></div>');
              step++; paint();
            } else {
              errors++;
              paint('<div class="feedback no pop" role="status"><span class="h">' + esc(t('wrong')) + '</span><span>' + esc(L([o[1], o[2]])) + '</span><span class="small">' + esc(L(st2.hint)) + '</span></div>');
            }
          };
        });
      } else {
        document.getElementById('fin').onclick = function () {
          S.scenes[u.id] = true;
          G = { cfg: { title: t('scene') + ' · ' + u.city, unit: ui, rerun: function () { runScene(ui); } }, i: sc.steps.length, qs: sc.steps, right: sc.steps.length, wrong: errors, xp: Math.max(20, 60 - errors * 10), best: sc.steps.length, results: [], learned: [], ended: false };
          endGame();
        };
      }
    }
    paint();
  }

  /* ---------- Duell-Code: 2 Handys, gleiche Fragen (Plan aus C.duelPlan) ---------- */
  var duelLevel = null, duelCodeDraft = '';
  var DUEL_LVS = ['1', '2', '3', 'P1', 'P2', 'P3'];
  function duelLvLabel(lv) { return lv.charAt(0) === 'P' ? 'P' + lv.charAt(1) + ' · ' + PLX_LV[+lv.charAt(1) - 1] : t('diff_' + ['easy', 'medium', 'hard'][+lv - 1]); }
  var PLX_LV = ['dobry', 'bardzo dobry', 'mistrz'];
  function duelRecLv() { return S.plv ? 'P' + Math.min(3, Math.max(1, S.plv)) : String(['easy', 'medium', 'hard'].indexOf(S.diff) + 1 || 1); }
  function renderDuelReady(pl) {
    var html = '<button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('back')) + '</button>' +
      '<section class="card stack" style="text-align:center"><span class="eyebrow">' + esc(t('d2')) + '</span>' +
      '<div class="score num" lang="pl" style="letter-spacing:.06em">' + esc(pl.code) + '</div>' +
      '<span class="small muted">' + esc(duelLvLabel(pl.lv)) + ' · ' + pl.plan.length + ' × · ' + esc(t('d2_weight')) + String(C.duelWeight(pl.lv)).replace('.', S.base === 'de' ? ',' : '.') + '</span>' +
      '<div><span class="small">' + esc(t('d2_check')) + '</span> <b class="chip num" id="d2chk" style="font-size:1.25rem">' + esc(pl.check) + '</b></div>' +
      '<p class="small muted">' + esc(t('d2_check_d')) + '</p><p class="small muted">' + esc(t('d2_mix')) + '</p>' +
      '<button class="btn" id="d2send">' + esc(t('d2_send_code')) + '</button>' +
      '<button class="btn primary" id="d2play">' + esc(t('start')) + '</button></section>';
    shell(html);
    document.getElementById('back').onclick = function () { renderDuelSetup(); };
    document.getElementById('d2send').onclick = function () { copy('Polski Szlak \u2694 ' + pl.code + ' #' + pl.check); };
    document.getElementById('d2play').onclick = function () { startCodeDuel(pl); };
  }
  function duelQ(it) {
    if (it.k === 'q') { var pq = D.polacy[it.c][it.i]; return { type: 'mc', id: null, ask: '', big: pq.q, bigPl: true, small: true, sentence: pq.s, a: pq.a, opts: it.opts.slice(), plOpts: true, explain: pq.x, lvq: pq.lv }; }
    if (it.k === 'w') {
      var w = U[it.item[0]].words[it.item[1]], id = U[it.item[0]].id + ':' + it.item[1], ow = it.opts.map(function (x) { return U[x[0]].words[x[1]]; });
      if (it.dir === 'pl2x') return { type: 'mc', id: id, ask: t('choose_meaning'), big: w[0], say: w[0], a: meaning(w), opts: ow.map(meaning) };
      return { type: 'mc', id: id, ask: t('choose_pl'), big: meaning(w), a: w[0], say: null, sayAfter: w[0], opts: ow.map(function (x) { return x[0]; }), plOpts: true };
    }
    if (it.k === 'c') {
      var c = D.cases[it.i], q = { id: null, ask: t('case_q') + ' (' + c.base + ')', sentence: c.s, sub: L(c.tr), a: c.a, explain: L(c.case) + ': ' + L(c.why), sayAfter: c.s.replace('___', c.a) };
      if (it.type) q.type = 'type'; else { q.type = 'mc'; q.opts = it.opts.slice(); q.plOpts = true; }
      return q;
    }
    if (it.k === 't') return qTF(D.culture.tf[it.i]);
    if (it.k === 'p') { var pp = D.culture.people[it.i]; return { type: 'mc', id: null, ask: t('whoami'), clues: pp.clues.map(L), shown: 1, a: pp.name, opts: it.opts.slice(), sayAfter: pp.name }; }
    var set = D.culture.hl[it.i], val = {}; set.items.forEach(function (x) { val[x[0]] = x[1]; });
    var a0 = it.pair[0], b0 = it.pair[1];
    return { type: 'mc', id: null, ask: L(set.q), big: '', a: val[a0] > val[b0] ? a0 : b0, opts: [a0, b0], fixed: true, plOpts: true, explain: a0 + ': ' + val[a0].toLocaleString(S.base) + ' · ' + b0 + ': ' + val[b0].toLocaleString(S.base) + ' ' + L(set.unit) };
  }
  function startCodeDuel(pl) {
    runGame({ title: t('d2') + ' · ' + pl.code, qs: pl.plan.map(duelQ), duel: { code: pl.code, check: pl.check, diff: pl.diff, lv: pl.lv, base: pl.base } });
  }
  function duelResultBox(g) {
    var d = g.cfg.duel;
    return '<div class="card stack" style="width:100%;text-align:left">' +
      '<div class="row" style="justify-content:space-between"><span>' + esc(t('d2_code')) + '</span><b class="num" lang="pl">' + esc(d.code) + ' #' + esc(d.check) + '</b></div>' +
      '<div class="row" style="justify-content:space-between"><span>' + esc(t('d2_time')) + '</span><b class="num">' + esc(C.fmtTime(g.ms)) + '</b></div>' +
      '<button class="btn primary" id="d2share">' + esc(t('d2_share')) + '</button>' +
      '<label class="small" for="d2other">' + esc(t('d2_paste')) + '</label><textarea id="d2other" rows="3" placeholder="Polski Szlak \u2694 ' + esc(d.code) + ' #' + esc(d.check) + '&#10;15/20 \u00b7 2:13"></textarea>' +
      '<button class="btn" id="d2cmp">' + esc(t('d2_compare')) + '</button><div id="d2verdict" role="status"></div></div>';
  }
  function bindDuelResult(g) {
    var d = g.cfg.duel, myName = C.duelName(S.name) || t('d2_me'), me = { right: g.right, total: g.results.length, ms: g.ms, lv: d.lv, name: myName };
    var myInp = { write: 'W', speak: 'S', tap: 'T' }[S.input] || '';
    function fmtP(x) { return String(x).replace('.', S.base === 'de' ? ',' : '.'); }
    function line(p) { return esc(p.name || '?') + ' (' + esc(p.lv || '?') + '): ' + p.right + '/' + p.total + (p.ms != null ? ' · ' + esc(C.fmtTime(p.ms)) : ''); }
    document.getElementById('d2share').onclick = function () { copy(C.duelResultText(d.code, d.check, g.results, g.ms, { name: S.name, input: S.input })); };
    document.getElementById('d2cmp').onclick = function () {
      var o = C.duelReadResult(document.getElementById('d2other').value), out = document.getElementById('d2verdict'), msg, mixed = false;
      if (o && !o.lv) o.lv = d.lv;
      if (o && o.code && o.code !== d.code) { mixed = true; var op = C.duelPlan(D, o.code); if (o.check && (!op || op.check !== o.check)) o.badCheck = true; }
      if (!o) msg = '<p class="small">' + esc(t('d2_unreadable')) + '</p>';
      else if (o.base && o.base !== d.base) msg = '<p class="small">' + esc(t('d2_other_base')) + '</p>';
      else if (o.badCheck || (!mixed && o.check && o.check !== d.check)) msg = '<p class="small">' + esc(t('d2_other_check')) + '</p>';
      else {
        o.name = o.name || '?';
        var v = C.duelCompare(me, o);
        msg = '<h2>' + esc(v > 0 ? t('d2_win') : (v < 0 ? t('d2_lose') : t('tie'))) + '</h2>' +
          (mixed ? '<p class="small"><b>' + esc(t('d2_mixed')) + '</b></p>' : '') +
          '<p class="small muted num">' + line(me) + (mixed ? ' → ' + fmtP(C.duelScore(me)) + ' ' + esc(t('d2_pts')) : '') + '<br>' + line(o) + (mixed ? ' → ' + fmtP(C.duelScore(o)) + ' ' + esc(t('d2_pts')) : '') + (o.check && !mixed ? '<br>' + esc(t('d2_same')) : '') + '</p>' +
          (o.input && myInp && o.input !== myInp ? '<p class="small muted">' + esc(t('d2_inp_diff')) + '</p>' : '');
        var key = String(C.hash([d.code, g.right, g.ms, o.code, o.name.toLowerCase(), o.right, o.ms].join('|')));
        if (!o.signed) msg += '<p class="small muted">' + esc(t('rank_unsigned')) + '</p>';
        else if (S.rankSeen.indexOf(key) >= 0) msg += '<p class="small muted">' + esc(t('rank_dupe')) + '</p>';
        else {
          C.rankAdd(S.rank, me, v); C.rankAdd(S.rank, o, -v);
          S.rankSeen.push(key); if (S.rankSeen.length > 300) S.rankSeen = S.rankSeen.slice(-300); save();
          msg += '<p class="small">' + esc(t('rank_added')) + '</p>';
        }
      }
      out.innerHTML = msg;
    };
  }

  /* ---------- Lokale Rangliste (S.rank, Logik in C.rankAdd/C.rankList) ---------- */
  function rankBox() {
    var list = C.rankList(S.rank), h = '<section class="card stack"><b>' + esc(t('rank')) + '</b><p class="small muted">' + esc(t('rank_d')) + '</p>';
    if (!list.length) return h + '<p class="small">' + esc(t('rank_empty')) + '</p></section>';
    h += '<table class="small num" style="width:100%;border-collapse:collapse"><thead><tr><th scope="col" style="text-align:left">#</th><th scope="col" style="text-align:left">' + esc(t('players')) + '</th><th scope="col">' + esc(t('rank_g')) + '</th><th scope="col">' + esc(t('rank_w')) + '</th><th scope="col">' + esc(t('rank_d2')) + '</th><th scope="col">' + esc(t('rank_pts')) + '</th></tr></thead><tbody>' +
      list.slice(0, 20).map(function (e, i) { return '<tr><td>' + (i + 1) + '</td><td style="text-align:left">' + esc(e.name) + '</td><td style="text-align:center">' + e.g + '</td><td style="text-align:center">' + e.w + '</td><td style="text-align:center">' + e.d + '</td><td style="text-align:center">' + String(e.pts).replace('.', S.base === 'de' ? ',' : '.') + '</td></tr>'; }).join('') + '</tbody></table>';
    return h + '<button class="btn ghost" id="rankclr">' + esc(t('rank_clear')) + '</button></section>';
  }

  /* ---------- Familienduell ---------- */
  var duelMode = 'quiz';
  function renderDuelSetup() {
    if (!duelLevel) duelLevel = duelRecLv();
    if (!S.rank || typeof S.rank !== 'object') S.rank = {};
    if (!Array.isArray(S.rankSeen)) S.rankSeen = [];
    var html = '<button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('back')) + '</button><h1>' + esc(t('duel')) + '</h1>' +
      '<section class="card stack"><b>' + esc(t('d2')) + '</b><p class="small muted">' + esc(t('d2_d')) + '</p>' +
      '<label class="small" for="d2name"><b>' + esc(t('d2_name')) + '</b></label><input type="text" id="d2name" maxlength="20" autocomplete="off" value="' + esc(S.name || '') + '">' +
      '<b class="small">' + esc(t('d2_level')) + '</b><span class="small muted">' + esc(t('d2_rec')) + ': ' + esc(duelLvLabel(duelRecLv())) + '</span>' +
      '<span class="small muted">' + esc(t('d2_learn')) + '</span><div class="seg" id="d2lv">' + DUEL_LVS.slice(0, 3).map(function (lv) { return segBtn(lv, duelLvLabel(lv), duelLevel === lv); }).join('') + '</div>' +
      '<span class="small muted" lang="pl">' + esc(t('d2_pol')) + '</span><div class="seg" id="d2lvp" lang="pl">' + DUEL_LVS.slice(3).map(function (lv) { return segBtn(lv, duelLvLabel(lv), duelLevel === lv); }).join('') + '</div>' +
      '<p class="small muted">' + esc(t('d2_mix')) + '</p>' +
      '<button class="btn" id="d2new">' + esc(t('d2_new')) + '</button>' +
      '<label class="small" for="d2code">' + esc(t('d2_code')) + '</label><input type="text" id="d2code" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="KOT-472-1" value="' + esc(duelCodeDraft) + '" style="text-transform:uppercase;letter-spacing:.08em">' +
      '<p class="small" id="d2err" role="alert" hidden></p>' +
      '<button class="btn primary" id="d2go">' + esc(t('start')) + '</button></section>' + rankBox() +
      '<h2>' + esc(t('duel_d')) + '</h2>' +
      '<section class="card stack"><b>' + esc(t('players')) + '</b>' + [0, 1, 2, 3].map(function (i) { return '<input type="text" id="p' + i + '" placeholder="' + esc(t('players')) + ' ' + (i + 1) + '" value="' + (i < 2 ? esc(['Ola', 'Tomek'][i]) : '') + '" aria-label="' + esc(t('players')) + ' ' + (i + 1) + '">'; }).join('') +
      '<b>' + esc(t('pm_mode')) + '</b><div class="seg" id="dmode">' + [['quiz', t('duel_quiz')], ['pm', t('pm')]].map(function (m) { return '<button data-m="' + m[0] + '" aria-pressed="' + (duelMode === m[0]) + '"' + (m[0] === 'pm' ? ' lang="pl"' : '') + '>' + esc(m[1]) + '</button>'; }).join('') + '</div>' +
      '<p class="small muted" id="dmode-d">' + esc(duelMode === 'pm' ? t('pm_d') : t('duel_d')) + '</p>' +
      '<button class="btn primary" id="dgo">' + esc(t('start')) + '</button></section>';
    shell(html);
    document.getElementById('back').onclick = function () { go('practice'); };
    function markLv() { document.querySelectorAll('#d2lv button, #d2lvp button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === duelLevel)); }); }
    function pickLv(v) { duelLevel = v; markLv(); var c0 = C.duelParse(document.getElementById('d2code').value); if (c0) { document.getElementById('d2code').value = c0.base + '-' + v; duelCodeDraft = document.getElementById('d2code').value; } }
    bindSeg('d2lv', pickLv); bindSeg('d2lvp', pickLv);
    document.getElementById('d2name').onchange = function () { S.name = C.duelName(this.value); this.value = S.name; save(); };
    document.getElementById('d2new').onclick = function () { duelCodeDraft = C.duelNewCode(Math.random, duelLevel); document.getElementById('d2code').value = duelCodeDraft; document.getElementById('d2err').hidden = true; };
    document.getElementById('d2code').oninput = function () { duelCodeDraft = this.value; var c1 = C.duelParse(this.value); if (c1 && c1.lv !== duelLevel) { duelLevel = c1.lv; markLv(); } };
    var rc = document.getElementById('rankclr');
    if (rc) rc.onclick = function () { if (!window.confirm(t('rank_clear_q'))) return; S.rank = {}; S.rankSeen = []; save(); renderDuelSetup(); };
    document.getElementById('d2go').onclick = function () {
      S.name = C.duelName(document.getElementById('d2name').value); save();
      var pl = C.duelPlan(D, document.getElementById('d2code').value), er = document.getElementById('d2err');
      if (!pl) { er.textContent = t('d2_bad'); er.hidden = false; return; }
      duelCodeDraft = pl.code; renderDuelReady(pl);
    };
    document.querySelectorAll('#dmode [data-m]').forEach(function (b) {
      b.onclick = function () {
        duelMode = b.getAttribute('data-m');
        document.querySelectorAll('#dmode [data-m]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        document.getElementById('dmode-d').textContent = duelMode === 'pm' ? t('pm_d') : t('duel_d');
      };
    });
    document.getElementById('dgo').onclick = function () {
      var ps = [0, 1, 2, 3].map(function (i) { return document.getElementById('p' + i).value.trim(); }).filter(Boolean);
      if (ps.length < 2) return; if (duelMode === 'pm') startPM(ps); else startDuel(ps);
    };
  }
  function startDuel(ps) {
    /* Alle bekommen DIESELBEN Fragen (gleiche Wörter, gleiche Antwortreihenfolge), nacheinander im Block */
    var pool = poolOpen(), base = [], qs = [], per = 5, pick = C.shuffle(pool, R).slice(0, per);
    pick.forEach(function (x, i) { base.push(i % 2 ? qListen(x, pool) : qMC(x, pool, 'pl2x')); });
    ps.forEach(function () { base.forEach(function (q) { qs.push(JSON.parse(JSON.stringify(q))); }); });
    runGame({ title: t('duel'), qs: qs, players: ps, block: per });
  }

  /* ---------- Dla Polaków: Bereich für Muttersprachler (komplett Polnisch), eigene Einstufung in 3 Stufen ---------- */
  var PCATS = ['ortografia', 'poprawnosc', 'aspekt', 'liczebniki', 'frazeologia', 'wiedza'], polLv = 0;
  function qPol(x) { return { type: 'mc', id: null, ask: '', big: x.q, bigPl: true, small: true, sentence: x.s, a: x.a, opts: C.shuffle([x.a].concat(x.o), R), plOpts: true, explain: x.x, lvq: x.lv }; }
  function polPool(cat, lv) { var out = []; (cat ? [cat] : PCATS).forEach(function (c) { (D.polacy[c] || []).forEach(function (x) { if (!lv || x.lv === lv) out.push(x); }); }); return out; }
  function renderPolacy() {
    polUI = true;
    if (!polLv) polLv = Math.max(1, S.plv || 1);
    var lvTxt = S.plv == null ? t('pol_lvx') : t('pol_lv' + S.plv);
    function best(k) { var b = S.plBest[k + '|' + polLv]; return b != null ? '<span class="badge good num">' + b + '%</span>' : ''; }
    shell('<div lang="pl" class="stack"><button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('back')) + '</button><h1>' + esc(t('pol')) + '</h1><p class="muted">' + esc(t('pol_intro')) + '</p>' +
      '<section class="card stack"><div class="row" style="justify-content:space-between"><b>' + esc(t('pol_lv')) + '</b><span class="chip">' + esc(lvTxt) + '</span></div>' +
      '<div class="row" style="gap:6px">' + [1, 2, 3].map(function (n) { return '<i class="pol-star' + (S.plv >= n ? ' on' : '') + '" aria-hidden="true"></i>'; }).join('') + '</div>' +
      '<button class="btn primary" id="ptest">' + esc(t('pol_test')) + '</button><p class="small muted">' + esc(t('pol_test_d')) + '</p></section>' +
      '<section class="stack"><b>' + esc(t('pol_qlv')) + '</b><div class="seg" id="plv">' + [1, 2, 3].map(function (n) { return segBtn(String(n), t('pol_lv' + n), polLv === n); }).join('') + '</div></section>' +
      '<section class="tiles">' + PCATS.map(function (c) { return tileBtn('pol:' + c, t('pol_c_' + c), t('pol_c_' + c + '_d'), best(c)); }).join('') + tileBtn('pol:mix', t('pol_mix'), t('pol_mix_d'), best('mix')) + '</section></div>');
    document.getElementById('back').onclick = function () { go('land'); };
    document.getElementById('ptest').onclick = startPolTest;
    bindSeg('plv', function (v) { polLv = +v; renderPolacy(); });
    document.querySelectorAll('[data-mode^="pol:"]').forEach(function (b) { b.onclick = function () { startPol(b.getAttribute('data-mode').slice(4)); }; });
  }
  function startPol(cat) {
    var lv = polLv, pool = polPool(cat === 'mix' ? null : cat, lv);
    if (!pool.length) pool = polPool(cat === 'mix' ? null : cat, 0);
    runGame({ title: t(cat === 'mix' ? 'pol_mix' : 'pol_c_' + cat) + ' · ' + t('pol_lv' + lv), qs: C.shuffle(pool, R).slice(0, 10).map(qPol), back: 'polacy', polKey: cat + '|' + lv, rerun: function () { startPol(cat); } });
  }
  function startPolTest() {
    var qs = [];
    [1, 2, 3].forEach(function (lv) { C.shuffle(PCATS, R).forEach(function (c) { var p = polPool(c, lv); if (p.length) qs.push(qPol(p[Math.floor(R() * p.length)])); }); });
    runGame({ title: t('pol_test'), qs: qs, back: 'polacy', polTest: true, rerun: startPolTest });
  }

  /* ---------- Gegenüber: 2 Leute, 1 Handy, geteilter Bildschirm (obere Hälfte 180° gedreht) ----------
     Beide sehen in jeder Runde DIESELBE Frage-Instanz (gleiche Antwortreihenfolge). Erster richtiger Tipp = Punkt. */
  var faceNames = ['Ola', 'Tomek'], faceN = 10;
  function renderFaceSetup() {
    shell('<button class="btn ghost" id="back" style="justify-self:start;padding-left:0">← ' + esc(t('back')) + '</button><h1>' + esc(t('face')) + '</h1>' +
      '<section class="card stack"><p class="small">' + esc(t('face_rules')) + '</p>' +
      '<b>' + esc(t('players')) + '</b>' + [0, 1].map(function (i) { return '<input type="text" id="f' + i + '" value="' + esc(faceNames[i]) + '" aria-label="' + esc(t('players')) + ' ' + (i + 1) + '">'; }).join('') +
      '<b>' + esc(t('face_n')) + '</b><div class="seg" id="fn">' + [5, 10, 15].map(function (n) { return segBtn(String(n), String(n), faceN === n); }).join('') + '</div>' +
      '<button class="btn primary" id="fgo">' + esc(t('start')) + '</button></section>');
    document.getElementById('back').onclick = function () { go('practice'); };
    bindSeg('fn', function (v) { faceN = +v; document.querySelectorAll('#fn button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === v)); }); });
    document.getElementById('fgo').onclick = function () {
      faceNames = [0, 1].map(function (i) { return document.getElementById('f' + i).value.trim() || ['Ola', 'Tomek'][i]; });
      startFace();
    };
  }
  function faceQs(n) {
    var pool = poolOpen(), words = C.shuffle(pool, R), cs = C.shuffle(D.cases, R), tf = C.shuffle(D.culture.tf, R), qs = [];
    for (var i = 0; i < n; i++) {
      var k = i % 4, q;
      if (k === 0) q = qMC(words[i % words.length], pool, 'pl2x');
      else if (k === 1) q = qMC(words[i % words.length], pool, 'x2pl');
      else if (k === 2) { var c = cs[i % cs.length]; q = { ask: t('case_q') + ' (' + c.base + ')', big: c.s, sub: L(c.tr), a: c.a, opts: C.shuffle(c.opts.slice(), R), plOpts: true, small: true, sayAfter: c.s.replace('___', c.a) }; }
      else q = qTF(tf[i % tf.length]);
      if (q.opts.length > 4) q.opts = C.shuffle(q.opts.filter(function (o) { return o !== q.a; }).slice(0, 3).concat([q.a]), R);
      qs.push(q);
    }
    return qs;
  }
  function startFace() {
    G = null;
    var F = { qs: faceQs(faceN), i: 0, sc: [0, 0], out: [false, false], done: false, tId: null };
    function half(p, inner) { return '<div class="fhalf' + (p === 0 ? ' flip' : '') + '" data-p="' + p + '">' + inner + '</div>'; }
    function quit() { if (F) clearTimeout(F.tId); F = null; document.removeEventListener('keydown', onKey); go('practice'); }
    function onKey(e) { if (e.key === 'Escape' && F) quit(); }
    document.addEventListener('keydown', onKey);
    function paint() {
      var q = F.qs[F.i], plo = q.plOpts ? ' lang="pl"' : '', plb = q.plOpts || q.ask === t('tf') ? '' : ' lang="pl"';
      var body = function (p) {
        return '<div class="fhead"><b>' + esc(faceNames[p]) + '</b><span class="num fsc">' + F.sc[p] + '</span></div>' +
          '<div class="fask">' + esc(q.ask) + '</div>' +
          '<div class="fbig' + (q.small || String(q.big).length > 34 ? ' sm' : '') + '"' + plb + '>' + esc(q.big) + '</div>' +
          (q.sub ? '<div class="small muted">' + esc(q.sub) + '</div>' : '') +
          '<div class="fopts">' + q.opts.map(function (o, j) { return '<button class="opt" data-o="' + j + '"' + plo + '>' + esc(o) + '</button>'; }).join('') + '</div>' +
          '<div class="fmsg" role="status"></div>';
      };
      $app.innerHTML = '<div class="face">' + half(0, body(0)) +
        '<div class="fbar"><span class="num">' + (F.i + 1) + '/' + F.qs.length + '</span><button class="btn ghost" id="fquit">' + esc(t('face_quit')) + '</button></div>' +
        half(1, body(1)) + '</div>';
      document.getElementById('fquit').onclick = quit;
      $app.querySelectorAll('.fhalf').forEach(function (h) {
        var p = +h.getAttribute('data-p');
        h.querySelectorAll('[data-o]').forEach(function (b) {
          var fire = function (e) { if (e.type === 'pointerdown') e.preventDefault(); answer(p, +b.getAttribute('data-o')); };
          b.addEventListener('pointerdown', fire); b.addEventListener('click', fire);
        });
      });
    }
    function msg(p, txt) { $app.querySelector('.fhalf[data-p="' + p + '"] .fmsg').textContent = txt; }
    function reveal() {
      var q = F.qs[F.i];
      $app.querySelectorAll('.fhalf').forEach(function (h) {
        h.querySelectorAll('[data-o]').forEach(function (b) { b.disabled = true; if (q.opts[+b.getAttribute('data-o')] === q.a) b.classList.add('right'); });
        h.querySelector('.fsc').textContent = F.sc[+h.getAttribute('data-p')];
      });
      if (q.sayAfter || q.say) speak(q.sayAfter || q.say);
      F.tId = setTimeout(function () { if (!F) return; F.i++; F.out = [false, false]; F.done = false; if (F.i >= F.qs.length) end(); else paint(); }, 1800);
    }
    function answer(p, j) {
      if (!F || F.done || F.out[p]) return;
      var q = F.qs[F.i], h = $app.querySelector('.fhalf[data-p="' + p + '"]');
      if (q.opts[j] === q.a) {
        F.done = true; F.sc[p]++; msg(p, t('face_point')); msg(1 - p, faceNames[p] + ' ' + t('face_fast'));
        try { if (navigator.vibrate) navigator.vibrate(40); } catch (e) {}
        reveal();
      } else {
        F.out[p] = true; h.querySelector('[data-o="' + j + '"]').classList.add('wrong');
        h.querySelectorAll('[data-o]').forEach(function (b) { b.disabled = true; });
        msg(p, t('face_wrong'));
        if (F.out[0] && F.out[1]) { F.done = true; msg(0, t('face_nobody')); msg(1, t('face_nobody')); reveal(); }
      }
    }
    function end() {
      document.removeEventListener('keydown', onKey);
      var tie = F.sc[0] === F.sc[1];
      var body = function (p) {
        return '<div class="fend"><h2>' + esc(tie ? t('tie') : F.sc[p] > F.sc[1 - p] ? t('face_win') : t('face_lose')) + '</h2>' +
          '<div class="fscore num">' + F.sc[p] + ' : ' + F.sc[1 - p] + '</div><div class="small muted">' + esc(faceNames[p]) + ' – ' + esc(faceNames[1 - p]) + '</div></div>';
      };
      $app.innerHTML = '<div class="face">' + half(0, body(0)) +
        '<div class="fbar"><button class="btn primary" id="fagain">' + esc(t('again')) + '</button><button class="btn ghost" id="fquit">' + esc(t('face_quit')) + '</button></div>' +
        half(1, body(1)) + '</div>';
      document.getElementById('fagain').onclick = function () { startFace(); };
      document.getElementById('fquit').onclick = function () { F = null; go('practice'); };
      document.getElementById('fagain').focus();
    }
    paint();
  }

  /* ---------- Państwa-Miasta (Stadt-Land-Fluss) ---------- */
  var PM = null;
  function startPM(ps) {
    pmStop();
    PM = { ps: ps, cats: C.shuffle(D.pm.cats, R).slice(0, 5), letters: C.shuffle(D.pm.letters, R).slice(0, 3), round: 0, pi: 0, ans: null, ok: null, tot: ps.map(function () { return 0; }), tId: null };
    pmRound();
  }
  function pmStop() { if (PM && PM.tId) { clearInterval(PM.tId); PM.tId = null; } }
  function pmQuit() { pmStop(); PM = null; go('practice'); }
  function pmTop(extra) {
    return '<div class="game-top"><button class="icon-btn" id="quit" aria-label="' + esc(t('back')) + '">' + I.x + '</button><div class="bar"><i style="width:' + (PM.round / PM.letters.length * 100) + '%"></i></div>' + (extra || '') + '</div>';
  }
  function pmRound() {
    PM.pi = 0;
    PM.ans = PM.ps.map(function () { return PM.cats.map(function () { return ''; }); });
    PM.ok = PM.ps.map(function () { return PM.cats.map(function () { return false; }); });
    pmPass();
  }
  function pmPass() {
    view = 'game';
    shell('<section class="game">' + pmTop() + '<div class="prompt"><span class="eyebrow"><span lang="pl">' + esc(t('pm')) + '</span> · ' + esc(t('pm_round')) + ' ' + (PM.round + 1) + '/' + PM.letters.length + '</span>' +
      '<p class="muted">' + esc(t('pm_pass')) + '</p><div class="big">' + esc(PM.ps[PM.pi]) + '</div><p class="small muted">' + esc(t('pm_lookaway')) + '</p></div>' +
      (PM.round === 0 && PM.pi === 0 ? '<div class="card small">' + esc(t('pm_rules')) + '</div>' : '') +
      '<button class="btn primary block" id="pmgo">' + esc(t('pm_ready')) + '</button></section>', false);
    document.getElementById('quit').onclick = pmQuit;
    document.getElementById('pmgo').onclick = pmPlay;
  }
  function pmPlay() {
    var letter = PM.letters[PM.round], secs = { easy: 90, medium: 60, hard: 45 }[S.diff] || 60, left = secs, done = false;
    shell('<section class="game">' + pmTop('<span class="timer num" id="pmt">' + left + '</span>') +
      '<div class="prompt"><span class="eyebrow">' + esc(PM.ps[PM.pi]) + ' · ' + esc(t('pm_letter')) + '</span><div class="pm-letter" lang="pl">' + esc(letter) + '</div></div>' +
      '<form id="pmf" class="stack" autocomplete="off">' + PM.cats.map(function (c, ci) {
        return '<label class="stack" style="gap:4px"><span class="small"><b lang="pl">' + esc(c.pl) + '</b> <span class="muted">· ' + esc(L([c.de, c.en])) + '</span></span>' +
          '<input type="text" id="pm' + ci + '" lang="pl" autocapitalize="off" spellcheck="false" placeholder="' + esc(letter) + '…"></label>';
      }).join('') + '<button class="btn primary block" type="submit">' + esc(t('pm_done')) + '</button></form></section>', false);
    document.getElementById('quit').onclick = pmQuit;
    function fin() {
      if (done || !PM) return; done = true; pmStop();
      PM.ans[PM.pi] = PM.cats.map(function (c, ci) { var el = document.getElementById('pm' + ci); return el ? el.value.trim() : ''; });
      PM.pi++;
      if (PM.pi < PM.ps.length) pmPass(); else pmReview();
    }
    document.getElementById('pmf').onsubmit = function (e) { e.preventDefault(); fin(); };
    document.getElementById('pm0').focus();
    pmStop();
    PM.tId = setInterval(function () { left--; var el = document.getElementById('pmt'); if (el) el.textContent = Math.max(left, 0); if (left <= 0) fin(); }, 1000);
  }
  function pmReview() {
    var letter = PM.letters[PM.round];
    PM.ans.forEach(function (row, pi) { row.forEach(function (a, ci) { PM.ok[pi][ci] = C.pmKnown(a, letter, PM.cats[ci].words); }); });
    var ex = PM.cats.map(function (c) { return C.shuffle(c.words.filter(function (w) { return C.pmLetterOk(w, letter); }), R).slice(0, 3); });
    function paint() {
      var html = '<section class="game">' + pmTop() + '<div class="prompt"><span class="eyebrow">' + esc(t('pm_check')) + ' · ' + esc(t('pm_letter')) + '</span><div class="pm-letter" lang="pl">' + esc(letter) + '</div></div>';
      PM.cats.forEach(function (c, ci) {
        html += '<div class="card stack"><b><span lang="pl">' + esc(c.pl) + '</span> <span class="muted small">· ' + esc(L([c.de, c.en])) + '</span></b>' +
          PM.ps.map(function (p, pi) {
            var a = PM.ans[pi][ci], ok = PM.ok[pi][ci], canTg = a && C.pmLetterOk(a, letter);
            return '<div class="row" style="justify-content:space-between;flex-wrap:nowrap"><span class="grow"><span class="small muted">' + esc(p) + '</span><br><b lang="pl">' + (a ? esc(a) : '–') + '</b></span>' +
              (canTg ? '<button class="chip pm-tg' + (ok ? ' on' : '') + '" data-p="' + pi + '" data-c="' + ci + '" aria-pressed="' + ok + '">' + esc(ok ? t('pm_valid') : t('pm_invalid')) + '</button>'
                : '<span class="chip">' + esc(t('pm_invalid')) + '</span>') + '</div>';
          }).join('') +
          (ex[ci].length ? '<span class="small muted">' + esc(t('pm_examples')) + ': <span lang="pl">' + esc(ex[ci].join(', ')) + '</span></span>' : '') + '</div>';
      });
      html += '<button class="btn primary block" id="pmc">' + esc(t('pm_count')) + '</button></section>';
      shell(html, false);
      document.getElementById('quit').onclick = pmQuit;
      document.querySelectorAll('.pm-tg').forEach(function (b) {
        b.onclick = function () { var pi = +b.getAttribute('data-p'), ci = +b.getAttribute('data-c'), y = window.scrollY; PM.ok[pi][ci] = !PM.ok[pi][ci]; paint(); window.scrollTo(0, y); };
      });
      document.getElementById('pmc').onclick = pmScoreRound;
    }
    paint(); window.scrollTo(0, 0);
  }
  function pmScoreRound() {
    var pts = PM.ps.map(function () { return 0; });
    PM.cats.forEach(function (c, ci) {
      C.pmScore(PM.ps.map(function (p, pi) { return PM.ans[pi][ci]; }), PM.ps.map(function (p, pi) { return PM.ok[pi][ci]; }))
        .forEach(function (v, pi) { pts[pi] += v; });
    });
    pts.forEach(function (v, pi) { PM.tot[pi] += v; });
    PM.round++;
    var last = PM.round >= PM.letters.length, max = Math.max.apply(null, PM.tot), win = PM.ps.filter(function (p, i) { return PM.tot[i] === max; });
    var rows = PM.ps.map(function (p, i) { return '<div class="row" style="justify-content:space-between"><b>' + esc(p) + '</b><span class="num">+' + pts[i] + ' · <b>' + PM.tot[i] + '</b></span></div>'; }).join('');
    shell('<section class="result pop"><span class="eyebrow" lang="pl">' + esc(t('pm')) + '</span><h1>' + esc(last ? t('done') : t('pm_round') + ' ' + PM.round + '/' + PM.letters.length) + '</h1>' +
      '<div class="card stack" style="width:100%;text-align:left"><span class="eyebrow">' + esc(t('pm_total')) + '</span>' + rows + '</div>' +
      (last ? '<h2>' + esc(win.length > 1 ? t('tie') : win[0] + ' ' + t('winner')) + '</h2><div class="row" style="width:100%"><button class="btn" id="again" style="flex:1">' + esc(t('again')) + '</button><button class="btn primary" id="home" style="flex:1">' + esc(t('home')) + '</button></div>'
        : '<button class="btn primary block" id="pmn">' + esc(t('pm_next_round')) + '</button>') + '</section>', false);
    if (last) {
      var ps = PM.ps; markActive(); save();
      document.getElementById('again').onclick = function () { startPM(ps); };
      document.getElementById('home').onclick = function () { PM = null; go('home'); };
    } else document.getElementById('pmn').onclick = pmRound;
  }

  /* ---------- Start ---------- */
  function boot() { sbFromHash(); render(); setTimeout(installHint, 1200); if (A && A.uid) syncNow(); }
  if (window.claude && window.claude.hot && window.claude.hot.ready) window.claude.hot.ready(boot); else boot();

  /* Service Worker nur im eigenen Hosting (nicht in Vorschauen/iframes) */
  try { if ('serviceWorker' in navigator && location.protocol === 'https:' && window.top === window.self && document.documentElement.getAttribute('data-pwa') === '1') navigator.serviceWorker.register('sw.js'); } catch (e) {}

  window.PSApp = { state: function () { return S; }, startMode: startMode, go: go };
})();
