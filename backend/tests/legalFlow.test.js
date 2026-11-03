import {test} from 'node:test';
import assert from 'node:assert/strict';
import {questionRoute} from '../questionRouting.js';
import {inferQuestionRoute} from '../questionUnderstanding.js';
import {legalFields,legalFieldsIn} from '../legalTopics.js';
import {searchLegalDocs} from '../legalRetrieval.js';
import {searchLocalLaws} from '../localLawSearch.js';
import {lawExcerptMetadata} from '../lawArticles.js';
import {boundedContext} from '../chatProvider.js';
import {lawCoverage} from '../lawCoverage.js';
import {publicSearchPlan,normalizeSearchSources} from '../externalSearch.js';
import catalog from '../data/amategekoCatalog.json' with {type:'json'};

const noDatabase={from(){throw new Error('This scenario must use the local corpus');}};
const user=content=>({sender:'user',content});

test('discussion-to-action follow-ups retain the new field across the whole field registry',()=>{
  const requests=[['explain simply','discussion'],['explain clearly','discussion'],['please explain that in simple words','discussion'],['what is the punishment?','penalty'],['what is the deadline?','deadline'],
    ['how much is it?','amount'],['how do i apply?','procedure'],['who qualifies?','eligibility'],
    ['what can i do next?','remedy'],['which source applies?','source'],['is it still in force?','current_verification']];
  for(const field of legalFields) {
    const topic=`What do you think about ${field.aliases[0]}?`;
    // An older offence and a generated citation must not take over the new topic.
    const history=[user('Explain fraud in Rwanda'),{sender:'ai',content:'Article 197 applies.'},user(topic)];
    const initial=questionRoute(topic);
    assert.ok(initial.kind==='discussion'||initial.intent==='violence_discussion',field.id);
    for(const [message,task] of requests) {
      const route=questionRoute(message,history);
      assert.equal(route.answerTask,task,`${field.id}: ${message}`);
      assert.equal(route.field,field.id,`${field.id}: ${message}`);
      assert.equal(route.context,topic,`${field.id}: ${message}`);
      assert.equal(route.kind,task==='discussion'?'discussion':'legal');
      assert.equal(Boolean(route.forceWeb),task==='current_verification');
    }
  }
});

test('a VAT appeal and its deadline retrieve appeal provisions through bounded context, without a rate overview',async()=>{
  const history=[user('What do you think about VAT?')];
  for(const message of ['how do i appeal?','what is the deadline?']) {
    const route=questionRoute(message,history);
    const docs=await searchLegalDocs(noDatabase,message,history,'en',{resolvedRoute:route});
    const supplied=boundedContext([],docs).legalDocs;
    assert.ok(supplied.some(doc=>lawExcerptMetadata(doc)?.key==='law-20-2023'&&doc.articleNumber===51));
    assert.ok(supplied.every(doc=>lawExcerptMetadata(doc)?.key==='law-20-2023'));
    assert.doesNotMatch(supplied.map(doc=>doc.content).join('\n'),/Article 4: Rates of value added tax/);
    const plan=publicSearchPlan(message,history,route);
    assert.match(plan.query,/tax procedures objection appeal/);
    assert.equal(plan.legalTopic,'tax_procedure');
    if(route.answerTask==='deadline')assert.match(route.context,/how do i appeal/);
    history.push(user(message));
  }
});

test('a new explicit field replaces appeal context, while ordinary field mentions remain unresolved',()=>{
  const history=[user('What do you think about VAT?'),user('how do i appeal?'),user('what is the deadline?'),
    user('What do you think about employment?')];
  const route=questionRoute('what are my rights?',history);
  assert.equal(route.field,'employment');
  assert.doesNotMatch(route.context,/VAT|appeal/);
  for(const message of ['I enjoy agriculture','I like education','https://example.com/VAT','`tax procedures`']) {
    assert.notEqual(questionRoute(message).kind,'discussion');
  }
  assert.deepEqual(legalFieldsIn('Please explain this code: `VAT = tax` https://example.com/land'),[]);
});

test('VAT exemptions retain their tax field when the supplied goods belong to another field',async()=>{
  for(const message of ['Explain VAT education exemptions','Explain VAT healthcare exemptions']) {
    const route=questionRoute(message);
    assert.equal(route.field,'vat');
    const docs=await searchLegalDocs(noDatabase,message,[],'en',{resolvedRoute:route});
    assert.ok(docs.some(doc=>lawExcerptMetadata(doc)?.key==='law-49-2023'&&doc.articleNumber===8));
  }
});

test('missing primary sources never substitute an unrelated locally indexed law',async()=>{
  const unrelated=searchLocalLaws('Law No. 66/2018 article 24');
  const query={textSearch(){return this;},order(){return this;},async limit(){return {data:unrelated};}};
  const database={from(){return {select(){return query;}};}};
  let localCalls=0;
  const route={kind:'legal',field:'customs',researchTopic:'customs import export duties East African Community',answerTask:'rule'};
  const docs=await searchLegalDocs(database,'What are customs duties?',[],'en',{resolvedRoute:route,localSearch(){localCalls++;return unrelated;}});
  assert.deepEqual(docs,[]);
  assert.equal(localCalls,0);
});

test('comparison keeps independently identified articles from both laws in bounded context',async()=>{
  const message='Compare Law No. 66/2018 article 5 and Law No. 71/2024 article 13';
  const docs=boundedContext([],await searchLegalDocs(noDatabase,message)).legalDocs;
  assert.ok(docs.some(doc=>lawExcerptMetadata(doc)?.key==='law-66-2018'&&doc.articleNumber===5));
  assert.ok(docs.some(doc=>lawExcerptMetadata(doc)?.key==='law-71-2024'&&doc.articleNumber===13));
});

test('tax searches describe administrative sanctions and preserve relevant official procedure results',()=>{
  const route=questionRoute('what is the punishment?',[user('What do you think about VAT?')]);
  const plan=publicSearchPlan('what is the punishment? My name is Aniela, phone 250788123456.',[],route);
  assert.match(plan.query,/administrative penalties sanctions/);
  assert.doesNotMatch(plan.query,/Aniela|250788|sentencing/);
  const results=normalizeSearchSources([{title:'Tax procedures',url:'https://www.rra.gov.rw/tax-procedures',raw_content:'Appeal against a tax assessment.'}],true,plan.legalTopic);
  assert.equal(results.length,1);
});

test('semantic understanding accepts approved new fields and tasks without rewriting changed user facts',async()=>{
  const message='Actually it is my company, not my employer. How much would the fee be?';
  const history=[user('My employer needs a work permit.')];
  const base={kind:'legal',topic:'company',anchor:null,followup:false,forceWeb:false,clarification:'none',answerTask:'amount'};
  const infer=answer=>inferQuestionRoute({message,history,model:'openai/gpt-oss-120b',client:{chat:{completions:{async create(request){
    assert.equal(JSON.parse(request.messages[1].content).message,message);
    assert.match(request.messages[0].content,/changed age, role or event/);
    return {choices:[{message:{content:JSON.stringify(answer)}}]};
  }}}}});
  const route=await infer(base);
  assert.equal(route.field,'company');assert.equal(route.answerTask,'amount');assert.equal(route.context,undefined);
  for(const answer of [{...base,answerTask:'private fee query'},{...base,answerTask:'discussion'},
    {...base,kind:'social',topic:'none'},{...base,topic:'all Rwanda laws verified'}])assert.equal(await infer(answer),null);
});

test('coverage accounts for every catalog document without claiming complete or current Rwanda law',()=>{
  const coverage=lawCoverage();
  assert.equal(coverage.completeRwandaLawCollection,false);
  assert.ok(coverage.fields.some(field=>field.id==='customs'&&field.coverage==='no_local_primary_documents'));
  for(const doc of catalog.documents)assert.ok(coverage.fields.some(field=>field.pdfs.some(pdf=>pdf.key===doc.key)),doc.key);
  assert.ok(coverage.fields.every(field=>field.completeForField===false&&field.currentLawVerified===false));
});
