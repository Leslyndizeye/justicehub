import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chatReplyError, chatFailureNotice, rateLimitDeadline, rateLimitNotice, chatRequestAllowed, cooldownAfterReply } from '../lib/chatErrors.js';
import { casualReply } from '../../shared/chatCasual.js';

test('only rate-limit errors with a valid duration establish a cooldown', () => {
  assert.equal(rateLimitDeadline(chatReplyError({ status: 429, error: 'Limited', retryAfterSeconds: 12 }), 1000), 13000);
  for (const payload of [{ status: 500, retryAfterSeconds: 12 }, { status: 429 }, { status: 429, retryAfterSeconds: -1 }, { status: 429, retryAfterSeconds: 'invalid' }]) {
    assert.equal(rateLimitDeadline(chatReplyError(payload), 1000), 0);
  }
});

test('countdown labels use the response language and do not promise quota availability', () => {
  assert.match(rateLimitNotice(3333), /55:33/);
  assert.match(rateLimitNotice(2), /at least 2 s/);
  assert.match(rateLimitNotice(0), /may still be limited/);
  assert.match(rateLimitNotice(12, 'rw'), /Tegereza nibura 12/);
  assert.match(rateLimitNotice(12, 'fr'), /Attendez au moins 12/);
});

test('cooldown permits only shared model-free casual replies, not a substantive question added to one', () => {
  const cooldown = { until: 678000, language: 'rw' };
  for (const message of ['bimeze gute c', 'bimeze gutec?', 'amakuru c', 'how r u', 'okay okay gotchuuu', 'ok']) {
    assert.equal(chatRequestAllowed(message, cooldown, 1000), true, message);
    assert.ok(casualReply(message, 'auto'), message);
    assert.equal(cooldownAfterReply(message, cooldown), cooldown, message);
  }
  for (const message of ['Explain the current fraud law', 'bimeze gute c, mbwira amategeko', 'okay okay gotchuuu, what is the latest law?', 'okay `C`', 'amakuru mashya ku mategeko']) {
    assert.equal(chatRequestAllowed(message, cooldown, 1000), false, message);
    assert.equal(chatRequestAllowed(message, cooldown, 678000), true, message);
    assert.equal(chatRequestAllowed(message, null, 1000), true, message);
  }
  assert.equal(cooldownAfterReply('Explain the current fraud law', cooldown), null);
  assert.equal(cooldownAfterReply('bimeze gute c', null), null);
});

test('the reported everyday orientations stay usable during cooldown without clearing the model limit', () => {
  const cooldown = { until: 678000, language: 'en' };
  for (const message of ['i think i am sick', 'i am in love with someone is it legal in rwanda', 'can u tell me one law that sometimes we likely kill', 'so what do u think about the person killing another person']) {
    assert.equal(chatRequestAllowed(message, cooldown, 1000), true);
    assert.equal(cooldownAfterReply(message, cooldown), cooldown);
  }
  for (const message of ['search online for a law people sometimes kill', 'I am in love with someone who is fifteen. Is it legal?', 'Give me one law people commonly break']) {
    assert.equal(chatRequestAllowed(message, cooldown, 1000), false, message);
  }
});

test('account-access failures keep their safe code and do not masquerade as model quota or expired sign-in', () => {
  const error = chatReplyError({ status: 503, code: 'account_access_unavailable', error: 'Account access could not be verified. Try again.' });
  assert.equal(error.code, 'account_access_unavailable');
  assert.equal(rateLimitDeadline(error), 0);
  assert.match(chatFailureNotice(error), /account could not be checked/);
  assert.match(chatFailureNotice(error, 'rw'), /Konti/);
  assert.match(chatFailureNotice(error, 'fr'), /compte/);
  assert.equal(chatReplyError({ code: 'private_database_detail' }).code, undefined);
});

test('a completed but unsaved answer offers copying instead of reporting a failed model response', () => {
  const error = chatReplyError({ status: 503, code: 'reply_not_saved', error: 'Raw server diagnostics' });
  assert.match(chatFailureNotice(error), /Copy it before leaving/);
  assert.doesNotMatch(chatFailureNotice(error), /Raw|server|model|training/);
  assert.match(chatFailureNotice(chatReplyError({ status: 503, code: 'message_not_saved' })), /message could not be saved/);
});
