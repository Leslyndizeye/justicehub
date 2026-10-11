import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAnswerReader } from '../lib/answerReader.js';
import { createSpeechReader } from '../lib/speechReader.js';

const response = () => new Response(new Uint8Array(46),{headers:{'content-type':'audio/wav'}});
function setup(fetchImpl=async()=>response()) {
  const players=[],requests=[],revoked=[];
  let allocated=0;
  class Audio {
    constructor(){players.push(this);}
    async play(){this.plays=(this.plays||0)+1;}
    pause(){this.paused=true;}
    load(){}
    removeAttribute(){this.src='';}
  }
  const reader=createAnswerReader({base:'https://backend.example',AudioClass:Audio,
    urls:{createObjectURL:()=>`blob:${++allocated}`,revokeObjectURL:url=>revoked.push(url)},
    fetchImpl:(url,options)=>{requests.push({url,options});return fetchImpl(url,options);},
    deviceReader:createSpeechReader({synthesis:null}),
  });
  return {reader,players,requests,revoked,get allocated(){return allocated;}};
}

test('natural audio requires an explicit choice and sends only the selected answer to the backend', async()=>{
  const d=setup();
  await d.reader.start({messageId:'a',text:'Do not change RWF 100000 or 30 days.',language:'en'});
  assert.equal(d.requests.length,0);
  d.reader.allowNaturalVoice();
  await d.reader.start({messageId:'a',text:'Do not change RWF 100000 or 30 days.',language:'en'});
  assert.equal(d.requests.length,1);
  assert.equal(d.requests[0].url,'https://backend.example/api/speech');
  assert.deepEqual(JSON.parse(d.requests[0].options.body),{text:'Do not change RWF 100000 or 30 days.',voice:'Sulafat',language:'en',consent:true});
  assert.equal(d.reader.snapshot().status,'reading');
  await d.players[0].onended();
  assert.equal(d.reader.snapshot().status,'idle');
  assert.deepEqual(d.revoked,['blob:1']);
});

test('long answers preserve their text and request another chunk only after playback, without truncating',async()=>{
  const d=setup();d.reader.allowNaturalVoice();
  const text='Do not change RWF 100000 or the 30-day deadline. '.repeat(140).trim();
  await d.reader.start({messageId:'long',text,language:'rw',voice:'Algieba'});
  assert.equal(d.requests.length,1);
  const player=d.players[0];
  while(d.reader.snapshot().status!=='idle') await player.onended();
  assert.equal(d.requests.map(request=>JSON.parse(request.options.body).text).join(' '),text);
  assert.ok(d.requests.every(request=>{const body=JSON.parse(request.options.body);return body.text.length<=2400&&body.language==='rw'&&body.voice==='Algieba';}));
  assert.equal(d.players.length,1);
  assert.equal(d.revoked.length,d.requests.length);
});

test('stopping generation, changing answers and leaving a chat abort requests and ignore late audio',async()=>{
  let finish;
  const d=setup(()=>new Promise(resolve=>{finish=resolve;}));d.reader.allowNaturalVoice();
  const pending=d.reader.start({messageId:'old',text:'An answer.'});
  d.reader.stop('old');
  assert.equal(d.requests[0].options.signal.aborted,true);
  finish(response());await pending;
  assert.equal(d.allocated,0);
  assert.equal(d.reader.snapshot().status,'idle');
  const next=d.reader.start({messageId:'new',text:'Another answer.'});finish(response());await next;
  const oldEnd=d.players.at(-1).onended;
  d.reader.dispose();
  await oldEnd();
  assert.equal(d.requests.length,2);
  assert.equal(d.reader.snapshot().status,'idle');
  assert.ok(d.revoked.includes('blob:1'));
});

test('browser autoplay restrictions allow a direct Play action without generating the audio again',async()=>{
  // The first delayed play is blocked; a subsequent user gesture is accepted.
  let finish;
  const controlled=setup(()=>new Promise(resolve=>{finish=resolve;}));controlled.reader.allowNaturalVoice();
  const pending=controlled.reader.start({messageId:'a',text:'Hello.'});
  let plays=0;
  controlled.players[0].play=async()=>{if(++plays===1)throw Object.assign(new Error('blocked'),{name:'NotAllowedError'});};
  finish(response());await pending;
  assert.equal(controlled.reader.snapshot().status,'paused');
  await controlled.reader.resume('a');
  assert.equal(controlled.reader.snapshot().status,'reading');
  assert.equal(controlled.requests.length,1);
  controlled.reader.stop();
});

test('quota, setup and network errors are useful, contain no provider diagnostics, and never silently switch voices',async()=>{
  for(const [status,code] of [[429,'speech_rate_limited'],[503,'speech_unconfigured'],[503,'internal'],[401,'invalid_identity']]){
    const d=setup(async()=>Response.json({code,error:'Google Gemini secret key https://private.example stack trace'},{status}));
    d.reader.allowNaturalVoice();await d.reader.start({messageId:'a',text:'Hello.'});
    assert.equal(d.reader.snapshot().status,'error');
    assert.doesNotMatch(d.reader.snapshot().error,/Google|Gemini|secret|private.example|stack/);
    assert.equal(d.requests.length,1);
  }
  const d=setup(async()=>{throw new TypeError('private failure');});d.reader.allowNaturalVoice();
  await d.reader.start({messageId:'a',text:'Hello.'});
  assert.match(d.reader.snapshot().error,/could not connect/);
  await d.reader.start({messageId:'long',text:'x'.repeat(12001)});
  assert.match(d.reader.snapshot().error,/too long/);
  assert.equal(d.requests.length,1);
});

test('device speech is an explicit local choice and works after the effect cleanup cycle',async()=>{
  let calls=0;
  const spoken=[];
  const deviceReader=createSpeechReader({synthesis:{getVoices:()=>[{lang:'fr-FR',localService:true}],speak:u=>spoken.push(u),cancel(){}},Utterance:class{constructor(text){this.text=text;}}});
  const reader=createAnswerReader({fetchImpl:async()=>{calls++;return response();},deviceReader,AudioClass:null});
  reader.dispose(); // React development cleanup can precede the next subscription/start.
  await reader.start({messageId:'fr',text:'Vous avez des droits.',language:'fr',voice:'device'});
  assert.equal(reader.snapshot().status,'reading');
  assert.equal(spoken[0].lang,'fr-FR');
  spoken[0].onend();
  assert.equal(reader.snapshot().status,'idle');
  assert.equal(calls,0);
});
