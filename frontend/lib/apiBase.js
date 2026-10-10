// Local browsers call /api through Vite; the dev server forwards it to the API.
// Production builds keep the explicitly configured backend base URL.
export function apiBaseUrl(configured, development = false) {
  return development ? '' : (configured?.trim() || 'http://localhost:4000').replace(/\/+$/, '');
}
