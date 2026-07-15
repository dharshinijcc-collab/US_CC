-- ============================================================
-- Site Content Table Migration
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.site_content (
  id              serial PRIMARY KEY,
  content_key     text UNIQUE,
  payload         jsonb,
  active          boolean DEFAULT true,
  created_at      timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Row Level Security
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Public: anyone can read active site configs
DROP POLICY IF EXISTS "Public can read site_content" ON public.site_content;
CREATE POLICY "Public can read site_content"
  ON public.site_content FOR SELECT
  USING (active = true);

-- Service role full access
DROP POLICY IF EXISTS "Service role full access for site_content" ON public.site_content;
CREATE POLICY "Service role full access for site_content"
  ON public.site_content FOR ALL
  USING (true)
  WITH CHECK (true);
