import {test} from 'node:test';
import assert from 'node:assert/strict';
import corpus from '../data/amategeko.json' with {type:'json'};
import catalog from '../data/amategekoCatalog.json' with {type:'json'};
import {readLawArticles,expandLawArticles} from '../lawArticleReader.js';
import {boundedContext,createChatProvider} from '../chatProvider.js';
import {unsupportedArticleCitations,unsupportedFilingPeriod} from '../lawGrounding.js';

function seed(key,page,language='rw') {
  const document=corpus.documents.find(doc=>doc.key===key);
  const metadata=catalog.documents.find(doc=>doc.key===key);
  const chunk=document.chunks.find(chunk=>chunk.page===page && chunk.language===language);
  return {title:document.title,source:`https://sources.example/storage/v1/object/public/justicehub-legal-sources/amategeko/${metadata.sha256}.pdf#page=${page}`,
    content:`[Amategeko PDF: ${key}; language: ${language}; page: ${page}; part: ${chunk.part}; published: ${metadata.published}]\nPublished copy.\n${chunk.text}`};
}

test('article reading follows the original PDF across page boundaries and stops before the next article',()=>{
  const article=readLawArticles('law-49-2023','rw').find(item=>item.number===28);
  assert.equal(article.complete,true);
  assert.deepEqual([...new Set(article.segments.map(part=>part.page))],[47,48]);
  const [doc]=expandLawArticles([seed('law-49-2023',47)],'VAT article 28',{preferredArticles:[28]});
  assert.equal(doc.coverage,'complete_article');
  assert.match(doc.content,/bitarenze|biri munsi/);
  assert.match(doc.content,/200\.000\.000/);
  assert.match(doc.content,/yemerewe kubikora/,'Optional monthly filing from later text is retained');
  assert.match(doc.content,/yaba yaracuruje/,'The following-page condition is retained');
  assert.doesNotMatch(doc.content,/Ingingo ya 29/,'A different article is not folded into the cited rule');
  assert.equal(boundedContext([], [doc]).legalDocs[0].content,doc.content);
});

test('very long articles are marked partial and the provider omits an article that cannot fit instead of cutting away its exceptions',()=>{
  const [partial]=expandLawArticles([seed('law-49-2023',20)],'VAT education exemptions',{preferredArticles:[8]});
  assert.equal(partial.coverage,'partial_article');
  assert.match(partial.content,/uburezi/);
  const [complete]=expandLawArticles([seed('law-49-2023',47)],'VAT article 28',{preferredArticles:[28]});
  const context=boundedContext([], [{...complete,content:'x'.repeat(7990)},complete]);
  assert.deepEqual(context.legalDocs,[complete],'The oversized article is omitted; the smaller complete article remains intact');
});

test('the six legacy versions can use their uploaded PDF text without inserting duplicated database records',()=>{
  for(const key of ['law-30-2018','law-60-2018','law-22-2018','law-66-2018','law-83-2013','law-71-2024']) {
    const article=readLawArticles(key,'en').find(article=>article.complete && article.segments.length);
    assert.ok(article,key);
    const metadata=catalog.documents.find(doc=>doc.key===key);
    const legacy={title:metadata.title,source:`Original law citation\nSource PDF: https://sources.example/storage/v1/object/public/justicehub-legal-sources/amategeko/${metadata.sha256}.pdf`,content:'Old short database excerpt.'};
    const [expanded]=expandLawArticles([legacy],`Explain article ${article.number}`,{preferredArticles:[article.number]});
    assert.equal(expanded.articleNumber,article.number);
    assert.ok(expanded.content.includes(article.segments[0].text));
    assert.equal(legacy.content,'Old short database excerpt.');
  }
});

test('unknown or mismatched source identities cannot be expanded and an absent requested article cannot be substituted',()=>{
  const document=seed('law-49-2023',47);
  assert.deepEqual(expandLawArticles([{...document,source:'https://sources.example/random.pdf'}],'Article 28'),[{...document,source:'https://sources.example/random.pdf'}]);
  const wrong=seed('law-27-2019',35,'en');
  const mismatch={...document,source:wrong.source};
  assert.deepEqual(expandLawArticles([mismatch],'Article 28'),[mismatch]);
  assert.deepEqual(expandLawArticles([document],'Article 999',{preferredArticles:[999]}),[]);
});

test('a model draft citing an absent PDF article is withheld; source-reading fallback is the same streamed and saved text',async()=>{
  const docs=expandLawArticles([seed('law-49-2023',47)],'Explain VAT article 28',{preferredArticles:[28]});
  const events=[];let requests=0;
  const provider=createChatProvider({model:'openai/gpt-oss-120b',fallbackModel:'none',searchSetting:'false',
    client:{chat:{completions:{async create(){requests++;return(async function*(){yield{choices:[{delta:{content:'Article 999 creates an automatic exemption.'}}]};})();}}}}});
  const reply=await provider.reply({message:'Explain VAT article 28 in English',legalDocs:docs,replyLanguage:'en',streaming:true,
    onEvent:(event,data)=>{if(event==='token')events.push(data.text);}});
  assert.equal(requests,1,'No paid or repeated correction request');
  assert.equal(events.join(''),reply);
  assert.doesNotMatch(reply,/automatic exemption|Article 999/);
  assert.match(reply,/supplied PDF text/);
  assert.match(reply,/LAW ESTABLISHING VALUE ADDED TAX.pdf/);
  assert.deepEqual(unsupportedArticleCitations('Article 28 provides the declaration rule.',docs),[]);
  assert.deepEqual(unsupportedArticleCitations('Article 999 was not provided, so I cannot verify it.',docs),[]);
  assert.deepEqual(unsupportedArticleCitations('Article 999 describes the exemption.',docs),[999]);
  assert.deepEqual(unsupportedArticleCitations('Article 999 describes the exemption.',docs,{sources:[{title:'Official amendment'}]}),[],'External evidence is not represented as locally validated');
  assert.equal(unsupportedFilingPeriod('Bamenyesha mu minsi 15 nyuma y’icyumweru.',docs),true);
  assert.equal(unsupportedFilingPeriod('Bamenyesha mu minsi 15 nyuma y’igihembwe.',docs),false);
  assert.equal(unsupportedFilingPeriod('Declare within 15 days after the week.',docs),true);
  assert.equal(unsupportedFilingPeriod('Declare quarterly, or choose monthly filing.',docs),false);
  assert.deepEqual(unsupportedArticleCitations('Article 28(4) permits this choice.',docs),[]);
  assert.deepEqual(unsupportedArticleCitations('Ingingo ya 4 permits this choice.',docs),[4]);
});
