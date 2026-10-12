import { test } from 'node:test';
import assert from 'node:assert/strict';
import corpus from '../data/amategeko.json' with {type:'json'};
import catalog from '../data/amategekoCatalog.json' with {type:'json'};
import { searchLegalDocs as searchStoredLegalDocs } from '../legalRetrieval.js';
import { vatQuestion } from '../legalTaxTopic.js';
import { excerptArticles } from '../lawArticles.js';
import { publicSearchPlan, normalizeSearchSources } from '../externalSearch.js';
import { browserSearchSources } from '../searchFallback.js';
import { buildChatMessages } from '../chatPrompt.js';
import { boundedContext, createChatProvider } from '../chatProvider.js';
import { finishLawReply } from '../lawSources.js';
import { vatOverviewAnswer, isBasicVatOverview } from '../vatOverviewAnswer.js';

const message = 'amategeko avuga ku ki kumusorowinyongerera gaciro ?';
const searchLegalDocs=(client,message,history=[],language='en')=>searchStoredLegalDocs(client,message,history,language,{localSearch:()=>[]});
const law = corpus.documents.find(doc=>doc.key === 'law-49-2023');
const metadata = catalog.documents.find(doc=>doc.key === law.key);
const base = `https://sources.example/storage/v1/object/public/justicehub-legal-sources/amategeko/${metadata.sha256}.pdf`;
const rows = law.chunks.map(chunk=>({title:law.title, year:law.year, source:`${base}#page=${chunk.page}`,
  content:`[Amategeko PDF: ${law.key}; language: ${chunk.language}; page: ${chunk.page}; part: ${chunk.part}; published: ${law.published}]\nPublished copy.\n${chunk.text}`}));
function database(data=rows) {
  return {from(table) {
    assert.equal(table,'legal_documents');
    return {select(){return {like(column,value){assert.equal(column,'content');assert.equal(value,'[Amategeko PDF: law-49-2023;%');return this;},
      async limit(count){assert.equal(count,1000);return {data};}};}};
  }};
}

test('the joined Kinyarwanda VAT spelling, standard terms and a focused follow-up retain the public VAT topic',()=>{
  for (const question of [message,'umusoro ku nyongeragaciro','umusoro w’inyongera gaciro','VAT law','TVA au Rwanda','value-added tax']) {
    assert.ok(vatQuestion(question),question);
    assert.match(publicSearchPlan(question).query,/value added tax VAT law 049\/2023 amendments/);
    assert.equal(publicSearchPlan(question).legalTopic,'vat');
  }
  assert.equal(vatQuestion('What is income tax?'),null);
  assert.equal(vatQuestion('What is your name?',[{sender:'user',content:message}]),null);
  assert.equal(vatQuestion('none ingingo ya 28 ivuga iki?',[{sender:'user',content:message}]).article,28);
  assert.equal(vatQuestion('Nk’uko inyandiko ya VAT ibivuga mu ngingo ya 28').article,28);
  assert.doesNotMatch(publicSearchPlan('My client Aniela passport 123456 asks about VAT').query,/Aniela|123456|passport|client/);
});

test('the reported question receives actual VAT rates, zero-rate, exemption and filing text in Kinyarwanda',async()=>{
  const wrong = {title:'Constitution',source:'https://sources.example/constitution.pdf#page=28',content:'Article 28: rights'};
  const excerpts = await searchLegalDocs(database([...rows,wrong]),message,[],'rw');
  assert.deepEqual(excerpts.map(doc=>Number(doc.source.split('=').at(-1))),[14,16,19,47]);
  assert.deepEqual(excerpts.map(doc=>excerptArticles(doc)),[[4],[7],[8],[28]]);
  assert.ok(excerpts.every(doc=>doc.content.includes('language: rw;')));
  const bounded = boundedContext([],excerpts).legalDocs;
  assert.match(bounded.map(doc=>doc.content).join('\n'),/200\.000\.000/,'Filing conditions remain visible within the provider budget');
  const request = buildChatMessages({message,legalDocs:bounded,replyLanguage:'rw'});
  assert.match(request[0].content,/LAW ESTABLISHING VALUE ADDED TAX\.pdf/);
  assert.match(request[0].content,/"article_numbers":\[28\]/);
  assert.doesNotMatch(JSON.stringify(excerpts),/Constitution|Income_Tax/);
});

test('Article 28 resolves to the VAT declaration text on PDF page 47, and missing articles never substitute unrelated law',async()=>{
  const excerpts = await searchLegalDocs(database(),'Explain VAT ingingo ya 28',[],'rw');
  assert.equal(excerpts.length,1);
  assert.ok(excerpts.every(doc=>excerptArticles(doc).includes(28)));
  assert.equal(excerpts[0].source,`${base}#page=47`);
  assert.match(excerpts[0].content,/Kumenyekanisha/);
  assert.deepEqual(await searchLegalDocs(database(),'VAT article 999',[],'rw'),[]);
  assert.deepEqual(await searchLegalDocs(database([]),message,[],'rw'),[]);
});

test('the VAT evidence filter excludes the reported privacy and human-research results even on official sites',()=>{
  const results = [
    {title:'Law relating to Protection of Personal Data and Privacy',url:'https://rwandalii.org/data-privacy',raw_content:'Navigation: VAT, income tax, research.'},
    {title:'Law relating to Research on a Human Being',url:'https://rwandalii.org/human-research',content:'A law.'},
    {title:'Republic of Rwanda',url:'https://www.minijust.gov.rw/constitution.pdf',content:'The Constitution.'},
    {title:'Law establishing value added tax',url:'https://www.rra.gov.rw/LAW_ESTABLISHING_VALUE_ADDED_TAX.pdf',raw_content:'Article 4: Rates'},
    {title:'Law amending the 2023 VAT law',url:'https://www.rra.gov.rw/Law_amending_the_2023_VAT_law___May_2025.pdf',content:'An amendment.'},
  ];
  const sources=normalizeSearchSources(results,true,'vat');
  assert.equal(sources.length,2);
  assert.ok(sources.every(doc=>/VAT|value added tax/.test(doc.title)));
  assert.deepEqual(browserSearchSources([{name:'browser.search',search_results:{results:results.map(result=>({...result,content:result.raw_content || result.content}))}}],true,'vat').map(item=>item.url),sources.map(item=>item.url));
  assert.doesNotThrow(()=>normalizeSearchSources([{title:'VAT',url:'https://www.rra.gov.rw/%zz',content:'Rates'}],true,'vat'));
});

test('article citations retain the original filename and differ from navigation pages in streamed and saved replies',async()=>{
  const excerpts=await searchLegalDocs(database(),'VAT ingingo ya 28',[],'rw');
  const footer=finishLawReply('Ibisobanuro.',excerpts,'rw');
  assert.match(footer,/\[LAW ESTABLISHING VALUE ADDED TAX\.pdf\]/);
  assert.match(footer,/Ingingo 28; PDF paji 47, 48/);
  const events=[];
  const provider=createChatProvider({model:'openai/gpt-oss-120b',fallbackModel:'none',searchSetting:'false',
    client:{chat:{completions:{async create(){return {choices:[{message:{content:JSON.stringify({status:'answered',points:[{kind:'rule',statement:'Taxpayers may choose monthly declarations.',evidence:[{source_id:'P1',paragraph:4,quote:excerpts[0].content.match(/\(4\)[\s\S]*?(?=\(5\))/)[0].trim()}]}]})}}]};}}}}});
  const reply=await provider.reply({message:'Explain VAT article 28 in English',legalDocs:excerpts,replyLanguage:'en',streaming:true,
    onEvent:(event,data)=>{if(event==='token')events.push(data.text);}});
  assert.equal(events.join(''),reply);
  assert.match(reply,/Article 28\(4\)/);
});

test('the basic dated VAT overview preserves exemptions, the threshold boundary and optional monthly filing without model/search quotas',async()=>{
  const excerpts=await searchLegalDocs(database(),message,[],'rw');
  for(const language of ['rw','en','fr']) {
    const reply=vatOverviewAnswer(message,excerpts,language);
    assert.ok(reply);
    assert.match(reply,/200/);
    assert.match(reply,/2023/);
    assert.equal((reply.match(/\]\(https:/g)||[]).length,1,'One real named PDF source');
  }
  const events=[];
  const provider=createChatProvider({model:'openai/gpt-oss-120b',
    client:{chat:{completions:{create(){throw new Error('No generation for the source-backed overview');}}}},
    externalSearch:{lookup(){throw new Error('No live lookup claimed for the dated source answer');}}});
  const reply=await provider.reply({message,legalDocs:excerpts,replyLanguage:'rw',streaming:true,
    onEvent:(event,data)=>{if(event==='token')events.push(data.text);}});
  assert.equal(events.join(''),reply);
  assert.match(reply,/Gusonerwa umusoro bitandukanye no gusoreshwa kuri 0%/);
  assert.match(reply,/bitarenze 200\.000\.000/);
  assert.match(reply,/ashobora guhitamo/);
  assert.match(reply,/impinduka zakurikiyeho ntizigenzuwe/);
  for(const text of ['latest VAT law','VAT article 28','VAT filing deadline for my company','VAT on imported software','What is VAT in 2026?']) {
    assert.equal(isBasicVatOverview(text),false,text);
    assert.equal(vatOverviewAnswer(text,excerpts),null,text);
  }
  assert.equal(vatOverviewAnswer(message,[]),null);
  const forged=excerpts.map(doc=>({...doc,source:'https://sources.example/not-vat.pdf'}));
  assert.equal(vatOverviewAnswer(message,forged),null);
});
