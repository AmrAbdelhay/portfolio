-- Repair the legacy (id, data, updated_at) table without removing its rows.
-- Apply before 002_seed.sql. The original migration must not be rerun.
begin;

alter table public.portfolio_content
  add column if not exists document jsonb not null default '{}'::jsonb,
  add column if not exists revision integer not null default 0;

do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'portfolio_content' and column_name = 'data') then
    alter table public.portfolio_content alter column data set default '{}'::jsonb;
    update public.portfolio_content set document = data where document = '{}'::jsonb and data is not null and data <> '{}'::jsonb;
  end if;
end;
$$;

alter table public.portfolio_content enable row level security;
-- Replace legacy policies which would expose drafts if SELECT were granted.
drop policy if exists "public read" on public.portfolio_content;
drop policy if exists "admin write" on public.portfolio_content;
drop policy if exists "Public published content only" on public.portfolio_content;
drop policy if exists "Admins read drafts" on public.portfolio_content;
revoke all on public.portfolio_content from anon, authenticated;
grant select on public.portfolio_content to anon, authenticated;
create policy "Public published content only" on public.portfolio_content
  for select to anon, authenticated using (id = 'published');
create policy "Admins read drafts" on public.portfolio_content
  for select to authenticated using (
    exists (select 1 from public.portfolio_admins where user_id = (select auth.uid()))
  );

notify pgrst, 'reload schema';
commit;
