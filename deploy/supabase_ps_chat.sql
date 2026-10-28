-- Polski Szlak – KI-Gespräch: Tageszähler pro Konto (selbst gehostetes Supabase: https://supabase.arndt-software.de)
-- Einmal im Supabase Studio → SQL Editor ausführen. Mehrfach ausführen schadet nicht.
-- Gespeichert wird NUR: Konto-ID, Tag, Anzahl Nachrichten. Keine Gesprächsinhalte.
-- Nur die Edge Function (Service-Rolle) darf zählen; über die normale API ist die Tabelle weder lesbar noch beschreibbar.

create table if not exists public.ps_chat_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  day     date not null default current_date,
  n       integer not null default 0,
  primary key (user_id, day)
);

alter table public.ps_chat_usage enable row level security;
revoke all on public.ps_chat_usage from anon, authenticated;

-- Erhöht den Zähler und gibt die neue Anzahl zurück, oder -1, wenn das Tageslimit erreicht ist.
create or replace function public.ps_chat_count(uid uuid, lim integer)
returns integer language plpgsql security definer set search_path = public as $$
declare cur integer;
begin
  insert into public.ps_chat_usage (user_id, day, n) values (uid, current_date, 0)
    on conflict (user_id, day) do nothing;
  select n into cur from public.ps_chat_usage where user_id = uid and day = current_date for update;
  if cur >= lim then return -1; end if;
  update public.ps_chat_usage set n = n + 1 where user_id = uid and day = current_date;
  return cur + 1;
end $$;

revoke all on function public.ps_chat_count(uuid, integer) from public, anon, authenticated;
grant execute on function public.ps_chat_count(uuid, integer) to service_role;

-- Alte Zähler nach 60 Tagen aufräumen (optional, z. B. gelegentlich von Hand):
-- delete from public.ps_chat_usage where day < current_date - 60;

notify pgrst, 'reload schema';
