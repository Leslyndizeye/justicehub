import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {lawRowId, primaryLawNumber, planLawImport, writeLawPlan} from '../lawImport.js';

const url=name=>`https://laws.example/amategeko/${name}`;
const law={key:'law-27-2019',number:'27/2019',title:'Law No. 027/2019 criminal procedure',category:'criminal_procedure',year:2019,
  published:'2019-11-08',legacyTitlePattern:'criminal|procedure',sha256:'a'.repeat(64),pages:2,
  chunks:[{language:'en',page:1,part:1,text:'An investigator may summon a person.'},{language:'rw',page:2,part:1,text:'Ubugenzacyaha.'}]};
const bundle={version:1,documents:[law]};

test('deduplicates the same law/version, distinguishes amendments and preserves a newer constitution',()=>{
  assert.equal(primaryLawNumber('Law No. 027/2019 of 19/09/2019'), '27/2019');
  assert.equal(primaryLawNumber('Law No. 058/2023 amending Law No. 027/2019'), '58/2023');
  const legacy={id:'old',title:'Criminal Procedure — Summons',source:'Law No. 027/2019 of 19/09/2019',content:'Existing reviewed summary',year:2019};
  const plan=planLawImport(bundle,[legacy],url);
  assert.equal(plan.rows.length,0); assert.equal(plan.skipped[0].reason,'existing_version');
  assert.equal(plan.sourceUpdates.length,1); assert.equal(legacy.content,'Existing reviewed summary');
  assert.equal(planLawImport(bundle,[{...legacy,source:'Law No. 058/2023 amending Law No. 027/2019'}],url).rows.length,2);
  const constitution={...law,key:'constitution-2023',number:null,title:'Constitution 2023',year:2023};
  const existing=[{...legacy,title:'Constitution — Equality',source:'Constitution of Rwanda 2003 revised in 2015',year:2015}];
  assert.equal(planLawImport({version:1,documents:[constitution]},existing,url).rows.length,2);
});

test('duplicate PDFs and repeat imports insert no repeated excerpts and partially completed imports resume',()=>{
  const plan=planLawImport({version:1,documents:[law,law]},[],url);
  assert.equal(plan.rows.length,2);assert.equal(plan.skipped[0].reason,'duplicate_in_bundle');
  assert.match(plan.rows[0].source, /#page=1$/);
  assert.equal(planLawImport(bundle,[plan.rows[0]],url).rows.length,1);
  assert.equal(planLawImport(bundle,plan.rows,url).rows.length,0);
  assert.notEqual(lawRowId(law.key,law.sha256,'en',1,1),lawRowId(law.key,law.sha256,'rw',1,1));
  assert.throws(()=>planLawImport(bundle,[{...plan.rows[0],content:'Changed independently'}],url),/no overwrite/);
});

test('source enrichment is conditional, imports conflict-ignore without deletes, and database failures stop cleanly',async()=>{
  const plan=planLawImport(bundle,[],url);
  const writes=[];
  const client={from(table){assert.equal(table,'legal_documents');return{
    upsert(rows,options){writes.push({rows,options});return{select:async()=>({data:rows.map(r=>({id:r.id}))})};},
  };}};
  assert.deepEqual(await writeLawPlan(client,plan),{inserted:2,linked:0});
  assert.deepEqual(writes[0].options,{onConflict:'id',ignoreDuplicates:true});
  const failed={from(){return{upsert(){return{select:async()=>({error:{code:'write_failed'}})};}};}};
  await assert.rejects(writeLawPlan(failed,plan),/rerun to resume without duplicates/);
  const conditions=[];
  const linked={from(){return{update(values){conditions.push(values);const query={eq(key,value){conditions.push([key,value]);return query;},select:async()=>({data:[]})};return query;}};}};
  assert.deepEqual(await writeLawPlan(linked,{rows:[],sourceUpdates:[{id:'old',previous:'old citation',source:'new link'}]}),{inserted:0,linked:0});
  assert.deepEqual(conditions,[{source:'new link'},['id','old'],['source','old citation']]);
});

test('the entire prepared archive has readable bounded text, unique versions, provenance and explicit OCR qualifications',async()=>{
  const corpus=JSON.parse(await readFile(new URL('../data/amategeko.json',import.meta.url),'utf8'));
  assert.equal(corpus.documents.length,16);
  assert.equal(new Set(corpus.documents.map(doc=>doc.key)).size,16);
  const plan=planLawImport(corpus,[],url);
  assert.equal(new Set(plan.rows.map(row=>row.id)).size,plan.rows.length);
  for(const doc of corpus.documents){assert.ok(doc.originalSource.startsWith('https://'));assert.ok(doc.published);assert.ok(doc.chunks.length);}
  assert.ok(plan.rows.some(row=>/OCR transcription/.test(row.content)));
  assert.ok(plan.rows.every(row=>row.content.includes('current applicability have not been verified')));
  assert.ok(plan.rows.every(row=>row.content.length<1800));
});
