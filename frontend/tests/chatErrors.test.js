import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chatReplyError, rateLimitDeadline, rateLimitNotice, chatRequestAllowed, cooldownAfterReply } from '../lib/chatErrors.js';
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
