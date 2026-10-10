import { publicSearchPlan, normalizeSearchSources } from './externalSearch.js';

const legalDomains = ['minijust.gov.rw', 'rra.gov.rw', 'rib.gov.rw', 'police.gov.rw', 'parliament.gov.rw', 'judiciary.gov.rw', 'rwandalii.org'];

/** Fail closed: a failed/free-plan/allowance check never starts a billable search. */
export function freeSearchAllowance(payload, limit = 900) {
  const account = payload?.account;
  const key = payload?.key;
  if (!account || !key) return { reason: 'usage' };
  // Free accounts can report null limits. A null PAYG limit does not prove
  // PAYG is disabled; only permit requests within the finite free allowance.
  if (!['free', 'researcher'].includes(String(account.current_plan).toLowerCase()) || ![0, null].includes(account.paygo_limit) || account.paygo_usage !== 0) return { reason: 'plan' };
  if (![account.plan_usage, account.plan_limit, key.usage].every(value => Number.isFinite(value) && value >= 0) || (key.limit !== null && !(Number.isFinite(key.limit) && key.limit >= 0))) return { reason: 'usage' };
  if (account.plan_limit > 1000) return { reason: 'plan' };
  // Tavily documents null key.limit as no separate per-key cap. The account
  // allowance and application ceiling still apply, including other key usage.
  const keyRemaining = key.limit === null ? Infinity : Math.max(0, key.limit - key.usage);
  const remaining = Math.min(Math.max(0, Math.min(limit, account.plan_limit) - account.plan_usage), keyRemaining);
  return remaining >= 1 ? { remaining } : { reason: 'quota' };
}

export function createTavilySearch({ apiKey, fetchImpl = fetch, now = Date.now, monthlyLimit = 900, cacheTtlMs = 15 * 60 * 1000 } = {}) {
  const cap = Math.min(1000, Math.max(0, Number.isFinite(Number(monthlyLimit)) ? Math.floor(Number(monthlyLimit)) : 900));
  const cache = new Map();
  let queue = Promise.resolve();
  let blockedUntil = 0;
  let blockedReason = 'unavailable';
  let budgetMonth = '';
  let reservedUsage = 0;
  const failure = (reason, status = 'blocked') => ({ status, reason, sources: [] });

  async function jsonRequest(path, body, signal) {
    const timeout = AbortSignal.timeout(path === 'usage' ? 10000 : 15000);
    const requestSignal = signal ? AbortSignal.any([signal, timeout]) : timeout;
    const response = await fetchImpl(`https://api.tavily.com/${path}`, { method: body ? 'POST' : 'GET', redirect: 'error', headers: { Authorization: `Bearer ${apiKey}`, ...(body ? { 'Content-Type': 'application/json' } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}), signal: requestSignal });
    if (!response.ok) throw Object.assign(new Error('Search provider request failed'), { status: response.status });
    const text = await response.text();
    if (text.length > 2000000) throw new Error('Search response too large');
    return JSON.parse(text);
  }

  return {
    async lookup({ message, history = [], signal } = {}) {
      signal?.throwIfAborted();
      const plan = publicSearchPlan(message, history);
      if (!plan) return { status: 'not_needed', sources: [] };
      if (!apiKey?.trim()) return failure('missing_key', 'unconfigured');
      const cacheKey = JSON.stringify(plan);
      const work = queue.then(async () => {
        signal?.throwIfAborted();
        const saved = cache.get(cacheKey);
        if (saved && now() - saved.savedAt < cacheTtlMs) return { ...saved.result, status: 'cached' };
        if (blockedUntil > now()) return failure(blockedReason);
        let stage = 'usage';
        try {
          const usage = await jsonRequest('usage', null, signal);
          const allowance = freeSearchAllowance(usage, cap);
          if (allowance.reason) return failure(allowance.reason);
          const month = new Date(now()).toISOString().slice(0, 7);
          if (budgetMonth !== month) { budgetMonth = month; reservedUsage = 0; }
          reservedUsage = Math.max(reservedUsage, usage.account.plan_usage);
          if (reservedUsage + 1 > Math.min(cap, usage.account.plan_limit)) return failure('quota');
          signal?.throwIfAborted();
          // Reserve before POST, including ambiguous network failures; stale usage
          // responses must not let this process repeatedly spend the same credit.
          reservedUsage++;
          stage = 'search';
          const response = await jsonRequest('search', {
            query: plan.query, topic: plan.topic, search_depth: 'basic', auto_parameters: false,
            max_results: 3, include_answer: false, include_raw_content: 'text', include_images: false,
            include_published_date: true, include_usage: true,
            ...(plan.legal ? { include_domains: legalDomains, include_domains_mode: 'restrict' } : {}),
          }, signal);
          signal?.throwIfAborted();
          if (response.usage?.credits !== 1) {
            if (Number.isFinite(response.usage?.credits) && response.usage.credits > 1) reservedUsage += response.usage.credits - 1;
            blockedReason = 'usage';
            blockedUntil = Date.UTC(new Date(now()).getUTCFullYear(), new Date(now()).getUTCMonth() + 1, 1);
            return failure('usage');
          }
          const sources = normalizeSearchSources(response.results, plan.legal);
          if (!sources.length) return failure('empty', 'empty');
          const result = { status: 'ok', sources, retrievedAt: new Date(now()).toISOString() };
          // Cache only evidence for the sanitized public query, never a personal reply.
          if (cache.size >= 100) cache.delete(cache.keys().next().value);
          cache.set(cacheKey, { savedAt: now(), result });
          return result;
        } catch (error) {
          signal?.throwIfAborted();
          blockedReason = [432, 433].includes(error.status) ? 'quota' : stage === 'usage' ? 'usage' : 'unavailable';
          blockedUntil = now() + 60000;
          return failure(blockedReason, 'unavailable');
        }
      });
      // All local requests share the account guard; cancellation does not poison the queue.
      queue = work.catch(() => {});
      return work;
    },
  };
}

export function configuredExternalSearch(env = process.env) {
  const provider = env.WEB_SEARCH_PROVIDER?.trim().toLowerCase() || 'tavily';
  if (!['tavily', 'none'].includes(provider)) throw new Error('WEB_SEARCH_PROVIDER must be tavily or none for this beta');
  if (provider === 'none') return { lookup: async ({ message, history }) => publicSearchPlan(message, history)
    ? { status: 'blocked', reason: 'unavailable', sources: [] }
    : { status: 'not_needed', sources: [] } };
  return createTavilySearch({ apiKey: env.TAVILY_API_KEY, monthlyLimit: Number(env.TAVILY_MONTHLY_LIMIT || 900) });
}
