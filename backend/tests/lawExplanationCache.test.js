import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createChatProvider} from '../chatProvider.js';
import {searchLegalDocs} from '../legalRetrieval.js';
import {lawExcerptMetadata} from '../lawArticles.js';
import {createLawExplanationCache,reusableLawExplanation} from '../lawExplanationCache.js';

const fixtures=[
  ['constitution-2023',15,'constitution','Everyone has equal legal standing and is entitled to equal protection.'],
  ['law-27-2022',12,'Law No. 027/2022','The article starts from worldwide taxation for residents, with an exception, and Rwanda-sourced taxation for non-residents.'],
  ['law-49-2023',4,'Law No. 049/2023','The standard VAT rate is 18%, while supplies eligible for the zero rate use 0%.'],
  ['law-30-2018',9,'Law No. 30/2018','If the jurisdiction rules do not fix the dispute value, the claimant states it; otherwise the judge determines it.'],
  ['law-27-2019',75,'Law No. 027/2019','Once the case goes to court, the prosecutor must give the suspect and counsel the case file so they can prepare a defence.'],
  ['law-59-2023',1,'Law No. 059/2023','Where community service is the principal penalty, the court sets its duration within the statutory maximum.'],
  ['law-60-2018',8,'Law No. 60/2018','Subject to other laws, a person required to cooperate with investigators must answer inquiries and comply with lawful directions.'],
  ['law-12-2017',3,'Law No. 12/2017','Investigation includes gathering evidence both against the suspect and in the suspect’s favour.'],
  ['law-22-2018',73,'Law No. 22/2018','When a scheduled court date changes before proceedings begin, the registrar must tell the parties before the old date.'],
  ['law-66-2018',56,'Law No. 66/2018','In this published version, maternity leave runs for consecutive weeks and includes time before childbirth.'],
  ['ministerial-order-003-2024',2,'foreign services authorisation','The application goes to the tax minister and must include supporting documents; the article also lists further requirements and an exception.'],
  ['law-20-2023',8,'Law No. 020/2023','The time to complete the tax-related act starts on the day after the recognised notification date.'],
  ['law-83-2013',4,'Law No. 83/2013','The Bar brings advocates together and oversees compliance with professional rules.'],
  ['law-71-2024',5,'Law No. 71/2024','Rwandan law normally governs Rwandans’ personal status and capacity, with a choice allowed for dual nationals domiciled abroad.'],
  ['rba-internal-rules-2014',12,'bar internal rules','The assembly normally seeks consensus; otherwise it uses an absolute majority of members present, subject to the article’s special rules.'],
  ['rba-regulation-01-2014',12,'lawyer fees','After the work is completed, the lawyer must itemise services, fees and expenses and account for advances received.'],
];
const messageFor=fixture=>`Explain ${fixture[2]} article ${fixture[1]}`;
const database={from(){throw new Error('These archived articles must be found locally');}};
const docsFor=async(message,language='en')=>searchLegalDocs(database,message,[],language);
const model='openai/gpt-oss-120b';
const answer=raw=>({choices:[{message:{content:raw}}]});
const client=create=>({chat:{completions:{create}}});
function draft(doc,statement,kind='rule') {
  // Fixture evidence comes from the actual indexed PDF, not an invented statute.
  const body=doc.content.split('\n').slice(2).join('\n').trim();
  const quote=body.length<=1400?body:body.slice(0,1300).replace(/\s+\S*$/,'');
  return JSON.stringify({status:'answered',points:[{kind,statement,evidence:[{source_id:'P1',quote,paragraph:null}]}]});
}

test('all sixteen uploaded laws render checked explanations, original text and one source, then reuse the general article answer',async()=>{
  for(const fixture of fixtures) {
    const message=messageFor(fixture),docs=await docsFor(message);
    assert.equal(lawExcerptMetadata(docs[0])?.key,fixture[0],message);
    assert.equal(docs[0]?.articleNumber,fixture[1],message);
    let calls=0,searches=0;
    const provider=createChatProvider({model,fallbackModel:'none',externalSearch:{async lookup(){searches++;throw new Error('PDF already answers');}},
      client:client(async request=>{calls++;assert.equal(request.stream,false);assert.equal(request.tools,undefined);return answer(draft(docs[0],fixture[3]));})});
    const input={message,legalDocs:docs,replyLanguage:'en',role:'citizen'};
    const first=await provider.reply(input);
    assert.match(first,/In plain language/ ,message);
    assert.ok(first.includes(fixture[3]),message);
    assert.match(first,/Original source text/,message);
    assert.equal((first.match(/\]\(https:\/\/[^)]+\.pdf/g)||[]).length,1,message);
    assert.doesNotMatch(first,/could not verify an explanation|I think|perhaps/i,message);
    const events=[];
    const second=await provider.reply({...input,streaming:true,onEvent:(name,data)=>events.push([name,data])});
    assert.equal(second,first,message);
    assert.deepEqual(events,[['token',{text:first}]],message);
    assert.equal(calls,1,message);assert.equal(searches,0,message);
  }
});

test('public article reuse excludes private conversation history and respects source, language and audience boundaries',async()=>{
  const fixture=fixtures[0],message=messageFor(fixture),docs=await docsFor(message);
  const requests=[];
  const provider=createChatProvider({model,fallbackModel:'none',client:client(async request=>{requests.push(request);return answer(draft(docs[0],fixture[3]));})});
  const input={message,legalDocs:docs,replyLanguage:'en',role:'citizen'};
  const first=await provider.reply({...input,history:[{sender:'user',content:'My private case involves Alice Confidential in Kigali.'}]});
  assert.doesNotMatch(JSON.stringify(requests),/Alice Confidential|My private case/);
  assert.equal(await provider.reply({...input,message:'Please explain constitution article 15 in English',history:[{sender:'user',content:'My name is Bob Secret.'}]}),first);
  assert.equal(requests.length,1);
  await provider.reply({...input,role:'lawyer'});assert.equal(requests.length,2);
  assert.notEqual(reusableLawExplanation(message,docs,'en','citizen'),reusableLawExplanation(message,docs,'fr','citizen'));
  const other=await docsFor('Explain constitution article 16');
  assert.notEqual(reusableLawExplanation(message,docs,'en','citizen'),reusableLawExplanation('Explain constitution article 16',other,'en','citizen'));
});

test('personal, contextual, online and current requests cannot enter the public explanation cache',async()=>{
  const docs=await docsFor('Explain constitution article 15');
  for(const message of ['Explain constitution article 15 for my case','Explain constitution article 15 for Alice',
    'Explain constitution article 15 today','Explain current constitution article 15','Explain constitution article 15 and search online',
    'Explain constitution article 15 in light of what I said','Explain article 15','Explain constitution articles 15 and 16']) {
    assert.equal(reusableLawExplanation(message,docs,'en','citizen'),null,message);
  }
  const message='Explain constitution article 15';
  for(const doc of [{...docs[0],coverage:'partial_article'},{...docs[0],content:docs[0].content+'\nA private addition.'},
    {...docs[0],source:'https://untrusted.example/law.pdf'},{...docs[0],articleNumber:16}]) {
    assert.equal(reusableLawExplanation(message,[doc],'en','citizen'),null);
  }
  assert.equal(reusableLawExplanation(message,[],'en','citizen'),null);
});

test('the provider bypasses shared answers for personal context and performs requested current or online research',async()=>{
  const fixture=fixtures[0],message=messageFor(fixture),docs=await docsFor(message);
  let calls=0,searches=0;
  const provider=createChatProvider({model,fallbackModel:'none',externalSearch:{async lookup(){searches++;return {status:'unavailable',sources:[]};}},
    client:client(async()=>{calls++;return answer(draft(docs[0],fixture[3]));})});
  const input={message,legalDocs:docs,replyLanguage:'en',role:'citizen'};
  await provider.reply(input);assert.equal(calls,1);
  const contextual={...input,routing:{kind:'legal',context:'My case is about unequal treatment at work'}};
  await provider.reply(contextual);await provider.reply(contextual);assert.equal(calls,3);
  const personal={...input,message:message+' for my case'};
  await provider.reply(personal);await provider.reply(personal);assert.equal(calls,5);
  await provider.reply({...input,message:message+' under current law'});
  await provider.reply({...input,routing:{kind:'legal',forceWeb:true}});
  assert.equal(searches,2);assert.equal(calls,7);
  await provider.reply(input);assert.equal(calls,7,'research and personal requests do not overwrite the public answer');
});

test('unsupported drafts and case applications are not reused as public rules',async()=>{
  const fixture=fixtures[0],message=messageFor(fixture),docs=await docsFor(message);
  const input={message,legalDocs:docs,replyLanguage:'en',role:'citizen'};
  let calls=0;
  const invalid=createChatProvider({model,fallbackModel:'none',client:client(async()=>{calls++;return answer(draft(docs[0],'The court imposes a 999 year penalty.'));})});
  for(let i=0;i<2;i++)assert.doesNotMatch(await invalid.reply(input),/999 year/);
  assert.equal(calls,4,'each invalid draft gets one repair and is never cached');
  calls=0;
  const application=createChatProvider({model,fallbackModel:'none',client:client(async()=>{calls++;return answer(draft(docs[0],'If this provision applies to your situation, you are entitled to equal legal protection.','application'));})});
  for(let i=0;i<2;i++)assert.match(await application.reply(input),/How this relates to your question/);
  assert.equal(calls,2,'case applications are never shared');
});

test('a checked cached explanation works during quota cooldown without clearing the cooldown, and Stop prevents cached output',async()=>{
  const fixture=fixtures[0],message=messageFor(fixture),docs=await docsFor(message);
  let calls=0,limited=false;
  const provider=createChatProvider({model,fallbackModel:'none',now:()=>0,client:client(async()=>{
    calls++;if(limited)throw Object.assign(new Error('Quota'),{status:429});
    return answer(draft(docs[0],fixture[3]));
  })});
  const input={message,legalDocs:docs,replyLanguage:'en',role:'citizen'};
  const checked=await provider.reply(input);limited=true;
  await assert.rejects(provider.reply({message:'Explain constitution article 16',legalDocs:await docsFor('Explain constitution article 16')}),{status:429});
  assert.equal(await provider.reply(input),checked);assert.equal(calls,2);
  await assert.rejects(provider.reply({message:'Explain constitution article 16',legalDocs:await docsFor('Explain constitution article 16')}),{status:429});
  assert.equal(calls,2);
  const controller=new AbortController();controller.abort();const events=[];
  await assert.rejects(provider.reply({...input,signal:controller.signal,streaming:true,onEvent:(...args)=>events.push(args)}),{name:'AbortError'});
  assert.deepEqual(events,[]);assert.equal(calls,2);
});

test('the public explanation cache evicts unused entries and resets with the backend instance',()=>{
  const cache=createLawExplanationCache(2);cache.set('one','A');cache.set('two','B');
  assert.equal(cache.get('one'),'A');cache.set('three','C');
  assert.equal(cache.get('two'),undefined);assert.equal(cache.get('one'),'A');assert.equal(cache.get('three'),'C');
  cache.delete('one');assert.equal(cache.get('one'),undefined);
  assert.equal(createLawExplanationCache().get('three'),undefined);
});
