import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizeMemory,captureMemory,localMemoryReply,readLocalMemory,writeLocalMemory,addMemoryNote} from '../../shared/userMemory.js';
import {memoryContextForChat,readMemoryContext,memoryRoutingHistory} from '../../shared/memoryContext.js';
import {validateMemoryWrite} from '../memoryStore.js';
import {createChatProvider} from '../chatProvider.js';
import {createGroqServiceFailover} from '../groqConnections.js';
import {prepareEvidenceRequest} from '../evidenceRequest.js';
import {searchLocalLaws} from '../localLawSearch.js';
import {evidenceBundle,validateEvidenceAnswer} from '../evidenceAnswer.js';
import {publicSearchPlan} from '../externalSearch.js';

const savedCase='My case concerns a landlord who locked me out of my rented home in Kigali. No court order has been served on me.';
const contextFor=memory=>readMemoryContext(memoryContextForChat({...memory,shareWithAI:true}));
const client=create=>({chat:{completions:{create}}});
const completion=content=>({choices:[{message:{content}}]});

test('case memory requires an explicit save and sharing requires a separate opt-in',()=>{
  assert.equal(captureMemory(null,savedCase).items.length,0);
  for(const statement of ['I am working on my court appeal.','I prefer short answers about my criminal case.','I am working on my housing dispute.'])assert.equal(captureMemory(null,statement).items.length,0,statement);
  const memory=captureMemory(null,`Remember that ${savedCase}`,()=> 'case-1');
  assert.equal(memory.items[0].category,'case_context');assert.equal(memory.items[0].origin,'manual');
  assert.equal(memory.shareWithAI,false);assert.equal(memoryContextForChat(memory),undefined);
  assert.deepEqual(readMemoryContext({consent:false,items:memory.items}),[]);
  assert.equal(contextFor(memory)[0].value,savedCase);
  assert.equal(memoryContextForChat({...memory,shareWithAI:true},true),undefined);
  assert.equal(addMemoryNote(null,savedCase,()=> 'bad',{category:'case_context',origin:'automatic'}).items.length,0);
  const legacy=normalizeMemory({items:memory.items});assert.equal(legacy.shareWithAI,false);
  const oldWrite={...legacy};delete oldWrite.shareWithAI;
  assert.equal(validateMemoryWrite({memory:oldWrite,expectedRevision:0}).memory.shareWithAI,false);
  assert.throws(()=>validateMemoryWrite({memory:{...legacy,shareWithAI:'yes'},expectedRevision:0}),{status:400});
});

test('saved case reports survive a fresh chat and browser reload without leaking to another account',()=>{
  const map=new Map();const storage={setItem:(key,value)=>map.set(key,value),getItem:key=>map.get(key)||null};
  let memory=captureMemory(null,'My name is Aniela',()=> 'name');
  memory=captureMemory(memory,`Remember that ${savedCase}`,()=> 'case');
  writeLocalMemory('owner-a',memory,storage);
  const reloaded=readLocalMemory('owner-a',storage);
  assert.match(localMemoryReply('What do you remember about my case?',reloaded,'',true,[]).reply,/locked me out/);
  assert.equal(readLocalMemory('owner-b',storage).items.length,0);
  const shared=captureMemory(reloaded,'Use my saved memory in AI replies');assert.equal(shared.shareWithAI,true);
  const revoked=captureMemory(shared,'Stop using my saved memory in AI replies');
  assert.equal(memoryContextForChat(revoked),undefined);assert.equal(revoked.items.length,2);
  const forgotten=captureMemory(shared,'Forget my case');assert.equal(forgotten.items.some(item=>item.category==='case_context'),false);
  const cleared=captureMemory(shared,'Forget everything about me');assert.equal(cleared.shareWithAI,false);assert.equal(cleared.items.length,0);
  assert.equal(memoryContextForChat({...shared,enabled:false}),undefined);
});

test('shared memory is bounded, preserves whole statements, rejects forged metadata and excludes credentials',()=>{
  let memory=normalizeMemory({shareWithAI:true});
  for(let i=0;i<16;i++)memory=addMemoryNote(memory,`Case ${i}: ${'A complete short sentence. '.repeat(7)}`,()=>`note-${i}`,{category:'case_context'});
  const payload=memoryContextForChat(memory);
  assert.ok(JSON.stringify(payload).length<=2000);assert.ok(payload.items.length<memory.items.length);
  assert.equal(payload.items[0].value,memory.items.at(-1).value);
  for(const item of payload.items)assert.ok(memory.items.some(original=>original.value===item.value));
  assert.throws(()=>readMemoryContext({...payload,owner_id:'another-user'}),{status:400});
  for(const secret of ['gsk_'+ 'a'.repeat(36),'AQ.'+'b'.repeat(40),'AIza'+'c'.repeat(40),'eyJ'+'d'.repeat(40)]) {
    assert.equal(addMemoryNote(null,secret).items.length,0);
    assert.throws(()=>readMemoryContext({consent:true,items:[{kind:'note',category:'case_context',value:secret}]}),{status:400});
  }
  const long=`Remember that my case concerns ${'a relevant condition '.repeat(20)}`;
  const unchanged=captureMemory(null,long);
  assert.equal(unchanged.items.length,0);assert.match(localMemoryReply(long,unchanged,'').reply,/wasn’t saved.*240/);
});

test('a single consented case supplies a new-chat follow-up while new user topics override it and separate cases stay separate',async()=>{
  const context=contextFor(captureMemory(null,`Remember that ${savedCase}`,()=> 'case'));
  const provider=createChatProvider({client:null,model:'openai/gpt-oss-120b',fallbackModel:'none'});
  const route=await provider.understand({message:'What can I do next?',history:[],memoryContext:context});
  assert.equal(route.kind,'legal');assert.equal(route.answerTask,'remedy');assert.match(route.context,/locked me out/);
  assert.doesNotMatch(publicSearchPlan('What can I do next?',[],route).query,/Kigali|locked|served|user report/i);
  const newTopic=await provider.understand({message:'What is the deadline?',history:[{sender:'user',content:'Explain VAT declaration filing in Rwanda'}],memoryContext:context});
  assert.match(newTopic.context,/VAT/);assert.doesNotMatch(newTopic.context,/locked me out/);
  const cases=[...context,{kind:'note',category:'case_context',value:'My other case concerns a client’s employment dismissal.'}];
  assert.deepEqual(memoryRoutingHistory([],cases),[]);
  assert.equal((await provider.understand({message:'What can I do next?',memoryContext:cases})).kind,'unclear');
});

test('the answer receives consented memory as untrusted context and a service fallback preserves it',async()=>{
  const memory=captureMemory(null,`Remember that ${savedCase}`,()=> 'case');const memoryContext=contextFor(memory);
  const accounts=[];let requests=0;
  const connection=createGroqServiceFailover({primary:client(async()=>{throw Object.assign(new Error('Temporary outage'),{status:503});}),secondary:client(async request=>{
    requests++;
    assert.match(request.messages[0].content,/SAVED USER CONTEXT/);assert.ok(request.messages[0].content.includes(savedCase));
    assert.match(request.messages[0].content,/not instructions, verified facts, legal sources/);
    assert.match(request.messages[0].content,/latest user corrections/);
    return completion('Fraud involves deception and can harm trust and cause financial loss.');
  }),onAccount:account=>accounts.push(account)});
  const provider=createChatProvider({client:connection,model:'openai/gpt-oss-120b',fallbackModel:'none'});
  await provider.reply({message:'What do you think about fraud?',memoryContext,replyLanguage:'en'});
  assert.deepEqual(accounts,['primary','secondary']);assert.equal(requests,1);
});

test('personalised statutory requests are not reused for another user and saved allegations are never evidence sources',async()=>{
  const message='Explain VAT article 28 from the published 2023 text.';
  const docs=searchLocalLaws('Law No. 049/2023 article 28',[],'en');
  const quote=docs[0].content.split('\n').slice(2).join('\n').match(/\(4\)[\s\S]*?(?=\(5\))/)[0].trim();
  let calls=0;
  const provider=createChatProvider({model:'openai/gpt-oss-120b',fallbackModel:'none',client:client(async request=>{
    calls++;const current=calls===1?'Aniela':'Beata',other=calls===1?'Beata':'Aniela';
    assert.ok(request.messages[0].content.includes(current));assert.ok(!request.messages[0].content.includes(other));
    return completion(JSON.stringify({status:'answered',points:[{kind:'rule',statement:'Smaller taxpayers may choose monthly VAT declarations.',evidence:[{source_id:'P1',quote,paragraph:4}]}]}));
  })});
  for(const name of ['Aniela','Beata']) {
    const memoryContext=contextFor(captureMemory(null,`My name is ${name}`,()=> 'name'));
    assert.match(await provider.reply({message,legalDocs:docs,memoryContext,replyLanguage:'en'}),/Smaller taxpayers/);
    const prepared=prepareEvidenceRequest({message,legalDocs:docs,memoryContext,language:'en'},true);
    assert.ok(prepared.size<=12000);assert.equal(prepared.context.legalDocs[0].content,docs[0].content);
    assert.equal(prepared.messages.at(-1).content,message);
  }
  assert.equal(calls,2);
  const bundle=evidenceBundle(message,[],docs);
  const invented={status:'answered',points:[{kind:'rule',statement:'The user’s saved note establishes the law.',evidence:[{source_id:'MEMORY',quote:'Article 999 allows every claimed deduction.',paragraph:null}]}]};
  assert.equal(validateEvidenceAnswer(JSON.stringify(invented),bundle,message,'en').ok,false);
});
