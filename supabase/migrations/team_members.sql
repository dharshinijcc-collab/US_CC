-- ============================================================
-- Team Members Table Migration
-- Run this in your Supabase SQL Editor
-- ============================================================

create table if not exists public.team_members (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  role            text not null,
  bio             text,
  image_url       text,
  category        text not null default 'Team Member'
                  check (category in ('Founder', 'Partner', 'Advisor', 'Team Member')),
  display_order   integer not null default 0,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Auto-update updated_at on every row change
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.team_members;
create trigger set_updated_at
  before update on public.team_members
  for each row execute function public.handle_updated_at();

-- Row Level Security
alter table public.team_members enable row level security;

-- Public: anyone can read active members
create policy "Public can read active team members"
  on public.team_members for select
  using (is_active = true);

-- Service role full access
create policy "Service role full access"
  on public.team_members for all
  using (true)
  with check (true);

-- Seed: initial hardcoded members
insert into public.team_members (name, role, bio, category, display_order) values
  ('Asfarul Huda',   'CEO & Founder',       'Former Amazon Product Manager with a decade of experience building digital products at scale. Founded CrestCode in 2025 with a mission to give every founder access to world-class execution.',      'Founder',     1),
  ('Adam Braasch',   'Partner',             'A strategic and operational partner at CrestCode, Adam brings deep expertise in building and scaling early-stage ventures from idea to market.',                                                   'Partner',     2),
  ('Pranali Choubal','Partner',             'Pranali brings a sharp product and design sensibility to CrestCode, ensuring that every venture we build is not just functional — but genuinely lovable.',                                       'Partner',     3),
  ('Amir Hoda',      'Partner',             'A technical and business partner at CrestCode, Amir focuses on engineering strategy, delivery excellence, and helping ventures scale with confidence.',                                           'Partner',     4),
  ('Fahad Siddiqui', 'Finance Advisor',     'Advises CrestCode and its ventures on financial strategy, investment structuring, and capital planning.',                                                                                         'Advisor',     5),
  ('Dr. Faria Ali',  'Healthcare Advisor',  'Brings deep domain expertise in healthcare, guiding CrestCode ventures in health-adjacent product strategy and compliance.',                                                                       'Advisor',     6)
on conflict do nothing;
