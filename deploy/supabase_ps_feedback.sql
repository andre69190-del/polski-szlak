-- Polski Szlak – Fehler melden (selbst gehostetes Supabase: https://supabase.arndt-software.de)
-- Einmal im Supabase Studio → SQL Editor ausführen. Mehrfach ausführen schadet nicht.
-- Jeder darf eine Meldung EINFÜGEN (auch ohne Konto), aber niemand kann Meldungen über die API lesen.
-- Gespeichert werden nur: Text der Meldung, Übungs-Kontext, Basissprache, App-Version, Zeitpunkt. Keine Konto-ID, keine IP.
-- Lesen: im Studio (Table Editor → ps_feedback) oder per SQL: select * from public.ps_feedback order by created_at desc;

create table if not exists public.ps_feedback (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  msg        text not null check (char_length(msg) between 1 and 1000),
  ctx        text check (ctx is null or char_length(ctx) <= 500),
  lang       text check (lang is null or lang in ('de', 'en')),
  ver        text check (ver is null or char_length(ver) <= 20)
);

alter table public.ps_feedback enable row level security;

drop policy if exists "ps_feedback_insert" on public.ps_feedback;
create policy "ps_feedback_insert" on public.ps_feedback for insert to anon, authenticated with check (true);

revoke all on public.ps_feedback from anon, authenticated;
grant insert on public.ps_feedback to anon, authenticated;

notify pgrst, 'reload schema';
