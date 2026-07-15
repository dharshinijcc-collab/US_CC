-- ============================================================
-- Idea Validator Tables Migration
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger function: auto-create profile row on new auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON public.profiles;
CREATE POLICY "Service role full access" ON public.profiles FOR ALL USING (true) WITH CHECK (true);


-- 2. DUE DILIGENCE REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.dd_reports (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  overall_score NUMERIC(4, 2),
  verdict TEXT,
  is_mock BOOLEAN DEFAULT FALSE,
  report_data JSONB NOT NULL
);

-- RLS for dd_reports
ALTER TABLE public.dd_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON public.dd_reports;
CREATE POLICY "Service role full access" ON public.dd_reports FOR ALL USING (true) WITH CHECK (true);


-- 3. IDEA SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.idea_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT,
  email TEXT,
  idea TEXT,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'reviewed', 'accepted', 'rejected', 'contacted')),
  status_updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  last_notification_sent TIMESTAMP WITH TIME ZONE,
  notification_type TEXT
);

-- RLS for idea_submissions
ALTER TABLE public.idea_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON public.idea_submissions;
CREATE POLICY "Service role full access" ON public.idea_submissions FOR ALL USING (true) WITH CHECK (true);


-- 4. SCORING RESULTS TABLE (Backwards compatibility)
CREATE TABLE IF NOT EXISTS public.scoring_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  idea_text TEXT,
  report JSONB NOT NULL
);

-- RLS for scoring_results
ALTER TABLE public.scoring_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.scoring_results;
CREATE POLICY "Allow anonymous inserts" ON public.scoring_results FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select" ON public.scoring_results;
CREATE POLICY "Allow public select" ON public.scoring_results FOR SELECT USING (true);
