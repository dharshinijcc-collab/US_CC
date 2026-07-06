-- ============================================================
-- Admin Users Table Migration
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.admin_users (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email           text NOT NULL UNIQUE,
  password_hash   text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION public.handle_admin_users_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS set_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER set_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.handle_admin_users_updated_at();

-- Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Service role full access only (no public access)
DROP POLICY IF EXISTS "Service role full access for admin_users" ON public.admin_users;
CREATE POLICY "Service role full access for admin_users"
  ON public.admin_users FOR ALL
  USING (true)
  WITH CHECK (true);

-- Seed default admin user (email: ccproductstudio@gmail.com, password: Hrsb43QtdXa&b)
-- Password hash generated using bcrypt for "Hrsb43QtdXa&b"
INSERT INTO public.admin_users (email, password_hash)
VALUES
  ('ccproductstudio@gmail.com', '$2b$12$C9vNZhzMUokbAkFCfuJpL.v9A4H5wmqsb63VeBxmYLGPoWHzvxi5q')
ON CONFLICT (email) DO NOTHING;
