import { createClient } from '@supabase/supabase-js';

// Only the verified/authorized API routes in server.js use this privileged client.
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for protected API access.');
export default createClient(process.env.SUPABASE_URL, key, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { fetch: (url, options = {}) => fetch(url, { ...options,
    signal: options.signal ? AbortSignal.any([options.signal, AbortSignal.timeout(10000)]) : AbortSignal.timeout(10000),
  }) },
});
