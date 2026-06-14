-- Notifications, bookmarks, and Realtime. Run once in the Supabase SQL Editor.

-- ── notifications ────────────────────────────────────────────────────────────
create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade, -- recipient
  actor_id   uuid references public.profiles (id) on delete set null,         -- who triggered it
  type       text not null check (type in ('like', 'comment')),
  post_id    uuid references public.board_items (id) on delete cascade,
  read       boolean not null default false,
  created_at timestamptz default now()
);
alter table public.notifications enable row level security;

drop policy if exists "notifications_select" on public.notifications;
create policy "notifications_select" on public.notifications
  for select using (auth.uid() = user_id);
drop policy if exists "notifications_update" on public.notifications;
create policy "notifications_update" on public.notifications
  for update using (auth.uid() = user_id);

-- Create a notification for the post owner when someone likes/comments (not on self-actions).
create or replace function public.notify_post_like()
returns trigger language plpgsql security definer set search_path = '' as $$
declare owner uuid;
begin
  select author_id into owner from public.board_items where id = new.post_id;
  if owner is not null and owner <> new.user_id then
    insert into public.notifications (user_id, actor_id, type, post_id)
    values (owner, new.user_id, 'like', new.post_id);
  end if;
  return null;
end; $$;
drop trigger if exists trg_notify_post_like on public.post_likes;
create trigger trg_notify_post_like after insert on public.post_likes
  for each row execute function public.notify_post_like();

create or replace function public.notify_comment()
returns trigger language plpgsql security definer set search_path = '' as $$
declare owner uuid;
begin
  select author_id into owner from public.board_items where id = new.post_id;
  if owner is not null and owner <> new.author_id then
    insert into public.notifications (user_id, actor_id, type, post_id)
    values (owner, new.author_id, 'comment', new.post_id);
  end if;
  return null;
end; $$;
drop trigger if exists trg_notify_comment on public.comments;
create trigger trg_notify_comment after insert on public.comments
  for each row execute function public.notify_comment();

-- ── bookmarks ────────────────────────────────────────────────────────────────
create table if not exists public.bookmarks (
  user_id    uuid not null references public.profiles (id) on delete cascade,
  post_id    uuid not null references public.board_items (id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, post_id)
);
alter table public.bookmarks enable row level security;

drop policy if exists "bookmarks_select" on public.bookmarks;
create policy "bookmarks_select" on public.bookmarks
  for select using (auth.uid() = user_id);
drop policy if exists "bookmarks_insert" on public.bookmarks;
create policy "bookmarks_insert" on public.bookmarks
  for insert with check (auth.uid() = user_id);
drop policy if exists "bookmarks_delete" on public.bookmarks;
create policy "bookmarks_delete" on public.bookmarks
  for delete using (auth.uid() = user_id);

-- ── enable Realtime on the social tables (idempotent) ────────────────────────
do $$ begin
  alter publication supabase_realtime add table public.comments;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.post_likes;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.notifications;
exception when duplicate_object then null; end $$;
