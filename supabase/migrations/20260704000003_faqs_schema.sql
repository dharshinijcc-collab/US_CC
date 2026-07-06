-- Create faqs table
create table if not exists public.faqs (
  id              uuid primary key default gen_random_uuid(),
  category        text not null, -- 'engagement', 'product', 'security'
  question        text not null,
  answer          text not null,
  is_active       boolean not null default true,
  display_order   integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Auto-update updated_at trigger
create or replace function public.handle_faqs_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_faqs_updated_at on public.faqs;
create trigger set_faqs_updated_at
  before update on public.faqs
  for each row execute function public.handle_faqs_updated_at();

-- Enable RLS
alter table public.faqs enable row level security;

-- Public: read active faqs
drop policy if exists "Public read active faqs" on public.faqs;
create policy "Public read active faqs"
on public.faqs for select
using (is_active = true);

-- Service role: full access
drop policy if exists "Service role full access for faqs" on public.faqs;
create policy "Service role full access for faqs"
on public.faqs for all
using (true)
with check (true);

-- Seed existing FAQs
insert into public.faqs (category, question, answer, display_order) values
  ('engagement', 'What is your typical engagement process?', 'Our process begins with a deep-dive discovery phase to align on goals. We then move into agile development cycles featuring bi-weekly demos, transparent roadmaps, and continuous feedback loops to ensure alignment at every step.', 0),
  ('engagement', 'Who owns the intellectual property?', 'Upon completion and final payment, you retain 100% ownership of all source code, designs, and intellectual property generated during the engagement.', 1),
  ('product', 'How long does it take to build an MVP?', 'A typical MVP takes between 12 to 20 weeks depending on complexity, integrations, and feature scope.', 0),
  ('product', 'What technology stack do you use?', 'We specialize in modern, scalable stacks including React/Next.js for frontend, Node.js or Python for backend, and PostgreSQL for databases, hosted on AWS or GCP.', 1),
  ('security', 'How do you handle data security?', 'We implement industry-standard security practices including encryption at rest and in transit, regular security audits, and compliance with data protection regulations.', 0),
  ('security', 'What support do you provide after launch?', 'We offer SLA-backed maintenance packages, ongoing feature iteration cycles, and proactive infrastructure monitoring to ensure your product scales seamlessly.', 1)
on conflict do nothing;
