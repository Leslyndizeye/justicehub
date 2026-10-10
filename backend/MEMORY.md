# Selective account memory

Reviewed on 9 October 2026. This is the implemented selection policy, not a claim that a model understands every useful personal fact.

## Research and decisions

[LangChain's memory guide](https://docs.langchain.com/oss/javascript/concepts/memory) distinguishes conversation history from a user profile shared across conversations. Its discussion of profiles and collections highlights the risks of stale facts, unnecessary insertions, and updates that lose information. JusticeHub keeps a small account document separate from chat messages and checks revisions before database writes.

[The Mem0 paper](https://arxiv.org/abs/2504.19413) separates extracting candidate facts from deciding whether to add, update, remove, or leave existing facts alone. JusticeHub uses these operations with local, bounded rules. It does not install Mem0, use embeddings, or reproduce the paper's model-based results.

[Anthropic's memory documentation](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context) describes roles, ongoing projects, communication and technical preferences as useful context, alongside user controls and exclusions for sensitive topics. JusticeHub's legal use calls for particular care with clients' information and case narratives; these do not become automatic account memories.

## What counts as useful

A candidate must be clearly stated by the signed-in person, describe that person or their project, and be likely to help in another chat. Detection accepts specific supported English, Kinyarwanda, and French forms. It retains the person's statement or a supported scoped clause instead of inferring an unstated fact. Simple combined English preferences such as "I prefer short answers in Kinyarwanda" are separated into style and language clauses so forgetting one does not leave that detail embedded in the other.

| Detail | Example | Later recall |
| --- | --- | --- |
| Preferred name | My name is Aniela | What is my name? |
| Work | I work as a lawyer | What do I do for work? |
| Studies | Niga amategeko | Niga iki? |
| Current project | I am building JusticeHub | What is my project? |
| Goal | My goal is to become a judge | What is my goal? |
| Response style | I prefer simple explanations | What answers do I prefer? |
| Reply language preference | Ujye unsubiza mu Kinyarwanda | What language do I prefer? |
| Languages spoken | I speak English and French | What languages do I speak? |
| General location | Ntuye i Kigali | Ntuye he? |
| Skills | I code in TypeScript | What are my skills? |
| Interests | I am interested in constitutional law | What am I interested in? |
| Project budget | I need only free tools | What is my budget? |
| Computer constraints | My laptop has 16 GB RAM | What computer do I use? |
| Hosting requirement | I want a public website | What are my project constraints? |

Budget, computer, and hosting details occupy separate slots. Language preference and language ability also remain separate. Within a slot, a new clear statement replaces the earlier one. Repeated text differing only in capitalization or punctuation keeps the existing record. This is not arbitrary semantic deduplication or a full list of every project or skill a person has.

## Corrections and exclusions

Corrections such as "Actually, I live in Huye" update the corresponding slot. Supported retractions such as "I no longer study law" or "Siniga amategeko" remove matching old information. An unrelated negative statement does not erase another fact. Statements are processed in order; a later retraction or forget request wins. Forgetting a category prevents automatic restoration until the person explicitly remembers it again through an explicit remember request.

Automatic extraction skips recognized questions, hypothetical or quoted examples, code, uncertain claims, temporary situations, other people's details, private case descriptions, credentials, and sensitive personal topics. A precise address does not qualify as general location. These rules are conservative and incomplete; native-speaker review and broader examples remain useful. Explicit notes and manual edits retain their existing credential filters and user controls.

## Persistence and limits

One preferred name and sixteen notes fit in the existing version-one memory document. A full document does not silently discard old notes to make room. The private API takes ownership from a verified Firebase token. No database schema change is needed for the new categories, but the original `user_memories` migration must be applied before account synchronization works.

Details persist across chats and devices only after successful database synchronization, with no automatic expiry. Without the table or a working connection, the browser copy remains the fallback. There is no memory panel. Review, correction, clearing, and pause/resume actions use chat commands; synchronization failures are logged to the browser console. Only newly entered messages are checked for these background facts; earlier chat recovery continues to look for explicit names.

Extraction and personal recall make no model or search calls. Saved details are not automatically sent to Groq or Tavily and do not yet personalize arbitrary model-generated answers. Language detection still follows the latest message. Adding a model-based extractor or general personalization would require a separate data-sharing choice and evaluation.
