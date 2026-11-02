import {test} from 'node:test';
import assert from 'node:assert/strict';
import {questionRoute} from '../questionRouting.js';
import {createChatProvider} from '../chatProvider.js';
import {searchLegalDocs,rankLegalDocuments} from '../legalRetrieval.js';
import {searchLocalLaws} from '../localLawSearch.js';
import {sourceReadingReply} from '../lawGrounding.js';
import {sourceBody,sourceMatchesTopic} from '../sourceRelevance.js';
import {evidenceBundle,validateEvidenceAnswer} from '../evidenceAnswer.js';

const cyber=searchLocalLaws('Law No. 60/2018 article 34')[0];
const legacy={...cyber,content:sourceBody(cyber)};
const never=()=>{throw new Error('A basic introduction must not use legal retrieval or web research');};

test('the exact stealing introduction answers naturally despite an earlier unrelated assistant article',async()=>{
  const message='tell me about stealing';
  const history=[{sender:'ai',content:'Article 34: Publication of pornographic images through a computer or a computer system.'}];
  const expected='Stealing means taking something that belongs to someone else without their permission. For example, taking someone’s phone from their bag is different from borrowing it with their agreement. It can cause loss and damage trust.\n\nAre you asking generally, or did something happen?';
  let calls=0;
  const provider=createChatProvider({model:'openai/gpt-oss-120b',externalSearch:{lookup:never},client:{chat:{completions:{async create(request){
    calls++;assert.match(request.messages[0].content,/GENERAL LEGAL DISCUSSION/);
    assert.equal(request.response_format,undefined);assert.equal(request.tool_choice,'none');
    if(request.stream)return (async function*(){yield {choices:[{delta:{content:expected}}]};})();
    return {choices:[{message:{content:expected}}]};
  }}}}});
  const routing=await provider.understand({message,history});
  assert.equal(routing.kind,'discussion');assert.equal(routing.field,'theft');
  assert.deepEqual(await searchLegalDocs({from:never},message,history,'en',{resolvedRoute:routing}),[]);
  const tokens=[];
  const answer=await provider.reply({message,history,routing,legalDocs:[cyber],replyLanguage:'en',streaming:true,
    onEvent(event,data){if(event==='token')tokens.push(data.text);}});
  assert.equal(answer,expected);assert.equal(tokens.join(''),answer);assert.equal(calls,1);
  assert.doesNotMatch(answer,/pornograph|Article 34|PDF passage|supported explanation/);
});

test('broad introductions work across fields while specific legal and personal requests retain analysis',()=>{
  for(const message of ['Tell me about theft','Please tell me a little about stealing','Tell me about fraud',
    'Tell me about privacy','Give me an overview of tenancy','Tell me about VAT'])assert.equal(questionRoute(message).kind,'discussion',message);
  for(const message of ['Tell me about the penalty for stealing','Tell me about stealing under article 166',
    'Tell me about stealing from my employer','Tell me about the current VAT law','Tell me about VAT exemptions',
    'Tell me about stealing. Search online.'])assert.notEqual(questionRoute(message).kind,'discussion',message);
  const route=questionRoute('what is the punishment?',[{sender:'user',content:'tell me about stealing'}]);
  assert.equal(route.kind,'legal');assert.equal(route.field,'theft');assert.equal(route.answerTask,'penalty');
});

test('neither tagged nor legacy pornographic-image provisions can be quoted as theft evidence',()=>{
  assert.equal(cyber.articleNumber,34);
  for(const doc of [cyber,legacy,{...legacy,title:'Theft penalties'}])for(const question of [
    'tell me about stealing','What does the law say about theft?','Can a person be punished for stealing?',
    'Umuntu wibye ahanishwa iki?']) {
    assert.equal(sourceMatchesTopic(doc,question),false,question);
    const reply=sourceReadingReply([doc],'en',question);
    assert.doesNotMatch(reply,/Article 34|pornograph|sexual|1,000,000|exact wording|> /,question);
  }
  assert.deepEqual(rankLegalDocuments([legacy],'What does the law say about stealing?','theft'),[]);
  assert.match(sourceReadingReply([cyber],'en','Explain Law No. 60/2018 article 34'),/Article 34/,
    'The same source remains available when it is actually requested');
});

test('unrelated DB passages are rejected even when a legal route is supplied directly',async()=>{
  let lookups=0;
  const query={textSearch(){return this;},order(){return this;},async limit(){lookups++;return {data:[cyber,legacy]};}};
  const client={from(){return {select(){return query;}};}};
  const docs=await searchLegalDocs(client,'What does Rwanda law say about stealing?',[],'en',{
    resolvedRoute:{kind:'legal',answerTask:'rule',field:'theft',researchTopic:'theft robbery'},localSearch(){return [cyber,legacy];}});
  assert.ok(lookups>0);assert.deepEqual(docs,[]);
  // VAT has no criminal-vocabulary topic: this separately exercises source
  // identity from a legacy URL, rather than relying only on offence words.
  const vatDocs=await searchLegalDocs(client,'How do I appeal a VAT assessment?',[],'en',{
    resolvedRoute:{kind:'legal',answerTask:'procedure',field:'vat',researchTopic:'value added tax VAT'},localSearch(){return [legacy];}});
  assert.deepEqual(vatDocs,[]);
});

test('an authentic quote cannot support a theft penalty statement about another offence',()=>{
  const question='What punishment follows theft?';
  const bundle=evidenceBundle(question,[],[cyber]);
  const quote=sourceBody(cyber).split('\n').slice(1).join('\n').trim();
  const result=validateEvidenceAnswer(JSON.stringify({status:'answered',points:[{kind:'rule',
    statement:'On conviction, theft is punishable by imprisonment.',
    evidence:[{source_id:'P1',paragraph:null,quote}]}]}),bundle,question,'en');
  assert.equal(result.ok,false);assert.equal(result.reason,'offence_support');
});

test('a fallback with no meaningful overlap cannot label an arbitrary passage relevant',()=>{
  const unrelated={title:'Another topic',source:'https://official.example/unrelated',content:'Article 90: This provision governs an entirely different subject.'};
  const reply=sourceReadingReply([unrelated],'en','Tell me about an unindexed topic');
  assert.doesNotMatch(reply,/Article 90|exact wording|> /);
  const relevant=searchLocalLaws('Law No. 66/2018 article 30');
  assert.match(sourceReadingReply(relevant,'en','What damages follow unlawful termination?'),/Article 30/);
});
