import { buildChatMessages } from './chatPrompt.js';
import { createSearchTracker, searchOptions, webSearchEnabled } from './chatSearch.js';
import { languageCopy, resolveReplyLanguage } from './chatLanguage.js';
import { needsTranslation, translateReply } from './chatTranslation.js';
import { interpretLegalQuestion } from './legalQuestion.js';
import { referencedPenaltyAnswer } from './legalAnswer.js';
import { needsVocabularyReview, vocabularyIssues, correctedVocabularyReply, reviewedVocabularyHistory } from './chatVocabularyGuard.js';
import { conversationCorrection } from './chatCorrection.js';
import { casualReply } from '../shared/chatCasual.js';
import { externalSearchNotice, finishExternalReply } from './externalSearch.js';
import { providerFailure } from './chatDiagnostics.js';

function errorDetails(error) {
  const detail = error.error?.error || error.error || {};
  return { code: detail.code || error.code, message: detail.message || error.message || '' };
}

function constructiveReply(text, copy) {
  const normalized = text.trim().replace(/[‘’]/g, "'");
  const bareRefusal = /^(?:I'm sorry,? (?:but )?)?I (?:can't|cannot|won't) (?:help|assist)(?: you)?(?: with (?:that|this)(?: request)?)?[.!]?$/i;
  if (!bareRefusal.test(normalized)) return text;
  return text.trim() + '\n\n' + copy.lawfulAlternative;
}

function durationSeconds(value) {
  if (!value) return 0;
  const text = String(value).trim().toLowerCase();
  if (/^\d+(?:\.\d+)?$/.test(text)) return Number(text);
  if (!/^(?:\d+(?:\.\d+)?\s*[hms]\s*)+$/.test(text)) return 0;
  return [...text.matchAll(/(\d+(?:\.\d+)?)\s*([hms])/g)]
    .reduce((seconds, [, count, unit]) => seconds + Number(count) * ({ h: 3600, m: 60, s: 1 }[unit]), 0);
}

export function retryDelaySeconds(error, time = Date.now()) {
  const header = name => error.headers?.get?.(name) ?? error.headers?.[name];
  const waits = [];
  const retry = header('retry-after');
  if (retry) {
    const seconds = Number(retry);
    if (Number.isFinite(seconds)) { if (seconds > 0) waits.push(seconds); }
    else {
      const date = Date.parse(retry);
      if (Number.isFinite(date) && date > time) waits.push((date - time) / 1000);
    }
  }
  const duration = errorDetails(error).message.match(/try again in\s+((?:\d+(?:\.\d+)?\s*[hms]\s*)+)/i)?.[1];
  waits.push(durationSeconds(duration));
  // These resets describe different quotas; only use a reset when its quota is exhausted.
  for (const quota of ['requests', 'tokens']) {
    const remaining = header(`x-ratelimit-remaining-${quota}`);
    if (remaining != null && String(remaining).trim() !== '' && Number(remaining) === 0) {
      waits.push(durationSeconds(header(`x-ratelimit-reset-${quota}`)));
    }
  }
  const valid = waits.filter(seconds => Number.isFinite(seconds) && seconds > 0);
  return valid.length ? Math.max(...valid) : 60;
}

export function publicChatError(error, language = 'en') {
  const copy = languageCopy(language);
  const failure = error.chatFailure || providerFailure(error);
  if (failure === 'request_timeout') return { status: 504, code: failure, error: copy.timeoutError };
  if (failure === 'provider_connection_failed') return { status: 502, code: failure, error: copy.connectionError };
  if (error.status === 429) {
    const seconds = Math.max(1, Math.ceil(error.retryAfterSeconds || retryDelaySeconds(error)));
    return { status: 429, error: copy.rateLimit(seconds), retryAfterSeconds: seconds };
  }
  if (error.status === 400 && errorDetails(error).code === 'tool_use_failed') {
    return { status: 502, error: copy.searchError };
  }
  return { status: 502, error: copy.genericError };
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

export function createChatProvider({ client, model, fallbackModel = 'openai/gpt-oss-20b', searchSetting, externalSearch, reasoningEffort = 'medium', requestTimeoutMs = 30000, now = Date.now }) {
  const cooldowns = new Map();
  const models = [...new Set([model, fallbackModel].filter(value => value && value !== 'none'))];
  return {
    async reply({ message, role, history, legalDocs, replyLanguage = 'auto', streaming, signal, onEvent = () => {} }) {
      const language = resolveReplyLanguage(message, history, replyLanguage);
      const copy = languageCopy(language);
      const correction = conversationCorrection(message, history);
      signal?.throwIfAborted();
      const greeting = casualReply(message, language);
      if (greeting) {
        if (streaming) onEvent('token', { text: greeting });
        return greeting;
      }
      const referencedAnswer = referencedPenaltyAnswer(message, interpretLegalQuestion(message, history), language);
      if (referencedAnswer) {
        if (streaming) onEvent('token', { text: referencedAnswer });
        return referencedAnswer;
      }
      let lastError;
      let earliestRetry = Infinity;
      const rateLimits = [];
      let emittedText = false;
      let externalSearchResult;
      for (const [index, candidate] of models.entries()) {
        signal?.throwIfAborted();
        const cooldown = cooldowns.get(candidate);
        if (cooldown && cooldown.until > now()) {
          earliestRetry = Math.min(earliestRetry, (cooldown.until - now()) / 1000);
          rateLimits.push({ model: candidate, retryAfterSeconds: Math.ceil((cooldown.until - now()) / 1000) });
          continue;
        }
        if (externalSearch && !externalSearchResult) {
          onEvent('status', { text: copy.search, webSearch: false });
          externalSearchResult = await externalSearch.lookup({ message, history, signal, onFallback: () => onEvent('status', { text: copy.searchFallback, webSearch: false }) });
          signal?.throwIfAborted();
          onEvent('status', { text: externalSearchNotice(externalSearchResult, language).trim() || (externalSearchResult.status === 'ok' ? externalSearchResult.provider === 'groq' ? copy.searchFallbackUsed : copy.search : ''), webSearch: ['ok', 'cached'].includes(externalSearchResult.status) });
        }
        if (index > 0) onEvent('status', { text: copy.fallback, webSearch: false });
        for (let attempt = 0; attempt < 2; attempt++) {
          const recoveredLookup = attempt > 0;
          const lookupNotice = externalSearch ? externalSearchNotice(externalSearchResult, language) : copy.lookupNotice;
          const showLookupNotice = externalSearch ? Boolean(lookupNotice) : recoveredLookup;
          const search = createSearchTracker({ language });
          const gptOss = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'].includes(candidate);
          const request = {
            model: candidate,
            messages: buildChatMessages({ message, role, ...boundedContext(reviewedVocabularyHistory(history), legalDocs), correction, replyLanguage: language, externalSearchResult, searchEnabled: !externalSearch && !recoveredLookup && webSearchEnabled(candidate, searchSetting), now: new Date(now()), instructionRole: gptOss ? 'developer' : 'system' }),
            temperature: 0.4,
            max_completion_tokens: 2048,
            ...(externalSearch ? { tool_choice: 'none' } : !recoveredLookup ? searchOptions(candidate, message, searchSetting) : {}),
            ...(gptOss ? { reasoning_effort: ['low', 'medium', 'high'].includes(reasoningEffort) ? reasoningEffort : 'medium', include_reasoning: false } : {}),
          };
          const requestTimeout = AbortSignal.timeout(requestTimeoutMs);
          const requestSignal = signal ? AbortSignal.any([signal, requestTimeout]) : requestTimeout;
          let text = '';
          const bufferLanguage = ['rw', 'fr'].includes(language);
          const reviewVocabulary = needsVocabularyReview(message, history);
          let releasedDraft = false;
          let translatingDraft = false;
          let translationTimeout;
          try {
            if (streaming) {
              const tokens = await client.chat.completions.create({ ...request, stream: true }, { signal: requestSignal });
              for await (const chunk of tokens) {
                const delta = chunk.choices[0]?.delta;
                if (delta?.executed_tools?.length && search.observe(delta.executed_tools)) {
                  onEvent('status', { text: copy.search, webSearch: true });
                }
                if (delta?.content) {
                  text += delta.content;
                  // Do not publish a slang interpretation before checking the completed draft.
                  if (reviewVocabulary) continue;
                  if (!bufferLanguage || releasedDraft) {
                    if (!releasedDraft && showLookupNotice) onEvent('token', { text: lookupNotice });
                    onEvent('token', { text: delta.content });
                    releasedDraft = true;
                    emittedText = true;
                  } else if (text.length >= 160 && resolveReplyLanguage(text) === language) {
                    onEvent('token', { text: (showLookupNotice ? lookupNotice : '') + text });
                    releasedDraft = true;
                    emittedText = true;
                  }
                }
              }
            } else {
              const completion = await client.chat.completions.create(request, { signal: requestSignal });
              const answer = completion.choices[0]?.message;
              search.observe(answer?.executed_tools);
              text = answer?.content || '';
            }
            signal?.throwIfAborted();
            let issues = vocabularyIssues(message, history, text);
            if (issues.length) {
              const safeReply = correctedVocabularyReply({ message, history, language, issues });
              onEvent('status', { text: copy.vocabularyRecovery, webSearch: false });
              if (streaming) onEvent('token', { text: safeReply });
              cooldowns.delete(candidate);
              return safeReply;
            }
            if (needsTranslation(text, language)) {
              translatingDraft = true;
              text = constructiveReply(text, languageCopy('en'));
              onEvent('status', { text: copy.translating, webSearch: false });
              translationTimeout = AbortSignal.timeout(requestTimeoutMs);
              text = await translateReply({ client, model: candidate, text, target: language, signal: signal ? AbortSignal.any([signal, translationTimeout]) : translationTimeout });
            }
            signal?.throwIfAborted();
            issues = vocabularyIssues(message, history, text);
            if (issues.length) {
              const safeReply = correctedVocabularyReply({ message, history, language, issues });
              onEvent('status', { text: copy.vocabularyRecovery, webSearch: false });
              if (streaming) onEvent('token', { text: safeReply });
              cooldowns.delete(candidate);
              return safeReply;
            }
            if (streaming && !releasedDraft && text.trim()) {
              onEvent('token', { text: (showLookupNotice ? lookupNotice : '') + text });
              emittedText = true;
            }
            if (text.trim() && showLookupNotice) text = lookupNotice + text;
            const helpfulText = constructiveReply(text, copy);
            if (streaming && helpfulText !== text) onEvent('token', { text: helpfulText.slice(text.trim().length) });
            const reply = externalSearch ? finishExternalReply(helpfulText, externalSearchResult, language) : search.finish(helpfulText);
            if (!reply) throw Object.assign(new Error('The AI returned an empty answer'), { code: 'empty_model_response' });
            if (externalSearchResult?.sources?.length) onEvent('status', { text: '', webSearch: true });
            cooldowns.delete(candidate);
            return reply;
          } catch (error) {
            signal?.throwIfAborted();
            const failure = providerFailure(error, translatingDraft ? translationTimeout?.aborted : requestTimeout.aborted);
            error.chatPhase = translatingDraft ? 'translation' : 'answer';
            if (failure) error.chatFailure = failure;
            // Long browser documents can overflow provider context. Recover once with honest
            // general guidance, without repeating the failed lookup or publishing an unverified draft.
            if (!emittedText && !recoveredLookup && !translatingDraft && request.tools?.length && (requestTimeout.aborted || errorDetails(error).code === 'context_length_exceeded')) {
              onEvent('status', { text: copy.lookupRecovery, webSearch: false });
              continue;
            }
            if (error.name === 'AbortError' && !failure) throw error;
            if (error.status === 429) {
              const strikes = (cooldowns.get(candidate)?.strikes || 0) + 1;
              // If a short retry repeatedly fails, slow down rather than hammering the quota.
              const backoff = strikes > 1 ? Math.min(60, 5 * 2 ** Math.min(strikes - 1, 4)) : 0;
              const seconds = Math.max(retryDelaySeconds(error, now()), backoff);
              earliestRetry = Math.min(earliestRetry, seconds);
              cooldowns.set(candidate, { until: now() + seconds * 1000, strikes });
              rateLimits.push({ model: candidate, retryAfterSeconds: Math.ceil(seconds) });
              error.retryAfterSeconds = seconds;
            }
            // Never mix a fallback answer into a reply the user has already seen.
            const canFallback = Boolean(failure) || errorDetails(error).code === 'empty_model_response' || error.status === 429 || (error.status === 404 && errorDetails(error).code === 'model_not_found');
            if (emittedText || !canFallback) throw error;
            lastError = error;
            break;
          }
        }
      }
      if (Number.isFinite(earliestRetry) && !lastError?.chatFailure) {
        throw Object.assign(new Error('Configured models are rate-limited'), { status: 429, code: 'rate_limit_exceeded', retryAfterSeconds: earliestRetry, rateLimits });
      }
      throw lastError || new Error('No chat model is configured');
    },
  };
}
