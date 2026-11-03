// Only a general comparison of the dated provisions. Extra case facts,
// jurisdictions, current-law requests and other offences require research.
const allowed=new Set('so please can could would you u tell explain me us about what is are do does the a an for of to in on and or between versus vs than same equal different difference compare comparison right correct really punishment punishments penalty penalties sentence sentences simple ordinary basic aggravated aggravating theft stealing circumstances rwanda rwandan law laws article articles 166 167'.split(' '));
export function theftComparisonQuestion(message) {
  const words=String(message||'').toLowerCase().match(/[\p{L}\p{N}]+/gu)||[];
  return words.length>0 && words.every(word=>allowed.has(word))
    && words.some(word=>['theft','stealing'].includes(word))
    && words.some(word=>['aggravated','aggravating','167'].includes(word))
    && words.some(word=>['same','equal','different','difference','compare','comparison','versus','vs','between'].includes(word));
}
