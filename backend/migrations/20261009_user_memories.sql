-- Run in the Supabase SQL editor. Non-destructive: creates only a new private table.
-- One durable memory document per verified Firebase owner, shared across chats.
-- No TTL or automatic expiration. Owner edits/clears memory through the API.
BEGIN;
CREATE TABLE IF NOT EXISTS public.user_memories (
  owner_id TEXT PRIMARY KEY CHECK (length(owner_id) BETWEEN 1 AND 128),
  memory JSONB NOT NULL CHECK (jsonb_typeof(memory) = 'object' AND octet_length(memory::text) <= 12000),
  revision BIGINT NOT NULL DEFAULT 1 CHECK (revision > 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_memories ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.user_memories FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.user_memories TO service_role;
COMMENT ON TABLE public.user_memories IS 'Private selective memories. Access only through the API after Firebase token verification; owner_id is taken from verified token sub, never a caller-provided UID.';
COMMIT;
