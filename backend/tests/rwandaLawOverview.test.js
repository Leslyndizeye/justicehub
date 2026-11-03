import {test} from 'node:test';
import assert from 'node:assert/strict';
import {questionRoute} from '../questionRouting.js';
import {searchLegalDocs} from '../legalRetrieval.js';
import {createChatProvider} from '../chatProvider.js';
import {rwandaLawOverviewAnswer} from '../rwandaLawOverview.js';
import {rwandaLawOverviewQuestion} from '../../shared/rwandaLawOverview.js';
import {generalDiscussionIssue} from '../generalDiscussion.js';
import {lawExcerptMetadata} from '../lawArticles.js';

const message='so tell me about rwandans laws which are interesting ..?';
const noDatabase={from(){throw new Error('The constitutional overview uses the local published source');}};
const limited=()=>Object.assign(new Error('Quota'),{status:429,headers:new Headers({'retry-after':'60'})});

test('the exact interesting-laws question gets a dated, cited overview even during a real model cooldown',async()=>{
  let calls=0;
  const provider=createChatProvider({model:'openai/gpt-oss-120b',client:{chat:{completions:{async create(){calls++;throw limited();}}}},
    externalSearch:{lookup(){throw new Error('No live research is claimed');}}});
  await provider.understand({message:'he said it was fine, what should i do?'});
  assert.equal(calls,2);
  const routing=await provider.understand({message});
  assert.equal(routing.kind,'legal');assert.equal(routing.intent,'rwanda_law_overview');
  const docs=await searchLegalDocs(noDatabase,message,[],'en',{resolvedRoute:routing});
  assert.deepEqual(docs.map(doc=>doc.articleNumber),[23,16,10]);
  assert.ok(docs.every(doc=>lawExcerptMetadata(doc).key==='constitution-2023'));
  const tokens=[];
  const reply=await provider.reply({message,legalDocs:docs,routing,replyLanguage:'en',streaming:true,
    onEvent(event,data){if(event==='token')tokens.push(data.text);}});
  assert.equal(calls,2);assert.equal(tokens.join(''),reply);
  assert.match(reply,/30% of positions in decision-making organs/);
  assert.match(reply,/published 2023|2023 Constitution/);
  assert.match(reply,/later amendments have not been checked/i);
  assert.match(reply,/Privacy.*Article 23/);assert.match(reply,/Equality.*Article 16/);
  assert.equal((reply.match(/https:\/\/www\.minijust\.gov\.rw/g)||[]).length,3);
  assert.doesNotMatch(reply,/Gacaca|lower.level crimes|gender.parity indexes|mandates equal representation/);
});

test('overview generation preserves source requirements, article identity, number of examples and language',async()=>{
  const docs=await searchLegalDocs(noDatabase,message);
  for(const language of ['en','rw','fr']) {
    const translatedDocs=await searchLegalDocs(noDatabase,message,[],language);
    assert.ok(rwandaLawOverviewAnswer(message,translatedDocs,language),language);
  }
  assert.equal(rwandaLawOverviewAnswer(message,docs.slice(0,2),'en'),null);
  assert.equal(rwandaLawOverviewAnswer(message,docs.map(doc=>({...doc,content:doc.content.replace('30%','50%')})),'en'),null);
  assert.equal(rwandaLawOverviewAnswer(message,docs.map(doc=>({...doc,coverage:'partial_article'})),'en'),null);
  const one=rwandaLawOverviewAnswer('Give me one interesting law in Rwanda',docs,'en');
  assert.equal((one.match(/https:\/\//g)||[]).length,1);
  assert.equal(rwandaLawOverviewAnswer('Which current tax law applies to my business?',docs,'en'),null);
});

test('specific facts, dates, foreign jurisdictions, current verification and named institutions remain research requests',()=>{
  for(const text of ['Tell me about current Rwandan laws','Give me interesting Rwanda tax laws',
    'Tell me about laws in Rwanda in 2026','Tell me about interesting laws in Kenya',
    'Tell me about Gacaca courts today','Tell me which Rwanda law applies to my divorce',
    'Tell me all Rwandan laws','Tell me interesting laws in Rwanda; search online',
    'What is law?','Which law?'])assert.equal(rwandaLawOverviewQuestion(text),null,text);
  for(const text of [message,'Tell me about Rwandan laws','Show me three interesting laws in Rwanda',
    'Mbwira amategeko ashimishije yo mu Rwanda','Parle-moi des lois intéressantes au Rwanda'])assert.ok(rwandaLawOverviewQuestion(text),text);
});

test('the reported unsourced court-history and constitutional claims cannot pass the conceptual-discussion guard',()=>{
  for(const draft of ['One notable feature is the Gacaca courts, where local panels hear cases.',
    'The constitution mandates equal representation of women in parliament and public office.',
    'Rwanda consistently ranks at the top of global gender-parity indexes.'])assert.equal(generalDiscussionIssue(draft),'legal_claim');
  assert.equal(generalDiscussionIssue('Privacy helps people feel secure and control what they share about themselves.'),null);
});
