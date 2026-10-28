# KI-Gespräch einrichten (ab 3.1)

In der App ist alles fertig: Üben → **KI-Gespräch**, und auf jeder Stadtseite die Kachel **KI-Gespräch**. Solange der Server-Teil fehlt, zeigt die App „wird gerade eingerichtet“. Es fehlen nur drei Schritte auf deinem Supabase-Server, zusammen etwa **20 Minuten**.

## So funktioniert es

```
Handy ──(Konto-Token)──▶ supabase.arndt-software.de/functions/v1/ps-chat ──(API-Schlüssel)──▶ KI-Anbieter
                                │
                                └─ zählt Nachrichten pro Konto und Tag (Tabelle ps_chat_usage)
```

- **Nur mit Konto**, also mit derselben Anmeldung wie der Geräte-Abgleich. So kann niemand Fremdes deine KI-Kosten verbrauchen.
- **Tageslimit pro Konto**, Standard 40 Nachrichten (`CHAT_DAILY_LIMIT`).
- **Der API-Schlüssel liegt nur auf dem Server**, nie in der App.
- **Gespeichert wird nichts außer dem Zähler.** Gesprächsinhalte werden nicht gespeichert.
- **Anbieterneutral:** Jeder Dienst mit OpenAI-kompatibler Schnittstelle funktioniert. Wechseln heißt drei Variablen ändern, kein Code.

## Schritt 1: Tabelle anlegen (2 Minuten)

Supabase Studio → **SQL Editor** → Inhalt von `deploy/supabase_ps_chat.sql` einfügen → **Run**.

## Schritt 2: KI-Schlüssel besorgen (5 Minuten)

Empfehlung für den Start: **Groq**. Es ist kostenlos, braucht keine Kreditkarte und ist sehr schnell.

1. **Konto anlegen:** https://console.groq.com im Browser öffnen → **Sign in** → mit Google-Konto oder E-Mail anmelden. Bei E-Mail kommt ein Bestätigungslink, den einmal anklicken.
2. **Schlüssel erzeugen:** Links im Menü (bzw. oben rechts) **API Keys** öffnen → **Create API Key**.
   - Als Namen z. B. `polski-szlak` eingeben → **Submit**.
   - Der Schlüssel wird **nur ein einziges Mal** angezeigt. Er beginnt mit `gsk_` und ist etwa 50 Zeichen lang.
3. **Schlüssel sicher aufbewahren:** Mit dem Kopier-Symbol kopieren und sofort in deinen Passwort-Manager legen (z. B. Eintrag „Groq API Polski Szlak“). Ersatzweise in eine Textdatei, die **nicht** im Projektordner und nicht in Git liegt.
   - Den Schlüssel **nie** in die App, in `src/` oder in eine Datei im Repo schreiben. Er gehört nur in Coolify (Schritt 3).
   - Verloren oder versehentlich geteilt? Unter **API Keys** löschen (Papierkorb) und einen neuen erzeugen. Der alte ist dann sofort ungültig.
4. **Modell freigeben:** Groq-Console → **Limits** → **Select Models** → „Only allow these models“ → nur **openai/gpt-oss-120b** anhaken → **Save**. Andere Modelle (auch Filter wie „prompt-guard“) nicht anhaken.
5. **Kontingent ansehen (optional):** Unter **Settings → Limits** zeigt Groq die Gratis-Grenzen pro Minute und Tag für jedes Modell.

Andere Anbieter funktionieren genauso: Konto anlegen, API-Schlüssel erzeugen, Adresse und Modellnamen aus der Tabelle nehmen.

| Anbieter | `LLM_BASE_URL` | `LLM_MODEL` (Beispiel) | Kosten (Stand Okt. 2026, bitte beim Anbieter prüfen) |
|---|---|---|---|
| **Groq** (Start) | `https://api.groq.com/openai/v1` | `openai/gpt-oss-120b` (alternativ `qwen/qwen3.8-27b`) | kostenlos: 30 Anfragen/Minute, 1.000/Tag, 200.000 Tokens/Tag (Stand 28.10.2026) |
| Google Gemini | `https://generativelanguage.googleapis.com/v1beta/openai` | `gemini-3.1-flash-lite` (genauen Namen in Google AI Studio nachsehen) | ca. 0,25 $ / 1,50 $ pro 1 Mio. Tokens (Ein-/Ausgabe). Die Gratisstufe ist für Apps mit EU-Nutzern **nicht** erlaubt, also bezahlte Stufe mit Ausgabenlimit |
| Mistral (EU) | `https://api.mistral.ai/v1` | `ministral-8b-latest` | ca. 0,15 $ pro 1 Mio. Tokens |
| OpenRouter | `https://openrouter.ai/api/v1` | je nach Modell | einige Gratis-Modelle, wechselnd |

**Grobe Kosten bei bezahlten Kleinmodellen:** Ein Gespräch mit 10 Nachrichten kostet etwa **0,1–0,4 Cent**. Mit dem Tageslimit von 40 Nachrichten sind das höchstens etwa 1–2 Cent pro Person und Tag. Beim Anbieter zusätzlich ein **monatliches Ausgabenlimit** setzen, zum Beispiel 5 €.

Wenn das Gratis-Kontingent von Groq einmal knapp wird, einfach auf Gemini Flash-Lite oder Ministral umstellen (Schritt 3, nur die drei Variablen ändern).

## Schritt 3: Funktion auf dem Server einspielen (10–15 Minuten)

Das selbst gehostete Supabase in Coolify besteht aus mehreren Diensten. Einer heißt **supabase-edge-functions** (in Coolify oft nur „edge-functions“ oder „functions“). Er führt alle Dateien aus, die im Container unter `/home/deno/functions/<name>/index.ts` liegen. Der Ordner `main` darin ist ein Verteiler: Ein Aufruf von `…/functions/v1/ps-chat` landet automatisch bei `/home/deno/functions/ps-chat/index.ts`. Wir legen also eine Datei dazu, setzen drei Variablen und starten neu.

### 3a) Die Datei anlegen – Weg A: in der Coolify-Oberfläche (empfohlen, ohne SSH)

1. Coolify öffnen → **Projects** → dein Projekt → die Ressource **Supabase**.
2. In der Liste der Dienste **supabase-edge-functions** anklicken (bzw. auf dessen Einstellungen/Zahnrad).
3. Reiter **Storages** (oder „Persistent Storage“) öffnen. Dort siehst du schon Einträge wie `/home/deno/functions/main/index.ts` und meist `/home/deno/functions/hello/index.ts`.
4. **+ Add** → **File Mount** wählen und ausfüllen:
   - **Destination Path:** `/home/deno/functions/ps-chat/index.ts`
   - **Content:** den kompletten Inhalt der Datei `deploy/functions/ps-chat/index.ts` aus deinem Projektordner einfügen (die Datei im Editor öffnen, Strg+A, Strg+C, dann hier Strg+V).
5. **Save**.

### 3a) Die Datei anlegen – Weg B: per Server-Terminal (falls es „File Mount“ nicht gibt)

1. In Coolify bei **Storages** des Dienstes nachsehen, welcher Server-Ordner auf `/home/deno/functions` zeigt. Er heißt meist `/data/coolify/services/<lange-ID>/volumes/functions`.
2. Coolify → **Servers** → dein Server → **Terminal** (oder per SSH anmelden).
3. Ordner anlegen und Datei öffnen (Pfad aus Schritt 1 einsetzen):
   ```
   mkdir -p /data/coolify/services/<lange-ID>/volumes/functions/ps-chat
   nano /data/coolify/services/<lange-ID>/volumes/functions/ps-chat/index.ts
   ```
4. Den Inhalt von `deploy/functions/ps-chat/index.ts` einfügen (Rechtsklick oder Strg+Umschalt+V), dann **Strg+O**, **Enter**, **Strg+X**.

### 3b) Die drei Variablen setzen

Coolify reicht Variablen nur an einen Dienst weiter, wenn sie in dessen Compose-Abschnitt stehen. Deshalb zwei kleine Schritte:

1. Bei der Supabase-Ressource **Edit Compose File** (oder „Docker Compose“) öffnen und den Abschnitt `supabase-edge-functions:` suchen. Darin gibt es `environment:` mit Einträgen wie `JWT_SECRET`, `SUPABASE_URL` usw. Genau dort diese vier Zeilen ergänzen. Die Einrückung muss wie bei den vorhandenen Zeilen sein, also mit Leerzeichen, keine Tabs:
   ```
         LLM_BASE_URL: ${LLM_BASE_URL}
         LLM_API_KEY: ${LLM_API_KEY}
         LLM_MODEL: ${LLM_MODEL}
         CHAT_DAILY_LIMIT: ${CHAT_DAILY_LIMIT:-40}
   ```
   Speichern.
2. Reiter **Environment Variables** der Supabase-Ressource öffnen. Die neuen Namen erscheinen dort meist schon leer. Werte eintragen (sonst mit **+ Add** anlegen):
   - `LLM_BASE_URL` = `https://api.groq.com/openai/v1`
   - `LLM_API_KEY` = dein Schlüssel `gsk_…` (wenn angeboten, als **Secret** / „Is Literal“ markieren)
   - `LLM_MODEL` = `openai/gpt-oss-120b` (welche Modelle es gerade gibt: Groq-Console → Limits bzw. Docs → Rate Limits)
   - `CHAT_DAILY_LIMIT` = `40`

   Speichern.
3. Prüfen, ob im selben `environment:`-Abschnitt schon `SUPABASE_URL`, `SUPABASE_ANON_KEY` und `SUPABASE_SERVICE_ROLE_KEY` stehen. Im Supabase-Paket von Coolify ist das normalerweise der Fall, die Funktion braucht sie für Anmeldung und Zähler. Fehlt eine davon, ebenso ergänzen, z. B. `SUPABASE_SERVICE_ROLE_KEY: ${SERVICE_SUPABASESERVICE_KEY}`, also mit dem Namen, den die anderen Dienste im Compose für denselben Schlüssel verwenden.

### 3c) Neu starten

Oben bei der Supabase-Ressource **Redeploy** (bzw. **Deploy**) klicken. Ein einfaches „Restart“ übernimmt Änderungen am Compose oft **nicht**. Das dauert 1–2 Minuten. Danach sollten alle Dienste wieder grün („Running“) sein.

## Test

**In der App:** polski.arndt-software.de öffnen → **Ich → Geräte-Abgleich** angemeldet sein → **Üben → KI-Gespräch**. Wenn die Situation und das Eingabefeld erscheinen, ist alles eingerichtet. Etwas auf Polnisch schreiben, z. B. `Poprosze kawe`, dann sollten eine Antwort und „Besser: Poproszę kawę.“ kommen.

**Ohne App (Windows PowerShell),** zeigt, ob die Funktion läuft und die Variablen ankommen:
```
$k='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4NDgxMTAwMCwiZXhwIjo0OTQwNDg0NjAwLCJyb2xlIjoiYW5vbiJ9.kMAlX4dS_sXjH6dsLoICMKnwyHFLAAuEwum7zuJh2DQ'
Invoke-RestMethod -Method Post -Uri https://supabase.arndt-software.de/functions/v1/ps-chat -Headers @{apikey=$k; Authorization="Bearer $k"} -ContentType 'application/json' -Body '{"ping":true}'
```
(Das ist der öffentliche anon-Schlüssel der App, kein Geheimnis.)

| Ergebnis | Bedeutung | Was tun |
|---|---|---|
| `ok: True, configured: True, limit: 40` | alles richtig | – |
| `configured: False` | Funktion läuft, aber `LLM_*` kommt nicht an | 3b prüfen (Compose-Zeilen + Werte), dann **Redeploy** |
| Fehler **404** / „function not found“ | Datei liegt nicht am richtigen Ort | Pfad muss genau `/home/deno/functions/ps-chat/index.ts` sein |
| Fehler **401** | Verteiler prüft Tokens (`VERIFY_JWT=true`) | normal, die App funktioniert trotzdem (sie schickt das Konto-Token). Zum Testen einfach direkt in der App probieren |
| Fehler **500** / „worker boot error“ | Datei unvollständig eingefügt | Inhalt erneut komplett einfügen, Redeploy |

**Wenn es hakt:** In Coolify beim Dienst **supabase-edge-functions** den Reiter **Logs** öffnen. Fehlermeldungen dort (oder als Foto) an Claude schicken.

## Danach

- Die **Datenschutzerklärung** nennt den Anbieter nur allgemein („z. B. Groq oder Google“). Wenn feststeht, welchen du nutzt, den Namen dort eintragen (`datenschutz.html`, Abschnitt KI-Gespräch).
- Limit ändern: `CHAT_DAILY_LIMIT` anpassen und den Dienst neu starten.
- Anbieter wechseln: die drei `LLM_*`-Variablen ändern und den Dienst neu starten.
