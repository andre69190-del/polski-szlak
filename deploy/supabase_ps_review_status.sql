-- Polski Szlak – Prüfstand für den Prüfmodus (?review): wer hat was schon geprüft? (selbst gehostetes Supabase)
-- Einmal im Supabase Studio → SQL Editor ausführen. Mehrfach ausführen schadet nicht.
-- Gibt NUR Schlüssel, Ergebnis (✓/✗), Datum und den VORNAMEN der prüfenden Person zurück – keine Texte, keine anderen Meldungen.
-- Einträge ohne Namen (automatische Tests, „?“) werden ignoriert. Neuester Stand pro Eintrag gewinnt.

create or replace function public.ps_review_status()
returns table (k text, ok boolean, who text, at timestamptz)
language sql stable security definer set search_path = public as $$
  with raw as (
    select f.created_at,
           split_part(split_part(f.ctx, '|', 2), ' ', 1) as who,
           f.msg
      from public.ps_feedback f
     where f.ctx like 'review|%'
       and split_part(f.ctx, '|', 2) not in ('', '?')
  ), items as (
    select created_at, who, unnest(string_to_array(split_part(msg, ': ', 2), ' ')) as k, true as ok
      from raw where msg like 'REVIEW ✓%'
    union all
    select created_at, who, substring(msg from '\[([^]]+)\]') as k, false as ok
      from raw where msg like 'REVIEW ✗%'
  )
  select distinct on (k) k, ok, left(who, 30), created_at
    from items where k is not null and k <> ''
   order by k, created_at desc;
$$;

revoke all on function public.ps_review_status() from public;
grant execute on function public.ps_review_status() to anon, authenticated;

notify pgrst, 'reload schema';
