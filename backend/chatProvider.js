import { buildChatMessages } from './chatPrompt.js';
import { createSearchTracker, searchOptions, webSearchEnabled } from './chatSearch.js';

function errorDetails(error) {
  const detail = error.error?.error || error.error || {};
  return { code: detail.code || error.code, message: detail.message || error.message || '' };
}

export function retryDelaySeconds(error) {
  const header = error.headers?.get?.('retry-after');
  if (header) {
    const seconds = Number(header);
    if (Number.isFinite(seconds) && seconds > 0) return seconds;
    const date = Date.parse(header);
    if (Number.isFinite(date) && date > Date.now()) return Math.ceil((date - Date.now()) / 1000);
  }
  const duration = errorDetails(error).message.match(/try again in\s+((?:\d+(?:\.\d+)?[hms]\s*)+)/i)?.[1];
  if (!duration) return 60;
  return [...duration.matchAll(/(\d+(?:\.\d+)?)([hms])/g)]
    .reduce((seconds, [, count, unit]) => seconds + Number(count) * ({ h: 3600, m: 60, s: 1 }[unit]), 0);
}

export function publicChatError(error) {
  if (error.status === 429) {
    const seconds = Math.max(1, Math.ceil(error.retryAfterSeconds || retryDelaySeconds(error)));
    const wait = seconds < 60 ? `${seconds} seconds` : `about ${Math.ceil(seconds / 60)} minutes`;
    return { status: 429, error: `The AI service has reached its usage limit. Please try again in ${wait}.`, retryAfterSeconds: seconds };
  }
  if (error.status === 400 && errorDetails(error).code === 'tool_use_failed') {
    return { status: 502, error: 'The web search could not be completed. Please try a more specific question.' };
  }
  return { status: 502, error: 'The reply could not be completed. Please try again shortly.' };
}

// Bound both excerpt and conversation size; history remains ordered and the latest user message is intact.
export function boundedContext(history = [], legalDocs = []) {
  let remaining = 6000;
  const recent = [];
  for (const item of [...history].reverse()) {
    if (!['user', 'ai'].includes(item.sender) || typeof item.content !== 'string' || !item.content.trim()) continue;
    if (item.content.length > remaining) break;
    recent.unshift(item);
    remaining -= item.content.length;
  }
  remaining = 4000;
  const excerpts = legalDocs.slice(0, 4).map(doc => {
    const content = String(doc.content || '');
    const excerpt = content.slice(0, Math.min(1600, remaining));
    remaining -= excerpt.length;
    return { ...doc, content: excerpt + (excerpt.length < content.length ? '\n[Excerpt truncated; verify the full official text.]' : '') };
  }).filter(doc => doc.content && !doc.content.startsWith('\n[Excerpt truncated;'));
  return { history: recent, legalDocs: excerpts };
}

export function createChatProvider({ client, model, fallbackModel = 'openai/gpt-oss-20b', searchSetting, reasoningEffort = 'medium', now = Date.now }) {
  const cooldowns = new Map();
  const models = [...new Set([model, fallbackModel].filter(value => value && value !== 'none'))];
  return {
    async reply({ message, role, history, legalDocs, streaming, signal, onEvent = () => {} }) {
      let lastError;
      let earliestRetry = Infinity;
      let emittedText = false;
      for (const [index, candidate] of models.entries()) {
        signal?.throwIfAborted();
        const cooldown = cooldowns.get(candidate);
        if (cooldown && cooldown.until > now()) {
          earliestRetry = Math.min(earliestRetry, (cooldown.until - now()) / 1000);
          continue;
        }
        if (index > 0) onEvent('status', { text: 'The main model is busy. Trying another model…', webSearch: false });
        const search = createSearchTracker();
        const gptOss = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'].includes(candidate);
        const request = {
          model: candidate,
          messages: buildChatMessages({ message, role, ...boundedContext(history, legalDocs), searchEnabled: webSearchEnabled(candidate, searchSetting), now: new Date(now()), instructionRole: gptOss ? 'developer' : 'system' }),
          temperature: 0.4,
          max_completion_tokens: 2048,
          ...searchOptions(candidate, message, searchSetting),
          ...(gptOss ? { reasoning_effort: ['low', 'medium', 'high'].includes(reasoningEffort) ? reasoningEffort : 'medium', include_reasoning: false } : {}),
        };
        let text = '';
        try {
          if (streaming) {
            const tokens = await client.chat.completions.create({ ...request, stream: true }, { signal });
            for await (const chunk of tokens) {
              const delta = chunk.choices[0]?.delta;
              if (delta?.executed_tools?.length && search.observe(delta.executed_tools)) {
                onEvent('status', { text: 'Searching the web…', webSearch: true });
              }
              if (delta?.content) {
                text += delta.content;
                emittedText = true;
                onEvent('token', { text: delta.content });
              }
            }
          } else {
            const completion = await client.chat.completions.create(request, { signal });
            const answer = completion.choices[0]?.message;
            search.observe(answer?.executed_tools);
            text = answer?.content || '';
          }
          signal?.throwIfAborted();
          const reply = search.finish(text);
          if (!reply) throw new Error('The AI returned an empty answer');
          cooldowns.delete(candidate);
          return reply;
        } catch (error) {
          signal?.throwIfAborted();
          if (error.name === 'AbortError') throw error;
          if (error.status === 429) {
            const seconds = retryDelaySeconds(error);
            earliestRetry = Math.min(earliestRetry, seconds);
            cooldowns.set(candidate, { until: now() + seconds * 1000 });
          }
          // Never mix a fallback answer into a reply the user has already seen.
          const canFallback = error.status === 429 || (error.status === 404 && errorDetails(error).code === 'model_not_found');
          if (emittedText || !canFallback) throw error;
          lastError = error;
        }
      }
      if (Number.isFinite(earliestRetry)) {
        throw Object.assign(new Error('Configured models are rate-limited'), { status: 429, retryAfterSeconds: earliestRetry });
      }
      throw lastError || new Error('No chat model is configured');
    },
  };
}
