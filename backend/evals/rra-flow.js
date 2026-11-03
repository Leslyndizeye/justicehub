// Opt-in live model checks. Uses provider quota, no database writes or web search.
// This is a small behavior/latency check, not legal review or a performance SLA.
import 'dotenv/config';
import assert from 'node:assert/strict';
import {configuredGroqConnection} from '../groqConnections.js';
import {createChatProvider,publicChatError} from '../chatProvider.js';
import {searchLegalDocs} from '../legalRetrieval.js';
import {lawExcerptMetadata} from '../lawArticles.js';

const provider=createChatProvider({client:configuredGroqConnection().client,
  model:process.env.GROQ_MODEL?.trim()||'openai/gpt-oss-120b',
  fallbackModel:process.env.GROQ_FALLBACK_MODEL?.trim()||'openai/gpt-oss-20b',searchSetting:'false',
  reasoningEffort:process.env.GROQ_REASONING_EFFORT?.trim()||'medium',
  externalSearch:{async lookup(){throw new Error('No live research is part of this dated-source check');}}});
const history=[{sender:'user',content:'What do you think about VAT?'}];
for(const message of ['how do i appeal?','what is the deadline?']) {
  const started=performance.now();
  try {
    const signal=AbortSignal.timeout(75000);
    const routing=await provider.understand({message,history,signal});
    const docs=await searchLegalDocs({from(){throw new Error('No database in this check');}},message,history,'en',{resolvedRoute:routing});
    assert.ok(docs.some(doc=>lawExcerptMetadata(doc)?.key==='law-20-2023'&&doc.articleNumber===51));
    let firstTokenMs;
    const reply=await provider.reply({message,history,legalDocs:docs,routing,replyLanguage:'en',streaming:true,signal,
      onEvent(event){if(event==='token'&&firstTokenMs===undefined)firstTokenMs=Math.round(performance.now()-started);}});
    console.log(JSON.stringify({message,answer:reply,firstTokenMs,totalMs:Math.round(performance.now()-started)}));
    assert.match(reply,/Article 51/);
    assert.match(reply,/In plain language/);
    assert.doesNotMatch(reply,/supported explanation.*not produced|couldn.t establish|Rates of value added tax|Article 197/);
    if(routing.answerTask==='deadline') {
      assert.match(reply,/thirty|30/i);
      assert.match(reply,/receipt|receiv/i);
    }
    console.log('PASS: small behavior check; current-law applicability still requires review.');
    history.push({sender:'user',content:message},{sender:'ai',content:reply});
  } catch(error) {
    console.error(error.code==='ERR_ASSERTION'?'Behavior assertion failed; review the answer above.':publicChatError(error).error);
    process.exitCode=1;break;
  }
}
