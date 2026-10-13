import {test} from 'node:test';
import assert from 'node:assert/strict';
import {employmentAgeQuestion,basicEmploymentAgeQuestion} from '../employmentAgeTopic.js';
import {employmentAgeAnswer} from '../employmentAgeAnswer.js';
import {searchLegalDocs} from '../legalRetrieval.js';
import {searchLocalLaws} from '../localLawSearch.js';
import {questionRoute} from '../questionRouting.js';
import {publicSearchPlan} from '../externalSearch.js';
import {createChatProvider} from '../chatProvider.js';

const question='how age a person should work ...?';
const docs=searchLocalLaws(question);
const never=()=>{throw new Error('No model, database or web call for the checked basic PDF explanation');};

test('the exact age question finds complete age and prohibited-work rules, not a penalty or definition',async()=>{
  const routing=questionRoute(question);
  assert.equal(routing.kind,'legal');
  const matches=await searchLegalDocs({from:never},question,[],'en',{resolvedRoute:routing});
  assert.deepEqual(matches.map(doc=>doc.articleNumber),[5,6]);
  assert.ok(matches.every(doc=>doc.coverage==='complete_article'));
  assert.match(publicSearchPlan(question).query,/employment labour child minimum age/);
  const provider=createChatProvider({model:'openai/gpt-oss-120b',client:{chat:{completions:{create:never}}},externalSearch:{lookup:never}});
  const events=[];
  const reply=await provider.reply({message:question,legalDocs:matches,routing,replyLanguage:'en',streaming:true,
    onEvent:(event,data)=>{if(event==='token')events.push(data.text);}});
  assert.equal(reply,events.join(''));
  assert.match(reply,/minimum age for ordinary employment is 16/);
  assert.match(reply,/13–15/);assert.match(reply,/only light work within an apprenticeship/);assert.match(reply,/Under 18/);
  assert.match(reply,/Article 6/);assert.match(reply,/No\. 66\/2018/);assert.match(reply,/PDF wording/);
  assert.equal((reply.match(/\]\(https:/g)||[]).length,1);
  assert.doesNotMatch(reply,/Article 117|45\/2018|could not verify an explanation|15 years and older|all types of work/i);
});

test('the reviewed explanation is localized and requires both complete, unchanged articles and archive identity',()=>{
  for(const [language,text,label] of [['en',question,'ordinary employment'],['rw','umuntu yemerewe gukora akazi afite imyaka ingahe?','Imyaka fatizo'],['fr','Quel est l’âge minimum pour travailler ?','emploi ordinaire']]) {
    const local=searchLocalLaws(text,[],language);
    assert.equal(basicEmploymentAgeQuestion(text),true,text);
    const reply=employmentAgeAnswer(text,local,language);
    assert.ok(reply?.includes(label));assert.match(reply,/16/);assert.match(reply,/13(?:–| à )15/);assert.match(reply,/18/);
  }
  for(const altered of [[],docs.slice(0,1),docs.map(doc=>({...doc,coverage:'partial_article'})),
    docs.map(doc=>({...doc,source:'https://example.com/spoof.pdf'})),
    docs.map(doc=>({...doc,content:doc.content+'\nUnreviewed new rule.'}))])assert.equal(employmentAgeAnswer(question,altered),null);
});

test('personal eligibility, foreign jurisdictions, current amendments and retirement do not receive the dated overview',async()=>{
  for(const text of ['Can my 15-year-old work at night?',question+' under current law',question+' in France',question+' please search online'])assert.equal(employmentAgeAnswer(text,docs),null,text);
  for(const text of ['What age should a person retire from work?','How old is Jimmy McGill?','What age should my computer work until?']) {
    assert.equal(basicEmploymentAgeQuestion(text),false,text);
  }
  assert.equal(employmentAgeQuestion('What is the retirement age for employment?'),false);
  const message=question+' please search online'; let lookups=0;
  const provider=createChatProvider({model:'openai/gpt-oss-120b',fallbackModel:'none',externalSearch:{async lookup(){lookups++;return {status:'unavailable',sources:[]};}},
    client:{chat:{completions:{async create(){return {choices:[{message:{content:'{"status":"insufficient","points":[]}'}}]};}}}}});
  await provider.reply({message,legalDocs:docs,replyLanguage:'en'}); assert.equal(lookups,1);
});

test('explicit penalty articles remain retrievable and Stop prevents a reviewed age answer from being published',async()=>{
  assert.equal(searchLocalLaws('Law No. 66/2018 article 117')[0].articleNumber,117);
  const controller=new AbortController();controller.abort();
  const provider=createChatProvider({model:'openai/gpt-oss-120b',client:{chat:{completions:{create:never}}}});
  await assert.rejects(provider.reply({message:question,legalDocs:docs,signal:controller.signal}),{name:'AbortError'});
});
