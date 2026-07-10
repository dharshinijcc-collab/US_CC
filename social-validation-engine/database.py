"""
database.py — Supabase client singleton.

All modules import `db` from here; they never instantiate their own clients.
The service-role key is used throughout because Phase 1 has no per-user auth
(RLS is stubbed permissive, per TDD §6 / schema.sql).
"""
from __future__ import annotations

from supabase import create_client, Client
from config import settings


def _create_supabase_client() -> Client:
    return create_client(
        settings.supabase_url,
        settings.supabase_service_role_key,
    )


# Module-level singleton — imported across the app
db: Client = _create_supabase_client()
