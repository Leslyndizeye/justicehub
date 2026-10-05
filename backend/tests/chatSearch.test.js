import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSearchTracker, searchOptions, webSearchEnabled } from '../chatSearch.js';
import { buildChatMessages } from '../chatPrompt.js';

test('allows tool use and clarifying replies for both current and ordinary questions', () => {
  for (const message of ['What is the latest news in Rwanda?', 'Search the internet for Better Call Saul', 'Check online sources for this law', 'What happened today?']) {
    assert.equal(searchOptions('openai/gpt-oss-120b', message).tool_choice, 'auto');
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
  assert.equal(results().finish('The story.'), 'The story.\n\nPages checked: [Verified story](https://news.example/story)');
  assert.equal(results().finish(''), '');
  assert.equal(createSearchTracker().finish('Hello!'), 'Hello!');
});

test('a generic link does not suppress links to the actual pages checked', () => {
  const tracker = results();
  tracker.observe([{ name: 'browser.open', index: 2, output: 'L1: URL: https://official.example/law' }]);
  const reply = tracker.finish('See [the story](https://news.example/story) and https://official.example/.');
  assert.match(reply, /Pages checked: \[official.example\]\(https:\/\/official.example\/law\)/);
  assert.equal(reply.match(/Verified story/g)?.length || 0, 0);
  assert.doesNotMatch(reply, /Unopened story/);
});

test('recognizes PDF source URLs wrapped across numbered browser lines', () => {
  const tracker = createSearchTracker();
  tracker.observe([{ name: 'browser.search', search_results: { results: [{ title: 'Official tax order', url: 'https://official.example/long-tax-order.pdf' }] } }]);
  tracker.observe([{ name: 'browser.open', index: 1, output: 'L0: \nL1: URL:\nL2: https://official.example/long-tax-order.pdf\nL3: PDF content', search_results: { results: [{ title: 'official.example - viewing lines [0 - 100]', url: 'https://official.example/long-tax-order.pdf' }] } }]);
  assert.equal(tracker.finish('A tax update. 〖1†L4-L8〗'), 'A tax update. [Official tax order](https://official.example/long-tax-order.pdf)');
  assert.equal(tracker.finish('A tax update.'), 'A tax update.\n\nPages checked: [Official tax order](https://official.example/long-tax-order.pdf)');
});

test('supplies the current date and ordered saved history with an honest disabled-search state', () => {
  const messages = buildChatMessages({ message: 'latest news', now: new Date('2026-10-05T12:00:00Z'), searchEnabled: true, history: [{ sender: 'user', content: 'My name is Aline.' }, { sender: 'ai', content: 'Hi Aline.' }] });
  assert.match(messages[0].content, /2026-10-05/);
  assert.deepEqual(messages.slice(1).map(m => m.role), ['user', 'assistant', 'user']);
  assert.match(buildChatMessages({ message: 'news', searchEnabled: false })[0].content, /Live web search is unavailable/);
});
