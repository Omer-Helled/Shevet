-- Shevet database schema. Run this once in the Supabase SQL Editor.
-- Safe to re-run: uses "if not exists" / "or replace" / drops policies first.

-- ── profiles ─────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id                   uuid primary key references auth.users (id) on delete cascade,
  first_name           text,
  last_name            text,
  avatar_url           text,
  bio                  text,
  home_city            text,
  languages            text[] default '{}',
  kosher_level         text default 'none' check (kosher_level in ('none', 'basic', 'glatt')),
  is_shabbat_observant boolean default false,
  is_verified          boolean default false,
  created_at           timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all" on public.profiles
  for select using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── properties (listings) ────────────────────────────────────────────────────
create table if not exists public.properties (
  id                   uuid primary key default gen_random_uuid(),
  owner_id             uuid not null references public.profiles (id) on delete cascade,
  title                text not null,
  description          text,
  listing_type         text not null default 'exchange'
                         check (listing_type in ('exchange', 'host', 'volunteer', 'petsit')),
  city                 text,
  country              text,
  is_kosher            boolean default false,
  is_shabbat_observant boolean default false,
  has_sukkah           boolean default false,
  near_shul            boolean default false,
  is_active            boolean default true,
  created_at           timestamptz default now()
);

alter table public.properties enable row level security;

drop policy if exists "properties_select_active" on public.properties;
create policy "properties_select_active" on public.properties
  for select using (is_active or auth.uid() = owner_id);

drop policy if exists "properties_insert_own" on public.properties;
create policy "properties_insert_own" on public.properties
  for insert with check (auth.uid() = owner_id);

drop policy if exists "properties_update_own" on public.properties;
create policy "properties_update_own" on public.properties
  for update using (auth.uid() = owner_id);

drop policy if exists "properties_delete_own" on public.properties;
create policy "properties_delete_own" on public.properties
  for delete using (auth.uid() = owner_id);

-- ── board_items (volunteering / jobs / offers / packages) ────────────────────
create table if not exists public.board_items (
  id         uuid primary key default gen_random_uuid(),
  author_id  uuid not null references public.profiles (id) on delete cascade,
  title      text not null,
  body       text,
  kind       text not null default 'volunteer'
               check (kind in ('volunteer', 'job', 'offer', 'package')),
  place      text,
  created_at timestamptz default now()
);

alter table public.board_items enable row level security;

drop policy if exists "board_select_all" on public.board_items;
create policy "board_select_all" on public.board_items
  for select using (true);

drop policy if exists "board_insert_own" on public.board_items;
create policy "board_insert_own" on public.board_items
  for insert with check (auth.uid() = author_id);

drop policy if exists "board_delete_own" on public.board_items;
create policy "board_delete_own" on public.board_items
  for delete using (auth.uid() = author_id);
