import {test} from 'node:test';
import assert from 'node:assert/strict';
import {searchLocalLaws} from '../localLawSearch.js';
import {searchLegalDocs} from '../legalRetrieval.js';
import {legalRetrievalCases} from '../evals/legalRetrievalCases.js';
import {boundedContext} from '../chatProvider.js';
import {lawExcerptMetadata} from '../lawArticles.js';

test('all uploaded documents and multilingual natural questions retrieve their target article without database or provider calls',async()=>{
  const client={from(){throw new Error('No database needed for uploaded source text');}};
  for(const [name,question,key,article,language] of legalRetrievalCases) {
    const docs=boundedContext([],await searchLegalDocs(client,question,[],language)).legalDocs;
    if(key)assert.ok(docs.some(doc=>lawExcerptMetadata(doc)?.key===key&&doc.articleNumber===article),name);
    else assert.deepEqual(docs,[],name);
    assert.ok(docs.every(doc=>doc.source.includes('/justicehub-legal-sources/amategeko/')),name);
  }
});

test('local search preserves explicit law scope, finds native text, and avoids turning casual or irrelevant requests into legal source claims',()=>{
  const docs=searchLocalLaws('Law No. 66/2018 article 56',[],'rw');
  assert.equal(docs.length,1);assert.equal(lawExcerptMetadata(docs[0]).language,'rw');
  assert.equal(docs[0].articleNumber,56);
  for(const text of ['bimeze gute c','What do you like to eat?','Write a cake recipe','Law No. 999/2023 article 2'])assert.deepEqual(searchLocalLaws(text),[],text);
  const followup=searchLocalLaws('And article 61?',[{sender:'user',content:'Explain Law No. 66/2018'}]);
  assert.equal(followup[0]?.articleNumber,61);
  assert.ok(followup.every(doc=>lawExcerptMetadata(doc).key==='law-66-2018'));
});
