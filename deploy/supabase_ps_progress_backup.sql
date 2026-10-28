-- Polski Szlak – Server-Sicherung der Spielstände (selbst gehostetes Supabase: https://supabase.arndt-software.de)
-- Einmal im Supabase Studio → SQL Editor ausführen (NACH supabase_ps_progress.sql). Mehrfach ausführen schadet nicht.
--
-- 1) Tages-Sicherung: Vor jeder Änderung wird der bisherige Stand einmal pro Tag und Konto in ps_progress_history
--    abgelegt (30 Tage). Nur der Server (Service-Rolle / Studio) sieht diese Tabelle – über die App-API nicht lesbar.
-- 2) Schutz: Ein Update, das deutlich weniger Fortschritt enthält als vorher (XP sinken), wird abgelehnt.
--    Die App führt Stände immer zusammen (Maximum), deshalb passiert das nur bei einem Fehler.
-- 3) „Meine Daten vom Server löschen“ in der App löscht auch die Sicherungen dieses Kontos (Datenschutz).

create table if not exists public.ps_progress_history (
  user_id  uuid        not null references auth.users(id) on delete cascade,
  day      date        not null default current_date,
  data     jsonb       not null,
  saved_at timestamptz not null default now(),
  primary key (user_id, day)
);
alter table public.ps_progress_history enable row level security;
revoke all on public.ps_progress_history from anon, authenticated;

create or replace function public.ps_progress_keep() returns trigger
language plpgsql security definer set search_path = public as $$
declare old_xp numeric; new_xp numeric;
begin
  begin old_xp := coalesce((old.data->>'xp')::numeric, 0); exception when others then old_xp := 0; end;
  begin new_xp := coalesce((new.data->>'xp')::numeric, 0); exception when others then new_xp := 0; end;
  if new_xp < old_xp then
    raise exception 'ps_progress: Rückschritt abgelehnt (XP % -> %)', old_xp, new_xp using errcode = 'P0001';
  end if;
  insert into public.ps_progress_history (user_id, day, data) values (old.user_id, current_date, old.data)
    on conflict (user_id, day) do nothing;
  delete from public.ps_progress_history where user_id = old.user_id and day < current_date - 30;
  return new;
end $$;

drop trigger if exists ps_progress_keep on public.ps_progress;
create trigger ps_progress_keep before update on public.ps_progress
  for each row execute function public.ps_progress_keep();

create or replace function public.ps_progress_forget() returns trigger
language plpgsql security definer set search_path = public as $$
begin delete from public.ps_progress_history where user_id = old.user_id; return old; end $$;

drop trigger if exists ps_progress_forget on public.ps_progress;
create trigger ps_progress_forget after delete on public.ps_progress
  for each row execute function public.ps_progress_forget();

-- Wiederherstellen eines Kontos (nur im Studio, falls je nötig):
--   select day, (data->>'xp') as xp from public.ps_progress_history where user_id = '<uuid>' order by day desc;
--   update public.ps_progress p set data = h.data from public.ps_progress_history h
--     where p.user_id = h.user_id and h.user_id = '<uuid>' and h.day = '<YYYY-MM-DD>';
--   (Dafür vorher kurz:  alter table public.ps_progress disable trigger ps_progress_keep;  danach wieder enable.)

notify pgrst, 'reload schema';
