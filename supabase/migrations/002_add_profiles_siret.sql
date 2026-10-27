-- La table profiles existe déjà (id = auth.users.id).
-- On ajoute les colonnes de la beta sans recréer la table.

alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists siret text;

do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'role'
  ) then
    alter table public.profiles
      add column role text not null default 'visitor';
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'created_at'
  ) then
    alter table public.profiles
      add column created_at timestamptz not null default now();
  end if;
end $$;

alter table public.profiles alter column role set default 'visitor';

alter table public.profiles enable row level security;

drop policy if exists "Public SELECT profiles" on public.profiles;
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (id = auth.uid());

create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

revoke all on table public.profiles from anon;
grant select, insert, update on table public.profiles to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_siret text;
  v_role text;
begin
  v_siret := nullif(regexp_replace(coalesce(new.raw_user_meta_data->>'siret', ''), '\s', '', 'g'), '');
  if v_siret is null or v_siret !~ '^\d{14}$' then
    v_siret := null;
    v_role := 'visitor';
  else
    v_role := 'pro';
  end if;

  insert into public.profiles (id, email, siret, role)
  values (new.id, new.email, v_siret, v_role)
  on conflict (id) do update
    set email = excluded.email,
        siret = coalesce(excluded.siret, public.profiles.siret),
        role = case
          when excluded.siret is not null then 'pro'
          else public.profiles.role
        end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update of raw_user_meta_data on auth.users
  for each row
  execute function public.handle_new_user();
