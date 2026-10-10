import { Router } from 'express';
import { requireFirebaseIdentity } from './firebaseIdentity.js';

export function memoryRouter({ verify, store }) {
  const router = Router();
  router.use(requireFirebaseIdentity(verify));
  router.use((req, res, next) => { res.setHeader('Cache-Control', 'private, no-store'); next(); });
  const failures = {
    invalid_memory: [400, 'Invalid saved-memory request.'],
    memory_conflict: [409, 'Memory changed on another device. Reload it before saving.'],
    memory_unconfigured: [503, 'Database memory setup is incomplete.'],
    memory_schema_missing: [503, 'Database memory table is not configured.'],
    memory_unavailable: [503, 'Database memory is temporarily unavailable.'],
  };
  const fail = (error, res) => {
    const code = Object.hasOwn(failures, error?.code || '') ? error.code : 'memory_unavailable';
    const [status, message] = failures[code];
    res.status(status).json({ error: message, code });
  };
  router.get('/', async (req, res) => {
    try { res.json(await store.read(req.identity.uid)); } catch (error) { fail(error, res); }
  });
  router.put('/', async (req, res) => {
    try { res.json(await store.write(req.identity.uid, req.body)); } catch (error) { fail(error, res); }
  });
  return router;
}
