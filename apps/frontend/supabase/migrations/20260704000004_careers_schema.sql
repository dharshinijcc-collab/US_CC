-- Create open_positions table
create table if not exists public.open_positions (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  location        text not null default 'Chennai, TN',
  type            text not null default 'Full Time',
  experience      text not null,
  category        text not null, -- 'Engineering', 'Design'
  apply_link      text default 'mailto:careers@crestcode.usa',
  is_active       boolean not null default true,
  display_order   integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Auto-update updated_at trigger
create or replace function public.handle_open_positions_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_open_positions_updated_at on public.open_positions;
create trigger set_open_positions_updated_at
  before update on public.open_positions
  for each row execute function public.handle_open_positions_updated_at();

-- Enable RLS
alter table public.open_positions enable row level security;

-- Public: read active positions
drop policy if exists "Public read active positions" on public.open_positions;
create policy "Public read active positions"
on public.open_positions for select
using (is_active = true);

-- Service role: full access
drop policy if exists "Service role full access for open_positions" on public.open_positions;
create policy "Service role full access for open_positions"
on public.open_positions for all
using (true)
with check (true);

-- Seed default jobs
insert into public.open_positions (title, location, type, experience, category, display_order, apply_link) values
  ('Frontend Developer', 'Chennai, TN', 'Full Time', 'Mid-Level (2-3 Yrs)', 'Engineering', 0, 'mailto:careers@crestcode.usa'),
  ('Backend Developer', 'Chennai, TN', 'Full Time', 'Mid-Level (2-3 Yrs)', 'Engineering', 1, 'mailto:careers@crestcode.usa'),
  ('Product Designer', 'Chennai, TN', 'Full Time', 'Entry-Level', 'Design', 2, 'mailto:careers@crestcode.usa')
on conflict do nothing;
