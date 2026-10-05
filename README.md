# JusticeHub

JusticeHub helps people understand Rwandan law, their rights and responsibilities, legal documents, and lawful options. It supports citizens and legal research for people working on cases, including criminal defence and truthful sentencing mitigation. It can check official sources for current information, while also answering everyday questions naturally.

Users can sign in, ask questions, and revisit saved conversations. An admin dashboard manages users, conversations, and legal documents. JusticeHub provides information and research support; it does not provide legal representation or decide cases.

Built with React, TypeScript, Vite, Express, Firebase, Supabase, and Groq.

## Project structure

```text
justicehub/
  frontend/       Website, authentication screens, and dashboards
  backend/        API, chat instructions, database setup, and legal document seeds
  README.md
  .gitignore
```

Each folder has its own `package.json`, dependencies, and `.env` file.

## Requirements

- Node.js 22.13+ in the 22.x line, or Node.js 24, with npm.
- Firebase Authentication and Cloud Firestore.
- A Supabase project with the required tables.
- A Groq API key with access to the configured chat model.

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
| `frontend/.env` | `VITE_API_URL` | Backend base URL. Defaults to `http://localhost:4000`. |
| `backend/.env` | `SUPABASE_URL` | Required Supabase project URL. |
| `backend/.env` | `SUPABASE_ANON_KEY` | Required Supabase key read by the current client. |
| `backend/.env` | `GROQ_API_KEY` | Required Groq API key. |
| `backend/.env` | `GROQ_MODEL` | Chat model. Defaults to `openai/gpt-oss-120b`. |
| `backend/.env` | `GROQ_FALLBACK_MODEL` | Model tried when the main model is rate-limited or unavailable. Defaults to `openai/gpt-oss-20b`; set `none` to disable. |
| `backend/.env` | `GROQ_REASONING_EFFORT` | GPT-OSS reasoning effort: `low`, `medium`, or `high`. Defaults to `medium`; higher effort can use more tokens. |
| `backend/.env` | `GROQ_WEB_SEARCH` | Enables built-in internet search by default on supported models. Set `false` to disable. |
| `backend/.env` | `FRONTEND_URL` | Additional allowed frontend origin. Local `http://localhost:5173` is always allowed. |
| `backend/.env` | `PORT` | Backend port. Defaults to `4000`. |

Use base URLs without a trailing slash; `VITE_API_URL` should not include `/api`. Keep Groq keys and privileged database keys out of frontend variables. Restart the servers after changing `.env`; rebuild the frontend when changing its deployed configuration.

Firebase web configuration is in `frontend/components/firebaseConfig.js`, currently pointing to project `ireme-30164`. It does not read `VITE_FIREBASE_*` variables. Chat uses Groq and does not require a Gemini key.

### Service setup

- [Firebase console](https://console.firebase.google.com/project/ireme-30164/overview): enable Email/Password and Google sign-in, authorize `localhost` and deployed frontend domains, and configure Cloud Firestore rules for `users/{firebaseUid}`. Signup uses Firestore, not Realtime Database.
- [Supabase dashboard](https://supabase.com/dashboard): manage the database, project URL, and API keys. See the [API key guide](https://supabase.com/docs/guides/getting-started/api-keys).
- [Groq API keys](https://console.groq.com/keys): create or manage the key used by the backend. Check [model availability](https://console.groq.com/docs/models) if chat returns `model_not_found`.

Environment files allow the app to connect to these services. Managing their settings requires separate account access.

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

If PowerShell blocks `npm.ps1`, use `npm.cmd` instead of `npm`. The frontend also has a pnpm lockfile: when using pnpm for dependency installation, run `pnpm install --frozen-lockfile` inside `frontend/`. Keep dependency changes consistent with the package manager you choose.

## Commands

| Folder | Command | What it does |
| --- | --- | --- |
| Either | `npm ci` | Installs the versions in `package-lock.json`, replacing `node_modules`. |
| `frontend` | `npm run dev` | Starts Vite for development. |
| `frontend` | `npm run build` | Creates the production website in `frontend/dist/`. |
| `frontend` | `npm run preview` | Previews that production build locally. |
| `frontend` | `npm test` | Runs stream parsing and Markdown rendering tests without external API calls. |
| `frontend` | `npx tsc --noEmit` | Checks TypeScript. |
| `backend` | `npm run dev` | Starts the API with automatic restart when source files change. |
| `backend` | `npm start` | Starts the API without automatic restart. |
| `backend` | `npm test` | Checks search configuration, source links, and conversation instructions without external API calls. |
| `backend` | `npm run eval:chat -- client_defence` | Runs an opt-in live check of client-case understanding using Groq. Uses API tokens; does not write to the database. |

The backend needs no compilation step. Its `build` script currently only prints a message.

## App notes

Routes are `/`, `/auth`, `/dashboard`, and `/adminxt`. New Supabase profiles start as `citizen`; admin access depends on `profiles.role`. Signup also writes a role to Firestore, but these role records are not synchronized.

Chat streams replies as they are generated. The Stop button cancels generation and preserves any partial answer already generated. Follow-ups use up to 20 recent saved messages, within a 6,000-character history budget. Retrieved legal excerpts also have a size limit; the full source should be checked for consequential questions. Start a new session for a fresh conversation.

Follow-up questions use the current conversation's topic, including short messages and obvious typos. Broad requests such as "latest tax laws in Rwanda" should get a sourced overview before an offer to narrow the topic. Clarifying questions are reserved for missing details that affect the answer, such as a case-specific deadline or an unidentified particular law. When the model omits direct links, a "Pages checked" list shows specific pages the browser actually opened; check these before relying on legal dates or provisions.

JusticeHub answers general questions as well as legal questions. With `openai/gpt-oss-120b` or `openai/gpt-oss-20b`, Groq's [built-in browser search](https://console.groq.com/docs/tool-use/built-in-tools/browser-search) can look up news and other changing information using the existing backend Groq key. No separate search key is needed. The assistant is instructed to search for news and changing facts, while vague questions can get a clarifying reply before a lookup. Source links appear in the answer, and the chat shows when web search is used. The current date is included in every request to help it find recent information.

When a model returns a rate limit, the backend tries the fallback once, before any answer text has been sent. Both default models support browser search. A blocked model is skipped until its reported retry time passes. The backend bounds conversation and excerpt sizes and defaults to medium reasoning effort for case understanding. Set `GROQ_REASONING_EFFORT=low` if reducing token use is more important. If all configured models are limited, the chat shows how long to wait. Restarting the app or creating another API key does not reset an organization quota; see [Groq rate limits](https://console.groq.com/docs/rate-limits).

Search availability and usage charges depend on your Groq account. Changing to another model may remove search support. If search is disabled or a lookup fails, the assistant should explain that it cannot verify current information. Web results can still be incomplete or outdated; check the linked source and publication date for important decisions.

Response instructions are in `backend/chatPrompt.js`. Reporting contact references and their official source links are in `backend/officialContacts.js`; recheck the sources when updating contacts. Message formatting is handled by `frontend/components/ChatMarkdown.tsx`.

The assistant should preserve who is involved in a scenario: a user's client is not the user. Questions about lawful defence, reviewing evidence, or reducing a sentence are supported even when an intentional act is described. It should refuse requests to fabricate evidence, conceal offences, intimidate witnesses, or otherwise obstruct proceedings, and suggest a lawful alternative. Case-specific penalties, deadlines, and eligibility still require verified sources and relevant facts.

Live behavior checks are in `backend/evals/assistant-behavior.mjs`. The available cases are `purpose`, `client_defence`, and `fabricated_evidence`. Run one by passing its name to `npm run eval:chat -- <case>`, or omit the name to run all three. They check basic response behavior; review the actual answer and its sources for legal accuracy.

## Deployment

Set the frontend hosting root directory to `frontend`, build command to `npm run build`, and output directory to `dist`. `frontend/vercel.json` handles frontend route rewrites.

Host the backend separately with working directory `backend` and start command `npm start`. Set its environment variables, the deployed frontend origin, and the port expected by the host. Backend hosting must support streamed responses without proxy buffering.

Set frontend `VITE_API_URL` to the deployed backend URL before building. Add the frontend domain to Firebase's authorized domains.

## Known issues

- The API does not verify Firebase ID tokens or protect admin routes. Matching a session to a supplied user ID is not authentication; API authorization needs work before exposing private data or admin operations publicly.
- The checked-in SQL does not reproduce the full database, and Firebase rules are not versioned here.
- The homepage references `frontend/assets/videos/video1.mp4`, but the folder currently contains only `video10.mp4`. Supply the intended video or update the reference.
- There is no admin setup script or license file.

For setup problems, check the backend terminal and browser console. Missing-key errors usually mean an empty backend `.env` value. A model error usually means an incorrect `GROQ_MODEL` or unavailable model. Browser CORS errors can occur when the frontend runs on an origin other than `http://localhost:5173`; set `FRONTEND_URL` to the actual origin and restart the backend.
