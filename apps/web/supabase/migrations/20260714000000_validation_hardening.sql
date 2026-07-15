-- ============================================================
-- Validation Hardening & Schema Integration Migration
-- Date: July 14, 2026
-- ============================================================

-- ── 1. ENSURE BASE TABLES EXIST ──────────────────────────────

-- Ensure public.blogs exists
CREATE TABLE IF NOT EXISTS public.blogs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text NOT NULL UNIQUE,
  title           text NOT NULL,
  excerpt         text NOT NULL,
  content         text NOT NULL,
  image_url       text,
  category        text NOT NULL DEFAULT 'Technology',
  author          text NOT NULL,
  read_time       text NOT NULL DEFAULT '3 min read',
  published_at    timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Ensure public.scoring_results exists
CREATE TABLE IF NOT EXISTS public.scoring_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  idea_text TEXT,
  report JSONB NOT NULL
);

-- ── 2. BACKFILL SOCIAL VALIDATION ENGINE (SVE) TABLES ─────────

-- SVE Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_text TEXT NOT NULL,
  idea_name TEXT,
  target_audience TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'collecting', 'analyzing', 'done', 'failed')),
  failed_stage TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SVE Sources table (social mentions)
CREATE TABLE IF NOT EXISTS public.sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  content TEXT,
  engagement INTEGER DEFAULT 0,
  posted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SVE Pain Points table
CREATE TABLE IF NOT EXISTS public.pain_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  pain_point TEXT NOT NULL,
  mentions INTEGER DEFAULT 0,
  severity INTEGER DEFAULT 1,
  confidence NUMERIC(4, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Join table for Pain Points and Sources (many-to-many)
CREATE TABLE IF NOT EXISTS public.pain_point_sources (
  pain_point_id UUID REFERENCES public.pain_points(id) ON DELETE CASCADE,
  source_id UUID REFERENCES public.sources(id) ON DELETE CASCADE,
  PRIMARY KEY (pain_point_id, source_id)
);

-- SVE Competitors table
CREATE TABLE IF NOT EXISTS public.competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  website TEXT,
  source_url TEXT,
  missing_features TEXT[], -- Array of features lacking
  confidence NUMERIC(4, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SVE Feature Requests table
CREATE TABLE IF NOT EXISTS public.features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  mentions INTEGER DEFAULT 0,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SVE Reports table (SVE validation summaries)
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  validation_score INTEGER NOT NULL,
  verdict TEXT NOT NULL,
  reasoning TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ── 3. PERFORMANCE INDEXES ────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_dd_reports_user_id ON public.dd_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_email ON public.submissions(email);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_sources_project_id ON public.sources(project_id);
CREATE INDEX IF NOT EXISTS idx_pain_points_project_id ON public.pain_points(project_id);
CREATE INDEX IF NOT EXISTS idx_competitors_project_id ON public.competitors(project_id);

-- ── 4. RLS LOCKDOWN POLICIES ──────────────────────────────────

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dd_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scoring_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pain_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pain_point_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 4.1. PROFILES Table Policies
DROP POLICY IF EXISTS "Service role full access" ON public.profiles;
CREATE POLICY "Allow users to read own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Allow users to update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id);

-- 4.2. DD_REPORTS Table Policies
DROP POLICY IF EXISTS "Service role full access" ON public.dd_reports;

CREATE POLICY "Allow anyone to insert reports"
  ON public.dd_reports FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow read own or anonymous reports"
  ON public.dd_reports FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Allow update own or anonymous reports"
  ON public.dd_reports FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 4.3. IDEA_SUBMISSIONS Table Policies
DROP POLICY IF EXISTS "Service role full access" ON public.idea_submissions;
CREATE POLICY "Allow anonymous lead inserts"
  ON public.idea_submissions FOR INSERT
  WITH CHECK (true);

-- 4.4. BLOGS Table Policies
DROP POLICY IF EXISTS "Public can read blogs" ON public.blogs;
CREATE POLICY "Public can read blogs"
  ON public.blogs FOR SELECT
  USING (true);

-- 4.5. SVE PROJECTS & CHILD TABLES Policies (Link project visibility to report ownership)
CREATE POLICY "Allow users to select own projects"
  ON public.projects FOR SELECT
  USING (id IN (SELECT id FROM public.dd_reports WHERE user_id = auth.uid() OR user_id IS NULL));

CREATE POLICY "Allow users to select own sources"
  ON public.sources FOR SELECT
  USING (project_id IN (SELECT id FROM public.dd_reports WHERE user_id = auth.uid() OR user_id IS NULL));

CREATE POLICY "Allow users to select own pain points"
  ON public.pain_points FOR SELECT
  USING (project_id IN (SELECT id FROM public.dd_reports WHERE user_id = auth.uid() OR user_id IS NULL));

CREATE POLICY "Allow users to select own competitors"
  ON public.competitors FOR SELECT
  USING (project_id IN (SELECT id FROM public.dd_reports WHERE user_id = auth.uid() OR user_id IS NULL));

CREATE POLICY "Allow users to select own features"
  ON public.features FOR SELECT
  USING (project_id IN (SELECT id FROM public.dd_reports WHERE user_id = auth.uid() OR user_id IS NULL));

CREATE POLICY "Allow users to select own reports"
  ON public.reports FOR SELECT
  USING (project_id IN (SELECT id FROM public.dd_reports WHERE user_id = auth.uid() OR user_id IS NULL));
