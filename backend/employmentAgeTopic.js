const fold = text => String(text).normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();

export function employmentAgeQuestion(message) {
  const text = fold(message);
  if (/\b(?:computer|phone|car|dog|cat|puppy)\b/.test(text)
    && !/\b(?:person|people|child|children|employee|worker|umwana|abana|umukozi)\b/.test(text)) return false;
  return /\bage\b|\bhow old\b|\bold enough\b|\bimyaka\b|\bans\b/.test(text)
    && /\bwork(?:ing)?\b|\bemploy\w*\b|\bjobs?\b|\bakazi\b|\bgukora\b|\bumurimo\b|\btravail\w*\b|\bemploi\b/.test(text)
    && !/\bretir\w*\b|\bpension\w*\b|\bizabukuru\b|\bretraite\b|maximum age|stop working|penalt\w*|punish\w*|igihano|ibihano/.test(text);
}

const basicWords = new Set('how what which at age old enough minimum legal a an the person someone people child children kid kids should can could may is are be to start begin allowed admission employment employed work working job jobs in rwanda rwandan law labour labor please tell me explain years does do have ni iyihe imyaka ingahe umuntu umwana abana yemerewe afite gutangira gukora akazi umurimo mu rwanda sobanura mbwira quel quelle est age minimum pour travailler travail emploi ans au expliquer explique de du le la les l un une personne peut'.split(' '));
export function basicEmploymentAgeQuestion(message) {
  return employmentAgeQuestion(message) && (fold(message).match(/[\p{L}\p{N}]+/gu) || []).every(word => basicWords.has(word));
}

