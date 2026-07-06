-- Create storage bucket for avatars if it doesn't exist
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Ensure public select is allowed for avatars bucket objects
drop policy if exists "Public Access to Avatars" on storage.objects;
create policy "Public Access to Avatars"
on storage.objects for select
using (bucket_id = 'avatars');
