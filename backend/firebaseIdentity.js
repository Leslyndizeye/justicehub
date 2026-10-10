import { decodeProtectedHeader, importX509, jwtVerify } from 'jose';

const certificateUrl = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
const invalid = () => Object.assign(new Error('Sign-in required'), { status: 401, code: 'invalid_identity' });
const unavailable = () => Object.assign(new Error('Sign-in verification unavailable'), { status: 503, code: 'identity_unavailable' });

export function createFirebaseIdentity({ projectId = 'ireme-30164', fetchImpl = fetch, now = Date.now, timeoutMs = 5000, importCertificate = importX509 } = {}) {
  let certificates = {};
  let expiresAt = 0;
  let refreshedAt = -Infinity;
  let pending;
  async function refresh() {
    if (pending) return pending;
    pending = (async () => {
      refreshedAt = now();
      const response = await fetchImpl(certificateUrl, { redirect: 'error', signal: AbortSignal.timeout(timeoutMs) });
      if (!response.ok) throw unavailable();
      const text = await response.text();
      if (text.length > 100000) throw unavailable();
      const values = JSON.parse(text);
      if (!values || typeof values !== 'object' || !Object.values(values).every(value => typeof value === 'string' && value.includes('BEGIN CERTIFICATE'))) throw unavailable();
      certificates = values;
      const ttl = Number(response.headers.get('cache-control')?.match(/max-age=(\d+)/)?.[1] || 60);
      expiresAt = now() + Math.min(ttl, 3600) * 1000;
    })();
    try { await pending; } catch { throw unavailable(); } finally { pending = null; }
  }
  return async function verify(token) {
    if (typeof token !== 'string' || token.length > 10000) throw invalid();
    let header;
    try { header = decodeProtectedHeader(token); } catch { throw invalid(); }
    if (header.alg !== 'RS256' || typeof header.kid !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(header.kid)) throw invalid();
    if (expiresAt <= now() || (!certificates[header.kid] && now() - refreshedAt > 30000)) await refresh();
    if (!Object.hasOwn(certificates, header.kid)) throw invalid();
    try {
      const key = await importCertificate(certificates[header.kid], 'RS256');
      const { payload } = await jwtVerify(token, key, { algorithms: ['RS256'], issuer: `https://securetoken.google.com/${projectId}`, audience: projectId,
        requiredClaims: ['exp', 'iat', 'auth_time', 'sub'], currentDate: new Date(now()) });
      const seconds = now() / 1000;
      if (payload.aud !== projectId || typeof payload.sub !== 'string' || !payload.sub.trim() || payload.sub.length > 128
        || !Number.isFinite(payload.iat) || payload.iat < 0 || payload.iat > seconds
        || !Number.isFinite(payload.auth_time) || payload.auth_time < 0 || payload.auth_time > seconds
        || payload.exp <= payload.iat || payload.user_id != null && payload.user_id !== payload.sub) throw invalid();
      return { uid: payload.sub, ...(typeof payload.email === 'string' ? { email: payload.email } : {}) };
    } catch { throw invalid(); }
  };
}

export function requireFirebaseIdentity(verify) {
  return async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (typeof authorization !== 'string' || !/^Bearer [^\s]+$/i.test(authorization)) return res.status(401).json({ error: 'Sign in to access JusticeHub.', code: 'invalid_identity' });
    try { req.identity = await verify(authorization.slice(7)); next(); }
    catch (error) { res.status(error.status === 503 ? 503 : 401).json({ error: error.status === 503 ? 'Sign-in verification is unavailable. Please retry.' : 'Your sign-in has expired. Please sign in again.', code: error.code }); }
  };
}
