import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {finishLawReply} from '../lawSources.js';
import {createChatProvider} from '../chatProvider.js';

const catalog=JSON.parse(await readFile(new URL('../data/amategekoCatalog.json',import.meta.url),'utf8'));
const law=catalog.documents.find(doc=>doc.key==='law-27-2019');
const base=`https://sources.example/storage/v1/object/public/justicehub-legal-sources/amategeko/${law.sha256}.pdf`;
const excerpt=(page,language='en')=>({title:law.title,source:`${base}#page=${page}`,
  content:`[Amategeko PDF: ${law.key}; language: ${language}; page: ${page}; part: 1; published: ${law.published}]\nPublished copy.\nThis Law governs criminal procedure.`});

test('missing model links get one PDF reference even when several pages and languages were supplied',()=>{
  const result=finishLawReply('A plain explanation.',[excerpt(35),excerpt(36),excerpt(35,'rw')]);
  assert.equal((result.match(/\]\(https:/g)||[]).length,1);
  assert.match(result,/pages 35, 36/);
  assert.ok(result.includes(`${base}#page=35`));
  assert.equal(finishLawReply(`See [the law](${base}).`,[excerpt(35)]),`See [the law](${base}).`);
  assert.match(finishLawReply('Une explication.',[excerpt(35)],'fr'),/PDF de référence/);
  assert.match(finishLawReply('Ibisobanuro.',[excerpt(35)],'rw'),/Inyandiko za PDF/);
});

test('unknown, mismatched or unsafe PDF metadata cannot manufacture references and empty replies stay empty',()=>{
  for(const changed of [{source:'javascript:alert(1)'},{source:`${base}#page=1`},{source:`${base}?token=private#page=35`},
    {source:'https://sources.example/other.pdf#page=35'},{content:'[Amategeko PDF: unknown; language: en; page: 35;]'}]){
    assert.equal(finishLawReply('Explanation.',[{...excerpt(35),...changed}]),'Explanation.');
  }
  assert.equal(finishLawReply('',[excerpt(35)]),'');
});

test('both streamed and saved replies carry the same PDF footer without another model request',async()=>{
  let calls=0;const events=[];
  const provider=createChatProvider({model:'openai/gpt-oss-120b',fallbackModel:'none',searchSetting:'false',client:{chat:{completions:{
    async create(request){calls++;return request.stream?(async function*(){yield{choices:[{delta:{content:'This Law governs criminal procedure.'}}]};})()
      :{choices:[{message:{content:'This Law governs criminal procedure.'}}]};},
  }}}});
  const streamed=await provider.reply({message:'Explain Law No. 027/2019',legalDocs:[excerpt(35)],replyLanguage:'en',streaming:true,
    onEvent:(name,data)=>{if(name==='token')events.push(data.text);}});
  assert.ok(streamed.includes(base));assert.equal(events.join(''),streamed);assert.equal(calls,1);
  const plain=await provider.reply({message:'Explain Law No. 027/2019',legalDocs:[excerpt(35)],replyLanguage:'en'});
  assert.equal(plain,streamed);assert.equal(calls,2);
});
