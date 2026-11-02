import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chatStatusLabel } from '../../shared/chatPresentation.js';

test('older-server operational messages never become public loading labels', () => {
  for (const text of [
    'The main model is busy. Trying another model…',
    'Training other models',
    'Supabase is responding now, but Render is still serving the older backend revision.',
    'Tavily is unavailable. Trying Groq search…',
    'secret account details',
  ]) {
    const label = chatStatusLabel({ text }, 'en');
    assert.equal(label, 'Preparing your answer…');
    assert.doesNotMatch(label, /model|train|Supabase|Render|Tavily|Groq|secret/i);
  }
  assert.equal(chatStatusLabel({ webSearch: true, text: 'Private diagnostics' }), 'Checking sources…');
  assert.match(chatStatusLabel(null, 'rw'), /igisubizo/);
  assert.match(chatStatusLabel(null, 'fr'), /réponse/);
});
