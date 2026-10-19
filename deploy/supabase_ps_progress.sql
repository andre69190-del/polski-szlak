-- Polski Szlak – Geräte-Abgleich (selbst gehostetes Supabase: https://supabase.arndt-software.de)
-- Einmal im Supabase Studio → SQL Editor ausführen. Mehrfach ausführen schadet nicht.
-- Pro Konto genau eine Zeile mit dem ganzen Spielstand (JSON). Jeder sieht und ändert nur seine eigene Zeile.

create table if not exists public.ps_progress (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb       not null,
  updated_at timestamptz not null default now(),
  constraint ps_progress_size check (pg_column_size(data) < 1000000)
);

create or replace function public.ps_touch() returns trigger
language plpgsql set search_path = public as $$
begin new.updated_at := now(); return new; end $$;

drop trigger if exists ps_progress_touch on public.ps_progress;
create trigger ps_progress_touch before insert or update on public.ps_progress
  for each row execute function public.ps_touch();

alter table public.ps_progress enable row level security;

drop policy if exists "ps_select_own" on public.ps_progress;
create policy "ps_select_own" on public.ps_progress for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "ps_insert_own" on public.ps_progress;
create policy "ps_insert_own" on public.ps_progress for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "ps_update_own" on public.ps_progress;
create policy "ps_update_own" on public.ps_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "ps_delete_own" on public.ps_progress;
create policy "ps_delete_own" on public.ps_progress for delete to authenticated using ((select auth.uid()) = user_id);

revoke all on public.ps_progress from anon;
grant select, insert, update, delete on public.ps_progress to authenticated;

notify pgrst, 'reload schema';
