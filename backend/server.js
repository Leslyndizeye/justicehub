import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import supabase from './supabase.js';
import { createChatProvider, publicChatError } from './chatProvider.js';

const app = express();
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:5173']
  : ['http://localhost:5173'];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Our provider handles one fallback explicitly; do not let SDK retries multiply rate-limited requests.
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY, maxRetries: 0 });
const groqModel = process.env.GROQ_MODEL?.trim() || 'openai/gpt-oss-120b';
const chatProvider = createChatProvider({
  client: groq,
  model: groqModel,
  fallbackModel: process.env.GROQ_FALLBACK_MODEL?.trim() || 'openai/gpt-oss-20b',
  searchSetting: process.env.GROQ_WEB_SEARCH,
  reasoningEffort: process.env.GROQ_REASONING_EFFORT?.trim() || 'medium',
});

// ─── RAG: search Rwanda legal documents ──────────────────────
async function searchLegalDocs(query) {
  try {
    const { data } = await supabase
      .from('legal_documents')
      .select('title, category, content, year, source')
      .textSearch('content', query, { type: 'websearch', config: 'english' })
      .limit(4);
    return data || [];
  } catch {
    return [];
  }
}

// ─── USERS ───────────────────────────────────────────────────────────────────

// Create or update a user profile (called after Firebase login)
// IMPORTANT: never overwrite role for existing users — only set role on first creation
app.post('/api/users', async (req, res) => {
  const { uid, email, auth_provider } = req.body;
  if (!uid || !email) return res.status(400).json({ error: 'uid and email required' });

  // Check if profile already exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('id, role, auth_provider')
    .eq('id', uid)
    .single();

  if (existing) {
    // Profile exists: preserve role, only refresh email and auth_provider
    const { data, error } = await supabase
      .from('profiles')
      .update({ email, auth_provider: auth_provider || existing.auth_provider || 'password' })
      .eq('id', uid)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  // New profile: create with citizen role
  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: uid, email, role: 'citizen', auth_provider: auth_provider || 'password' })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Get a user profile
app.get('/api/users/:uid', async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.params.uid)
    .single();

  if (error) return res.status(404).json({ error: 'User not found' });
  res.json(data);
});

// Update user role
app.patch('/api/users/:uid/role', async (req, res) => {
  const { role } = req.body;
  const allowed = ['attorney', 'judge', 'citizen', 'admin'];
  if (!allowed.includes(role)) return res.status(400).json({ error: 'Invalid role' });

  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', req.params.uid)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ─── ADMIN ────────────────────────────────────────────────────────────────────

// GET /api/admin/stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    const [users, sessions, messages, docs] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('chat_sessions').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true }),
      supabase.from('legal_documents').select('*', { count: 'exact', head: true }),
    ]);
    res.json({
      totalUsers: users.count ?? 0,
      totalSessions: sessions.count ?? 0,
      totalMessages: messages.count ?? 0,
      totalDocuments: docs.count ?? 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/users
app.get('/api/admin/users', async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, role, auth_provider, created_at')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/admin/sessions
app.get('/api/admin/sessions', async (req, res) => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('id, title, created_at, updated_at, user_id, profiles(email, role)')
    .order('updated_at', { ascending: false })
    .limit(100);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/admin/documents
app.get('/api/admin/documents', async (req, res) => {
  const { data, error } = await supabase
    .from('legal_documents')
    .select('id, title, category, year, source')
    .order('category', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE /api/admin/documents/:id
app.delete('/api/admin/documents/:id', async (req, res) => {
  const { error } = await supabase
    .from('legal_documents')
    .delete()
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// GET /api/admin/messages
app.get('/api/admin/messages', async (req, res) => {
  const { data, error } = await supabase
    .from('messages')
    .select('id, content, sender, created_at, user_id, profiles(email, role, auth_provider), session_id, chat_sessions(title)')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE /api/admin/users/:uid
app.delete('/api/admin/users/:uid', async (req, res) => {
  await supabase.from('messages').delete().eq('user_id', req.params.uid);
  await supabase.from('chat_sessions').delete().eq('user_id', req.params.uid);
  const { error } = await supabase.from('profiles').delete().eq('id', req.params.uid);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ─── CHAT SESSIONS ────────────────────────────────────────────────────────────

// Get all sessions for a user
app.get('/api/sessions/:uid', async (req, res) => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', req.params.uid)
    .order('created_at', { ascending: false })
    .limit(25);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Create a new session
app.post('/api/sessions', async (req, res) => {
  const { uid, title } = req.body;
  if (!uid) return res.status(400).json({ error: 'uid required' });

  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({ user_id: uid, title: title || 'New Consultation' })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Delete a session and its messages
app.delete('/api/sessions/:sessionId', async (req, res) => {
  await supabase.from('messages').delete().eq('session_id', req.params.sessionId);
  const { error } = await supabase.from('chat_sessions').delete().eq('id', req.params.sessionId);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ─── MESSAGES ─────────────────────────────────────────────────────────────────

// Get all messages for a session
app.get('/api/messages/:sessionId', async (req, res) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('session_id', req.params.sessionId)
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ─── CHAT (main AI route) ─────────────────────────────────────────────────────

app.post('/api/chat', async (req, res) => {
  const { uid, sessionId, message, role } = req.body;
  const streaming = req.body.stream === true;
  if (typeof uid !== 'string' || !uid.trim() || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'uid and a nonempty message are required' });
  }

  const generation = new AbortController();
  let complete = false;
  let streamedReply = '';
  let activeSessionId = sessionId;
  let replySaved = false;
  let heartbeat;
  const onDisconnect = () => { if (!complete) generation.abort(); };
  res.on('close', onDisconnect);
  const sendEvent = (event, data) => {
    if (!res.destroyed && !res.writableEnded) res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    // 1. Create session if not provided
    if (!activeSessionId) {
      const { data: session, error: sessionErr } = await supabase
        .from('chat_sessions')
        .insert({ user_id: uid, title: message.slice(0, 60) })
        .select()
        .single();
      if (sessionErr) throw sessionErr;
      activeSessionId = session.id;
    } else {
      const { data: session, error: sessionErr } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('id', activeSessionId)
        .eq('user_id', uid)
        .maybeSingle();
      if (sessionErr) throw sessionErr;
      if (!session) return res.status(404).json({ error: 'Conversation not found for this user' });
    }

    // Load recent saved turns before inserting the current message.
    const { data: recentMessages, error: historyErr } = await supabase
      .from('messages')
      .select('content, sender')
      .eq('session_id', activeSessionId)
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(20);
    if (historyErr) throw historyErr;
    const history = (recentMessages || []).reverse();

    // 2. Save user message to Supabase
    const { error: userMessageErr } = await supabase.from('messages').insert({
      session_id: activeSessionId,
      user_id: uid,
      content: message,
      sender: 'user',
    });
    if (userMessageErr) throw userMessageErr;

    // Build conversational instructions and grounded reference context.
    const legalDocs = await searchLegalDocs(message);

    // Stream actual model tokens to the UI. JSON callers retain the existing API.
    if (streaming) {
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('X-Accel-Buffering', 'no');
      res.flushHeaders();
      sendEvent('session', { sessionId: activeSessionId });
      heartbeat = setInterval(() => {
        if (!res.destroyed && !res.writableEnded) res.write(': keepalive\n\n');
      }, 15000);
    }
    const aiText = await chatProvider.reply({
      message, role, history, legalDocs, streaming, signal: generation.signal,
      onEvent: (event, data) => {
        if (event === 'token') streamedReply += data.text;
        if (streaming) sendEvent(event, data);
      },
    });

    // 5. Save AI response to Supabase
    const { error: aiMessageErr } = await supabase.from('messages').insert({
      session_id: activeSessionId,
      user_id: uid,
      content: aiText,
      sender: 'ai',
    });
    if (aiMessageErr) throw aiMessageErr;
    replySaved = true;

    // 6. Update session title if it's the first message
    await supabase
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', activeSessionId);

    complete = true;
    if (streaming) {
      sendEvent('done', { reply: aiText, sessionId: activeSessionId });
      res.end();
    } else {
      res.json({ reply: aiText, sessionId: activeSessionId });
    }

  } catch (err) {
    if (generation.signal.aborted) {
      if (streaming && streamedReply.trim() && !replySaved && activeSessionId) {
        const { error } = await supabase.from('messages').insert({
          session_id: activeSessionId,
          user_id: uid,
          content: `${streamedReply.trim()}\n\n*Response stopped.*`,
          sender: 'ai',
        });
        if (error) console.error('Stopped reply could not be saved:', error.message);
      }
      return;
    }
    const publicError = publicChatError(err);
    console.error('Chat error:', err?.status || 'internal', err?.error?.error?.code || err?.error?.code || err?.code || 'request_failed');
    if (res.headersSent) {
      sendEvent('error', publicError);
      res.end();
    } else {
      if (publicError.retryAfterSeconds) res.setHeader('Retry-After', String(publicError.retryAfterSeconds));
      res.status(publicError.status).json(publicError);
    }
  } finally {
    clearInterval(heartbeat);
    res.off('close', onDisconnect);
  }
});

// ─── START ────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`JusticeHub backend running on http://localhost:${PORT}`));
