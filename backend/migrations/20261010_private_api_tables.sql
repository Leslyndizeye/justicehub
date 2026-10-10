-- Apply after the protected API has been deployed/configured with its service key.
-- Firebase identities are verified by the API, not by Supabase's anonymous client.
-- This migration changes access privileges only; it does not delete any data.
BEGIN;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.profiles, public.chat_sessions, public.messages FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.profiles, public.chat_sessions, public.messages TO service_role;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLE public.legal_documents FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.legal_documents TO service_role;
COMMIT;
