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

test('retry notices omit quota and countdown details and disappear when the wait ends', () => {
  assert.equal(rateLimitNotice(3333),'Please try again shortly.');
  assert.equal(rateLimitNotice(2),'Please try again shortly.');
  assert.equal(rateLimitNotice(0),'');
  assert.equal(rateLimitNotice(-1),'');
  assert.match(rateLimitNotice(12, 'rw'), /Ongera/);
  assert.match(rateLimitNotice(12, 'fr'), /Réessayez/);
});

test('a rate-limit failure uses a brief message without quota terminology or unverified memory claims',()=>{
  for(const language of ['en','rw','fr']) {
    const failure=chatFailureNotice(chatReplyError({status:429,retryAfterSeconds:5}),language);
    assert.doesNotMatch(failure,/5|quota|usage limit|retry notice below|rugero ntarengwa|limite d’utilisation|memory|mémoire/i);
    for(const seconds of [5,0])assert.doesNotMatch(rateLimitNotice(seconds,language),/quota|usage limit|availability|memory|mémoire/i);
  }
  assert.match(chatFailureNotice({status:429}),/try again shortly/);
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

test('the published-source Rwanda overview stays usable without claiming that the AI quota recovered',()=>{
  const cooldown={until:678000,language:'en'};
  const question='so tell me about rwandans laws which are interesting ..?';
  assert.equal(chatRequestAllowed(question,cooldown,1000),true);
  assert.equal(cooldownAfterReply(question,cooldown),cooldown);
  assert.equal(chatRequestAllowed('What are the current Rwanda tax laws?',cooldown,1000),false);
  assert.equal(chatRequestAllowed('Tell me about Gacaca courts today',cooldown,1000),false);
});

test('the dated theft comparison stays available during cooldown but current and case-specific comparisons do not',()=>{
  const cooldown={until:678000,language:'en'};
  const message='so the punishments for simple theft and aggravated theft are the same ..? right';
  assert.equal(chatRequestAllowed(message,cooldown,1000),true);
  assert.equal(cooldownAfterReply(message,cooldown),cooldown);
  for(const question of ['Compare theft and aggravated theft under current law','Compare theft and aggravated theft for my client','Compare theft and aggravated theft in Kenya'])assert.equal(chatRequestAllowed(question,cooldown,1000),false);
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
