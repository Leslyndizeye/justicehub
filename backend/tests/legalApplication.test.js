import {test} from 'node:test';
import assert from 'node:assert/strict';
import {searchLocalLaws} from '../localLawSearch.js';
import {evidenceBundle,validateEvidenceAnswer,renderEvidenceAnswer} from '../evidenceAnswer.js';
import {createChatProvider} from '../chatProvider.js';

const question='So I lied to someone is that legal when I was talking to him 1 on 1';
const docs=searchLocalLaws('Law No. 71/2024 article 13',[],'en');
const bundle=evidenceBundle(question,[],docs);
const paragraph=(bundle,number)=>bundle.sources[0].text.match(new RegExp(`\\(${number}\\)[\\s\\S]*?(?=\\(\\d+\\)|Section|Icyiciro|$)`))[0].trim();
const p1=paragraph(bundle,1),p3=paragraph(bundle,3);
const point=(statement,kind='application',quote=p3,number=3)=>({kind,statement,evidence:[{source_id:'P1',quote,paragraph:number}]});
const payload=points=>({status:'answered',points});
const check=points=>validateEvidenceAnswer(JSON.stringify(payload(points)),bundle,question,'en');
const bad=()=>payload([
  point('Rwandan law requires a person to act in good faith when exercising civil rights and fulfilling obligations.','rule',p1,1),
  point('A person may not claim to have acted in good faith if the act is contrary to the diligence required of them.','rule'),
  point('Therefore, deliberately lying to someone in a private conversation is not a criminal offence by itself, but it breaches the duty of good faith and could become illegal if it amounts to fraud, defamation or perjury.'),
]);
const client=create=>({chat:{completions:{create}}});
const completion=answer=>({choices:[{message:{content:JSON.stringify(answer)}}]});

test('the exact reported private-lie draft fails despite its authentic civil quotations',()=>{
  assert.equal(validateEvidenceAnswer(JSON.stringify(bad()),bundle,question,'en').reason,'offence_support');
  for(const statement of ['Lying in a private conversation breaches the duty of good faith.',
    'A private lie is not a criminal offence by itself.','Your conversation is a legal obligation governed by good faith.',
    'Because you acted dishonestly, you failed to meet the required diligence.','You can legally lie in a private conversation.']) {
    assert.equal(check([point(statement)]).reason,'scope_connection',statement);
    assert.equal(check([point(statement,'rule')]).ok,false,'a rule label cannot bypass the application check: '+statement);
  }
});

test('a named offence needs its own quoted authority and cannot borrow another point’s evidence',()=>{
  for(const offence of ['fraud','defamation','perjury']) {
    assert.equal(check([point(`A private lie could be ${offence}.`)]).reason,'offence_support');
    assert.equal(check([point(`Your conduct is not ${offence}.`)]).reason,'offence_support','categorical negative conclusions also need authority');
  }
  const fraudText='Any person who uses false pretences to obtain another person’s property commits an offence of fraud.';
  const criminalDoc={title:'Illustrative fraud provision',articleNumber:99,coverage:'complete_article',source:'https://official.example/fraud',content:'metadata\nsource\n'+fraudText};
  const withCrime=evidenceBundle(question,[],[...docs,criminalDoc]);
  const supported=point('The quoted fraud provision requires obtaining another person’s property through false pretences.','rule',fraudText,null);
  supported.evidence[0].source_id='P2';
  assert.equal(validateEvidenceAnswer(JSON.stringify(payload([supported])),withCrime,question,'en').ok,true);
  const borrowing=point('A private lie could be fraud.');
  assert.equal(validateEvidenceAnswer(JSON.stringify(payload([supported,borrowing])),withCrime,question,'en').reason,'offence_support');
  const unrelated=point('A private lie could be perjury.','application',fraudText,null);unrelated.evidence[0].source_id='P2';
  assert.equal(validateEvidenceAnswer(JSON.stringify(payload([unrelated])),withCrime,question,'en').reason,'offence_support');
  assert.equal(check([point('This passage does not establish fraud or determine criminal liability in a private conversation.')]).ok,true);
  assert.equal(check([point('This passage does not establish fraud and you have breached the law.')]).ok,false);
});

test('a scoped good-faith explanation and conditional civil application remain valid in all answer languages',()=>{
  for(const [language,rule,application,unsupported] of [
    ['en','This article requires good faith when exercising legally recognised civil rights and performing obligations.',
      'If the conduct concerns a civil obligation, this principle requires good faith in performing that obligation.',
      'Lying privately breaches the duty of good faith.'],
    ['rw','Iyi ngingo isaba gukoresha uburenganzira mbonezamubano no kurangiza inshingano nta buriganya.',
      'Iyo igikorwa kireba inshingano mbonezamubano, iri hame risaba kuzirangiza nta buriganya.',
      'Kubeshya mu kiganiro ni icyaha kandi binyuranyije n’amategeko.'],
    ['fr','Cet article impose la bonne foi dans l’exercice des droits civils reconnus par la loi et l’exécution des obligations.',
      'Si le comportement concerne une obligation civile, ce principe exige de la bonne foi dans son exécution.',
      'Un mensonge dans une conversation privée viole le devoir de bonne foi.'],
  ]) {
    const translated=evidenceBundle(question,[],searchLocalLaws('Law No. 71/2024 article 13',[],language));
    const evidence={source_id:'P1',quote:paragraph(translated,1),paragraph:1};
    const answer=payload([{kind:'rule',statement:rule,evidence:[evidence]},{kind:'application',statement:application,evidence:[evidence]}]);
    assert.equal(validateEvidenceAnswer(JSON.stringify(answer),translated,question,language).ok,true,language);
    assert.equal(validateEvidenceAnswer(JSON.stringify(payload([{kind:'application',statement:unsupported,evidence:[evidence]}])),translated,question,language).reason,'scope_connection',language);
  }
});

test('same-paragraph reasoning retains its distinct explanations while headings, exact quotations and identical points appear once',()=>{
  const rule=point('The good-faith defence must satisfy the diligence expected by this provision.','rule');
  const application=point('If the conduct concerns a civil obligation, the required diligence is relevant to a claim of good faith.');
  const checked=check([rule,application,{...rule}]);assert.equal(checked.ok,true);
  const rendered=renderEvidenceAnswer(checked,'en');
  assert.equal((rendered.match(/\*\*Article 13\(3\)\*\*/g)||[]).length,1);
  assert.equal((rendered.match(/Original source text/g)||[]).length,1);
  assert.equal((rendered.match(/The good-faith defence/g)||[]).length,1);
  assert.ok(rendered.includes(application.statement));
  assert.equal((rendered.match(/\]\(https:/g)||[]).length,1);
  assert.ok(rendered.includes(docs[0].source));
  assert.match(rendered,/OG_n___Special_of_30.07.2024_Abantu_n_umuryango.pdf/);
  assert.match(rendered,/Later amendments are outside this explanation/);
  const other={...docs[0],title:'Another source',source:'https://official.example/other',content:docs[0].content};
  const combined=evidenceBundle(question,[],[docs[0],other]);
  const next=point('The diligence standard is relevant where this provision governs a civil obligation.','rule');next.evidence[0].source_id='P2';
  const separate=validateEvidenceAnswer(JSON.stringify(payload([rule,next])),combined,question,'en');assert.equal(separate.ok,true);
  assert.equal((renderEvidenceAnswer(separate,'en').match(/\*\*Article 13\(3\)\*\*/g)||[]).length,2,'different sources with the same number stay separate');
});

test('a rejected application gets one repair, then a factual clarification without streaming the unsupported draft or dumping the civil rule',async()=>{
  for(const repaired of [bad(),{status:'needs_context',points:[]}]) {
    const requests=[],events=[];let searches=0;
    const provider=createChatProvider({model:'openai/gpt-oss-120b',fallbackModel:'none',externalSearch:{async lookup(){searches++;throw new Error('Missing facts need clarification, not a new search');}},
      client:client(async request=>{requests.push(request);return completion(requests.length===1 ? payload([point('Lying privately breaches good faith.')]) : repaired);})});
    const reply=await provider.reply({message:question,legalDocs:docs,replyLanguage:'en',streaming:true,onEvent:(name,data)=>{if(name==='token')events.push(data.text);}});
    assert.equal(requests.length,2);assert.equal(searches,0);assert.deepEqual(events,[reply]);
    if(repaired.status==='needs_context')assert.match(reply,/What was the false statement about/);
    else assert.match(reply,/couldn’t establish the answer/);
    assert.doesNotMatch(reply,/breaches good faith|could become illegal|fraud|defamation|perjury|Original source text|Article 13/);
    assert.match(requests[1].messages[0].content,/EXPLANATION REPAIR/);
  }
});

test('needs_context is a distinct bounded outcome with no repair/search, and cannot carry unvalidated advice',async()=>{
  let calls=0;
  const provider=createChatProvider({model:'openai/gpt-oss-120b',fallbackModel:'none',externalSearch:{lookup(){throw new Error('No search needed to ask for facts');}},
    client:client(async()=>{calls++;return completion({status:'needs_context',points:[]});})});
  assert.match(await provider.reply({message:question,legalDocs:docs,replyLanguage:'en'}),/What was the false statement about/);assert.equal(calls,1);
  assert.equal(validateEvidenceAnswer(JSON.stringify({status:'needs_context',points:[point('Invented advice')]}),bundle,question,'en').reason,'format');
});
