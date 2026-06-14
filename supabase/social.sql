-- Social layer for the board: comments, post likes, comment likes.
-- Run once in the Supabase SQL Editor (after schema.sql and storage.sql).

-- Counters kept in sync by triggers below.
alter table public.board_items add column if not exists like_count int not null default 0;
alter table public.board_items add column if not exists comment_count int not null default 0;

-- ── comments ─────────────────────────────────────────────────────────────────
create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.board_items (id) on delete cascade,
  author_id  uuid not null references public.profiles (id) on delete cascade,
  body       text,
  image_url  text,
  like_count int not null default 0,
  created_at timestamptz default now()
);
alter table public.comments enable row level security;

drop policy if exists "comments_select" on public.comments;
create policy "comments_select" on public.comments for select using (true);
drop policy if exists "comments_insert" on public.comments;
create policy "comments_insert" on public.comments for insert with check (auth.uid() = author_id);
drop policy if exists "comments_delete" on public.comments;
create policy "comments_delete" on public.comments for delete using (auth.uid() = author_id);

-- ── post_likes ───────────────────────────────────────────────────────────────
create table if not exists public.post_likes (
  post_id    uuid not null references public.board_items (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz default now(),
  primary key (post_id, user_id)
);
alter table public.post_likes enable row level security;

drop policy if exists "post_likes_select" on public.post_likes;
create policy "post_likes_select" on public.post_likes for select using (true);
drop policy if exists "post_likes_insert" on public.post_likes;
create policy "post_likes_insert" on public.post_likes for insert with check (auth.uid() = user_id);
drop policy if exists "post_likes_delete" on public.post_likes;
create policy "post_likes_delete" on public.post_likes for delete using (auth.uid() = user_id);

-- ── comment_likes ────────────────────────────────────────────────────────────
create table if not exists public.comment_likes (
  comment_id uuid not null references public.comments (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz default now(),
  primary key (comment_id, user_id)
);
alter table public.comment_likes enable row level security;

drop policy if exists "comment_likes_select" on public.comment_likes;
create policy "comment_likes_select" on public.comment_likes for select using (true);
drop policy if exists "comment_likes_insert" on public.comment_likes;
create policy "comment_likes_insert" on public.comment_likes for insert with check (auth.uid() = user_id);
drop policy if exists "comment_likes_delete" on public.comment_likes;
create policy "comment_likes_delete" on public.comment_likes for delete using (auth.uid() = user_id);

-- ── counter triggers (security definer to bypass RLS on the counted tables) ──
create or replace function public.bump_post_likes()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if (tg_op = 'INSERT') then
    update public.board_items set like_count = like_count + 1 where id = new.post_id;
  elsif (tg_op = 'DELETE') then
    update public.board_items set like_count = greatest(like_count - 1, 0) where id = old.post_id;
  end if;
  return null;
end; $$;
drop trigger if exists trg_post_likes on public.post_likes;
create trigger trg_post_likes after insert or delete on public.post_likes
  for each row execute function public.bump_post_likes();

create or replace function public.bump_comments()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if (tg_op = 'INSERT') then
    update public.board_items set comment_count = comment_count + 1 where id = new.post_id;
  elsif (tg_op = 'DELETE') then
    update public.board_items set comment_count = greatest(comment_count - 1, 0) where id = old.post_id;
  end if;
  return null;
end; $$;
drop trigger if exists trg_comments on public.comments;
create trigger trg_comments after insert or delete on public.comments
  for each row execute function public.bump_comments();

create or replace function public.bump_comment_likes()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if (tg_op = 'INSERT') then
    update public.comments set like_count = like_count + 1 where id = new.comment_id;
  elsif (tg_op = 'DELETE') then
    update public.comments set like_count = greatest(like_count - 1, 0) where id = old.comment_id;
  end if;
  return null;
end; $$;
drop trigger if exists trg_comment_likes on public.comment_likes;
create trigger trg_comment_likes after insert or delete on public.comment_likes
  for each row execute function public.bump_comment_likes();
