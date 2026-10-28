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
1. https://console.groq.com öffnen und mit Google oder E-Mail anmelden.
2. **API Keys → Create API Key**, den Schlüssel kopieren und sicher aufbewahren.

| Anbieter | `LLM_BASE_URL` | `LLM_MODEL` (Beispiel) | Kosten (Stand Okt. 2026, bitte beim Anbieter prüfen) |
|---|---|---|---|
| **Groq** (Start) | `https://api.groq.com/openai/v1` | `llama-3.3-70b-versatile` | kostenloses Kontingent mit Minuten- und Tagesgrenzen |
| Google Gemini | `https://generativelanguage.googleapis.com/v1beta/openai` | `gemini-3.1-flash-lite` (genauen Namen in Google AI Studio nachsehen) | ca. 0,25 $ / 1,50 $ pro 1 Mio. Tokens (Ein-/Ausgabe). Die Gratisstufe ist für Apps mit EU-Nutzern **nicht** erlaubt, also bezahlte Stufe mit Ausgabenlimit |
| Mistral (EU) | `https://api.mistral.ai/v1` | `ministral-8b-latest` | ca. 0,15 $ pro 1 Mio. Tokens |
| OpenRouter | `https://openrouter.ai/api/v1` | je nach Modell | einige Gratis-Modelle, wechselnd |

**Grobe Kosten bei bezahlten Kleinmodellen:** Ein Gespräch mit 10 Nachrichten kostet etwa **0,1–0,4 Cent**. Mit dem Tageslimit von 40 Nachrichten sind das höchstens etwa 1–2 Cent pro Person und Tag. Beim Anbieter zusätzlich ein **monatliches Ausgabenlimit** setzen, zum Beispiel 5 €.

Wenn das Gratis-Kontingent von Groq einmal knapp wird, einfach auf Gemini Flash-Lite oder Ministral umstellen (Schritt 3, nur die drei Variablen ändern).

## Schritt 3: Funktion auf dem Server einspielen (10 Minuten)

Das selbst gehostete Supabase in Coolify hat einen Dienst **supabase-edge-functions**. Seine Funktionen liegen in einem Ordner, der in den Container eingebunden ist (`/home/deno/functions`).

1. In Coolify die Supabase-Ressource öffnen. Im Docker-Compose bzw. bei **Storages** des Dienstes `supabase-edge-functions` nachsehen, welcher Server-Ordner auf `/home/deno/functions` zeigt (meist `…/volumes/functions`).
2. Dort einen Ordner **`ps-chat`** anlegen und die Datei `deploy/functions/ps-chat/index.ts` aus diesem Projekt als **`index.ts`** hineinlegen. Das geht per SFTP oder im Coolify-Terminal des Servers mit `nano`. Der Ordner `main` bleibt unverändert, er leitet die Aufrufe an `ps-chat` weiter.
3. Beim Dienst **supabase-edge-functions** unter **Environment Variables** ergänzen:
   ```
   LLM_BASE_URL=https://api.groq.com/openai/v1
   LLM_API_KEY=<dein Schlüssel>
   LLM_MODEL=llama-3.3-70b-versatile
   CHAT_DAILY_LIMIT=40
   ```
   Falls Coolify keine eigenen Variablen pro Dienst anbietet: im Compose-File beim Dienst `supabase-edge-functions` unter `environment:` eintragen, den Schlüssel am besten als Coolify-Variable `${LLM_API_KEY}`.
   `SUPABASE_URL`, `SUPABASE_ANON_KEY` und `SUPABASE_SERVICE_ROLE_KEY` sind dort normalerweise schon gesetzt. Die Funktion braucht sie für Anmeldung und Zähler.
4. Den Dienst **supabase-edge-functions** neu starten (Restart).

## Test

Im Browser die App öffnen, angemeldet unter **Ich → Geräte-Abgleich**, dann Üben → **KI-Gespräch**. Kommt „wird gerade eingerichtet“, antwortet die Funktion nicht oder `LLM_*` fehlt.

Zum Prüfen ohne App reicht dieser Aufruf. `<ANON>` ist der öffentliche anon-Schlüssel aus `src/app.js` (`SB_KEY`):
```
curl -s -X POST https://supabase.arndt-software.de/functions/v1/ps-chat -H "apikey: <ANON>" -H "Authorization: Bearer <ANON>" -H "Content-Type: application/json" -d '{"ping":true}'
```
Erwartet wird `{"ok":true,"configured":true,"limit":40}`. Kommt `401`, ist im Dienst `VERIFY_JWT=true` gesetzt. Der Test mit dem anon-Schlüssel scheitert dann, die App selbst funktioniert trotzdem, weil sie mit dem Konto-Token anfragt.

## Danach

- Die **Datenschutzerklärung** nennt den Anbieter nur allgemein („z. B. Groq oder Google“). Wenn feststeht, welchen du nutzt, den Namen dort eintragen (`datenschutz.html`, Abschnitt KI-Gespräch).
- Limit ändern: `CHAT_DAILY_LIMIT` anpassen und den Dienst neu starten.
- Anbieter wechseln: die drei `LLM_*`-Variablen ändern und den Dienst neu starten.
