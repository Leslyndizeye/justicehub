import { createHash } from 'node:crypto';

export const speechVoices = ['Sulafat', 'Algieba'];
const model = 'gemini-3.8-flash-lite-tts';
const endpoint = 'https://generativelanguage.googleapis.com/v1beta/interactions';
const maxAudioBytes = 8 * 1024 * 1024;
const failure = (code, status = 503, retryAfterSeconds) => Object.assign(new Error('Speech is unavailable.'), { code, status, retryAfterSeconds });

export function validateSpeech(body) {
  if (!body || Object.keys(body).some(key => !['text', 'language', 'voice', 'consent'].includes(key))
    || typeof body.text !== 'string' || !body.text.trim() || body.text.length > 2400
    || !['rw', 'en', 'fr'].includes(body.language) || !speechVoices.includes(body.voice)
    || body.consent !== true) throw failure('invalid_speech', 400);
  return { text: body.text, language: body.language, voice: body.voice };
}

async function responseJson(response) {
  if (!response.body) throw failure('speech_unavailable');
  const reader = response.body.getReader();
  const parts = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.length;
      if (bytes > 12 * 1024 * 1024) throw failure('speech_unavailable');
      parts.push(value);
    }
    return JSON.parse(Buffer.concat(parts).toString('utf8'));
  } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
}

// Quotas and cache are per process. Free-only billing comes from using an unbilled
// Google project; an API key cannot verify or control its project's billing tier.
export function createSpeechProvider({ apiKey = '', freeTierConfirmed = false, dailyLimit = 30,
  fetchImpl = fetch, now = Date.now, timeoutMs = 45000 } = {}) {
  const key = apiKey.trim();
  const available = Boolean(key && freeTierConfirmed === true);
  const cap = Math.max(0, Math.min(100, Math.floor(Number(dailyLimit) || 0)));
  let day = '', attempts = 0, active = false, cooldownUntil = 0;
  const owners = new Map();
  const cache = new Map();
  let cacheBytes = 0;
  function cleanCache() {
    for (const [id, entry] of cache) if (entry.until <= now()) { cache.delete(id); cacheBytes -= entry.audio.length; }
  }
  return {
    available,
    async generate(uid, body, signal) {
      const input = validateSpeech(body);
      if (typeof uid !== 'string' || !uid) throw failure('invalid_identity', 401);
      if (!available) throw failure('speech_unconfigured');
      signal?.throwIfAborted();
      cleanCache();
      const id = createHash('sha256').update(JSON.stringify([uid, input])).digest('hex');
      if (cache.has(id)) return cache.get(id).audio;
      const today = new Date(now()).toISOString().slice(0, 10);
      if (day !== today) { day = today; attempts = 0; owners.clear(); }
      if (cooldownUntil > now()) throw failure('speech_rate_limited', 429, Math.ceil((cooldownUntil - now()) / 1000));
      if (active) throw failure('speech_busy', 429, 5);
      if (attempts >= cap || (owners.get(uid) || 0) >= Math.min(cap, 10)) {
        const reset = Date.parse(today + 'T00:00:00.000Z') + 86400000;
        throw failure('speech_rate_limited', 429, Math.max(1, Math.ceil((reset - now()) / 1000)));
      }
      attempts++;
      owners.set(uid, (owners.get(uid) || 0) + 1);
      active = true;
      const requestSignal = signal ? AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)]) : AbortSignal.timeout(timeoutMs);
      try {
        const response = await fetchImpl(endpoint, {
          method: 'POST', redirect: 'error', signal: requestSignal,
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
          body: JSON.stringify({ model, store: false, input: [{ type: 'user_input', content: [{
            type: 'text', text: input.text,
            annotations: [{ type: 'speech_metadata', style: 'Warm, calm, clear, conversational delivery at a steady pace.' }],
          }] }], response_format: { type: 'audio', mime_type: 'audio/wav' },
          generation_config: { speech_config: [{ voice: input.voice }] } }),
        });
        if (response.status === 429) {
          const seconds = Math.max(60, Math.min(86400, Number(response.headers.get('retry-after')) || 60));
          cooldownUntil = now() + seconds * 1000;
          await response.body?.cancel();
          throw failure('speech_rate_limited', 429, seconds);
        }
        if (!response.ok) { await response.body?.cancel(); throw failure('speech_unavailable'); }
        const data = await responseJson(response);
        const block = data.steps?.filter(step => step.type === 'model_output')
          .flatMap(step => step.content || []).filter(part => part.type === 'audio').at(-1);
        if (!block || block.mime_type !== 'audio/wav' || typeof block.data !== 'string'
          || !/^[A-Za-z0-9+/]+={0,2}$/.test(block.data)) throw failure('speech_unavailable');
        const audio = Buffer.from(block.data, 'base64');
        if (audio.length <= 44 || audio.length > maxAudioBytes || audio.toString('ascii', 0, 4) !== 'RIFF'
          || audio.toString('ascii', 8, 12) !== 'WAVE') throw failure('speech_unavailable');
        requestSignal.throwIfAborted();
        // Keep only bounded, short-lived audio for this owner. No database or disk writes.
        while (cache.size && (cache.size >= 12 || cacheBytes + audio.length > 24 * 1024 * 1024)) {
          const oldest = cache.keys().next().value;
          cacheBytes -= cache.get(oldest).audio.length;
          cache.delete(oldest);
        }
        cache.set(id, { audio, until: now() + 5 * 60 * 1000 });
        cacheBytes += audio.length;
        return audio;
      } catch (error) {
        if (signal?.aborted) throw signal.reason;
        if (['speech_rate_limited', 'speech_unavailable'].includes(error?.code)) throw error;
        throw failure('speech_unavailable');
      } finally { active = false; }
    },
  };
}

export function configuredSpeechProvider(env = process.env) {
  return createSpeechProvider({ apiKey: env.GEMINI_API_KEY || '',
    freeTierConfirmed: env.GEMINI_SPEECH_FREE_TIER?.trim().toLowerCase() === 'true',
    dailyLimit: env.GEMINI_SPEECH_DAILY_LIMIT ?? 30 });
}
