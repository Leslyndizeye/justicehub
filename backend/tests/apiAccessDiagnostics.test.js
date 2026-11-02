import { test } from 'node:test';
import assert from 'node:assert/strict';
import { apiAccessDiagnostic } from '../apiAccessDiagnostics.js';

test('database access diagnostics recognize native and serialized DNS failures without revealing account data', () => {
  const cause = Object.assign(new Error('getaddrinfo ENOTFOUND private-project.supabase.co'), { code: 'ENOTFOUND' });
  for (const error of [
    new TypeError('fetch failed', { cause }),
    { code: '', message: 'TypeError: fetch failed', details: 'Error: getaddrinfo ENOTFOUND private-project.supabase.co; Bearer secret-token; owner alice@example.com' },
  ]) {
    const diagnostic = apiAccessDiagnostic(error, 'profile');
    assert.deepEqual(diagnostic, { stage: 'profile', reason: 'database_dns_failed', causeCode: 'ENOTFOUND' });
    assert.doesNotMatch(JSON.stringify(diagnostic), /private-project|secret-token|alice|Bearer/);
  }
});

test('database access diagnostics distinguish permissions, schema, credentials, timeouts and connection errors', () => {
  for (const [error, reason] of [
    [{ code: '42501', message: 'permission denied' }, 'database_permission_denied'],
    [{ code: '42P01' }, 'database_schema_missing'],
    [{ code: 'PGRST205' }, 'database_schema_missing'],
    [{ code: 'PGRST301' }, 'database_credentials'],
    [{ message: 'Invalid API key' }, 'database_credentials'],
    [Object.assign(new Error(), { name: 'TimeoutError' }), 'database_timeout'],
    [{ message: 'TypeError: fetch failed', details: 'TimeoutError: operation aborted' }, 'database_timeout'],
    [{ cause: { code: 'ECONNRESET' } }, 'database_connection_failed'],
    [new Error('Unexpected private account data'), 'account_lookup_failed'],
  ]) assert.equal(apiAccessDiagnostic(error, 'session_ownership').reason, reason);
  assert.deepEqual(apiAccessDiagnostic({ code: 'secret-token' }, '/messages/private-id'), { stage: 'request', reason: 'account_lookup_failed' });
});
