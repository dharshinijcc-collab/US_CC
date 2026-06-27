-- Supabase Table Schema for CrestCode Idea Validator & Due Diligence Platform
-- Run this SQL in your Supabase SQL Editor to create the necessary tables.

CREATE TABLE IF NOT EXISTS scoring_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  idea_text TEXT,
  report JSONB NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE scoring_results ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for the questionnaire
CREATE POLICY "Allow anonymous inserts" ON scoring_results 
  FOR INSERT WITH CHECK (true);

-- Allow public select
CREATE POLICY "Allow public select" ON scoring_results 
  FOR SELECT USING (true);
