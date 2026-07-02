-- ============================================================
-- CrestCode Idea Validator — Supabase Table Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. USER PROFILES TABLE (Existing 'profiles' table)
-- Stores name + email of every registered user for easy viewing
-- Auto-populated via a trigger when a user signs up via Supabase Auth
-- Note: If you already have the 'profiles' table created as shown in your schema, 
-- you do not need to run this CREATE TABLE block.
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger function: auto-create profile row on new auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
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
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON profiles USING (true) WITH CHECK (true);



-- ============================================================
-- 2. DUE DILIGENCE REPORTS TABLE
-- Stores every submitted idea report (AI or mock)
-- ============================================================
CREATE TABLE IF NOT EXISTS dd_reports (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  overall_score NUMERIC(4, 2),
  verdict TEXT,
  is_mock BOOLEAN DEFAULT FALSE,
  report_data JSONB NOT NULL
);

-- RLS for dd_reports
ALTER TABLE dd_reports ENABLE ROW LEVEL SECURITY;
-- Service role (used by server) has full access
CREATE POLICY "Service role full access" ON dd_reports USING (true) WITH CHECK (true);


-- ============================================================
-- 3. IDEA SUBMISSIONS TABLE
-- Captures lead details (name, email, idea) when AI engine fails
-- ============================================================
CREATE TABLE IF NOT EXISTS idea_submissions (
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
ALTER TABLE idea_submissions ENABLE ROW LEVEL SECURITY;
-- Service role (used by server) has full access
CREATE POLICY "Service role full access" ON idea_submissions USING (true) WITH CHECK (true);


-- ============================================================
-- LEGACY: scoring_results (kept for backwards compatibility)
-- ============================================================
CREATE TABLE IF NOT EXISTS scoring_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  idea_text TEXT,
  report JSONB NOT NULL
);

ALTER TABLE scoring_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous inserts" ON scoring_results
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON scoring_results
  FOR SELECT USING (true);
