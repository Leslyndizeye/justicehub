import {writeFileSync} from 'node:fs';
import {searchLegalDocs} from '../legalRetrieval.js';
import {legalRetrievalCases} from './legalRetrievalCases.js';
import {lawExcerptMetadata} from '../lawArticles.js';
import {boundedContext} from '../chatProvider.js';
const client={from(){throw new Error('The local retrieval evaluation never reads the database');}};
const results=[];
for(const [name,question,key,article,language] of legalRetrievalCases) {
  const started=performance.now();
  const docs=await searchLegalDocs(client,question,[],language);
  const supplied=boundedContext([],docs).legalDocs;
  const found=supplied.some(doc=>lawExcerptMetadata(doc)?.key===key && doc.articleNumber===article);
  results.push({name,passed:key?found:supplied.length===0,documents:supplied.length,ms:Math.round(performance.now()-started)});
}
const passed=results.filter(row=>row.passed).length;
console.log(JSON.stringify({passed,total:results.length,failed:results.filter(row=>!row.passed),externalCalls:0}));
if(process.argv.includes('--report')) {
  const path=new URL('../data/legal-retrieval-evaluation.md',import.meta.url);
  const report=`# Published-PDF retrieval evaluation\n\n${passed}/${results.length} target checks passed. No model, search-provider or database calls. Covers all 16 uploaded documents, multilingual maternity/VAT wording, a typing error, and a missing article.\n\nThis measures whether the target article reaches the bounded model context. It does not measure legal interpretation, translation quality, completeness, or current-law accuracy, and does not establish a 20× improvement.\n\n| Check | Result | Supplied articles | Local time (ms) |\n| --- | --- | --- | --- |\n${results.map(row=>`| ${row.name} | ${row.passed?'Pass':'Fail'} | ${row.documents} | ${row.ms} |`).join('\n')}\n`;
  writeFileSync(path,report);
}
if(passed!==results.length)process.exitCode=1;
