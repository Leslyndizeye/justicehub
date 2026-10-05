import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSearchTracker, searchOptions, webSearchEnabled } from '../chatSearch.js';
import { buildChatMessages } from '../chatPrompt.js';

test('forces live lookup for news and explicit web searches, permits ordinary conversation', () => {
  for (const message of ['What is the latest news in Rwanda?', 'Search the internet for Better Call Saul', 'Check online sources for this law', 'What happened today?']) {
    assert.equal(searchOptions('openai/gpt-oss-120b', message).tool_choice, 'required');
  }
  assert.equal(searchOptions('openai/gpt-oss-120b', 'Do you know Better Call Saul?').tool_choice, 'auto');
  assert.deepEqual(searchOptions('openai/gpt-oss-20b', 'hello').tools, [{ type: 'browser_search' }]);
});

test('does not attach unsupported tools when disabled or changing models', () => {
  assert.equal(webSearchEnabled('openai/gpt-oss-120b', ' FALSE '), false);
  assert.deepEqual(searchOptions('openai/gpt-oss-120b', 'latest news', 'false'), {});
  assert.deepEqual(searchOptions('another-model', 'latest news'), {});
});

function results() {
  const tracker = createSearchTracker();
  tracker.observe([{ name: 'browser.search', search_results: { results: [
    { title: 'Verified story', url: 'https://news.example/story' },
    { title: 'Unopened story', url: 'https://news.example/other' },
    { title: 'Unsafe', url: 'javascript:alert(1)' },
  ] } }]);
  tracker.observe([{ name: 'browser.open', index: 1, output: 'L0: \nL1: URL: https://news.example/story\nL2: Story' }]);
  return tracker;
}

test('maps browser citation markers to actual opened source links', () => {
  assert.equal(results().finish('The story. 〖1†L6-L10〗'), 'The story. [Verified story](https://news.example/story)');
  assert.doesNotMatch(results().finish('The story. 〖99†L1〗'), /〖|javascript:|Unopened/);
});

test('preserves Markdown links and supplies opened sources only when links are missing', () => {
  const answer = 'See [the story](https://news.example/story).';
  assert.equal(results().finish(answer), answer);
  assert.equal(results().finish('The story.'), 'The story.\n\nSources: [Verified story](https://news.example/story)');
  assert.equal(results().finish(''), '');
  assert.equal(createSearchTracker().finish('Hello!'), 'Hello!');
});

test('supplies the current date and actual search capability while preserving saved history', () => {
  const messages = buildChatMessages({ message: 'latest news', now: new Date('2026-10-05T12:00:00Z'), searchEnabled: true, history: [{ sender: 'user', content: 'My name is Aline.' }, { sender: 'ai', content: 'Hi Aline.' }] });
  assert.match(messages[0].content, /2026-10-05/);
  assert.match(messages[0].content, /You have the browser_search tool/);
  assert.match(messages[0].content, /Do not redirect entertainment/);
  assert.deepEqual(messages.slice(1).map(m => m.role), ['user', 'assistant', 'user']);
  assert.match(buildChatMessages({ message: 'news', searchEnabled: false })[0].content, /Live web search is unavailable/);
});
