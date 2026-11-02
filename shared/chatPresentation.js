// Loading metadata is never free-form assistant text. In particular, an older
// backend's provider/debug messages must not become labels in the public UI.
export function chatStatusLabel(data, language = 'en') {
  const labels = data?.webSearch === true ? {
    en: 'Checking sources…', rw: 'Ndagenzura amasoko…', fr: 'Vérification des sources…',
  } : {
    en: 'Preparing your answer…', rw: 'Ndategura igisubizo…', fr: 'Préparation de votre réponse…',
  };
  return labels[language] || labels.en;
}
