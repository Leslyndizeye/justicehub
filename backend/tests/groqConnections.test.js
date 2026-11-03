import {test} from 'node:test';
import assert from 'node:assert/strict';
import {configuredGroqConnection,createGroqServiceFailover} from '../groqConnections.js';
import {createChatProvider,publicChatError} from '../chatProvider.js';
import {searchLocalLaws} from '../localLawSearch.js';

const client=create=>({chat:{completions:{create}}});
const failure=status=>Object.assign(new Error('Private upstream details'),{status});
const answer=content=>({choices:[{message:{content}}]});
const request={model:'openai/gpt-oss-120b',messages:[{role:'developer',content:'Application rules and dated source text'},{role:'user',content:'The original question'}],response_format:{type:'json_schema'},tool_choice:'none'};

test('primary and isolated secondary modes construct only the selected client with SDK retries disabled',async()=>{
  const instances=[];
  class FakeClient {constructor(options){instances.push(options);this.options=options;}}
  const env={GROQ_API_KEY:'fixture-primary',GROQ_SECONDARY_API_KEY:'fixture-secondary'};
  const primary=configuredGroqConnection(env,{Client:FakeClient});
  assert.equal(primary.mode,'primary');assert.equal(primary.client.options.apiKey,env.GROQ_API_KEY);
  assert.deepEqual(instances,[{apiKey:'fixture-primary',maxRetries:0}]);
  instances.length=0;
  const secondary=configuredGroqConnection({...env,GROQ_ACCOUNT_MODE:' secondary '},{Client:FakeClient});
  assert.equal(secondary.mode,'secondary');
  assert.deepEqual(instances,[{apiKey:'fixture-secondary',maxRetries:0}]);
  for(const bad of [{GROQ_ACCOUNT_MODE:'round-robin'},
    {GROQ_ACCOUNT_MODE:'primary'},
    {GROQ_ACCOUNT_MODE:'secondary',GROQ_API_KEY:'fixture-primary'},
    {...env,GROQ_ACCOUNT_MODE:'failover',GROQ_SECONDARY_API_KEY:env.GROQ_API_KEY}]) {
    assert.throws(()=>configuredGroqConnection(bad,{Client:FakeClient}),error=>!error.message.includes('fixture-'));
  }
});

test('a healthy primary leaves the second account unused; a service failure resends exactly the same request once',async()=>{
  const calls=[];let down=false;const accounts=[];
  const primary=client(async(input,options)=>{calls.push({account:'primary',input,options});if(down)throw failure(503);return answer('Primary');});
  const secondary=client(async(input,options)=>{calls.push({account:'secondary',input,options});return answer('Secondary');});
  const pool=createGroqServiceFailover({primary,secondary,onAccount:account=>accounts.push(account)});
  assert.equal((await pool.chat.completions.create(request)).choices[0].message.content,'Primary');
  down=true;const signal=new AbortController().signal;
  assert.equal((await pool.chat.completions.create(request,{signal})).choices[0].message.content,'Secondary');
  assert.deepEqual(calls.map(call=>call.account),['primary','primary','secondary']);
  assert.equal(calls[1].input,request);assert.equal(calls[2].input,request);
  assert.equal(calls[2].options.signal,signal);assert.equal(calls[2].options.timeout,10000);assert.equal(calls[2].options.maxRetries,0);
  assert.deepEqual(accounts,['primary','secondary']);
});

test('the circuit avoids repeated failed calls and probes the primary again after thirty seconds',async()=>{
  let time=1000;let down=true;let primaryCalls=0,secondaryCalls=0;
  const pool=createGroqServiceFailover({now:()=>time,primary:client(async()=>{primaryCalls++;if(down)throw failure(502);return answer('Primary');}),secondary:client(async()=>{secondaryCalls++;return answer('Secondary');})});
  await pool.chat.completions.create(request);await pool.chat.completions.create(request);
  assert.equal(primaryCalls,1);assert.equal(secondaryCalls,2);
  time=31001;down=false;
  assert.equal((await pool.chat.completions.create(request)).choices[0].message.content,'Primary');
  assert.equal(primaryCalls,2);assert.equal(secondaryCalls,2);
});

test('when both accounts are unavailable, subsequent calls fail without contacting either until the circuit resets',async()=>{
  let time=1000,calls=0;
  const down=client(async()=>{calls++;throw failure(503);});
  const pool=createGroqServiceFailover({now:()=>time,primary:down,secondary:down});
  await assert.rejects(pool.chat.completions.create(request),{status:503});
  assert.equal(calls,2);
  await assert.rejects(pool.chat.completions.create(request),{status:503});assert.equal(calls,2);
  time=31001;
  await assert.rejects(pool.chat.completions.create(request),{status:503});assert.equal(calls,4);
});

test('quota errors never switch accounts, including later service failures inside the reported quota wait',async()=>{
  let time=1000,primaryCalls=0,secondaryCalls=0;
  const pool=createGroqServiceFailover({now:()=>time,primary:client(async()=>{
    primaryCalls++;
    if(primaryCalls===1)throw Object.assign(failure(429),{headers:new Headers({'retry-after':'60'})});
    throw failure(503);
  }),secondary:client(async()=>{secondaryCalls++;return answer('Secondary');})});
  await assert.rejects(pool.chat.completions.create(request),{status:429});
  await assert.rejects(pool.chat.completions.create({...request,model:'openai/gpt-oss-20b'}),{status:503});
  assert.equal(secondaryCalls,0);
  time=61001;
  await pool.chat.completions.create(request);assert.equal(secondaryCalls,1);
});

test('a secondary quota pins calls there even when the primary circuit has recovered',async()=>{
  let time=1000,primaryCalls=0,secondaryCalls=0;
  const pool=createGroqServiceFailover({now:()=>time,primary:client(async()=>{primaryCalls++;if(primaryCalls===1)throw failure(503);return answer('Primary');}),secondary:client(async()=>{secondaryCalls++;throw Object.assign(failure(429),{headers:{'retry-after':'120'}});})});
  await assert.rejects(pool.chat.completions.create(request),{status:429});
  time=32000;
  await assert.rejects(pool.chat.completions.create(request),{status:429});
  assert.equal(primaryCalls,1);assert.equal(secondaryCalls,2);
  time=200000;
  assert.equal((await pool.chat.completions.create(request)).choices[0].message.content,'Primary');
});

test('authentication, permission, input and size errors do not contact a different account',async()=>{
  for(const status of [400,401,403,404,413,422,429]) {
    let calls=0;
    const pool=createGroqServiceFailover({primary:client(async()=>{throw failure(status);}),secondary:client(async()=>{calls++;return answer('Unexpected');})});
    await assert.rejects(pool.chat.completions.create(request),{status});assert.equal(calls,0);
  }
});

test('an SDK connection timeout can switch within the application deadline while Stop prevents any switch',async()=>{
  let calls=0;
  const timeout=Object.assign(new Error('Private timeout'),{name:'APIConnectionTimeoutError'});
  const pool=createGroqServiceFailover({primary:client(async()=>{throw timeout;}),secondary:client(async()=>{calls++;return answer('Secondary');})});
  await pool.chat.completions.create(request);assert.equal(calls,1);
  const controller=new AbortController();calls=0;
  const cancelled=createGroqServiceFailover({primary:client(async()=>{controller.abort();throw failure(503);}),secondary:client(async()=>{calls++;return answer('Unexpected');})});
  await assert.rejects(cancelled.chat.completions.create(request,{signal:controller.signal}),{name:'AbortError'});assert.equal(calls,0);
});

test('stream failures preserve partial text and never replay the stream on the second account',async()=>{
  let secondaryCalls=0;
  const pool=createGroqServiceFailover({primary:client(async()=> (async function*(){yield {choices:[{delta:{content:'Partial'}}]};throw failure(503);})()),secondary:client(async()=>{secondaryCalls++;return answer('Secondary');})});
  const stream=await pool.chat.completions.create({...request,stream:true});const text=[];
  await assert.rejects(async()=>{for await(const chunk of stream)text.push(chunk.choices[0].delta.content);},{status:503});
  assert.deepEqual(text,['Partial']);assert.equal(secondaryCalls,0);
  await pool.chat.completions.create(request);assert.equal(secondaryCalls,1);
});

test('secondary responses still pass the same statutory quotation validation and produce only checked text',async()=>{
  const message='Explain VAT article 28 from the published 2023 text.';
  const docs=searchLocalLaws('Law No. 049/2023 article 28',[],'en');
  const quote=docs[0].content.split('\n').slice(2).join('\n').match(/\(4\)[\s\S]*?(?=\(5\))/)[0].trim();
  const requests=[];
  const pool=createGroqServiceFailover({primary:client(async input=>{requests.push(input);throw failure(503);}),secondary:client(async input=>{
    assert.equal(input,requests[0]);assert.equal(input.response_format.json_schema.strict,true);
    assert.equal(input.stream,false);assert.equal(input.tools,undefined);
    return answer(JSON.stringify({status:'answered',points:[{kind:'rule',statement:'Smaller taxpayers may choose monthly VAT declarations.',evidence:[{source_id:'P1',quote,paragraph:4}]}]}));
  })});
  const provider=createChatProvider({client:pool,model:request.model,fallbackModel:'none'});
  const tokens=[];
  const reply=await provider.reply({message,legalDocs:docs,replyLanguage:'en',streaming:true,onEvent:(name,data)=>{if(name==='token')tokens.push(data.text);}});
  assert.match(reply,/Smaller taxpayers may choose monthly VAT declarations/);assert.match(reply,/Article 28/);
  assert.equal(reply,tokens.join(''));assert.doesNotMatch(reply,/Private|secondary|primary/);
});

test('public error output contains no account identifiers, keys or upstream response bodies',async()=>{
  const pool=createGroqServiceFailover({primary:client(async()=>{throw failure(503);}),secondary:client(async()=>{throw Object.assign(failure(403),{apiKey:'fixture-secondary',account:'fixture-account'});})});
  await assert.rejects(pool.chat.completions.create(request),error=>{
    assert.doesNotMatch(JSON.stringify(publicChatError(error)),/fixture|Private|upstream/);return true;
  });
});
