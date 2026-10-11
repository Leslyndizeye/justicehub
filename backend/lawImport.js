import { createHash } from 'node:crypto';

export function lawRowId(key, hash, language, page, part) {
  const bytes = createHash('sha256').update(JSON.stringify(['justicehub-law-v1', key, hash, language, page, part])).digest().subarray(0, 16);
  bytes[6] = (bytes[6] & 15) | 80; bytes[8] = (bytes[8] & 63) | 128;
  const hex = bytes.toString('hex');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

export function primaryLawNumber(source) {
  // Only the first cited law counts: an amendment mentioning a base law is a different version.
  const match = String(source || '').match(/\b(?:law|loi|itegeko)\s*(?:(?:no\.?|n[º°o§]?\.?)\s*)?(\d+)\/(\d{4})/i);
  return match ? `${Number(match[1])}/${match[2]}` : null;
}

export function documentAlreadyRepresented(document, rows) {
  return rows.filter(row => {
    if (String(row.content).startsWith('[Amategeko PDF:')) return false; // Partial imports resume by row ID below.
    if (document.number) return primaryLawNumber(row.source) === document.number
      && new RegExp(document.legacyTitlePattern, 'i').test(row.title);
    return document.key === 'constitution-2023' && /constitution/i.test(row.title)
      && /2023/.test(row.source) && Number(row.year) === 2023;
  });
}

export function planLawImport(corpus, existing, publicUrl) {
  if (corpus.version !== 1 || !Array.isArray(corpus.documents)) throw new Error('Invalid law corpus.');
  const byId = new Map(existing.map(row => [row.id, row]));
  const rows = [], skipped = [], sourceUpdates = [], documents = [];
  const seenVersions = new Set(), seenRows = new Set();
  for (const document of corpus.documents) {
    if (seenVersions.has(document.key)) { skipped.push({ key: document.key, reason: 'duplicate_in_bundle' }); continue; }
    seenVersions.add(document.key);
    if (!/^[a-f0-9]{64}$/.test(document.sha256) || !document.chunks?.length) throw new Error(`Missing text or checksum: ${document.key}`);
    const source = publicUrl(`${document.sha256}.pdf`);
    const parsed = new URL(source);
    if (parsed.protocol !== 'https:') throw new Error('Law sources require HTTPS.');
    const represented = documentAlreadyRepresented(document, existing);
    if (represented.length) {
      skipped.push({ key: document.key, reason: 'existing_version', excerpts: represented.length });
      for (const row of represented) {
        // Keep existing content and citation; only add a working copy of its source.
        if (!String(row.source).includes(source)) sourceUpdates.push({ id: row.id, previous: row.source,
          source: `${row.source}\nSource PDF: ${source}` });
      }
    } else {
      for (const chunk of document.chunks) {
        if (!['rw','en','fr'].includes(chunk.language) || !Number.isInteger(chunk.page) || chunk.page < 1
          || chunk.page > document.pages || !Number.isInteger(chunk.part) || chunk.part < 1
          || typeof chunk.text !== 'string' || !chunk.text.trim() || chunk.text.length > 1450
          || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(chunk.text)) throw new Error(`Invalid excerpt: ${document.key}`);
        const id = lawRowId(document.key, document.sha256, chunk.language, chunk.page, chunk.part);
        const label = {rw:'Ikinyarwanda',en:'English',fr:'French'}[chunk.language];
        const warning = chunk.ocr ? ' OCR transcription: verify every amount and legal condition against the PDF.' : '';
        const row = { id, title: `${document.title} — ${label}, PDF page ${chunk.page}, part ${chunk.part}`,
          category: document.category, year: document.year, source: `${source}#page=${chunk.page}`,
          content: `[Amategeko PDF: ${document.key}; language: ${chunk.language}; page: ${chunk.page}; part: ${chunk.part}; published: ${document.published}]
${document.title}. Uploaded published version; later amendments and current applicability have not been verified.${warning}
${chunk.text}` };
        const old = byId.get(id);
        if (old && (old.content !== row.content || old.title !== row.title)) throw new Error(`Existing excerpt differs; no overwrite: ${document.key}`);
        if (!old && !seenRows.has(id)) rows.push(row);
        seenRows.add(id);
      }
    }
    documents.push({ ...document, source, represented: Boolean(represented.length) });
  }
  return { rows, sourceUpdates, skipped, documents };
}

export async function loadExistingLaws(client) {
  const rows = [];
  for (let offset = 0; ; offset += 500) {
    const {data, error} = await client.from('legal_documents').select('id,title,source,year,content').order('id').range(offset, offset + 499);
    if (error) throw new Error(`Cannot read legal documents (${error.code || 'database_error'}).`);
    rows.push(...data);
    if (data.length < 500) return rows;
  }
}

export async function writeLawPlan(client, plan) {
  let inserted = 0, linked = 0;
  for (let start = 0; start < plan.rows.length; start += 100) {
    const {data, error} = await client.from('legal_documents').upsert(plan.rows.slice(start, start + 100),
      {onConflict:'id', ignoreDuplicates:true}).select('id');
    if (error) throw new Error(`Law import stopped (${error.code || 'database_error'}); rerun to resume without duplicates.`);
    inserted += data.length;
  }
  for (const update of plan.sourceUpdates) {
    const {data, error} = await client.from('legal_documents').update({source:update.source}).eq('id',update.id)
      .eq('source',update.previous).select('id');
    if (error) throw new Error(`Source linking stopped (${error.code || 'database_error'}); rerun to resume.`);
    linked += data.length;
  }
  return {inserted, linked};
}
