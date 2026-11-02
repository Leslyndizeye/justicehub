import catalog from './data/amategekoCatalog.json' with {type:'json'};
import provisions from './data/criminalProvisions.json' with {type:'json'};
import {legalFields,fieldForTopic} from './legalTopics.js';

export function sourceField(route) {
  return legalFields.find(field=>field.id===route?.field)||fieldForTopic(route?.researchTopic);
}
export function fieldLawKeys(field,task) {
  if(!field)return null;
  const keys=[...field.lawKeys];
  if(['vat','income_tax','tax','tax_procedure'].includes(field.id)&&['penalty','procedure','remedy'].includes(task))keys.push('law-20-2023');
  if(['employment','family'].includes(field.id)&&['procedure','remedy'].includes(task))keys.push('law-22-2018','law-30-2018');
  return [...new Set(keys)];
}
export function lawCoverage() {
  return {publishedPdfCount:catalog.documents.length,selectedProvisionCount:provisions.articles.length,completeRwandaLawCollection:false,
    fields:legalFields.map(field=>{
      const pdfs=catalog.documents.filter(doc=>field.lawKeys.includes(doc.key)).map(doc=>({key:doc.key,title:doc.title,published:doc.published,source:doc.originalSource}));
      const selected=provisions.articles.filter(article=>article.topic===field.id||field.id==='homicide'&&article.topic==='murder');
      return {id:field.id,label:field.label,topic:field.query,coverage:pdfs.length?'published_documents':selected.length?'selected_provisions_only':'no_local_primary_documents',
        completeForField:false,pdfs,selectedArticles:selected.map(article=>({law:provisions.law,article:article.number,pages:article.pages,source:provisions.source,published:provisions.published})),currentLawVerified:false};
    })};
}
