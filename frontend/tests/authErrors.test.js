import { test } from 'node:test';
import assert from 'node:assert/strict';
import { authErrorMessage } from '../lib/authErrors.js';

test('account failures provide useful recovery messages without exposing provider text', () => {
  const raw = 'Firebase: Error (auth/internal-error). https://private.example/?token=secret <script>debug stack</script>';
  for (const action of ['signup', 'login', 'forgot', 'google', 'confirmReset', 'resetLink']) {
    for (const error of [undefined, null, new Error(raw), {code:'auth/internal-error',message:raw}, {code:'permission-denied',message:raw}]) {
      const message = authErrorMessage(error, action);
      assert.ok(message.length > 20);
      assert.doesNotMatch(message, /Firebase|auth\/|private\.example|secret|<script>|stack|permission-denied/i);
    }
  }
  assert.match(authErrorMessage({code:'auth/email-already-in-use',message:raw}, 'signup'), /sign in or reset/);
  assert.match(authErrorMessage({code:'auth/network-request-failed',message:raw}, 'signup'), /internet connection/);
  assert.match(authErrorMessage({code:'auth/unauthorized-domain',message:raw}, 'google'), /temporarily unavailable/);
  assert.match(authErrorMessage({code:'auth/too-many-requests',message:raw}), /wait a few minutes/);
  assert.match(authErrorMessage({code:'auth/popup-blocked',message:raw}, 'google'), /Allow pop-ups/);
  assert.match(authErrorMessage({code:'auth/expired-action-code',message:raw}, 'confirmReset'), /request a new one/);
  assert.match(authErrorMessage({code:'auth/weak-password',message:raw}, 'signup'), /stronger password/);
  assert.match(authErrorMessage({code:'auth/invalid-email',message:raw}, 'signup'), /valid email address/);
  assert.equal(authErrorMessage({code:'auth/wrong-password'}), authErrorMessage({code:'auth/user-not-found'}));
  assert.equal(authErrorMessage({code:'auth/invalid-credential'}), authErrorMessage({code:'auth/user-not-found'}));
});

test('even recognized errors do not read the provider message', () => {
  const error = {code:'auth/invalid-credential', get message() { throw new Error('Provider message must not be accessed'); }};
  assert.match(authErrorMessage(error), /email or password/);
  error.code = 'auth/popup-closed-by-user';
  assert.match(authErrorMessage(error, 'google'), /cancelled/);
});
