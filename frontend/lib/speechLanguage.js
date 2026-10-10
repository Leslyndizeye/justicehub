import { franc } from 'franc-min';

// Older saved messages have no reply-language field, so inspect the actual answer locally.
export function speechLanguage(text, explicit) {
  if (['en', 'fr', 'rw'].includes(explicit)) return explicit;
  const prose = String(text || '').replace(/https?:\/\/\S+/gu, '').trim();
  if (/\b(?:means|refers to|in English)\b/i.test(prose) && prose.length < 80) return 'en';
  if (prose.length < 40) {
    if (/\b(?:muraho|murakoze|nitwa|yego|oya|amakuru|amategeko|icyaha|ahanishwa|izina ryanjye)\b/i.test(prose)) return 'rw';
    if (/\b(?:bonjour|merci|bonsoir|oui|vous|votre|salut)\b/i.test(prose)) return 'fr';
    if (/\b(?:hello|thanks|thank you|yes|no|your|you|of course)\b/i.test(prose)) return 'en';
  }
  return { eng: 'en', fra: 'fr', kin: 'rw' }[franc(prose, { only: ['eng', 'fra', 'kin'], minLength: 20 })] || 'en';
}
