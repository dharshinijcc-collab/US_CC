-- Create submissions table
create table if not exists public.submissions (
  id                  uuid primary key default gen_random_uuid(),
  form_type           text not null, -- 'idea', 'talent', 'contact', 'investor'
  status              text not null default 'new' check (status in ('new', 'under_review', 'need_more_information', 'approved', 'rejected', 'contacted')),
  name                text not null,
  email               text not null,
  phone               text,
  company             text,
  payload             jsonb not null default '{}'::jsonb,
  assigned_reviewer   text,
  internal_notes      text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Enable RLS
alter table public.submissions enable row level security;

-- Policies
drop policy if exists "Service role full access for submissions" on public.submissions;
create policy "Service role full access for submissions"
on public.submissions for all
using (true)
with check (true);

drop policy if exists "Public insert access for submissions" on public.submissions;
create policy "Public insert access for submissions"
on public.submissions for insert
with check (true);


-- Create submission_notes table
create table if not exists public.submission_notes (
  id                  uuid primary key default gen_random_uuid(),
  submission_id       uuid not null references public.submissions(id) on delete cascade,
  note                text not null,
  created_by          text not null, -- admin email
  created_at          timestamptz not null default now()
);

-- Enable RLS
alter table public.submission_notes enable row level security;

-- Policies
drop policy if exists "Service role full access for submission_notes" on public.submission_notes;
create policy "Service role full access for submission_notes"
on public.submission_notes for all
using (true)
with check (true);


-- Create submission_status_history table
create table if not exists public.submission_status_history (
  id                  uuid primary key default gen_random_uuid(),
  submission_id       uuid not null references public.submissions(id) on delete cascade,
  previous_status     text,
  current_status      text not null,
  changed_by          text not null, -- admin email
  changed_at          timestamptz not null default now(),
  internal_notes      text
);

-- Enable RLS
alter table public.submission_status_history enable row level security;

-- Policies
drop policy if exists "Service role full access for submission_status_history" on public.submission_status_history;
create policy "Service role full access for submission_status_history"
on public.submission_status_history for all
using (true)
with check (true);
