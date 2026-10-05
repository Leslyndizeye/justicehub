# JusticeHub

JusticeHub is a web app for exploring Rwandan legal information. It includes a public landing page, Firebase sign-in, an AI consultation dashboard with saved conversations, and an admin dashboard for users, conversations, and legal documents.

The frontend uses React, TypeScript, and Vite. The Express backend stores data in Supabase and calls Groq for AI responses, using matching legal documents as context. Firebase Authentication handles login; Firestore also stores signup profile details.

## Before a collaborator starts

Credentials are **not** included in the repository. Local `.env` files are ignored by Git; a new collaborator must copy the example files and fill in their values. The example files list the configuration the code currently reads. Full login, chat, and admin functionality also require cloud project access and a complete database schema.

Direct setup links:

- [Supabase dashboard](https://supabase.com/dashboard): open the existing project, use Connect for its URL, and Settings > API Keys for the key. See [Supabase's key guide](https://supabase.com/docs/guides/getting-started/api-keys).
- [Groq API keys](https://console.groq.com/keys): create a key or recover the key from the existing backend's environment settings.
- [Firebase console](https://console.firebase.google.com/project/ireme-30164/overview): open project `ireme-30164` after the owner grants access. Check Authentication, Firestore, and Project settings.

Use the owner's existing projects to work with existing data. A new project needs its own database and authentication setup.

Collect the following from the project owner or existing deployments:

| Needed | Where to look | Status in this repository |
| --- | --- | --- |
| `SUPABASE_URL` and `SUPABASE_ANON_KEY` | Existing backend environment settings, or the Supabase project's Connect dialog and Settings > API Keys. See [Supabase's key guide](https://supabase.com/docs/guides/getting-started/api-keys). | Values missing; required by `backend/supabase.js`. |
| `GROQ_API_KEY` | Existing backend environment settings, or the owner's Groq account. See the [Groq quickstart](https://console.groq.com/docs/quickstart). | Value missing; required by `backend/server.js`. |
| Firebase project access | Ask for access to project `ireme-30164`, or agree on a separate development project. Web configuration is available in Firebase project settings; see [Firebase web setup](https://firebase.google.com/docs/web/setup). | Web configuration is already hardcoded in `frontend/components/firebaseConfig.js`; console access is separate. |
| Firebase Authentication settings and Firestore rules | Existing Firebase console: enabled providers, authorized domains, email action templates, and Firestore rules. | Email/password and Google login are used. No Firestore rules file or Firebase deployment configuration is checked in. |
| Current Supabase schema, grants, and row level security policies | Export schema/migrations from the existing Supabase project or ask the previous maintainer. | `backend/schema.sql` is incomplete for the current code; details below. |
| Legal document seed history and order | Existing database and the maintainer's setup notes. | Seed files exist, but there is no automated runner or verified complete execution order. |
| Deployed frontend/backend URLs and hosting access | Existing hosting dashboards and the project owner. | Frontend Vercel rewrites exist; no backend deployment configuration is checked in. |
| Development admin account | Ask which test account should have `profiles.role = 'admin'` in the development database. | No admin bootstrap script. The checked-in schema currently rejects this role. |

Share secret values through a private channel or secret manager. Commit the example files, not filled-in `.env` files. Do not put Groq or privileged Supabase keys in frontend variables.

## Local setup

Run the commands from the repository root, the directory containing this README, `frontend/`, and `backend/`. Each folder is a separate npm project with its own `package.json` and environment file.

Use Node.js 22.13 or later in the 22.x line, or Node.js 24, with npm and Git installed. These versions meet the engine requirements of the checked-in dependencies. No Node version is pinned in the repository.

### 1. Install dependencies

```sh
npm --prefix frontend ci
npm --prefix backend ci
```

Both projects have npm lockfiles. Use `npm ci` for a reproducible install. The frontend also contains the existing pnpm lockfile and configuration; if continuing with pnpm, run `pnpm install --frozen-lockfile` inside `frontend/` and use `pnpm dev` / `pnpm build` there. Use one package manager consistently within each folder. If PowerShell blocks `npm.ps1`, use `npm.cmd` in place of `npm` in these commands.

### 2. Create environment files

In PowerShell, copy these files once if you do not already have local `.env` files, before adding your values. Existing local files were preserved during the folder reorganization:

```powershell
Copy-Item frontend/.env.example frontend/.env
Copy-Item backend/.env.example backend/.env
```

In Git Bash or on macOS/Linux, use `cp` instead of `Copy-Item`.

Frontend `frontend/.env`:

| Variable | Required? | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | Optional locally | Backend base URL, without `/api` or a trailing slash. Defaults to `http://localhost:4000`. Set to the deployed backend URL for a hosted frontend. |

Backend `backend/.env`:

| Variable | Required? | Purpose |
| --- | --- | --- |
| `SUPABASE_URL` | Yes | Supabase project URL. |
| `SUPABASE_ANON_KEY` | Yes | The key read by the current Supabase client. Obtain the project's `anon` key for the existing setup and confirm its grants/policies. This variable name is used literally in code. |
| `GROQ_API_KEY` | Yes | Groq API key used for chat completions. |
| `GROQ_MODEL` | Optional | Groq chat model ID; defaults to `openai/gpt-oss-120b`. Choose a model available to your Groq project. |
| `FRONTEND_URL` | Optional locally | One additional allowed frontend origin, such as `https://your-site.example`. Local `http://localhost:5173` is always allowed. Do not include a path or trailing slash. |
| `PORT` | Optional | Backend port; defaults to `4000`. If changed, update `VITE_API_URL` too. |

Supabase also offers publishable and secret keys; consult its linked key guide when planning a migration. Do not substitute a privileged key to work around missing permissions: the current API does not verify callers or enforce admin roles.

Firebase currently reads its configuration directly from `frontend/components/firebaseConfig.js`, configured for project `ireme-30164`. Adding `VITE_FIREBASE_*` variables alone will have no effect. To use another Firebase project, update that configuration and configure Authentication and Firestore in the matching project. The current runtime uses Groq; no Gemini API key is read, despite the Google AI packages.

Restart the development servers after changing environment files. Vite frontend values are included at build time, so changing a deployed frontend's `VITE_API_URL` requires a rebuild.

### 3. Configure cloud services and the database

In Firebase project `ireme-30164`, configure the following in the console; adding the web configuration to the code does not enable these services:

- Authentication > Sign-in method: enable [Email/Password](https://firebase.google.com/docs/auth/web/password-auth) and [Google](https://firebase.google.com/docs/auth/web/google-signin), selecting a support email for Google sign-in.
- Authentication > Settings > Authorized domains: confirm `localhost` and any deployed frontend domain are listed.
- Firestore Database: [create the default Cloud Firestore database](https://firebase.google.com/docs/firestore/quickstart) if it does not exist, and configure rules for users to write their own `users/{firebaseUid}` document.

Signup writes to Cloud Firestore, not Realtime Database. The `databaseURL` in the Firebase configuration does not replace Firestore setup. Recover the existing rules if available, or define rules for the app's intended access rather than opening the database to everyone.

For Supabase, use a development project or an agreed development database. **Recover the missing schema/migrations before expecting the app to work fully.** The checked-in SQL creates `profiles`, `chat_sessions`, and `messages`, but does not match all backend queries:

| Gap | Why it matters |
| --- | --- |
| `profiles.auth_provider` is missing | Profile creation/update and admin queries use this column. Login can succeed in Firebase while saving the Supabase profile fails. |
| The `profiles.role` check excludes `admin` | Backend and frontend support `admin`, but the schema only allows `citizen`, `attorney`, and `judge`. |
| `legal_documents` is missing | Search, document administration, and all document seed files expect this table. The code uses `id`, `title`, `category`, `content`, `year`, and `source`. Recover its actual types, defaults, constraints, and search indexes. |
| Grants and row level security policies are missing | The backend uses a Supabase client without forwarding a Firebase token. Firebase login alone does not give the Supabase client an authenticated user session. Recover and review the intended access setup. |

Once the schema is complete, run the reviewed setup SQL in the development project's Supabase SQL Editor. `backend/schema.sql` is a starting point, not a complete installation. Its `CREATE TABLE IF NOT EXISTS` statements do not update existing table definitions.

Review seed files before executing them. `backend/seed_legal_docs.sql` starts with `DELETE FROM legal_documents`; rerunning it removes existing documents. Later files have ordering notes, some delete outdated entries, and repeated inserts can create duplicates. Confirm the seed history and order with the maintainer; do not run every file alphabetically or against a live database.

### 4. Start both servers

Terminal 1, from the repository root:

```sh
cd frontend
npm run dev
```

Terminal 2, from the repository root:

```sh
cd backend
npm run dev
```

Start the backend from `backend/` so `dotenv` reads `backend/.env`. Use `npm start` there when automatic restart is unnecessary.

Open `http://localhost:5173`. The backend defaults to `http://localhost:4000`; it exposes `/api/...` endpoints and has no root page or health endpoint. Keep the frontend on port 5173, or set `FRONTEND_URL` to the actual origin if Vite selects another port.

## Project layout

```text
justicehub/
  frontend/
    App.tsx                   Routing, auth state, and role lookup
    index.tsx                 React entry point
    index.html                HTML, CDN Tailwind styling, and fonts
    components/               Landing page, auth, Firebase, and dashboards
    assets/                   Frontend media
    package.json              Frontend dependencies and scripts
    vite.config.ts            Vite configuration
    tsconfig.json             TypeScript configuration
    vercel.json               Frontend route rewrites
    .env.example              Frontend configuration template
    .env                      Local frontend configuration (ignored by Git)
  backend/
    server.js                 Express routes, legal search, and Groq calls
    chatPrompt.js             Conversation style and reference-grounding instructions
    supabase.js               Supabase client
    schema.sql                Partial database setup
    seed_*.sql                Legal document data and corrections
    package.json              Backend dependencies and scripts
    .env.example              Backend configuration template
    .env                      Local backend configuration (ignored by Git)
  README.md                   Shared setup and collaboration guide
  .gitignore                  Ignore rules for both projects
```

Main routes: `/` (landing), `/auth` (authentication), `/dashboard` (consultations), and `/adminxt` (admin). The frontend selects the dashboard using the role in Supabase `profiles`. Signup also stores a role in Firestore; these stores are not synchronized by the current code, and the backend creates new profiles as `citizen`.

## AI conversation behavior

`backend/chatPrompt.js` defines JusticeHub's conversation style. Greetings and small talk receive brief, friendly replies. Answers use plain language, explain practical next steps, and ask a useful clarifying question when important facts are missing. Its main focus remains Rwandan legal information; it should not repeat a formal introduction or legal disclaimer on every turn.

For follow-ups, the backend loads the last 20 saved messages in the same session from Supabase. Browser-supplied `history` is ignored. Memory is limited to that saved session, so start a new session for a fresh conversation. Retrieved legal excerpts include their title, source, and reference number; the prompt treats them as potentially incomplete or outdated and tells the model to avoid invented citations and deadlines.

With the GPT-OSS models, the backend requests medium reasoning effort, hides reasoning from the reply, and allows up to 3,072 completion tokens. Ordinary replies are instructed to stay under about 150 words unless more detail is needed. Prompt changes improve response style but do not guarantee legal accuracy. A useful manual check is: "hello", "how are you?", share a fictional name, ask it to recall that name, then ask a legal question with missing case details and check that it asks for clarification.

## Build and verification

From the repository root:

```sh
cd frontend
npm run build
npm run preview
```

The frontend build outputs `frontend/dist/`. Preview serves the built frontend; the backend still needs to run separately. If preview uses a different origin, add that origin as `FRONTEND_URL` for local API requests and restart the backend.

There are no automated test or lint scripts configured. The backend `build` script only prints a message; its runtime entry point is `server.js`.

After setup, manually check signup, email/password and Google login, password reset, profile creation, an AI response, saved conversations after reload, and admin access with a designated development admin account. Check both the browser console/network panel and backend logs for failures.

## Deployment notes and current limitations

The checked-in `frontend/vercel.json` rewrites frontend routes to `index.html`; it does not deploy the Express backend. In Vercel or another frontend host, set the project Root Directory to `frontend`, build command to `npm run build`, and output directory to `dist` relative to that root. Update any existing hosting project that previously built from the repository root. Host the backend separately with working directory `backend`, dependency installation, and `npm start`.

Set the deployed backend URL as frontend `VITE_API_URL`, set the frontend origin as backend `FRONTEND_URL`, and configure backend Supabase/Groq variables. Confirm the hosting provider's port setting and Firebase authorized domains. The Groq chat model defaults to `openai/gpt-oss-120b`; set `GROQ_MODEL` to use another model available to your project. See [Groq's supported models](https://console.groq.com/docs/models). If Groq returns `model_not_found`, check the model ID and your project's access, update `GROQ_MODEL`, and restart the backend.

The API currently accepts user IDs and roles supplied by callers without verifying Firebase ID tokens or protecting admin routes. Chat checks that a session belongs to the supplied user ID, but that does not authenticate the caller; other routes also need ownership checks. Frontend redirects and CORS do not enforce API permissions. These are concrete implementation gaps to address before exposing user data or admin operations publicly.

## Collaboration

Agree on cloud project access, development data, the admin test account, and which database migrations have already been applied. Work on a branch and submit a pull request with the change and verification steps. Keep lockfiles with dependency changes and document schema/configuration changes alongside the code.

No license file is included; the owner should decide the project's license and sharing terms.
