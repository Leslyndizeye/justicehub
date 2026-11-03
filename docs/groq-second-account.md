# Test a second Groq connection

JusticeHub keeps its prompts, recent conversation history, source retrieval,
language handling and citation checks in the application. A second connection
does not need separate training. Different responses still require review.

## Configure Render

1. Open [Render Dashboard](https://dashboard.render.com), select the backend
   service serving `justicehub-dr4e.onrender.com`, and open **Environment**.
2. Keep the existing `GROQ_API_KEY`.
3. In the second account's [Groq API Keys](https://console.groq.com/keys), create
   an API key and add it in Render as `GROQ_SECONDARY_API_KEY`.
4. Set `GROQ_ACCOUNT_MODE` to `secondary`, then choose **Save, rebuild, and deploy**.
   This uses only the second account, so you can check it independently.
5. In the Render logs, check for `Chat connection mode: secondary`. No key is
   logged. Open JusticeHub and ask `What do you think about fraud?` This uses
   model generation. Greetings and the reviewed theft comparison do not test
   provider access because they are answered without a model call.
6. After the isolated test, set `GROQ_ACCOUNT_MODE` to `failover` and deploy.
   To return to the original setup, set it to `primary` and deploy.

These variables are backend settings. Vercel needs no key or configuration
change. Render's [environment-variable guide](https://render.com/docs/configure-environment-variables)
explains its save and deployment options.

Never paste keys into chat, Git, screenshots, frontend variables or browser
storage. Use only accounts you are authorized to use. Check each account's
billing settings: using its key can incur its configured usage charges.

## Automatic service fallback

In `failover` mode, the primary connection receives each request first. A
temporary connection failure, SDK timeout, or supported service error
(408/500/502/503/504) before a response starts can try the same request once
on the secondary connection. It keeps the requested model, instructions,
sources, output format and language. Each physical call has a ten-second SDK
timeout inside the existing application deadline; SDK retries stay disabled.

A failing connection is held back for 30 seconds per backend process. If both
connections are unavailable, requests fail without repeatedly calling them
until the waiting period ends. No automatic switch occurs after a stream has
started. Stop cancels the request and prevents switching.

Quota errors (429) pin requests to the limited account until its reported
reset. Existing model fallback may still use another model within that same
account. Authentication, permission, oversized-request and other invalid-input
errors do not trigger another account. This is service resilience, not extra
free quota: [Groq's policy](https://console.groq.com/docs/legal/ai-policy)
prohibits multiple-account orchestration to exceed published limits, and
[organization limits](https://console.groq.com/docs/rate-limits) apply across
its keys. A Groq-wide outage can affect both accounts.

This connection is shared by question understanding, answers, translation
repair and the optional Groq research backup. Tavily and the database keep
their existing connections. Both Groq accounts can therefore receive the
same recent conversation data in this mode.

## Verification

The offline connection tests simulate temporary failures, unchanged requests,
quota waits, cancellation and broken streams without calling Groq:

```powershell
cd backend
node --test tests/groqConnections.test.js
```

An actual second-account test still requires its key in Render and the
authenticated chat check above. A green `/health` response establishes that
the backend is running; it does not verify either account's model access.
