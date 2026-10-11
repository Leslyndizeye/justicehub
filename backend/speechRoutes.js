import { Router } from 'express';

// Mounted after apiAccess: identity is verified before any speech-provider call.
export function speechRouter({ provider }) {
  const router = Router();
  router.use((req, res, next) => {
    res.setHeader('Cache-Control', 'private, no-store');
    if (!req.identity?.uid) return res.status(401).json({ code: 'invalid_identity' });
    next();
  });
  router.post('/', async (req, res) => {
    const controller = new AbortController();
    const cancel = () => { if (!res.writableEnded) controller.abort(); };
    res.on('close', cancel);
    try {
      const audio = await provider.generate(req.identity.uid, req.body, controller.signal, async chunk => {
        controller.signal.throwIfAborted();
        if (!res.headersSent) {
          res.setHeader('Content-Type', 'audio/pcm');
          res.setHeader('Cache-Control', 'private, no-store, no-transform');
          res.setHeader('X-Accel-Buffering', 'no');
        }
        if (!res.write(chunk)) await new Promise((resolve, reject) => {
          const clean = () => { res.off('drain', drain); res.off('close', closed); };
          const drain = () => { clean(); resolve(); };
          const closed = () => { clean(); reject(new Error('Audio request closed')); };
          res.once('drain', drain); res.once('close', closed);
        });
      });
      if (!controller.signal.aborted) {
        if (req.body.stream === true) res.end();
        else res.type('audio/wav').send(audio);
      }
    } catch (error) {
      if (controller.signal.aborted) return;
      if (res.headersSent) { res.destroy(); return; }
      const code = ['invalid_speech', 'speech_unconfigured', 'speech_rate_limited', 'speech_busy'].includes(error?.code)
        ? error.code : 'speech_unavailable';
      const status = code === 'invalid_speech' ? 400 : ['speech_rate_limited', 'speech_busy'].includes(code) ? 429 : 503;
      if (status === 429) res.setHeader('Retry-After', String(error.retryAfterSeconds || 60));
      res.status(status).json({ code, ...(status === 429 ? { retryAfterSeconds: error.retryAfterSeconds || 60 } : {}) });
    } finally { res.off('close', cancel); }
  });
  return router;
}
