import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { createSpeechProvider, configuredSpeechProvider, validateSpeech } from '../speechProvider.js';
import { speechRouter } from '../speechRoutes.js';
import { requireFirebaseIdentity } from '../firebaseIdentity.js';

const text = 'Do not change the amount RWF 100000 or the deadline of 30 days.';
const input = {text,language:'en',voice:'Algieba',consent:true};
function wav() {
  const value = Buffer.alloc(46);
  value.write('RIFF'); value.writeUInt32LE(38,4); value.write('WAVEfmt ',8);
  value.writeUInt32LE(16,16); value.writeUInt16LE(1,20); value.writeUInt16LE(1,22);
  value.writeUInt32LE(24000,24); value.writeUInt32LE(48000,28); value.writeUInt16LE(2,32);
  value.writeUInt16LE(16,34); value.write('data',36); value.writeUInt32LE(2,40);
  return value;
}
const audioResponse = () => Response.json({steps:[{type:'model_output',content:[{type:'audio',mime_type:'audio/wav',data:wav().toString('base64')}]}]});

test('natural speech stays disabled without a key and explicit confirmation of an unbilled project', async () => {
  let calls = 0;
  for (const options of [{}, {apiKey:'secret'}, {apiKey:'secret',freeTierConfirmed:false}, {apiKey:'',freeTierConfirmed:true}]) {
    const provider = createSpeechProvider({...options,fetchImpl:async()=>{calls++; return audioResponse();}});
    assert.equal(provider.available,false);
    await assert.rejects(provider.generate('alice',input),{code:'speech_unconfigured'});
  }
  assert.equal(configuredSpeechProvider({GEMINI_API_KEY:'secret',GEMINI_SPEECH_FREE_TIER:'false'}).available,false);
  const off = createSpeechProvider({apiKey:'secret',freeTierConfirmed:true,dailyLimit:0,fetchImpl:async()=>{calls++; return audioResponse();}});
  await assert.rejects(off.generate('alice',input),{code:'speech_rate_limited'});
  assert.equal(calls,0);
});

test('speech sends the exact selected text with structured style and stateless audio, cached only for its owner', async () => {
  let calls=0;
  const provider = createSpeechProvider({apiKey:'secret',freeTierConfirmed:true,fetchImpl:async(url,options)=>{
    calls++;
    assert.equal(url,'https://generativelanguage.googleapis.com/v1beta/interactions');
    assert.equal(options.headers['x-goog-api-key'],'secret');
    const body=JSON.parse(options.body);
    assert.equal(body.model,'gemini-3.8-flash-lite-tts');
    assert.equal(body.store,false);
    assert.equal(body.input[0].content[0].text,text);
    assert.equal(body.generation_config.speech_config[0].voice,'Algieba');
    assert.equal(body.response_format.mime_type,'audio/wav');
    assert.doesNotMatch(options.body,/alice|bob|history|previous_interaction_id|database|memory/);
    return audioResponse();
  }});
  assert.deepEqual(await provider.generate('alice',input),wav());
  assert.deepEqual(await provider.generate('alice',input),wav());
  assert.equal(calls,1);
  await provider.generate('bob',input);
  assert.equal(calls,2);
  for (const change of [{consent:false},{language:'de'},{voice:'Cove'},{voice:'Sulafat'},{stream:'true'},{text:'x'.repeat(2401)},{model:'paid-model'},{uid:'bob'}]) {
    assert.throws(()=>validateSpeech({...input,...change}),{code:'invalid_speech'});
  }
});

test('global limits, quota cooldown and concurrent requests never create automatic retries or paid fallbacks', async () => {
  let count=0;
  const cap=createSpeechProvider({apiKey:'secret',freeTierConfirmed:true,dailyLimit:1,fetchImpl:async()=>{count++;return audioResponse();}});
  await cap.generate('alice',input);
  await assert.rejects(cap.generate('bob',input),{code:'speech_rate_limited'});
  assert.equal(count,1);
  const quota=createSpeechProvider({apiKey:'secret',freeTierConfirmed:true,fetchImpl:async()=>{count++;return new Response('private provider message',{status:429,headers:{'retry-after':'120'}});}});
  await assert.rejects(quota.generate('alice',input),{code:'speech_rate_limited',retryAfterSeconds:120});
  await assert.rejects(quota.generate('alice',input),{code:'speech_rate_limited'});
  assert.equal(count,2);
  let complete;
  const serial=createSpeechProvider({apiKey:'secret',freeTierConfirmed:true,fetchImpl:()=>new Promise(resolve=>{complete=resolve;})});
  const first=serial.generate('alice',input);
  await assert.rejects(serial.generate('bob',input),{code:'speech_busy'});
  complete(audioResponse());
  await first;
});

test('cancelled calls cannot publish or cache late audio; malformed and upstream errors remain private', async () => {
  let complete,calls=0;
  const provider=createSpeechProvider({apiKey:'secret',freeTierConfirmed:true,fetchImpl:()=>{calls++;return new Promise(resolve=>{complete=resolve;});}});
  const controller=new AbortController();
  const pending=provider.generate('alice',input,controller.signal);
  controller.abort(); complete(audioResponse());
  await assert.rejects(pending,{name:'AbortError'});
  const again=provider.generate('alice',input); complete(audioResponse()); await again;
  assert.equal(calls,2);
  for (const response of [new Response('private key and stack',{status:403}),Response.json({steps:[]}),Response.json({steps:[{type:'model_output',content:[{type:'audio',mime_type:'text/html',data:'private'}]}]})]) {
    const invalid=createSpeechProvider({apiKey:'secret',freeTierConfirmed:true,fetchImpl:async()=>response});
    await assert.rejects(invalid.generate('alice',input),error=>error.code==='speech_unavailable' && !/private|secret|stack/.test(error.message));
  }
});

test('HTTP speech is authenticated and returns private audio or sanitized errors without database calls', async t => {
  let calls=0;
  const provider=createSpeechProvider({apiKey:'secret',freeTierConfirmed:true,fetchImpl:async()=>{calls++;return audioResponse();}});
  const app=express(); app.use(express.json());
  app.use('/api/speech',requireFirebaseIdentity(async token=>{
    if(token!=='alice') throw new Error('Bad token'); return {uid:'alice'};
  }),speechRouter({provider}));
  const server=await new Promise(resolve=>{const server=app.listen(0,'127.0.0.1',()=>resolve(server));});
  t.after(()=>{server.closeAllConnections();server.close();});
  const base=`http://127.0.0.1:${server.address().port}/api/speech`;
  const request=token=>fetch(base,{method:'POST',headers:{'content-type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify(input)});
  assert.equal((await request()).status,401);
  assert.equal((await request('bob')).status,401);
  assert.equal(calls,0);
  const response=await request('alice');
  assert.equal(response.status,200);
  assert.equal(response.headers.get('content-type'),'audio/wav');
  assert.equal(response.headers.get('cache-control'),'private, no-store');
  assert.deepEqual(Buffer.from(await response.arrayBuffer()),wav());
  assert.equal(calls,1);
});
