// A broad introduction, not a current-law check or a request about a case.
const allowed=new Set('so please can could would you u tell give show share list explain me us about some a an the of to in on for which what are is do does say says there exist exists interesting useful notable examples example overview introduction few three two one 1 2 3 laws law rwanda rwandan rwandans s mbwira sobanura amategeko ashimishije ashishikaje amwe ingero yo mu ni ayahe nyarwanda parle moi donne donnez explique expliquer des de du les le la un une au sur lois loi interessantes interessants exemples apercu'.split(' '));
export function rwandaLawOverviewQuestion(message) {
  const text=String(message||'').normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase();
  const words=text.match(/[\p{L}\p{N}]+/gu)||[];
  if(!words.length||!words.every(word=>allowed.has(word)))return null;
  if(!words.some(word=>['law','laws','loi','lois','amategeko'].includes(word)))return null;
  if(!words.some(word=>['rwanda','rwandan','rwandans','interesting','useful','notable','example','examples','overview','introduction','one','two','three','1','2','3','ashimishije','ashishikaje','ingero','interessantes','interessants','exemples','apercu'].includes(word)))return null;
  if(!words.some(word=>['tell','give','show','share','list','explain','which','what','mbwira','sobanura','parle','donne','donnez','explique','expliquer','ayahe'].includes(word)))return null;
  const count=words.some(word=>['one','1','un','une'].includes(word))?1:words.some(word=>['two','2'].includes(word))?2:3;
  return {count};
}
