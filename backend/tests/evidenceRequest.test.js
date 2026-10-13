import {test} from 'node:test';
import assert from 'node:assert/strict';
import {searchLocalLaws} from '../localLawSearch.js';
import {prepareEvidenceRequest} from '../evidenceRequest.js';
import {createChatProvider,publicChatError} from '../chatProvider.js';
import {chatErrorDiagnostic} from '../chatDiagnostics.js';
import {evidenceBundle,validateEvidenceAnswer,renderEvidenceAnswer} from '../evidenceAnswer.js';

const message='what are Payments exempted from employment income tax';
// A case-specific follow-up must still exercise the model and its size recovery.
const modelQuestion=message+' Does this apply to my employer?';
const docs=searchLocalLaws(message);
const research={status:'ok',provider:'tavily',sources:[1,2,3].map(number=>({title:'Income tax',url:`https://www.rra.gov.rw/tax-${number}`,excerpt:'Published income-tax research. '.repeat(35),evidence:'page_excerpt'}))};

test('the complete five-category exemption quote is accepted without weakening its exact-source match',()=>{
  const bundle=evidenceBundle(message,[],docs);
  const quote=bundle.sources[0].text.trim();
  assert.ok(quote.length>650 && quote.length<=1400);
  const answer={status:'answered',points:[{kind:'rule',statement:'Article 16 lists payments excluded from taxable employment income, with conditions attached to its categories.',evidence:[{source_id:'P1',quote,paragraph:null}]}]};
  const result=validateEvidenceAnswer(JSON.stringify(answer),bundle,message,'en');
  assert.equal(result.ok,true);assert.match(renderEvidenceAnswer(result,'en'),/Article 16/);
  const item=quote.match(/2°[\s\S]*?(?=3°)/)[0].trim();
  const numbered={status:'answered',points:[{kind:'rule',statement:'Employer contributions to the public social-security institution are excluded.',evidence:[{source_id:'P1',quote:item,paragraph:2}]}]};
  assert.equal(validateEvidenceAnswer(JSON.stringify(numbered),bundle,message,'en').ok,true);
  numbered.points[0].evidence[0].paragraph=3;
  assert.equal(validateEvidenceAnswer(JSON.stringify(numbered),bundle,message,'en').ok,false);
  const fifth=quote.match(/5°[\s\S]*/)[0].trim();
  const conditional={status:'answered',points:[{kind:'rule',statement:'Non-resident individuals receiving employment income from a non-resident employer for services in Rwanda are exempt unless those services relate to the employer’s permanent establishment in Rwanda.',evidence:[{source_id:'P1',quote:fifth.replace(/non-\s+governmental/g,'non‑governmental').replace(/non-resident/g,'non‑resident'),paragraph:5}]}]};
  assert.equal(validateEvidenceAnswer(JSON.stringify(conditional),bundle,message,'en').ok,true);
  conditional.points[0].statement='Employment income received from a non-resident employer for services in Rwanda is exempt unless the services relate to its permanent establishment.';
  assert.equal(validateEvidenceAnswer(JSON.stringify(conditional),bundle,message,'en').reason,'residence_condition');
  answer.points[0].evidence[0].quote=quote.replace('unless','even when');
  assert.equal(validateEvidenceAnswer(JSON.stringify(answer),bundle,message,'en').ok,false);
  answer.points[0].evidence[0].quote='q'.repeat(1401);
  assert.equal(validateEvidenceAnswer(JSON.stringify(answer),bundle,message,'en').ok,false);
  assert.equal(chatErrorDiagnostic({status:413,error:{code:'rate_limit_exceeded'}}).code,'request_too_large');
});

test('PDF requests bound combined instructions, whole provisions, history and research without changing the latest question',()=>{
  const history=[1,2,3,4].map(number=>({sender:number%2?'user':'ai',content:'Previous context. '.repeat(85)}));
  const input={message,history,legalDocs:docs,language:'en',research,now:new Date('2026-10-12')};
  const original=JSON.stringify(input);
  const prepared=prepareEvidenceRequest(input);
  const compact=prepareEvidenceRequest(input,true);
  assert.ok(prepared.size<=18000);assert.ok(compact.size<=12000);
  assert.ok(compact.size<prepared.size);
  for(const request of [prepared,compact]) {
    assert.equal(request.context.legalDocs[0].articleNumber,16);
    assert.equal(request.messages.at(-1).content,message);
    for(const doc of request.context.legalDocs)assert.ok(docs.some(original=>original.content===doc.content));
    assert.match(request.messages[0].content,/fabricate evidence|false testimony/);
    assert.match(request.messages[0].content,/contiguous verbatim quotation/);
  }
  assert.equal(JSON.stringify(input),original);
});

test('413 causes one smaller source-checked retry with no repeat search and no quota cooldown',async()=>{
  const requests=[];let lookups=0;const events=[];
  const provider=createChatProvider({model:'openai/gpt-oss-120b',fallbackModel:'none',externalSearch:{async lookup(){lookups++;return research;}},client:{chat:{completions:{async create(request){
    requests.push(request);
    if(requests.length===1)throw Object.assign(new Error('Sensitive upstream details'),{status:413,error:{code:'rate_limit_exceeded'}});
    return {choices:[{message:{content:JSON.stringify({status:'answered',points:[{kind:'rule',statement:'Article 16 lists payments excluded from taxable employment income under specified conditions.',evidence:[{source_id:'P1',quote:docs[0].content.split('\n').slice(2).join('\n').trim(),paragraph:null}]}]})}}]};
  }}}}});
  const reply=await provider.reply({message:modelQuestion+' under current law',legalDocs:docs,history:[],replyLanguage:'en',streaming:true,onEvent:(event,data)=>{if(event==='token')events.push(data.text);}});
  assert.equal(requests.length,2);assert.equal(lookups,1);
  const size=request=>request.messages.reduce((sum,item)=>sum+item.content.length,0);
  assert.ok(size(requests[1])<size(requests[0]));
  assert.ok(requests.every(request=>request.response_format.json_schema.strict===true && request.tools===undefined));
  assert.equal(reply,events.join(''));assert.match(reply,/Article 16/);
  assert.doesNotMatch(reply,/Sensitive|wait|AI.*limit|couldn’t complete a live/);
});

test('persistent oversize requests fail after one retry with useful localized copy; Stop prevents the retry',async()=>{
  for(const language of ['en','rw','fr']) {
    let calls=0;
    const provider=createChatProvider({model:'openai/gpt-oss-120b',fallbackModel:'none',client:{chat:{completions:{async create(){calls++;throw Object.assign(new Error('Private detail'),{status:413});}}}}});
    await assert.rejects(provider.reply({message:modelQuestion,legalDocs:docs,replyLanguage:language}),error=>{
      assert.equal(chatErrorDiagnostic(error).code,'request_too_large');
      assert.equal(publicChatError(error,language).code,'request_too_large');
      assert.doesNotMatch(publicChatError(error,language).error,/Private|wait|usage limit/);
      return true;
    });
    assert.equal(calls,2);
  }
  const controller=new AbortController();let calls=0;
  const provider=createChatProvider({model:'openai/gpt-oss-120b',client:{chat:{completions:{async create(){calls++;controller.abort();throw Object.assign(new Error('Too large'),{status:413});}}}}});
  await assert.rejects(provider.reply({message:modelQuestion,legalDocs:docs,signal:controller.signal}),{name:'AbortError'});
  assert.equal(calls,1);
});
