begin;
create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.portfolio_admins enable row level security;
revoke all on public.portfolio_admins from anon, authenticated;
grant select on public.portfolio_admins to authenticated;
create policy "Read own admin membership" on public.portfolio_admins for select to authenticated using (user_id = (select auth.uid()));

create table if not exists public.portfolio_content (
  id text primary key check (id in ('draft','published')),
  document jsonb not null check (jsonb_typeof(document) = 'object'),
  revision integer not null default 1,
  updated_at timestamptz not null default now()
);
alter table public.portfolio_content enable row level security;
revoke all on public.portfolio_content from anon, authenticated;
grant select on public.portfolio_content to anon, authenticated;
create policy "Public published content only" on public.portfolio_content for select to anon, authenticated using (id = 'published');
create policy "Admins read drafts" on public.portfolio_content for select to authenticated using (exists(select 1 from public.portfolio_admins where user_id = (select auth.uid())));

create or replace function public.save_portfolio(content jsonb, expected_revision integer, publish_now boolean default false)
returns integer language plpgsql security definer set search_path = '' as $$
declare current_revision integer;
begin
  if not exists(select 1 from public.portfolio_admins where user_id = auth.uid()) then raise exception 'FORBIDDEN'; end if;
  if jsonb_typeof(content) <> 'object' or octet_length(content::text) > 1000000 then raise exception 'INVALID_CONTENT'; end if;
  perform pg_advisory_xact_lock(739241);
  select revision into current_revision from public.portfolio_content where id = 'draft';
  current_revision := coalesce(current_revision, 0);
  if current_revision <> expected_revision then raise exception 'REVISION_CONFLICT'; end if;
  current_revision := current_revision + 1;
  insert into public.portfolio_content(id,document,revision) values ('draft',content,current_revision)
  on conflict(id) do update set document=excluded.document, revision=excluded.revision, updated_at=now();
  if publish_now then
    insert into public.portfolio_content(id,document,revision) values ('published',content,current_revision)
    on conflict(id) do update set document=excluded.document, revision=excluded.revision, updated_at=now();
  end if;
  return current_revision;
end;
$$;
revoke all on function public.save_portfolio(jsonb,integer,boolean) from public, anon;
grant execute on function public.save_portfolio(jsonb,integer,boolean) to authenticated;
commit;
