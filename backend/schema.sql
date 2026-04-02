-- Run this entire file in Supabase SQL Editor

-- 1. User profiles (linked to Firebase UID)
CREATE TABLE IF NOT EXISTS profiles (
  id        TEXT PRIMARY KEY,        -- Firebase UID
  email     TEXT NOT NULL,
  role      TEXT NOT NULL DEFAULT 'citizen'
              CHECK (role IN ('attorney', 'judge', 'citizen')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Chat sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title      TEXT NOT NULL DEFAULT 'New Consultation',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Messages
CREATE TABLE IF NOT EXISTS messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  sender     TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_sessions_user ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id);
