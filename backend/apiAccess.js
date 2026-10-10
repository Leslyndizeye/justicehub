import { requireFirebaseIdentity } from './firebaseIdentity.js';

export function apiAccess({ verify, profile, ownsSession }) {
  const identify = requireFirebaseIdentity(verify);
  return async (req, res, next) => {
    identify(req, res, async () => {
      try {
        const uid = req.identity.uid;
        // Express routes are case-insensitive and allow a trailing slash by default.
        const path = req.path.replace(/\/+$/, '') || '/';
        const adminRoute = /^\/admin(?:\/|$)/i.test(path) || req.method === 'PATCH' && /^\/users\/[^/]+\/role$/i.test(path);
        const ownerRoute = /^\/(?:users|sessions)\/([^/]+)$/i.exec(path);
        if (ownerRoute && req.method === 'GET' && decodeURIComponent(ownerRoute[1]) !== uid) return res.status(403).json({ error: 'This account is not yours.' });
        if (req.method === 'POST' && ['/users', '/sessions', '/chat'].includes(path.toLowerCase()) && req.body?.uid != null && req.body.uid !== uid) return res.status(403).json({ error: 'This account is not yours.' });
        if (adminRoute || path.toLowerCase() === '/chat') {
          const account = await profile(uid);
          if (adminRoute && account?.role !== 'admin') return res.status(403).json({ error: 'Administrator access required.' });
          req.accountRole = account?.role || 'citizen';
        }
        const sessionRoute = req.method === 'GET' ? /^\/messages\/([^/]+)$/i.exec(path)
          : req.method === 'DELETE' ? /^\/sessions\/([^/]+)$/i.exec(path) : null;
        if (sessionRoute && !await ownsSession(decodeURIComponent(sessionRoute[1]), uid)) return res.status(404).json({ error: 'Conversation not found.' });
        next();
      } catch {
        res.status(503).json({ error: 'Account access could not be verified. Try again.' });
      }
    });
  };
}
