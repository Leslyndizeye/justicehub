import { createSearchTracker, searchOptions, webSearchEnabled } from './chatSearch.js';
import { languageCopy, resolveReplyLanguage } from './chatLanguage.js';
import { needsTranslation, translateReply } from './chatTranslation.js';
import { interpretLegalQuestion } from './legalQuestion.js';
import { referencedPenaltyAnswer, referencedTheftComparisonAnswer } from './legalAnswer.js';
import { needsVocabularyReview, vocabularyIssues, correctedVocabularyReply, reviewedVocabularyHistory } from './chatVocabularyGuard.js';
import { conversationCorrection } from './chatCorrection.js';
import { casualReply } from '../shared/chatCasual.js';
import { externalSearchNotice, finishExternalReply } from './externalSearch.js';
import { providerFailure } from './chatDiagnostics.js';
import { finishLawReply } from './lawSources.js';
import { vatOverviewAnswer } from './vatOverviewAnswer.js';
import { incomeTaxExemptionsAnswer } from './incomeTaxExemptionsAnswer.js';
import {lawExcerptMetadata} from './lawArticles.js';
import {unsupportedArticleCitations,unsupportedFilingPeriod,sourceReadingReply} from './lawGrounding.js';
import {referencesForQuestion} from './legalReferences.js';
import {evidenceResponseFormat,validateEvidenceAnswer,renderEvidenceAnswer} from './evidenceAnswer.js';
import {prepareEvidenceRequest} from './evidenceRequest.js';
import { questionRoute, needsQuestionUnderstanding, scopeReply, insufficientSourcesReply } from './questionRouting.js';
import {sourceMatchesTopic} from './sourceRelevance.js';
import {rwandaLawOverviewAnswer} from './rwandaLawOverview.js';
import { everydayQuestionReply } from '../shared/everydayQuestions.js';
import { inferQuestionRoute } from './questionUnderstanding.js';
import { employmentAgeAnswer } from './employmentAgeAnswer.js';
import {reusableLawExplanation,createLawExplanationCache} from './lawExplanationCache.js';
import {applicationClarification} from './legalApplicationGuard.js';
import {isReviewedStatute} from './criminalProvisions.js';
import {generalDiscussionIssue} from './generalDiscussion.js';
import {taskClarification} from './legalFlow.js';

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
  if (!/^(?:\d+(?:\.\d+)?\s*(?:ms|[dhms])\s*)+$/.test(text)) return 0;
  return [...text.matchAll(/(\d+(?:\.\d+)?)\s*(ms|[dhms])/g)]
    .reduce((seconds, [, count, unit]) => seconds + Number(count) * ({ d:86400, h:3600, m:60, s:1, ms:.001 }[unit]), 0);
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
  const duration = errorDetails(error).message.match(/try again in\s+((?:\d+(?:\.\d+)?\s*(?:ms|[dhms])\s*)+)(?![a-z])/i)?.[1];
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

export function publicChatError(error, language = 'en', stage = 'generate') {
  const copy = languageCopy(language);
  const databaseStages = ['create_session', 'load_session', 'load_history', 'save_user', 'save_reply', 'update_session'];
  if (databaseStages.includes(stage)) {
    const code = stage === 'save_reply' ? 'reply_not_saved' : stage === 'save_user' ? 'message_not_saved' : 'conversation_unavailable';
    const messages = code === 'reply_not_saved' ? {
      en: 'Your answer could not be saved. Copy it before leaving this conversation.',
      rw: 'Igisubizo nticyashoboye kubikwa. Gikoporore mbere yo kuva muri iki kiganiro.',
      fr: 'Votre réponse n’a pas pu être enregistrée. Copiez-la avant de quitter cette conversation.',
    } : code === 'message_not_saved' ? {
      en: 'Your message could not be saved. Please try again shortly.',
      rw: 'Ubutumwa bwawe ntibwashoboye kubikwa. Ongera ugerageze mu kanya.',
      fr: 'Votre message n’a pas pu être enregistré. Réessayez dans un instant.',
    } : {
      en: 'Your conversation could not be opened right now. Please try again shortly.',
      rw: 'Ikiganiro cyawe nticyashoboye gufungurwa ubu. Ongera ugerageze mu kanya.',
      fr: 'Votre conversation n’a pas pu être ouverte. Réessayez dans un instant.',
    };
    return { status: 503, code, error: messages[language] || messages.en };
  }
  if(error.status===413 || error.code==='request_too_large')return {status:413,code:'request_too_large',error:({en:'We couldn’t prepare this reply. Please try again.',rw:'Ntitwashoboye gutegura iki gisubizo. Ongera ugerageze.',fr:'La réponse n’a pas pu être préparée. Réessayez.'})[language] || copy.genericError};
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
  const articleContext=legalDocs.some(doc=>['complete_article','partial_article'].includes(doc.coverage));
  remaining = articleContext ? 8000 : 4000;
  const excerpts = legalDocs.slice(0, 4).map(doc => {
    const content = String(doc.content || '');
    // Whole PDF articles retain their conditions and exceptions. If the
    // remaining budget cannot hold one, omit it rather than presenting a
    // chopped article as a complete provision.
    if(doc.coverage && content.length>Math.min(6000,remaining))return null;
    const excerpt = content.slice(0, Math.min(doc.coverage ? 6000 : 1600, remaining));
    remaining -= excerpt.length;
    return { ...doc, ...(excerpt.length<content.length && doc.coverage ? {coverage:'partial_article'} : {}), content: excerpt + (excerpt.length < content.length ? '\n[Excerpt truncated; verify the full official text.]' : '') };
  }).filter(doc => doc?.content && !doc.content.startsWith('\n[Excerpt truncated;'));
  return { history: recent, legalDocs: excerpts };
}

export function createChatProvider({ client, model, fallbackModel = 'openai/gpt-oss-20b', searchSetting, externalSearch, reasoningEffort = 'medium', requestTimeoutMs = 30000, now = Date.now }) {
  const cooldowns = new Map();
  function recordRateLimit(candidate,error) {
    const strikes=(cooldowns.get(candidate)?.strikes||0)+1;
    const backoff=strikes>1?Math.min(60,5*2**Math.min(strikes-1,4)):0;
    const seconds=Math.max(retryDelaySeconds(error,now()),backoff);
    cooldowns.set(candidate,{until:now()+seconds*1000,strikes});
    error.retryAfterSeconds=seconds;
    return seconds;
  }
  const lawExplanations = createLawExplanationCache();
  const models = [...new Set([model, fallbackModel].filter(value => value && value !== 'none'))];
  return {
    async understand({ message, history = [], signal }) {
      signal?.throwIfAborted();
      const local = questionRoute(message, history);
      if (!needsQuestionUnderstanding(message, local)) return local;
      for (const candidate of models) {
        if ((cooldowns.get(candidate)?.until || 0) > now()) continue;
        const timeout = AbortSignal.timeout(Math.min(requestTimeoutMs, 10000));
        try {
          const route = await inferQuestionRoute({ client, model: candidate, message, history,
            signal: signal ? AbortSignal.any([signal, timeout]) : timeout });
          return route || local;
        } catch (error) {
          signal?.throwIfAborted();
          if (error.status === 429) {
            recordRateLimit(candidate,error);
          } else if (![404, 408, 500, 502, 503, 504].includes(error.status) && !providerFailure(error, timeout.aborted)) return local;
        }
      }
      return local;
    },
    async reply({ message, role, history, legalDocs, routing, replyLanguage = 'auto', streaming, signal, onEvent = () => {} }) {
      const language = resolveReplyLanguage(message, history, replyLanguage);
      const copy = languageCopy(language);
      const correction = conversationCorrection(message, history);
      signal?.throwIfAborted();
      const greeting = casualReply(message, language);
      if (greeting) {
        if (streaming) onEvent('token', { text: greeting });
        return greeting;
      }
      const route = routing || questionRoute(message, history);
      legalDocs=legalDocs?.filter(doc=>sourceMatchesTopic(doc,[route.context,message].filter(Boolean).join('\n')));
      const orientation = everydayQuestionReply(route, language);
      if (orientation) {
        if (streaming) onEvent('token', { text: orientation });
        return orientation;
      }
      if (route.kind === 'unrelated') {
        const reply = scopeReply(language);
        if (streaming) onEvent('token', { text: reply });
        return reply;
      }
      // Ignore even caller-supplied PDF context for social/unclear requests.
      if (route.kind !== 'legal') legalDocs = [];
      const pdfFirst = (legalDocs || []).some(doc => doc.coverage && lawExcerptMetadata(doc) || isReviewedStatute(doc));
      // A dated PDF cannot establish today's law or a later amendment.
      const currentVerification = /\b(?:latest|current|today|now|in force|still appl\w*|202[5-9]|new laws?|amend\w*|updated?|recent|agezweho|mashya|vuba|aujourd'hui|actuel\w*|modifi\w*|recent\w*)\b/i.test(message);
      let needsResearch = route.kind === 'legal' && (!pdfFirst || currentVerification || route.forceWeb);
      const referencedAnswer = route.kind === 'legal' && !route.forceWeb && (referencedTheftComparisonAnswer(message,language,history)
        || employmentAgeAnswer(message, legalDocs, language)
        || rwandaLawOverviewAnswer(message,legalDocs,language)
        || incomeTaxExemptionsAnswer(message, legalDocs, language)
        || ([undefined,'rule','explanation','amount'].includes(route.answerTask) && vatOverviewAnswer(message, legalDocs, language))
        || referencedPenaltyAnswer(message, interpretLegalQuestion(message, history), language));
      if (referencedAnswer) {
        if (streaming) onEvent('token', { text: referencedAnswer });
        return referencedAnswer;
      }
      const reusableKey = !needsResearch && !route.context && !correction
        ? reusableLawExplanation(message, legalDocs || [], language, role) : null;
      // Reusable article questions contain only public source identifiers.
      // Omit earlier case history before generation so no private facts can
      // enter an explanation later reused for another account.
      const answerHistory = reusableKey ? [] : history;
      if (reusableKey) {
        const prepared = prepareEvidenceRequest({message,role,history:[],legalDocs,routing:route,language,now:new Date(now())});
        const raw = lawExplanations.get(reusableKey);
        if (raw) {
          const checked = validateEvidenceAnswer(raw, prepared.bundle, message, language);
          if (checked.ok) {
            signal?.throwIfAborted();
            const reply = renderEvidenceAnswer(checked, language);
            if (streaming) onEvent('token', {text:reply});
            return reply;
          }
          lawExplanations.delete(reusableKey);
        }
      }
      let lastError;
      let earliestRetry = Infinity;
      const rateLimits = [];
      let emittedText = false;
      let externalSearchResult;
      let evidenceRepairUsed = false;
      let repairReason;
      let discussionRepairUsed = false;
      for (const [index, candidate] of models.entries()) {
        signal?.throwIfAborted();
        const cooldown = cooldowns.get(candidate);
        if (cooldown && cooldown.until > now()) {
          earliestRetry = Math.min(earliestRetry, (cooldown.until - now()) / 1000);
          rateLimits.push({ model: candidate, retryAfterSeconds: Math.ceil((cooldown.until - now()) / 1000) });
          continue;
        }
        if (needsResearch && externalSearch && !externalSearchResult) {
          onEvent('status', { text: copy.search, webSearch: false });
          externalSearchResult = await externalSearch.lookup({ message, history, routing: route, signal, onFallback: () => onEvent('status', { text: copy.searchFallback, webSearch: false }) });
          signal?.throwIfAborted();
          onEvent('status', { text: externalSearchNotice(externalSearchResult, language).trim() || (externalSearchResult.status === 'ok' ? externalSearchResult.provider === 'groq' ? copy.searchFallbackUsed : copy.search : ''), webSearch: ['ok', 'cached'].includes(externalSearchResult.status) });
        }
        if (index > 0) onEvent('status', { text: copy.fallback, webSearch: false });
        let recoveredLookup = false;
        for (let attempt = 0; attempt < 4; attempt++) {
          const search = createSearchTracker({ language });
          const gptOss = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'].includes(candidate);
          let context=boundedContext(reviewedVocabularyHistory(answerHistory),legalDocs);
          const evidenceMode=gptOss && context.legalDocs.some(doc=>doc.coverage && lawExcerptMetadata(doc) || isReviewedStatute(doc));
          const prepared=prepareEvidenceRequest({message,role,...context,routing:route,language,correction,research:externalSearchResult,now:new Date(now()),repairReason,evidenceMode,
            searchEnabled:needsResearch && !externalSearch && !recoveredLookup && webSearchEnabled(candidate,searchSetting),instructionRole:gptOss?'developer':'system'},recoveredLookup);
          context=prepared.context;
          const bundle=prepared.bundle;
          const answerResearch=prepared.research;
          const lookupNotice = externalSearch ? externalSearchNotice(answerResearch, language) : copy.lookupNotice;
          const showLookupNotice = externalSearch ? Boolean(lookupNotice) : recoveredLookup;
          const request = {
            model: candidate,
            messages: prepared.messages,
            temperature: evidenceMode ? 0.1 : 0.4,
            max_completion_tokens: route.kind === 'discussion' ? 512 : 2048,
            ...(evidenceMode ? {response_format:evidenceResponseFormat(bundle)} : externalSearch || !needsResearch ? { tool_choice: 'none' } : !recoveredLookup ? searchOptions(candidate, message, searchSetting) : {}),
            ...(gptOss ? { reasoning_effort: route.kind === 'discussion' ? 'low' : ['low', 'medium', 'high'].includes(reasoningEffort) ? reasoningEffort : 'medium', include_reasoning: false } : {}),
          };
          if (route.kind === 'discussion' && discussionRepairUsed) request.messages[0].content += '\nRepair the previous failure: give only a short ordinary explanation and ethical view. Remove statutory claims, consequences, authorities and legal steps. No legal sources or penalty was requested.';
          const requestTimeout = AbortSignal.timeout(requestTimeoutMs);
          const requestSignal = signal ? AbortSignal.any([signal, requestTimeout]) : requestTimeout;
          let text = '';
          const bufferLanguage = ['rw', 'fr'].includes(language);
          const reviewVocabulary = route.kind === 'discussion' || needsVocabularyReview(message, history) || (legalDocs || []).some(doc=>lawExcerptMetadata(doc));
          let releasedDraft = false;
          let translatingDraft = false;
          let translationTimeout;
          try {
            if(evidenceMode) {
              // Structured Outputs do not support streaming/tools. Raw JSON and
              // unchecked legal claims never become visible UI tokens.
              const completion=await client.chat.completions.create({...request,stream:false},{signal:requestSignal});
              signal?.throwIfAborted();
              const result=validateEvidenceAnswer(completion.choices?.[0]?.message?.content || '',bundle,message,language);
              if (!result.ok && !['insufficient','needs_context'].includes(result.reason) && !evidenceRepairUsed && attempt < 3) {
                // Reuse the same evidence once to obtain a checked explanation;
                // never publish the failed draft or research merely to mask it.
                evidenceRepairUsed = true;
                repairReason = result.reason;
                continue;
              }
              if (!result.ok && result.reason === 'insufficient' && externalSearch && !externalSearchResult && attempt < 3) {
                // A retrieved PDF is not proof that it answers this question.
                // Try external evidence once only after the PDF-only draft
                // reports insufficient support; no draft has been published.
                needsResearch = true;
                onEvent('status', { text: copy.search, webSearch: false });
                externalSearchResult = await externalSearch.lookup({ message, history, routing: route, signal,
                  onFallback: () => onEvent('status', { text: copy.searchFallback, webSearch: false }) });
                signal?.throwIfAborted();
                onEvent('status', { text: '', webSearch: ['ok', 'cached'].includes(externalSearchResult.status) });
                if (externalSearchResult.sources?.length) continue;
              }
              let reply=result.ok ? renderEvidenceAnswer(result,language)
                : ['needs_context','scope_connection'].includes(result.reason) ? taskClarification(route.answerTask,language)||applicationClarification(message,language)
                : result.reason === 'insufficient' ? insufficientSourcesReply(language)
                : result.reason === 'offence_support' ? insufficientSourcesReply(language)
                  : sourceReadingReply(context.legalDocs,language,[route.context,message].filter(Boolean).join('\n'));
              const conflicts=vocabularyIssues(message,history,reply);
              if(conflicts.length)reply=correctedVocabularyReply({message,history,language,issues:conflicts});
              if (result.ok && !conflicts.length && reusableKey && !externalSearchResult && result.points.every(point=>point.kind==='rule'
                && point.evidence.every(item=>item.source.kind==='pdf'))) {
                lawExplanations.set(reusableKey, completion.choices[0].message.content);
              }
              if(bundle.research || externalSearchResult)reply=externalSearchNotice(bundle.research || externalSearchResult,language)+reply;
              if(streaming)onEvent('token',{text:reply});
              cooldowns.delete(candidate);
              return reply;
            }
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
            if (route.kind === 'discussion' && generalDiscussionIssue(text)) {
              if (!discussionRepairUsed && attempt < 3) { discussionRepairUsed = true; continue; }
              throw Object.assign(new Error('The general discussion could not be completed reliably.'), {status:502,code:'unverified_discussion'});
            }
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
            const sourceContext=context.legalDocs;
            const suppliedReferences=[...sourceContext,...referencesForQuestion(interpretLegalQuestion(message,history))];
            if(unsupportedArticleCitations(text,suppliedReferences,answerResearch).length || unsupportedFilingPeriod(text,sourceContext,answerResearch)) {
              const safeReply=sourceReadingReply(sourceContext,language,[route.context,message].filter(Boolean).join('\n'));
              if(streaming)onEvent('token',{text:safeReply});
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
            const researchReply = externalSearch ? finishExternalReply(helpfulText, answerResearch, language) : search.finish(helpfulText);
            const reply = finishLawReply(researchReply, sourceContext, language);
            if (streaming && reply !== researchReply) onEvent('token', {text:reply.slice(researchReply.length)});
            if (!reply) throw Object.assign(new Error('The AI returned an empty answer'), { code: 'empty_model_response' });
            if (externalSearchResult?.sources?.length) onEvent('status', { text: '', webSearch: true });
            cooldowns.delete(candidate);
            return reply;
          } catch (error) {
            signal?.throwIfAborted();
            if(error.status===413 || errorDetails(error).code==='context_length_exceeded') {
              error.code='request_too_large';
              if(!recoveredLookup && !emittedText && !translatingDraft && attempt < 2) { recoveredLookup = true; continue; }
            }
            const failure = providerFailure(error, translatingDraft ? translationTimeout?.aborted : requestTimeout.aborted);
            error.chatPhase = translatingDraft ? 'translation' : 'answer';
            if (failure) error.chatFailure = failure;
            // Long browser documents can overflow provider context. Recover once with honest
            // general guidance, without repeating the failed lookup or publishing an unverified draft.
            if (!emittedText && !recoveredLookup && !translatingDraft && request.tools?.length && (requestTimeout.aborted || errorDetails(error).code === 'context_length_exceeded')) {
              onEvent('status', { text: copy.lookupRecovery, webSearch: false });
              recoveredLookup = true;
              continue;
            }
            if (error.name === 'AbortError' && !failure) throw error;
            if (error.status === 429) {
              // Understanding and answering share the same provider budget.
              const seconds = recordRateLimit(candidate,error);
              earliestRetry = Math.min(earliestRetry, seconds);
              rateLimits.push({ model: candidate, retryAfterSeconds: Math.ceil(seconds) });
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
