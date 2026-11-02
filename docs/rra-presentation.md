# JusticeHub: RRA presentation preparation

Prepared 2 November 2026. This guide describes a pilot and proposed validation work; it is not an RRA endorsement or a statement of complete legal coverage.

## Opening pitch

“JusticeHub helps people ask tax and legal questions in everyday language, understand a cited provision, and continue with relevant follow-up questions. We want to work with RRA on a focused taxpayer-assistance pilot using sources that RRA can validate and help keep up to date.”

## Five-minute presentation

1. **Problem — 45 seconds:** A taxpayer may know what happened without knowing the legal term, article number or next procedural step. Show one informal question.
2. **Product — 45 seconds:** Explain the conversation, document citations, language support, and the distinction between an explanation and a verified current-law answer.
3. **Demonstration — two minutes:** Start with a question about VAT, open the cited source, then ask about an appeal and its deadline. Confirm that the answer changes task while retaining the topic. Use a fictional scenario without taxpayer identifiers. Rehearse the exact flow against the deployed website first; local retrieval tests do not prove a live end-to-end answer.
4. **Trust and limits — 45 seconds:** Explain how source versions, amendments, missing evidence and escalation are handled. Show a missing-source question and its honest limitation if time permits.
5. **Pilot request — 45 seconds:** Ask RRA to help select the highest-value taxpayer questions, validate the source collection, review example answers, and nominate a small pilot group.

Keep a short screen recording and screenshots of a rehearsed successful run in case connectivity fails. Identify recorded material as recorded.

## What can honestly be claimed today

- The local collection contains 16 published PDFs and three selected penal-code provisions. It is not a complete or current consolidated Rwanda law collection.
- The conversation framework recognizes 48 legal fields. Recognition does not establish that the laws for a field are indexed or that its answers have passed legal review.
- The repository includes source-bound answering, local article retrieval and optional web research. No fine-tuning of Gemini or Groq model weights has been performed.
- Chat currently uses Groq. Gemini is used for optional read-aloud, with a free-tier-only configuration. Enabling Gemini billing alone will not migrate or accelerate chat.
- Cross-device account memory still requires the existing memory-table migration in the Supabase project actually used by Render. Browser-only memory is not the same feature.

## Source work required before a current-tax-law demonstration

The indexed 2022 income-tax and 2023 VAT texts are dated sources. The [Rwanda Law Reform Commission's May 2025 publication report](https://www.rlrc.gov.rw/news-details/report-on-legal-instruments-published-to-the-web-portal-and-rlrcs-website-as-of-may-2025) identifies later amendments: Law 009/2025 for VAT and Law 014/2025 for income tax. Their existence means a dated base text alone cannot establish the current rule. This check is not an exhaustive amendment audit.

Use [RRA's legislation collection](https://www.rra.gov.rw/rra/index.php?L=0&id=280) to obtain and review the applicable laws, amendments, orders and directives. Track publication, commencement, expiry and supersession separately. A handbook can explain practice but should not silently replace binding legislation.

Suggested pilot coverage: registration/TIN, VAT, income tax/PAYE, EBM/invoicing, declarations and payments, penalties, objections/appeals, and customs. Choose a small validated set first and add other fields with their own verified sources. Have a Rwanda tax specialist review applicability and example answers.

## Speed and spending

Measure a cold visit, an ordinary explanation, a source-backed follow-up, and a web-research question separately. Record time to first visible response, time to completed verified answer, and failures; repeat enough times to see variability. Do not promise a response-time figure from local unit tests.

- The repository's Render configuration specifies a free instance; confirm the actual service plan in the dashboard. [Render documents](https://render.com/docs/free#spinning-down-on-idle) that free services sleep after 15 idle minutes and can take about a minute to resume. A paid **service compute instance** removes this idle-sleep limitation; it does not fix database or model failures. Changing the workspace subscription alone does not upgrade the instance.
- [Gemini API billing](https://ai.google.dev/gemini-api/docs/billing) offers prepaid credits, currently with a $5 minimum purchase. Paid tiers provide higher usage limits; [limits still apply](https://ai.google.dev/gemini-api/docs/rate-limits).
- Google's [Priority inference](https://ai.google.dev/gemini-api/docs/priority-inference) is a separate premium processing option in preview. It requires a compatible integration; adding credits alone does not select it.
- Benchmark any proposed chat provider on the same taxpayer scenarios, checking latency, cited support, follow-up accuracy and cost per completed answer. Choose after this comparison. Keep provider keys on the backend.

## Final rehearsal

Confirm the deployed revision, sign-in and protected chat access, source links, the intended language, follow-up context, retry/Stop behavior, and the missing-source response. Resolve account/database failures before inviting live questions. Avoid deploying during the presentation. Prepare a clear human-support handoff and collect feedback without requesting private taxpayer data.

Proposed pilot measures: correct cited source, supported interpretation, correct follow-up topic, clear language, response time, failure rate, and usefulness as assessed by taxpayers and RRA reviewers. Record these as measurements to obtain, not achievements already established.

## Development checks on 2 November 2026

The updated backend passed 266 automated tests and 36 local retrieval targets. Added flow tests cover all 48 registered fields, topic changes, missing-source isolation, separate-law comparison, VAT exemptions, and appeal-to-deadline context. These tests do not establish legal accuracy for every question.

One live Groq appeal answer included the relevant Articles 51 and 52 and completed in about 9.6 seconds in this development run. The immediate deadline follow-up encountered the provider's usage limit, so that live sequence did not pass in full. The deployment's authenticated chat and performance still need a separate rehearsal. [Groq's limits documentation](https://console.groq.com/docs/rate-limits) explains the organization-level limits; examine the actual account's limits before choosing a paid plan.

Run `npm --prefix backend run eval:rra` to repeat the small live check using the configured API credentials. It uses model quota and stops on failure; it does not write to the application database, enable billing, or verify current law.
