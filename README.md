# JusticeHub

JusticeHub helps people understand Rwandan law, their rights and responsibilities, legal documents, and lawful options. It supports citizens and legal research for people working on cases, including criminal defence and truthful sentencing mitigation. It can check official sources for current information, while also answering everyday questions naturally.

Users can sign in, ask questions, and revisit saved conversations. An admin dashboard manages users, conversations, and legal documents. JusticeHub provides information and research support; it does not provide legal representation or decide cases.

Built with React, TypeScript, Vite, Express, Firebase, Supabase, Groq, and Tavily.

## Project structure

```text
justicehub/
  frontend/       Website, authentication screens, and dashboards
  backend/        API, chat instructions, database setup, and legal document seeds
  shared/         Casual-message and selective-memory rules for the website and API
  README.md
  .gitignore
```

The frontend and backend each have their own `package.json`, dependencies, and `.env` file. The `shared` folder contains plain JavaScript and needs no dependency installation.

## Requirements

- Node.js 22.13+ in the 22.x line, or Node.js 24, with npm.
- Firebase Authentication and Cloud Firestore.
- A Supabase project with the required tables.
- A Groq API key with access to the configured chat model.
- A Tavily Researcher/Free API key for primary live search, with pay-as-you-go disabled. A configured Groq search backup can look up sources if Tavily is unavailable; without usable search results, chat provides general guidance.

## Setup

From the project root, install dependencies:

```bash
npm --prefix frontend ci
npm --prefix backend ci
```

Place the supplied environment files at:

```text
frontend/.env
backend/.env
```

If you do not have them yet, copy the templates and fill in the values. Do not overwrite an existing `.env` file.

Git Bash, macOS, or Linux:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

PowerShell:

```powershell
Copy-Item frontend/.env.example frontend/.env
Copy-Item backend/.env.example backend/.env
```

The `.env` files are ignored by Git. Share filled-in files privately; the templates can stay in the repository.

### Environment variables

| File | Variable | Purpose |
| --- | --- | --- |
| `frontend/.env` | `VITE_API_URL` | Backend base URL. Defaults to `http://localhost:4000`. Vite forwards local `/api` requests there; production browsers use the URL directly. |
| `backend/.env` | `SUPABASE_URL` | Required Supabase project URL. |
| `backend/.env` | `SUPABASE_ANON_KEY` | Legacy anonymous key for older utility clients. Protected API routes use the backend service key. |
| `backend/.env` | `SUPABASE_SERVICE_ROLE_KEY` | Required backend-only privileged key for the protected API and private memory. Never place it in frontend variables. |
| `backend/.env` | `FIREBASE_PROJECT_ID` | Firebase project whose ID tokens the memory API accepts. Defaults to `ireme-30164`; must match frontend authentication. |
| `backend/.env` | `GROQ_API_KEY` | Required Groq API key. |
| `backend/.env` | `GROQ_MODEL` | Chat model. Defaults to `openai/gpt-oss-120b`. |
| `backend/.env` | `GROQ_FALLBACK_MODEL` | Model tried when the main model is rate-limited or unavailable. Defaults to `openai/gpt-oss-20b`; set `none` to disable. |
| `backend/.env` | `GROQ_REASONING_EFFORT` | GPT-OSS reasoning effort: `low`, `medium`, or `high`. Defaults to `medium`; higher effort can use more tokens. |
| `backend/.env` | `WEB_SEARCH_PROVIDER` | `tavily` (default) or `none`. `none` disables primary and backup research. |
| `backend/.env` | `TAVILY_API_KEY` | Backend-only Tavily Free key used for separate web research. |
| `backend/.env` | `TAVILY_MONTHLY_LIMIT` | Account-wide credit ceiling. Defaults to 900; clamped to 0–1000. Other account usage counts toward the ceiling. |
| `backend/.env` | `GROQ_SEARCH_FALLBACK` | Set `true` to try a separate Groq browser request when Tavily cannot supply sources. Uses Groq tokens; keep the account on Free. Omitted or `false` disables the backup. |
| `backend/.env` | `GROQ_SEARCH_MODEL` | Backup research model. Defaults to `openai/gpt-oss-20b`. |
| `backend/.env` | `GROQ_WEB_SEARCH` | Keep `false`. Normal answer generation disables built-in tools; search backup is controlled separately. |
| `backend/.env` | `FRONTEND_URL` | Additional allowed frontend origin. Local `http://localhost:5173` is always allowed. |
| `backend/.env` | `PORT` | Backend port. Defaults to `4000`. |

Use base URLs without a trailing slash; `VITE_API_URL` should not include `/api`. Keep Groq keys and privileged database keys out of frontend variables. Restart the servers after changing `.env`; rebuild the frontend when changing its deployed configuration.

Firebase web configuration is in `frontend/components/firebaseConfig.js`, currently pointing to project `ireme-30164`. It does not read `VITE_FIREBASE_*` variables. Chat uses Groq and does not require a Gemini key.

### Service setup

- [Firebase console](https://console.firebase.google.com/project/ireme-30164/overview): enable Email/Password and Google sign-in, authorize `localhost` and deployed frontend domains, and configure Cloud Firestore rules for `users/{firebaseUid}`. Signup uses Firestore, not Realtime Database.
- [Supabase dashboard](https://supabase.com/dashboard): manage the database, project URL, and API keys. See the [API key guide](https://supabase.com/docs/guides/getting-started/api-keys).
- [Groq API keys](https://console.groq.com/keys): create or manage the key used by the backend. Check [model availability](https://console.groq.com/docs/models) if chat returns `model_not_found`.
- [Tavily dashboard](https://app.tavily.com): create a Researcher/Free key without adding a payment method or enabling pay-as-you-go. Save it as `TAVILY_API_KEY` in `backend/.env`, then restart the backend. Do not paste keys into chat or commit them.

Environment files allow the app to connect to these services. Managing their settings requires separate account access.

### Model choice and free access

JusticeHub uses Groq, the API provider, with `openai/gpt-oss-120b` for answers and `openai/gpt-oss-20b` as its fallback. Both are listed in [Groq's free-plan limits](https://console.groq.com/docs/rate-limits). Tavily performs primary web research; an optional Groq browser request supplies backup sources. This extra request uses the same Groq account quota. Kinyarwanda quality still needs evaluation with native speakers.

Keep the Groq account on the **Free** plan. Check [Settings → Billing](https://console.groq.com/settings/billing); upgrading to Developer enables usage-based charges. The app cannot check or control the account's billing plan. See [Groq's billing guide](https://console.groq.com/docs/billing-faqs).

Free access has request and token limits. When the available models are limited, wait for the retry time shown in chat. The backend does not purchase credits or upgrade the account. Translation repair uses the existing Groq key and counts toward the same account's quotas. No paid translation service is configured. Grok is a separate xAI service whose [API has usage charges](https://docs.x.ai/developers/pricing).

### Database setup

The app uses the existing Supabase database configured in `backend/.env`. Its main tables are `profiles`, `chat_sessions`, `messages`, and `legal_documents`.

For a new database, export the current schema, grants, and row level security policies first. The checked-in `backend/schema.sql` is incomplete: it omits `profiles.auth_provider`, the `admin` role, and the `legal_documents` table. It also does not contain the project's access policies. Running it alone will not reproduce the working database.

Legal document data is in `backend/seed_*.sql`. Check which files have already been applied and their ordering notes before running them. `seed_legal_docs.sql` deletes existing legal documents; other files may remove old entries or create duplicates when rerun. Use a development database for setup work.

Firestore rules and a complete Supabase schema export are not included in this repository.

## Run locally

Open two terminals from the project root.

Frontend:

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`.

Backend:

```bash
cd backend
npm run dev
```

The API runs at `http://localhost:4000`. Start it from `backend/` so it reads the correct `.env`. The backend root URL is not a website; its routes start with `/api`.

Press **Ctrl+C** to stop a server. You only need to install dependencies on first setup or after dependency changes.

If PowerShell blocks `npm.ps1`, use `npm.cmd` instead of `npm`. Both folders use npm and their checked-in `package-lock.json` files. Use npm when changing dependencies so local setup and hosting install the same versions.

## Commands

| Folder | Command | What it does |
| --- | --- | --- |
| Either | `npm ci` | Installs the versions in `package-lock.json`, replacing `node_modules`. |
| `frontend` | `npm run dev` | Starts Vite for development. |
| `frontend` | `npm run build` | Creates the production website in `frontend/dist/`. |
| `frontend` | `npm run preview` | Previews that production build locally. |
| `frontend` | `npm test` | Runs stream parsing, Markdown rendering, and saved-memory tests without external API calls. |
| `frontend` | `npx tsc --noEmit` | Checks TypeScript. |
| `backend` | `npm run dev` | Starts the API with automatic restart when source files change. |
| `backend` | `npm start` | Starts the API without automatic restart. |
| `backend` | `npm test` | Checks search configuration, source links, and conversation instructions without external API calls. |
| `backend` | `npm run eval:chat -- client_defence` | Runs an opt-in live check of client-case understanding using Groq. Uses API tokens; does not write to the database. |

The backend requires `SUPABASE_SERVICE_ROLE_KEY` for protected API access; startup fails when it is missing instead of using an anonymous key. The backend needs no compilation step. Its `build` script currently only prints a message.

## App notes

Routes are `/`, `/auth`, `/dashboard`, `/dashboard/:sessionId`, and `/adminxt`. `/dashboard` starts a new conversation. Saved conversations use their session ID in the URL, so refresh and browser Back/Forward reopen the selected chat. Opening a protected chat link before signing in returns to that chat after login. Local-only memory exchanges are still separate from saved database messages.

The chat list loads independently of the profile request at sign-in. History requests have a ten-second timeout and show a retry action on failure. Login and signup fields start empty and use prompts instead of example names, emails, or masked password placeholders. The form requests that browser autofill stay off; a browser or password manager can still override this setting.

Unknown URLs show a styled 404 page with home and workspace links. A conversation is shown as missing only after the account's chat list has loaded successfully; connection failures show a separate recovery card with a working retry button. Expired sessions offer sign-in again, unauthorized admin navigation shows a 403 page, and unexpected React rendering failures show a recovery screen. These are client-side displays; frontend hosting still serves the SPA through its existing rewrite. Raw network, provider and setup diagnostics are kept out of chat/history displays, while quota countdowns remain visible. Technical details can be checked in the console and server logs. Recovery styles are in `frontend/components/statusScreen.css`.

The chat uses a liquid glass interface with Charcoal Black (`#040404`), Golden Top (`#d8ab4e`) accents, frosted panels, subtle glossy edges, soft ambient lighting, and light text. The layout places conversation history in a full-height sidebar, centers the welcome composer, and keeps active conversations in a centered column with the composer at the bottom. Its scoped styles are in `frontend/components/chatGlass.css`; the landing page keeps its own theme. On phones and tablets, the header menu opens conversation history as a drawer with keyboard focus handling and Escape to close. Suggested questions fill the composer for review before sending. Tables and code blocks scroll within replies, and reduced-motion settings suppress decorative animations.

New Supabase profiles start as `citizen`; admin access depends on `profiles.role`. Signup also writes a role to Firestore, but these role records are not synchronized.

Most chat replies stream as they are generated. Replies involving recognized slang or a correction follow-up are checked as completed drafts before appearing. The Stop button cancels generation and preserves any partial answer already shown. Follow-ups use up to 20 recent saved messages, within a 6,000-character history budget. Retrieved legal excerpts also have a size limit; the full source should be checked for consequential questions. Start a new session for a fresh conversation.

Follow-up questions use the current conversation's topic, including short messages and obvious typos. Broad requests such as "latest tax laws in Rwanda" should get a sourced overview before an offer to narrow the topic. Clarifying questions are reserved for missing details that affect the answer, such as a case-specific deadline or an unidentified particular law. When the model omits supplied search links, a timestamped "Search sources" list shows the missing references; it does not claim that the model opened a browser or that every result proves a legal claim.

JusticeHub answers general questions as well as legal questions. The beta server uses [Tavily search](https://docs.tavily.com/documentation/api-reference/endpoint/search) separately from answer generation. With `GROQ_SEARCH_FALLBACK=true`, missing keys, failed lookups, exhausted credits or empty results trigger a separate Groq browser research request. Successful or cached Tavily results skip this backup. `WEB_SEARCH_PROVIDER=none` disables both searches. The backend classifies legal/current-information requests using bounded local rules, searches public topics, and supplies at most three short evidence excerpts to the answer model. Legal queries use broad English topics, verified slang meanings and explicitly identified law numbers; neither research request receives the user's name, account memory or full case narrative. This planner is deliberately limited and can miss topics, languages or useful case-specific distinctions.

Groq backup research receives only the public query and current date. Only evidence from actual `browser.*` tool results is retained; the research model's generated summary is discarded. The answer model receives those bounded excerpts with tools disabled. A generated link alone cannot establish a successful search. Backup results are cached for 15 minutes; concurrent matching requests reuse the same result. A failed backup is not retried automatically, and a cooldown prevents repeated attempts during provider failures or reported quota waits. If both searches fail, replies explain that current information could not be verified. Tavily is a search service and cannot replace Groq's answer generation when all chat models are unavailable.

When an answer model returns a rate limit, connection failure, timeout, transient server error, or empty answer, the backend tries the fallback once, before any answer text has been sent. It reuses the same research result rather than searching again. A model blocked by a rate limit is skipped until its reported retry time passes, and if all answer models are cooling down no external search is started. Retry timing uses the longest wait reported in the error, Retry-After header, or exhausted-quota reset headers. Repeated short rate limits increase the backoff. Bad credentials, application bugs and failures after visible answer text do not trigger a replacement answer. The Stop button cancels both the active request and any pending fallback.

Chat error logs identify the database or model stage, error type, recognized error code and safe connection cause. Known application stack frames include only a filename and line number. Logs omit raw error bodies, arbitrary messages, keys and conversation text. A final timeout or connection failure receives a localized message; an error during translation is logged as a translation failure rather than a generic internal error.

If all configured models are limited, the composer shows a countdown and waits before making another AI request. Local saved-memory commands still work during this wait. New chats keep the countdown; requests are not retried automatically when it expires. A retry time is a minimum wait, not a guarantee that account quota will be available. Restarting the app or creating another API key does not reset an organization quota; see [Groq rate limits](https://console.groq.com/docs/rate-limits). The backend bounds conversation and excerpt sizes and defaults to medium reasoning effort for case understanding. Set `GROQ_REASONING_EFFORT=low` if reducing token use is more important.

Tavily's [free plan](https://docs.tavily.com/documentation/api-credits) supplies 1,000 monthly credits; basic search uses one credit. Before each uncached search, the backend checks `/usage` and requires a verified Free/Researcher plan, zero pay-as-you-go usage, and enough account/key credits below the configured ceiling. A pay-as-you-go limit must be zero or explicitly null; null alone does not establish that billing is disabled, so keep pay-as-you-go off in the dashboard. A null per-key limit means there is no separate key cap; the finite free account allowance and application ceiling still apply. Missing or unexpected usage data blocks the search. Searches use `basic`, disable automatic parameter selection, request extracted page text, and make no additional extract/crawl/research calls. There is no automatic retry or paid-provider fallback. These controls do not upgrade accounts or purchase credits; keep both service accounts on their free plans.

Public query results are cached in memory for 15 minutes, with a maximum of 100 entries. Cache hits retain their original retrieval timestamp and are labelled as saved results, not a new verification. No personal model answer is cached. Requests are serialized within one backend process, and local credit reservations protect against stale usage responses; provider-reported account usage remains important across restarts and multiple replicas. Caches and reservations do not persist or synchronize across servers. Free-provider limits still apply.

Legal results are restricted to selected official Rwandan domains and RwandaLII. Extracted page text and search snippets are distinguished: a snippet alone does not verify a precise provision or current penalty. Retrieved dates do not establish publication, enactment or effective dates. If neither search supplies usable evidence, the reply includes a localized limitation. The interface indicates when the Groq backup is attempted and when it supplies sources. Review the linked full source for important decisions. Automated checks use simulated responses; live provider access and source coverage can change.

Response instructions are in `backend/chatPrompt.js`. Reporting contact references and their official source links are in `backend/officialContacts.js`; recheck the sources when updating contacts. Message formatting is handled by `frontend/components/ChatMarkdown.tsx`.

Kinyarwanda theft terms such as "kwiba" and "wibye" are mapped to "theft" for retrieval from the English legal corpus. Short punishment follow-ups retain the topic from earlier user messages. Excerpts whose titles concern theft are prioritized over unrelated documents that merely mention it.

Common sexual-offence wording is mapped separately: "gufata ku ngufu" and joined typing such as "gufata kungufu" mean rape in sexual-offence usage; explicit literal arrest/property contexts are preserved. Related terms distinguish child defilement, sexual harassment, gender-based violence and indecent assault. The completed-draft guard rejects the observed rape-to-robbery definition and drops its invented penalties and links. These sourced meaning hints do not establish the applicable charge, guilt or current sentence; see `backend/SLANG.md` for source dates and review limitations.

Vocabulary mappings are in `backend/legalVocabulary.js`; researched examples, translations, competing meanings, and sources are in [backend/SLANG.md](backend/SLANG.md). They include scam and smuggling expressions, service-linked bribery euphemisms such as "akantu" and "umuti w’ikaramu," Girinka-related "ikiziriko," and local substance names. "Gucucura" searches property-taking possibilities without assuming one charge; "abazunguzayi" searches street-vending rules without labelling vendors as thieves. For model requests, recognized slang receives formal research wording and an English topic gloss alongside the unchanged original question. URLs and code are preserved. Ambiguous payment terms need nearby service and requested-benefit context; literal thirst, massage, ropes, objects, and personal names are kept separate. These mappings document usage, not current penalties or every regional meaning.

The vocabulary also covers property snatching, impersonation, threats, favouritism, handling entrusted funds, and account/data-access complaints. "Iterabwoba" in a personal complaint is not automatically interpreted as terrorism; "kwiba konti" uses cyber-law retrieval and does not select the stored physical-theft penalty. "Ibyuma" receives its documented drink sense only with beverage context. A short question about an ambiguous word can explain its ordinary and contextual meanings before choosing a legal issue. Sources and their dates or access limitations are recorded in the vocabulary notes; these hints do not guarantee a correct live model answer.

`backend/chatVocabularyGuard.js` checks positive definition conflicts before publishing a slang reply, including after language translation. Its rules cover scam versus assault, distinct substance names, smuggling versus counterfeit goods, border routes, vendors, drink-related "ibyuma," Girinka-related "ikiziriko," media-related "GITI," cash-bribe claims about favouritism, and personal threats mislabelled as terrorism. On detection, it discards the wrong draft and its browser citations, then returns reviewed meanings with usage links and a current-law limitation. It makes no extra correction request. Negation, qualified allegations, ordinary senses, labelled mistaken quotations, and code examples have checks to reduce false positives. Known wrong definitions are excluded from future model context; saved messages are preserved. These are limited pattern checks, so errors and false positives remain possible. They do not verify every factual/legal claim, inference, or regional meaning. The stored Article 174 fraud excerpt is from the Ministry's 2018 text; later amendments or case-specific penalties still need verification.

Correction follow-ups such as "that's wrong," "you misunderstood," "wibeshye," and "sibyo" are handled by `backend/chatCorrection.js`. They retain the earlier user's question and use the newest clarification. A bounded correction context preserves up to 2,400 characters of that question and 1,600 characters of the disputed answer when ordinary history is trimmed. It is labelled as untrusted conversation data. A demonstrated earlier meaning error can be acknowledged; a challenge alone does not establish that the earlier answer was false. Changes to laws and penalties still need relevant sources. Personal clarifications apply to the conversation and do not automatically rewrite the shared vocabulary or create saved memories.

The model is also instructed to check meaning, people, intent, language, source dates, legal alternatives, amounts, and conviction conditions before its final reply. This instruction does not establish that a live answer is correct. The offline correction tests use mocked model output to verify draft withholding, source handling, context, language, and cancellation; no additional provider or paid review service is configured. Existing translation repair still uses Groq quota.

Simple questions such as "umuntu wibye ahanishwa iki?" return a short answer from reviewed, dated official references in `backend/legalReferences.js`, without a Groq request. The answer preserves the court-conviction condition and statutory alternatives, cites the Ministry text and Police explanation, and states that later amendments have not been verified. It does not replace a punishment question with an arrest-and-trial table. Requests about newer laws, aggravated circumstances, or a particular client's sentence continue through the model with these references available. Review the official sources before updating the stored facts; this is not a continuously updated consolidated law database.

The assistant should preserve who is involved in a scenario: a user's client is not the user. Questions about lawful defence, reviewing evidence, or reducing a sentence are supported even when an intentional act is described. It should refuse requests to fabricate evidence, conceal offences, intimidate witnesses, or otherwise obstruct proceedings, and suggest a lawful alternative. If the model returns only a bare refusal, the backend adds a brief offer to help with true facts, rights, or lawful options. Case-specific penalties, deadlines, and eligibility still require verified sources and relevant facts.

GPT-OSS receives the application instructions as a developer message. Each Groq answer or backup research request has a 30-second time limit. Tavily usage checks have a ten-second timeout and searches have a 15-second timeout. A Tavily timeout can trigger the configured Groq search backup; neither search automatically repeats a failed request. General guidance can continue with a clear verification limitation if both fail. The older browser-in-answer recovery code remains covered by isolated provider tests; production uses browser tools only in the separate backup research request.

Behavior checks are in `backend/evals/assistant-behavior.js`. The available cases are `purpose`, `client_defence`, `fabricated_evidence`, `kinyarwanda`, `theft_penalty`, `fraud_slang`, and `sexual_terms`. Run one by passing its name to `npm run eval:chat -- <case>`, or omit the name to run all cases. Model-backed cases use Groq tokens; the narrow source-based theft answer does not. The slang checks include earlier wrong assistant definitions. These check basic response behavior; review the actual answer and its sources for language quality and legal accuracy.

### Language support

Casual typing is interpreted in context. For example, "bimeze gute c" means "bimeze gute se?" (how are you / how is it going); similar short greeting forms and English "how r u" are recognized. "Okay okay gotchuuu" is an acknowledgement meaning "got it." Recognized standalone greetings and acknowledgements get a brief reply in the detected language without legal retrieval or a Groq request, even after a legal discussion or during a model quota cooldown. The website and API use the same rules in `shared/chatCasual.js`. These replies use the normal saved-conversation flow and still require the backend and database to be reachable. Their success does not clear the model cooldown. During cooldown, other requests keep their draft and the countdown instead of appending another failed turn on every click. Messages combining a greeting with a substantive question continue through the usual answer path. The original text is preserved; letters in names, code, links, and legal identifiers are not globally expanded. These are limited typing rules, not a general spelling corrector.

Replies automatically follow the language of the latest message. There is no language selector, and old browser language selections are ignored. Short ambiguous follow-ups use the previous user's language; common short Kinyarwanda questions and personal phrases are recognized explicitly. An earlier assistant answer in English does not choose the language for a Kinyarwanda question. Explicit requests such as "answer in English", "in English", "English please" or "mu cyongereza" switch the answer language, including after a Kinyarwanda conversation. Detection can be imperfect for mixed-language text.

The `/api/chat` request accepts optional `replyLanguage` (`auto`, `rw`, `en`, or `fr`). Replies, service status messages, lookup-recovery notices, and errors use the selected or detected language. Source URLs and legal identifiers are preserved. Language detection runs locally using `franc-min` and does not send text to another service.

Groq generates the answer in the selected language. For Ikinyarwanda and French, the backend checks the initial draft before streaming it. If the completed draft is clearly in the wrong language, a separate translation request uses the same available Groq model and key. This step preserves protected URLs, code, numeric identifiers, and dates, and rejects missing or duplicated protected values. Translated drafts appear after translation finishes; answers already in the correct language stream normally, except for the slang review described above. This repair can use additional Groq tokens. It does not establish native-level translation quality or verify legal meaning by itself.

The current setup stays with Groq for translation repair. Paid translation services such as Google Cloud Translation are outside the current budget and are not connected. A stronger Kinyarwanda translation layer should be evaluated separately from legal reasoning before changing providers.

For a translation layer, translate Kinyarwanda questions into English for retrieval from the English legal corpus, keep the original question and context for meaning, research and verify legal claims, then translate the answer back while preserving citations, dates, amounts, conditions, and negation. Compare candidate translations with native Kinyarwanda speakers using representative legal questions before choosing a model. No single best model for this project's legal use has been established by these checks.

[Meta NLLB-200](https://huggingface.co/facebook/nllb-200-distilled-600M) is an option for research experiments, but its model card says it is not released for production or intended for domain-specific legal text. [KinyaBERT](https://aclanthology.org/2022.acl-long.367/) is a language-understanding model; it does not replace a conversational assistant or a translation service.

### Saved memory

Memory runs in the background; the chat has no Saved memory button or panel. It retains one preferred name and up to sixteen short notes. Database memory uses one private `user_memories` table with one document per verified Firebase account, shared across that person's chats and devices. It has no automatic expiry; details remain until corrected or cleared. It does not create a table for each person or conversation. Cloud storage still depends on the Supabase project remaining available.

To enable account storage:

1. Run [backend/migrations/20261009_user_memories.sql](backend/migrations/20261009_user_memories.sql) in your project's Supabase SQL Editor. It creates the private table without changing existing chats.
2. Set `SUPABASE_SERVICE_ROLE_KEY` in `backend/.env` and ensure `FIREBASE_PROJECT_ID` matches frontend authentication. Restart the backend.
3. Sign in and check the authenticated `/api/memory` request in browser developer tools. A successful response confirms that account memory can be loaded. Setup and synchronization failures are logged to the console, without a chat banner; details remain in the browser or page until synchronization succeeds. An explicit save reply distinguishes account storage from browser storage.

The `/api/memory` GET and PUT routes verify Firebase ID-token signatures, issuer, audience, and expiry using Google's public certificates. Ownership comes from the verified token's UID, never a supplied user ID. The table enables row level security and denies direct access to anonymous and ordinary Supabase clients. Only the separate backend service client accesses it after verification. Token revocation is not checked before token expiry. Chat and admin APIs also verify identity and enforce owner/admin access; private database privileges must be applied separately.

At sign-in the account document takes priority over the browser cache, so another device's correction or clear is respected. A browser's existing memory is migrated only when no account document exists. Revision checks reject concurrent changes instead of overwriting them; refresh the page to load the account copy after a conflict. Reloading replaces the browser copy with the account version, including any local changes whose database save was not confirmed. Database failures leave a browser copy and a console diagnostic; they do not claim cross-device persistence. No automatic eviction removes older notes when the sixteen-note capacity is reached; remove a note before adding another.

Automatic memory recognizes clear first-person statements about a name, work, studies, project, goal, response preference, general location, language, skills, interests, and project requirements. Examples include "Nitwa Aniela," "I study law," "Ntuye i Kigali," "I code in TypeScript," and "I need only free tools." Budget, computer, and hosting requirements have separate slots; language preferences and languages spoken also stay separate. A new clear statement updates its slot; duplicates differing only in case or punctuation keep the existing record. It does not maintain a complete list of every project, interest, or skill.

Corrections such as "Actually, I live in Huye" update the previous detail. Supported retractions such as "I no longer study law" and "Siniga amategeko" remove matching earlier information. Changes are processed in order so a later retraction or forget request wins. Automatic updates and synchronization run without a memory panel or status banner. Details are shown only when requested in chat; operational failures are logged to the console. Detection runs locally without extra AI tokens or search requests. It uses limited patterns rather than a general language-understanding model, and never infers an unstated fact. The selection criteria, examples, research sources, and limitations are in [backend/MEMORY.md](backend/MEMORY.md).

"Remember that I prefer short answers" and "Ibuka ko nkunda ibisubizo bigufi" save a requested note even when automatic saving is off. Automatic extraction skips recognized hypothetical or quoted examples, questions, uncertain claims, temporary details, other people's information, private case details, and credential or identity-number patterns. General location rules exclude precise street addresses. These filters are limited; memory is not a secure vault. Only new messages are checked for these background details; historical recovery below checks names.

Name questions such as "uzi izina ryanjye?" and "ese nitwa nde?" are answered locally. When no preferred name is saved, the app can check explicit introductions in up to 25 recent saved conversations for that account, with a ten-second lookup budget. Only user statements are used to recover the name; assistant guesses and other people's names are excluded. The newest explicit name takes priority over the Firebase account display name. A follow-up such as "I mean the one I told you in the previous chat" stays about the name and does not substitute the account name if no earlier introduction can be found. An incomplete lookup is reported rather than restoring a potentially stale name.

After a name question, follow-ups such as "I think I got two names?" compare the saved name and permitted account display name locally, with separate labels. They do not assume a full or second legal name, alter memory, or turn the conversation into legal advice. Explicit questions about identity documents or name-change law still go through the model.

"Call me by my name" recalls the saved name, checks earlier introductions if allowed, or uses the account display name with that qualification. It does not save "by my name" as a new name. Invalid command phrases saved by older versions are discarded when memory is read. If a faulty update replaced the preferred name, earlier saved introductions can recover it; names from local-only exchanges may need to be entered again.

Manage memory through chat: "What do you remember about me?" reviews details; "What am I studying?" recalls a fact; "My name is Aline" updates a name; "Forget my studies" removes that category; and "Forget everything about me" clears saved details. "Disable memory" pauses saving and recall without erasing existing details; "Enable memory" restores access. "Disable automatic memory" pauses automatic capture, while explicit "Remember that..." requests still work with memory enabled. "Enable automatic memory" restores capture without undoing earlier name-recovery exclusions. Forgetting a category prevents automatic restoration until an explicit remember request. "Forget my name" also stops recovery from old chats and use of the account name. Clearing details turns off automatic saving and does not delete old chat messages. An account display name is identified as such rather than treated as a verified legal name.

Saved names and notes are not automatically attached to Groq requests. Personal lookups and memory commands run in the browser; these local exchanges are not saved to Supabase conversation history. Using saved details to personalize other model answers requires permission to send that context to Groq. This keeps the current memory feature separate from the existing recent-message history used by the model.

### Read aloud

Each completed assistant answer has a **Read aloud** button beside **Copy**, which changes to **Stop reading** during playback. It reads the rendered explanation, lists, and tables; code blocks and bare web URLs are skipped. Long replies are read in short sections. Starting another answer or leaving the conversation stops playback.

This uses the browser's [speech synthesis API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) with matching [local device voices](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice/localService). It adds no database records, AI requests, speech-service key, or paid API. Older saved answers without language metadata are checked locally with `franc-min`; detection may be imperfect for short or mixed text. Only installed voices marked local are used; availability and pronunciation depend on the device. If no matching Kinyarwanda, French, or English voice is available, the button explains that limitation instead of reading in another language. Playback is disabled while an answer is still being written. Unsupported browsers show a disabled control.

## Deployment

The prepared setup uses Vercel for the frontend and Render for the backend. [render.yaml](render.yaml) defines a **Free** Node service, backend dependency installation, startup, and the public `/health` liveness endpoint. Secret values are supplied in Render's dashboard, not committed. Keep the repository root as the Render working directory so backend imports from `shared/` are available. This file prepares the service; it does not publish anything by itself.

Public launch requires applying [backend/migrations/20261010_private_api_tables.sql](backend/migrations/20261010_private_api_tables.sql), which restricts direct access to profiles, sessions, and messages and prevents public writes to legal documents. The API changes are implemented and use a separate backend service client after identity and authorization checks. All API routes now verify Firebase identity; owner routes check the account or conversation owner, and admin/role changes require the stored admin role. Apply the private memory migration to enable account persistence. The database migrations must be applied before launch; local code changes do not alter existing Supabase privileges.

[Render Free services](https://render.com/docs/free) sleep after 15 minutes idle and can take about a minute to restart. They have monthly limits and are intended for previews or hobby use, not guaranteed production availability. Keep the service on Free; without a payment method, excess bandwidth suspends service rather than billing it. [Vercel Hobby](https://vercel.com/docs/plans/hobby) is for personal, non-commercial use; verify that the beta qualifies before choosing it. Free hosting does not remove Groq or search quotas.

Set the Vercel frontend root directory to `frontend`. `frontend/vercel.json` sets Vite, installation with `npm ci --include=dev`, build command `npm run build`, output directory `dist`, and frontend route rewrites. Enable source files outside the root directory so imports from `shared/` are included. If deployment settings still select pnpm from an older commit, set the Install Command override to `npm ci --include=dev` and redeploy the latest commit. The frontend's obsolete pnpm lockfile and placeholder build-policy file were removed; npm is the project's package manager.

Host the backend separately with working directory `backend` and start command `npm start`. Set its environment variables, the deployed frontend origin, and the port expected by the host. Backend hosting must support streamed responses without proxy buffering.

Set frontend `VITE_API_URL` to the deployed backend URL before building. Add the frontend domain to Firebase's authorized domains.

## Known issues

- Primary live search needs a valid backend `TAVILY_API_KEY`. The Groq backup depends on its own model access and remaining tokens. Neither search provider removes Groq generation limits, and the app cannot verify or control the Groq account's billing plan.
- API identity and owner/admin authorization checks are implemented. Apply the private-table access migration before exposing the app publicly; existing Supabase permissions do not change automatically. Firebase token revocation is not checked before token expiry, and Firestore rules still need review.
- The checked-in SQL does not reproduce the full database, and Firebase rules are not versioned here.
- The homepage references `frontend/assets/videos/video1.mp4`, but the folder currently contains only `video10.mp4`. Supply the intended video or update the reference.
- There is no admin setup script or license file.

For setup problems, check the backend terminal and browser console. Missing-key errors usually mean an empty backend `.env` value. A model error usually means an incorrect `GROQ_MODEL` or unavailable model. During development, the browser calls `/api` on Vite's own origin and Vite proxies requests to `VITE_API_URL`; the backend must still be running. History reads retry transient connection errors up to twice and retry when the browser comes back online; chat POSTs are not automatically resent. A connection error is shown instead of claiming there are no saved chats. Restart Vite after changing its API target. Production builds use the backend URL directly; set backend `FRONTEND_URL` to the deployed frontend origin if CORS blocks those requests.
