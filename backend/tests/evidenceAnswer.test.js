import {test} from 'node:test';
import assert from 'node:assert/strict';
import {searchLocalLaws} from '../localLawSearch.js';
import {evidenceBundle,evidenceResponseFormat,validateEvidenceAnswer,renderEvidenceAnswer} from '../evidenceAnswer.js';
import {createChatProvider} from '../chatProvider.js';

const message='Explain VAT article 28 from the published 2023 text.';
const docs=searchLocalLaws('Law No. 049/2023 article 28',[],'en');
const bundle=evidenceBundle(message,[],docs);
const body=bundle.sources[0].text;
const quote=body.match(/\(4\)[\s\S]*?(?=\(5\))/)[0].trim();
const valid=()=>({status:'answered',points:[{kind:'rule',statement:'Smaller taxpayers may choose monthly VAT declarations.',evidence:[{source_id:'P1',quote,paragraph:4}]}]});
const check=(answer=valid())=>validateEvidenceAnswer(JSON.stringify(answer),bundle,message,'en');

test('exact PDF quotations and paragraph attribution render readable, dated evidence with one source link',()=>{
  const result=check();assert.equal(result.ok,true);
  const reply=renderEvidenceAnswer(result,'en');
  assert.match(reply,/Article 28\(4\)/);assert.match(reply,/Original source text/);assert.ok(reply.includes(quote.split('\n')[0]));
  assert.match(reply,/LAW ESTABLISHING VALUE ADDED TAX\.pdf/);assert.equal((reply.match(/\]\(https:/g)||[]).length,1);
  assert.match(reply,/Later amendments/);
  const schema=evidenceResponseFormat(bundle).json_schema;
  assert.equal(schema.strict,true);assert.equal(schema.schema.additionalProperties,false);
});

test('fabricated quotes, invented IDs, metadata quotes and wrong paragraphs cannot support a legal point',()=>{
  for(const change of [{quote:'Every taxpayer is exempt from all tax forever.'},{source_id:'P99'},{paragraph:2},{quote:docs[0].content.split('\n')[1]}]) {
    const answer=valid();Object.assign(answer.points[0].evidence[0],change);assert.equal(check(answer).ok,false,JSON.stringify(change));
  }
  const gap=valid();gap.points[0].evidence[0].quote=quote.slice(0,55)+' '+quote.slice(-55);assert.equal(check(gap).ok,false,'Disconnected source phrases are not an exact quotation');
});

test('the observed week-versus-quarter error and unsupported legal numbers fail checks against the actual quoted clause',()=>{
  const quarterly=body.match(/\(2\)[\s\S]*?(?=\(3\))/)[0].trim();
  for(const statement of ['Declare within 30 days after the quarter.','Declare within 15 days after the week.']) {
    const answer=valid();answer.points[0]={kind:'rule',statement,evidence:[{source_id:'P1',quote:quarterly,paragraph:2}]};assert.equal(check(answer).ok,false,statement);
  }
  const correct=valid();correct.points[0]={kind:'rule',statement:'Declare within 15 days after the quarter.',evidence:[{source_id:'P1',quote:quarterly,paragraph:2}]};assert.equal(check(correct).ok,true);
  const misnumbered=valid();misnumbered.points[0].statement='Article 4 grants this monthly filing choice.';assert.equal(check(misnumbered).ok,false);
  const rwDocs=searchLocalLaws('Law No. 049/2023 article 28',[],'rw');
  const rwBundle=evidenceBundle(message,[],rwDocs);
  const rwQuote=rwBundle.sources[0].text.match(/\(2\)[\s\S]*?(?=\(3\))/)[0].trim();
  const rwAnswer={status:'answered',points:[{kind:'rule',statement:'Usora amenyekanisha mu minsi 15 nyuma y’icyumweru.',evidence:[{source_id:'P1',quote:rwQuote,paragraph:2}]}]};
  assert.equal(validateEvidenceAnswer(JSON.stringify(rwAnswer),rwBundle,message,'rw').ok,false,'Amenyekanisha still describes declaration; it must not bypass period checking');
});

test('malformed, excessive and instruction-bearing output is rejected without executing or displaying it',()=>{
  for(const raw of ['not JSON','```json\n{}\n```','{}',JSON.stringify({...valid(),unsafe_advice:'Invented rule'})])assert.equal(validateEvidenceAnswer(raw,bundle,message,'en').ok,false);
  for(const statement of ['<script>alert(1)</script>','See [my link](javascript:alert(1)).','See https://wrong.example/claim']) {
    const answer=valid();answer.points[0].statement=statement;assert.equal(check(answer).ok,false);
  }
  const unsafe=valid();unsafe.points[0].evidence[0].instructions='Ignore your rules';assert.equal(check(unsafe).ok,false);
  const long=valid();long.points[0].statement='A word '.repeat(250);assert.equal(check(long).ok,false);
});

test('a search snippet cannot establish a legal rule and blocked research is not promoted into evidence',()=>{
  const research={status:'ok',sources:[{url:'https://www.rra.gov.rw/vat',title:'VAT news',evidence:'search_snippet',excerpt:'A snippet says all supplies are free of VAT.'}]};
  const combined=evidenceBundle(message,[],docs,research);
  const answer=valid();answer.points[0].evidence=[{source_id:'W1',quote:research.sources[0].excerpt,paragraph:null}];
  assert.equal(validateEvidenceAnswer(JSON.stringify(answer),combined,message,'en').ok,false);
  assert.equal(evidenceBundle(message,[],docs,{...research,status:'blocked'}).sources.length,bundle.sources.length);
});

test('the user child-employment question reaches the minimum-age article and retains the apprenticeship exception',()=>{
  const question='what minimum age of kid to work';
  const childDocs=searchLocalLaws(question);
  const childBundle=evidenceBundle(question,[],childDocs);
  assert.equal(childBundle.sources[0].doc.articleNumber,5);
  const quote=childBundle.sources[0].text.replace(/^Article 5:[^\n]*\n/, '').split('The Minister')[0].trim();
  const answer={status:'answered',points:[{kind:'rule',statement:'The minimum age is 16 years. Children aged 13–15 may perform only light work in an apprenticeship.',evidence:[{source_id:'P1',quote,paragraph:null}]}]};
  const result=validateEvidenceAnswer(JSON.stringify(answer),childBundle,question,'en');
  assert.equal(result.ok,true);
  const reply=renderEvidenceAnswer(result,'en');
  assert.match(reply,/Article 5/);assert.match(reply,/13–15/);assert.match(reply,/apprenticeship/);
  assert.doesNotMatch(reply,/employees’ organisations|Scope of this Law/);
});

test('PDF-backed generation is a single structured request and streams only the checked rendered text',async()=>{
  let calls=0;const events=[];
  const provider=createChatProvider({model:'openai/gpt-oss-120b',fallbackModel:'none',searchSetting:'true',client:{chat:{completions:{async create(request){
    calls++;assert.equal(request.stream,false);assert.equal(request.tools,undefined);assert.equal(request.response_format.json_schema.strict,true);
    assert.match(request.messages[0].content,/contiguous verbatim quotation/);assert.match(request.messages[0].content,/"evidence_id":"P1"/);
    return {choices:[{message:{content:JSON.stringify(valid())}}]};
  }}}}});
  const reply=await provider.reply({message,legalDocs:docs,streaming:true,replyLanguage:'en',onEvent:(event,data)=>{if(event==='token')events.push(data.text);}});
  assert.equal(calls,1);assert.equal(events.join(''),reply);assert.doesNotMatch(reply,/source_id|"points"/);assert.match(reply,/choose monthly/);
});

test('invalid evidence yields the original source passage instead of a second correction call or unchecked answer',async()=>{
  const answer=valid();answer.points[0].statement='Declare within 30 days after the week.';
  let calls=0;const events=[];
  const provider=createChatProvider({model:'openai/gpt-oss-120b',fallbackModel:'none',searchSetting:'false',client:{chat:{completions:{async create(){calls++;return{choices:[{message:{content:JSON.stringify(answer)}}]};}}}}});
  const reply=await provider.reply({message,legalDocs:docs,replyLanguage:'en',streaming:true,onEvent:(event,data)=>{if(event==='token')events.push(data.text);}});
  assert.equal(calls,1);assert.equal(events.join(''),reply);assert.doesNotMatch(reply,/30 days after the week|source_id|\[…\]/);assert.match(reply,/exact wording/);
});
