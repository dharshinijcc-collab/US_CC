-- Create portfolio storage bucket
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- Ensure public select is allowed for portfolio bucket objects
drop policy if exists "Public Access to Portfolio" on storage.objects;
create policy "Public Access to Portfolio"
on storage.objects for select
using (bucket_id = 'portfolio');

-- Create partner_products table
create table if not exists public.partner_products (
  id              uuid primary key default gen_random_uuid(),
  name            text not null unique,
  status_type     text not null default 'live', -- 'live', 'beta', 'development'
  status_text     text not null default 'Live',
  status_subtext  text,
  tagline         text not null,
  subtitle        text not null,
  stat_value      text not null,
  stat_subtext    text not null,
  what_we_did     text not null,
  industry        text not null,
  duration        text not null,
  team_size       text not null,
  tech_stack      text[] not null default '{}',
  features        jsonb not null default '[]',
  gallery_images  jsonb not null default '[]', -- JSON array of screenshot URLs
  website_url     text,
  logo_url        text,
  is_active       boolean not null default true,
  display_order   integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Auto-update updated_at trigger
create or replace function public.handle_partner_products_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_partner_products_updated_at on public.partner_products;
create trigger set_partner_products_updated_at
  before update on public.partner_products
  for each row execute function public.handle_partner_products_updated_at();

-- Enable RLS
alter table public.partner_products enable row level security;

-- Public: read active products
drop policy if exists "Public read active partner products" on public.partner_products;
create policy "Public read active partner products"
on public.partner_products for select
using (is_active = true);

-- Service role: full access
drop policy if exists "Service role full access for partner_products" on public.partner_products;
create policy "Service role full access for partner_products"
on public.partner_products for all
using (true)
with check (true);

-- Seed default partner products
insert into public.partner_products (name, status_type, status_text, status_subtext, tagline, subtitle, stat_value, stat_subtext, what_we_did, industry, duration, team_size, tech_stack, features, website_url, logo_url, display_order) values
  (
    'Dockly',
    'live',
    'Live',
    'Web ready',
    'Family connectivity',
    'One connected platform to manage your life, simplified',
    '2,400+ families onboarded',
    'Within the first 90 days post-launch',
    'Scoped, designed, and built a unified family hub from scratch — shipping a live product in 4 months with a 3-person team.',
    'Family Tech / SaaS',
    '4 months',
    '3 members',
    array['Next.js', 'Node.js', 'Tailwind CSS'],
    '[{"text": "Planner & calendars"}, {"text": "Shared finances"}, {"text": "Secure vault"}]'::jsonb,
    'https://dockly.me/',
    'https://www.google.com/s2/favicons?sz=64&domain=dockly.me',
    0
  ),
  (
    'CastleGEC',
    'live',
    'Live',
    'Web ready',
    'Global education',
    'Study abroad & admissions consulting, simplified',
    '500+ student placements',
    'Secured in premier universities across the US and EU',
    'Designed and engineered a global education portal, unifying visa tracking and admissions counseling into one workflow for international students.',
    'EdTech / Consulting',
    '3 months',
    '2 members',
    array['Next.js', 'React', 'Tailwind CSS'],
    '[{"text": "University admissions"}, {"text": "Visa guidance"}, {"text": "Admissions insights"}]'::jsonb,
    'https://castlegec.com/',
    'https://www.google.com/s2/favicons?sz=64&domain=castlegec.com',
    1
  ),
  (
    'OpenCap',
    'beta',
    'Beta phase',
    null,
    'Trading analytics',
    'Trading analytics & prediction dashboard, simplified',
    '$12M+ monthly trading volume',
    'Processed through the prediction dashboard',
    'Developed high-frequency trading analytics dashboard and prediction models, enabling real-time portfolio tracking and option analytics.',
    'Fintech / Trading',
    '5 months',
    '4 members',
    array['React.js', 'Node.js', 'PostgreSQL'],
    '[{"text": "AI trade prediction"}, {"text": "Portfolio analytics"}, {"text": "Positions tracker"}]'::jsonb,
    null,
    null,
    2
  ),
  (
    'NestBloq',
    'development',
    'In development',
    null,
    'Partner operations',
    'B2B partner operations and workflow automation',
    '5+ active operations hubs',
    'Deployed for strategic partner products',
    'Designed and built the operations hub to orchestrate workflow management, delivery logistics, and service coordination for B2B partner products.',
    'B2B / Operations',
    '5 months',
    '3 members',
    array['Next.js', 'Node.js', 'PostgreSQL'],
    '[{"text": "Partner workspace"}, {"text": "Integration gateway"}, {"text": "Delivery flows"}]'::jsonb,
    null,
    null,
    3
  )
on conflict (name) do nothing;
