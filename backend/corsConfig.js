const localOrigin = 'http://localhost:5173';

// Match exact origins. Deployment URLs may include a trailing slash or path.
// Never grant every Vercel deployment access to account requests.
export function configuredCorsOrigins(frontendUrl = '') {
  const origins = new Set([localOrigin]);
  for (const entry of frontendUrl.split(',')) {
    const value = entry.trim();
    if (!value) continue;
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.hostname.includes('*')) {
      throw new Error('FRONTEND_URL must contain HTTP or HTTPS frontend URLs without credentials or wildcards.');
    }
    origins.add(url.origin);
  }
  return [...origins];
}
