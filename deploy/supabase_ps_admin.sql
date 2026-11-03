-- Polski Szlak – Rückmeldungen in der App lesen (nur für Administratoren). Selbst gehostetes Supabase.
-- Einmal im Supabase Studio → SQL Editor ausführen. Mehrfach ausführen schadet nicht.
-- Danach EINMAL das eigene Konto als Administrator eintragen (Zeile steht in der Anleitung im Chat, nicht im öffentlichen Repo):
--   insert into public.ps_admins (user_id) select id from auth.users where email in ('…') on conflict do nothing;

create table if not exists public.ps_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  added_at timestamptz not null default now()
);
alter table public.ps_admins enable row level security;
revoke all on public.ps_admins from anon, authenticated;

-- Liefert alle Rückmeldungen (Prüfmodus + „Fehler melden“), neueste zuerst – aber nur, wenn die anfragende Person Administrator ist.
create or replace function public.ps_feedback_admin(since timestamptz default null)
returns table (created_at timestamptz, msg text, ctx text, lang text, ver text)
language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from public.ps_admins a where a.user_id = auth.uid()) then
    raise exception 'nicht berechtigt' using errcode = '42501';
  end if;
  return query select f.created_at, f.msg, f.ctx, f.lang, f.ver from public.ps_feedback f
    where since is null or f.created_at > since order by f.created_at desc limit 5000;
end $$;

revoke all on function public.ps_feedback_admin(timestamptz) from public, anon;
grant execute on function public.ps_feedback_admin(timestamptz) to authenticated;

notify pgrst, 'reload schema';
