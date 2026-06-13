-- Run once in the Supabase SQL Editor (adds image support to the board).

-- Image column on board posts.
alter table public.board_items add column if not exists image_url text;

-- Public bucket for board images.
insert into storage.buckets (id, name, public)
values ('board-images', 'board-images', true)
on conflict (id) do nothing;

-- Logged-in users can upload; anyone can read (bucket is public).
drop policy if exists "board_images_insert" on storage.objects;
create policy "board_images_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'board-images');

drop policy if exists "board_images_read" on storage.objects;
create policy "board_images_read" on storage.objects
  for select using (bucket_id = 'board-images');

drop policy if exists "board_images_delete_own" on storage.objects;
create policy "board_images_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'board-images' and owner = auth.uid());
