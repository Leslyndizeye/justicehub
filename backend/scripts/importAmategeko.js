import 'dotenv/config';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { loadExistingLaws, planLawImport, writeLawPlan } from '../lawImport.js';

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const pdfDirectory = args.includes('--pdf-dir') ? args[args.indexOf('--pdf-dir') + 1] : null;
const bucket = 'justicehub-legal-sources';
const corpus = JSON.parse(await readFile(fileURLToPath(new URL('../data/amategeko.json',import.meta.url)),'utf8'));
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!key) throw new Error('Set backend-only SUPABASE_SERVICE_ROLE_KEY to import laws.');
const client = createClient(process.env.SUPABASE_URL, key, {auth:{persistSession:false,autoRefreshToken:false}});
const publicUrl = name => client.storage.from(bucket).getPublicUrl(`amategeko/${name}`).data.publicUrl;

async function pdfs(dir, result = new Map()) {
  for (const entry of await readdir(dir,{withFileTypes:true})) {
    const file = path.join(dir,entry.name);
    if (entry.isDirectory()) await pdfs(file,result);
    else if (entry.isFile() && /\.pdf$/i.test(entry.name)) {
      const bytes = await readFile(file);
      if (bytes.length > 30 * 1024 * 1024 || bytes.subarray(0,5).toString() !== '%PDF-') throw new Error('Invalid source PDF.');
      result.set(createHash('sha256').update(bytes).digest('hex'),file);
    }
  }
  return result;
}

try {
  const existing = await loadExistingLaws(client);
  const plan = planLawImport(corpus, existing, publicUrl);
  console.log(JSON.stringify({mode:apply?'apply':'preview', existingExcerpts:existing.length, PDFs:plan.documents.length,
    newExcerpts:plan.rows.length, sourcesToLink:plan.sourceUpdates.length, skipped:plan.skipped},null,2));
  if (apply) {
    if (!pdfDirectory) throw new Error('Provide --pdf-dir with the extracted original PDFs.');
    const files = await pdfs(path.resolve(pdfDirectory));
    for (const doc of plan.documents) if (!files.has(doc.sha256)) throw new Error(`Original PDF is missing: ${doc.key}`);
    const storage = await client.storage.getBucket(bucket);
    if (storage.error) {
      if (storage.error.status !== 404 && storage.error.statusCode !== '404') throw new Error('Cannot inspect source storage.');
      const created = await client.storage.createBucket(bucket,{public:true,allowedMimeTypes:['application/pdf'],fileSizeLimit:30*1024*1024});
      if (created.error) throw new Error('Cannot create law PDF storage.');
    } else if (!storage.data.public) throw new Error('Source bucket is private; its permissions were not changed.');
    let uploaded = 0;
    for (const doc of plan.documents) {
      const name = `${doc.sha256}.pdf`;
      const {data,error} = await client.storage.from(bucket).list('amategeko',{search:name,limit:2});
      if (error) throw new Error('Cannot check existing source files.');
      if (data.some(file => file.name === name)) continue;
      const result = await client.storage.from(bucket).upload(`amategeko/${name}`,await readFile(files.get(doc.sha256)),
        {contentType:'application/pdf',upsert:false,cacheControl:'31536000'});
      if (result.error && ![409,'409'].includes(result.error.statusCode || result.error.status)) throw new Error(`PDF upload failed: ${doc.key}`);
      if (!result.error) uploaded++;
    }
    const written = await writeLawPlan(client,plan);
    const remaining = planLawImport(corpus,await loadExistingLaws(client),publicUrl);
    if (remaining.rows.length || remaining.sourceUpdates.length) throw new Error('Post-import verification found unfinished rows; rerun to resume.');
    console.log(JSON.stringify({...written,uploadedPDFs:uploaded,verifiedMissingExcerpts:0,verifiedMissingSourceLinks:0}));
  }
} catch (error) {
  // Do not print service keys, request headers or raw SDK diagnostics.
  console.error(error.message); process.exitCode = 1;
}
