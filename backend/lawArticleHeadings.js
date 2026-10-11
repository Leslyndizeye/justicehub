export function articleHeadings(text) {
  return articleHeadingPositions(text).map(match=>match.number);
}

export function articleHeadingPositions(text) {
  return [...String(text).matchAll(/^(?:Ingingo\s+ya\s+(\d+|mbere)|Article\s+(\d+|One|premier|premi[eè]r))\s*:/gim)]
    .map(match => ({offset:match.index,number:/^\d+$/.test(match[1] || match[2]) ? Number(match[1] || match[2]) : 1}));
}
