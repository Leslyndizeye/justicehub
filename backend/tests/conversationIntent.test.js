import {test} from 'node:test';
import assert from 'node:assert/strict';
import {questionRoute} from '../questionRouting.js';
import {inferQuestionRoute} from '../questionUnderstanding.js';
import {createChatProvider} from '../chatProvider.js';
import {searchLegalDocs} from '../legalRetrieval.js';
import {interpretLegalQuestion} from '../legalQuestion.js';
import {searchCriminalProvisions,isReviewedStatute} from '../criminalProvisions.js';
import {sourceReadingReply,unsupportedArticleCitations} from '../lawGrounding.js';
import {searchLocalLaws} from '../localLawSearch.js';
import {generalDiscussionIssue} from '../generalDiscussion.js';
import {evidenceBundle,validateEvidenceAnswer} from '../evidenceAnswer.js';

const model='openai/gpt-oss-120b';
const never=()=>{throw new Error('No unrelated database or web lookup is allowed');};
const complete=value=>({choices:[{message:{content:typeof value==='string'?value:JSON.stringify(value)}}]});

test('general discussion uses the answer model, without forcing legal research for each familiar topic',async()=>{
  let calls=0;
  const provider=createChatProvider({model,externalSearch:{lookup:never},client:{chat:{completions:{async create(request){
    calls++;
    assert.match(request.messages[0].content,/GENERAL LEGAL DISCUSSION/);
    assert.doesNotMatch(request.messages[0].content,/Article 174|FRW 3,000,000|SOURCE-BOUND ANSWER FORMAT/);
    assert.equal(request.response_format,undefined);
    assert.equal(request.tool_choice,'none');
    return complete('Fraud involves deliberately deceiving someone to gain something unfairly. It can cause financial harm and destroy trust. Are you asking generally or about something that happened?');
  }}}}});
  for(const message of ['what do u think about fraud','What are your thoughts on theft?','How do you feel about privacy?']){
    const route=await provider.understand({message});
    assert.equal(route.kind,'discussion',message);
    const legalDocs=await searchLegalDocs({from:never},message,[],'en',{resolvedRoute:route});
    assert.deepEqual(legalDocs,[]);
    const reply=await provider.reply({message,routing:route,legalDocs,replyLanguage:'en'});
    assert.match(reply,/deceiving/);
    assert.doesNotMatch(reply,/couldn.t establish|source.*unavailable|Article \d/);
  }
  assert.equal(calls,3,'These are generated discussions, not one canned fraud answer');
  const discussionHistory=[{sender:'user',content:'what do u think about fraud'},{sender:'ai',content:'Fraud damages trust.'}];
  assert.equal(questionRoute('tell me more',discussionHistory).kind,'discussion');
  assert.equal(questionRoute('what is the punishment?',discussionHistory).kind,'legal');
  assert.equal(questionRoute('how long in prison?',discussionHistory).context,'what do u think about fraud');
  assert.equal(questionRoute('search online',discussionHistory).forceWeb,true);
  for(const message of ['What do you think about fraud in my case?','What do you think about fraud and its punishment?',
    'What do you think about fraud under article 174?','What do you think about fraud? Search online.'])assert.notEqual(questionRoute(message).kind,'discussion',message);
});

test('semantic understanding can identify a conceptual discussion beyond the local phrasing rules',async()=>{
  const route=await inferQuestionRoute({model,message:'Scamming people for money, your take?',client:{chat:{completions:{async create(){
    return complete({kind:'discussion',topic:'fraud',anchor:null,forceWeb:false,followup:false,clarification:'none'});
  }}}}});
  assert.equal(route.kind,'discussion');
  assert.equal(route.researchTopic,'fraud scam');
});

test('the exact reported punishment follow-up retains killing instead of the older fraud topic or an assistant article',async()=>{
  const original='so what do u think about the person killing another person';
  const history=[{sender:'user',content:'what do u think about fraud'},{sender:'ai',content:'An unsupported old answer about fraud.'},
    {sender:'user',content:original},{sender:'ai',content:'Are you asking generally, about the law in Rwanda, or a real incident?'}];
  const message='what someone can be  punished by';
  const routing=questionRoute(message,history);
  assert.equal(routing.kind,'legal');assert.equal(routing.context,original);
  assert.equal(interpretLegalQuestion(message,history).topic,'murder');
  const legalDocs=await searchLegalDocs({from:never},message,history,'en',{resolvedRoute:routing});
  assert.deepEqual(legalDocs.map(doc=>doc.articleNumber),[107,111]);
  assert.ok(legalDocs.every(isReviewedStatute));
  const provider=createChatProvider({model,externalSearch:{lookup:never},client:{chat:{completions:{async create(request){
    assert.equal(request.response_format.json_schema.name,'justicehub_source_answer');
    assert.match(request.messages[0].content,/earlierUserQuestion.*person killing another person/);
    assert.match(request.messages[0].content,/Do not assume intent or guilt/);
    assert.doesNotMatch(request.messages[0].content,/Grounds for case review/);
    return complete({status:'answered',points:[{kind:'rule',statement:'For intentional killing, Article 107 sets life imprisonment following conviction; this does not establish intent or guilt in a particular case.',
      evidence:[{source_id:'P1',quote:legalDocs[0].content,paragraph:null}]}]});
  }}}}});
  const reply=await provider.reply({message,routing,history,legalDocs,replyLanguage:'en'});
  assert.match(reply,/life imprisonment/);assert.match(reply,/Article 107/);assert.match(reply,/#page=110/);
  assert.doesNotMatch(reply,/Article 197|case review|couldn.t establish/);
  assert.equal(questionRoute(message,[{sender:'ai',content:original}]).kind,'unclear');
  assert.equal(questionRoute(message,[...history,{sender:'user',content:'I want yoghurt.'}]).kind,'unclear');
});

test('reviewed provisions preserve the actual penalty conditions, alternatives and source identity',()=>{
  const homicide=searchCriminalProvisions('What is the punishment for killing someone?');
  assert.deepEqual(homicide.map(doc=>doc.articleNumber),[107,111]);
  assert.match(homicide[0].content,/intentionally kills/);
  assert.match(homicide[1].content,/without intent to kill/);
  assert.match(homicide[1].content,/or only\s+one of these penalties/);
  assert.ok(homicide.every(doc=>!/^\d+$/m.test(doc.content)),'PDF footers are not statutory text');
  const fraud=searchCriminalProvisions('Explain fraud under Law No. 68/2018 article 174');
  assert.equal(fraud.length,1);assert.match(fraud[0].content,/Upon conviction/);
  assert.equal(isReviewedStatute({...fraud[0],content:'Forged statute'}),false);
  assert.deepEqual(unsupportedArticleCitations('Article 197 sets the punishment',homicide),[197]);
  assert.deepEqual(searchCriminalProvisions('Explain Law No. 027/2019 article 197'),[]);
  assert.deepEqual(searchCriminalProvisions('What is the penalty for tax fraud?'),[]);
});

test('a failed penalty explanation cannot fall back to the reported case-review article',()=>{
  const unrelated=searchLocalLaws('Law No. 027/2019 article 197');
  assert.ok(unrelated.length);
  const reply=sourceReadingReply(unrelated,'en','What someone can be punished by?');
  assert.doesNotMatch(reply,/Article 197|Grounds for case review|> /);
  assert.match(reply,/own words/);
});

test('unsourced legal discussion drafts are buffered and repaired before any public token is emitted',async()=>{
  let calls=0;const tokens=[];
  const provider=createChatProvider({model,externalSearch:{lookup:never},client:{chat:{completions:{async create(request){
    calls++;
    assert.equal(request.max_completion_tokens,512);
    assert.equal(request.reasoning_effort,'low');
    if(calls===2)assert.match(request.messages[0].content,/Repair the previous failure/);
    return (async function*(){yield {choices:[{delta:{content:calls===1?'Under Law 68/2018, fraud carries imprisonment.':'Fraud harms people through deception and breaks trust. Are you asking about a real incident?'}}]};})();
  }}}}});
  const reply=await provider.reply({message:'what do u think about fraud',replyLanguage:'en',streaming:true,onEvent(event,data){if(event==='token')tokens.push(data.text);}});
  assert.equal(calls,2);assert.equal(tokens.join(''),reply);
  assert.doesNotMatch(reply,/Law 68|imprison/);
  assert.equal(generalDiscussionIssue('Fraud is not fine; we must value honesty.'),null);
});

test('reviewed penalty explanations retain the conviction condition in their own plain-language statements',()=>{
  const docs=searchCriminalProvisions('What is the penalty for killing someone?');
  const bundle=evidenceBundle('What is the penalty for killing someone?',[],docs);
  const point={kind:'rule',statement:'An intentional killing automatically means life imprisonment.',evidence:[{source_id:'P1',quote:docs[0].content,paragraph:null}]};
  const check=()=>validateEvidenceAnswer(JSON.stringify({status:'answered',points:[point]}),bundle,'What is the penalty for killing someone?','en');
  assert.equal(check().reason,'conviction_condition');
  point.statement='For intentional killing, Article 107 sets life imprisonment following conviction.';
  assert.equal(check().ok,true);
});

test('a verified fraud article supports its own penalty paragraph without weakening unrelated-offence checks',()=>{
  const docs=searchCriminalProvisions('What is the punishment for fraud?');
  const bundle=evidenceBundle('What is the punishment for fraud?',[],docs);
  const quote=docs[0].content.slice(docs[0].content.indexOf('Upon conviction'),docs[0].content.indexOf('If this offence')).trim();
  const point={kind:'rule',statement:'A conviction for fraud carries 2–3 years in prison and a fine of FRW 3,000,000–5,000,000.',evidence:[{source_id:'P1',quote,paragraph:null}]};
  const check=()=>validateEvidenceAnswer(JSON.stringify({status:'answered',points:[point]}),bundle,'What is the punishment for fraud?','en');
  assert.equal(check().ok,true);
  point.statement='A conviction for fraud carries 2–3 years in prison or a fine of FRW 3,000,000–5,000,000.';
  assert.equal(check().reason,'penalty_conditions');
});
