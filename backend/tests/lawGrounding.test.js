import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sourceReadingReply} from '../lawGrounding.js';
import {searchLocalLaws} from '../localLawSearch.js';

test('a fallback uses complete source sentences and cites the same PDF only once',()=>{
  const docs=searchLocalLaws('Law No. 66/2018 article 30');
  const text=sourceReadingReply([...docs,...docs],'en','What damages follow unlawful termination?');
  assert.match(text,/Article 30/);assert.doesNotMatch(text,/\[…\]|essential serv\b|could not support that interpretation/);
  assert.equal((text.match(/\]\(https:/g)||[]).length,1);
  const quote=text.split('\n').filter(line=>line.startsWith('> ')).map(line=>line.slice(2)).join('\n');
  assert.ok(docs[0].content.includes(quote));assert.match(quote,/[.;]$/);
});

test('background definitions and scope do not replace a case-specific answer',()=>{
  const docs=[...searchLocalLaws('Law No. 66/2018 article 3'),...searchLocalLaws('Law No. 66/2018 article 2')];
  const broad=sourceReadingReply(docs,'en','Explain labour law');
  assert.match(broad,/Which part of labour law/);assert.doesNotMatch(broad,/employees’ organisations|> |\[…\]/);
  const definition=sourceReadingReply(searchLocalLaws('What does unfair dismissal mean?'),'en','What does unfair dismissal mean?');
  assert.match(definition,/unfair dismissal/);assert.doesNotMatch(definition,/Which part/);
  assert.doesNotMatch(sourceReadingReply([],'en','What is VAT?'),/labour/);
});

test('operative labour provisions precede background scope; definitions remain available when requested',()=>{
  const fired=searchLocalLaws('I was fired without a reason. What does labour law say?');
  assert.equal(fired[0].articleNumber,30);assert.ok(!fired.some(doc=>[1,2,3].includes(doc.articleNumber)));
  assert.equal(searchLocalLaws('What does unfair dismissal mean?')[0].articleNumber,3);
  assert.equal(searchLocalLaws('What does the law say about overtime?')[0].articleNumber,43);
  assert.equal(searchLocalLaws('what minimum age of kid to work')[0].articleNumber,5);
  assert.ok(searchLocalLaws('What work is prohibited for children?').some(doc=>doc.articleNumber===6));
});
