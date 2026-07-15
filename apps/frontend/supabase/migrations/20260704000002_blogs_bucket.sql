-- Create blogs storage bucket
insert into storage.buckets (id, name, public)
values ('blogs', 'blogs', true)
on conflict (id) do nothing;

-- Ensure public select is allowed for blogs bucket objects
drop policy if exists "Public Access to Blogs" on storage.objects;
create policy "Public Access to Blogs"
on storage.objects for select
using (bucket_id = 'blogs');

-- Create blog_authors table
create table if not exists public.blog_authors (
  id              uuid primary key default gen_random_uuid(),
  name            text not null unique,
  role            text not null,
  avatar_url      text,
  bio             text,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Enable RLS
alter table public.blog_authors enable row level security;

-- Public: anyone can read active authors
drop policy if exists "Public can read active authors" on public.blog_authors;
create policy "Public can read active authors"
on public.blog_authors for select
using (is_active = true);

-- Service role: full access
drop policy if exists "Service role full access for blog_authors" on public.blog_authors;
create policy "Service role full access for blog_authors"
on public.blog_authors for all
using (true)
with check (true);

-- Seed fallback authors
insert into public.blog_authors (name, role, bio) values
  ('Ahmed Faraz', 'Principal Architect', 'Elite engineering and product design veteran.'),
  ('Moin Khan', 'Venture Strategist', 'Helping startups validate and build lean products.'),
  ('Karthik Raja', 'Engineering Lead', 'Specialist in scaling microservices and cloud infra.'),
  ('Tulasi Divya', 'Design Principal', 'Crafting user experiences that users fall in love with.'),
  ('Swathi', 'Product Consultant', 'Navigating funding rounds and scaling playbooks.'),
  ('Vinitha', 'Scrum Coach / PM', 'Fostering agile workflows and iterative sprint deliveries.'),
  ('Satheesh', 'Cloud Architect', 'DevOps leader optimizing cloud infrastructures.'),
  ('Mythrehe', 'Growth Lead', 'Integrating data-driven decisions and growth analytics.')
on conflict (name) do nothing;

-- Alter blogs table to add author_id
alter table public.blogs add column if not exists author_id uuid references public.blog_authors(id) on delete set null;

-- Map existing blogs to their author_id
update public.blogs b
set author_id = a.id
from public.blog_authors a
where b.author = a.name;
