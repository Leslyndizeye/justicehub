// Rebuild lightweight citation metadata from the uploaded text, without DB/API calls.
import fs from 'node:fs';
import { articleHeadings } from '../lawArticleHeadings.js';
const data = new URL('../data/', import.meta.url);
const corpus = JSON.parse(fs.readFileSync(new URL('amategeko.json', data), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(new URL('amategekoCatalog.json', data), 'utf8'));
const documents = {};
const report=fs.readFileSync(new URL('amategeko-import-report.md',data),'utf8');
for (const document of corpus.documents) {
  const metadata = catalog.documents.find(item => item.key === document.key);
  if (!metadata) continue;
  metadata.filename = document.originalFilename;
  const archive=[...report.matchAll(/https:\/\/[^\s)]+\/storage\/v1\/object\/public\/justicehub-legal-sources\/amategeko\/[a-f0-9]{64}\.pdf/g)]
    .map(match=>match[0]).find(url=>url.endsWith(`/${document.sha256}.pdf`));
  if(archive)metadata.archiveSource=archive;
  const languages = {};
  for (const chunk of document.chunks.filter(item => item.page >= metadata.provisionsFrom)) {
    for (const number of articleHeadings(chunk.text)) {
      (languages[chunk.language] ||= []).push({page:chunk.page, part:chunk.part, number});
    }
  }
  for (const starts of Object.values(languages)) starts.sort((a,b) => a.page-b.page || a.part-b.part);
  documents[document.key] = languages;
}
fs.writeFileSync(new URL('amategekoArticles.json',data), JSON.stringify({version:1,documents})+'\n');
fs.writeFileSync(new URL('amategekoCatalog.json',data), JSON.stringify(catalog,null,2)+'\n');
console.log(`Indexed article headings for ${Object.keys(documents).length} published documents.`);
