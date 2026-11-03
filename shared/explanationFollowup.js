// Entire-message follow-ups only: added case facts or a new substantive topic
// must keep their own route. This does not turn an earlier AI claim into evidence.
export function explanationFollowup(message) {
  const text=String(message||'').normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().trim().replace(/[.!?]+$/,'').trim().replace(/\s+/g,' ');
  return /^(?:please )?(?:(?:(?:can|could|would) (?:you|u) )?explain(?: (?:it|that|this|more))?(?: (?:clearly|simply|more clearly|in (?:simple|plain) (?:words|terms|language)))?|(?:make|say) (?:it|that|this) (?:clearer|simpler)|simplify (?:it|that|this)|in (?:simple|plain) (?:words|terms|language)|sobanura(?: neza)?|explique(?:z)?(?: (?:simplement|clairement|plus clairement))?)(?: please)?$/.test(text);
}
