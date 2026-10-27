drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (
    id = auth.uid()
    and (
      (role = 'visitor' and siret is null)
      or (role = 'pro' and siret ~ '^\d{14}$')
    )
  );

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create or replace function public.prevent_privilege_escalation()
returns trigger
language plpgsql
as $$
begin
  new.role := old.role;
  new.siret := old.siret;
  return new;
end;
$$;

drop trigger if exists prevent_privilege_escalation on public.profiles;
create trigger prevent_privilege_escalation
  before update on public.profiles
  for each row
  execute function public.prevent_privilege_escalation();
