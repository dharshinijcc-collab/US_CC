-- Create milestones table
create table if not exists public.milestones (
  id              uuid primary key default gen_random_uuid(),
  year            text not null,
  title           text not null,
  description     text not null,
  image_url       text,
  display_order   integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Auto-update updated_at trigger
create or replace function public.handle_milestones_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_milestones_updated_at on public.milestones;
create trigger set_milestones_updated_at
  before update on public.milestones
  for each row execute function public.handle_milestones_updated_at();

-- Enable RLS
alter table public.milestones enable row level security;

-- Public: read milestones
drop policy if exists "Public read milestones" on public.milestones;
create policy "Public read milestones"
on public.milestones for select
using (true);

-- Service role: full access
drop policy if exists "Service role full access for milestones" on public.milestones;
create policy "Service role full access for milestones"
on public.milestones for all
using (true)
with check (true);

-- Seed timeline milestones
insert into public.milestones (year, title, description, display_order) values
  ('2023', 'The Seed of an Idea', 'While working as a Product Manager at Amazon, Asfarul Huda began thinking seriously about the entrepreneur journey. He saw a consistent pattern — founders with genuine ideas struggling to find partners who could actually build. The idea for a product studio that could bridge that gap began to take shape.', 0),
  ('2024', 'The First Client — and the First Lesson', 'Premier Review became CrestCode''s first client, seeking strategic guidance as an early-stage startup. That engagement crystallized two foundational truths: founders don''t just need builders — they need someone who will challenge them, hold them accountable, and earn their trust. Those two pillars — execution and trust — became the foundation of everything CrestCode stands for.', 1),
  ('2025', 'CrestCode Launches', 'With a clear model and a founding team in place, CrestCode USA officially launched as a venture studio — offering end-to-end product building for founders and business owners. The mission: be the partner that turns ambitious ideas and real-world problems into products people actually use.', 2),
  ('TODAY', 'Three Products. One Studio. A Growing Portfolio.', 'CrestCode now has three active products in market — Dockly, OpenCapFi, and Vhoas — alongside strategic partnerships with Premier Review and CastleGEC. The studio is growing its team, its network, and its ambition.', 3)
on conflict do nothing;
