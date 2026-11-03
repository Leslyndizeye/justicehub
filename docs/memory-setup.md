# Enable JusticeHub memory

## Account storage

Open the [configured Supabase project's SQL Editor](https://supabase.com/dashboard/project/lazejiagfzqqqkesuvgk/sql/new).
If access is denied or the project is not listed, its owner must invite your
Supabase account or apply the migration. A service-role API key does not provide
a dashboard login or a SQL execution connection.

Run [the private memory migration](../backend/migrations/20261009_user_memories.sql).
The committed copy is also available on
[GitHub](https://github.com/Leslyndizeye/justicehub/blob/908ecf9/backend/migrations/20261009_user_memories.sql).
It creates only the owner-isolated memory table and grants access to the
privileged backend after Firebase sign-in verification. It does not delete
existing chats or expose the table to anonymous access.

Render's `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` must refer to that same
project. A repository deployment does not apply the SQL migration.

## Use memory

1. Sign in to JusticeHub and open **Menu → Memory**.
2. Choose **Reload account memory** after applying the migration. Look for
   **Synced with your account**. Browser-only status is not cross-device sync.
3. Save a short note, or say `Remember that my case concerns a tenancy dispute.`
   Case details require an explicit save; they are not collected automatically.
4. Review the saved details. Turn on **Use saved details in AI replies** only
   for information you have permission to send to the AI service. Without
   this permission, direct memory lookups still work, but AI answers do not
   receive saved notes.
5. Start a new chat and ask `What do you remember about my case?`. Then try
   a relevant follow-up. For a second-device test, sign in to the same account
   there and check that the memory status is synced before asking.

Notes have a 240-character limit. Keep important conditions and use separate
notes for different cases. Several saved cases may require choosing which
case a question concerns. Recent notes are prioritised within the request
size limit; saved reports never replace verified legal sources.

Use **Forget** beside a note, **Clear saved memory**, or chat commands such as
`Forget my case`. Disable **Use saved details in AI replies** to stop adding
notes to new requests. Clearing memory does not delete earlier conversations.

Memory settings and notes are shared across Groq connections through
JusticeHub, not trained into either model. Never save service credentials.
