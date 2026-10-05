const browserModels = new Set(['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'openai/gpt-oss-safeguard-20b']);

export function webSearchEnabled(model, setting = process.env.GROQ_WEB_SEARCH) {
  return setting?.trim().toLowerCase() !== 'false' && browserModels.has(model);
}

export function searchOptions(model, message, setting) {
  if (!webSearchEnabled(model, setting)) return {};
  const needsSearch = /\b(news|latest|current|today|yesterday|this week|this month|recent(?:ly)?|up[- ]to[- ]date)\b|\b(search|browse|look\s*up|check|verify)\b.{0,35}\b(web|internet|online|sources?)\b/i.test(message);
  return { tools: [{ type: 'browser_search' }], tool_choice: needsSearch ? 'required' : 'auto' };
}

function safeSource(url, title) {
  try {
    const parsed = new URL(url);
    if (!['https:', 'http:'].includes(parsed.protocol) || parsed.username || parsed.password) return null;
    return { url: parsed.href, title: (title || parsed.hostname).replace(/[\[\]\\\r\n]/g, ' ').trim() };
  } catch { return null; }
}

// Built-in browser events expose real result URLs and opened pages separately from answer tokens.
export function createSearchTracker() {
  const sources = new Map();
  const citations = new Map();
  const opened = new Set();
  let used = false;
  return {
    observe(executedTools = []) {
      for (const tool of executedTools) {
        if (!tool.name?.startsWith('browser.')) continue;
        used = true;
        for (const result of tool.search_results?.results || []) {
          const source = safeSource(result.url, result.title);
          if (source) sources.set(source.url, source);
        }
        const url = tool.output?.match(/(?:^|\n)(?:L\d+:\s*)?URL:\s*(https?:\/\/\S+)/)?.[1];
        if (url && tool.name !== 'browser.search') {
          const source = safeSource(url);
          if (source) {
            if (!sources.has(source.url)) sources.set(source.url, source);
            citations.set(String(tool.index), sources.get(source.url));
            opened.add(source.url);
          }
        }
      }
      return used;
    },
    finish(text) {
      if (!text.trim()) return '';
      const linked = new Set();
      let answer = text.replace(/〖(\d+)(?:†[^〗]*)?〗/g, (_, index) => {
        const source = citations.get(index);
        if (!source) return '';
        linked.add(source.url);
        return `[${source.title}](${source.url})`;
      }).trim();
      for (const source of sources.values()) {
        if (answer.includes(source.url)) linked.add(source.url);
      }
      // If the model omitted its links, show pages actually opened, rather than inventing citations.
      if (used && !linked.size && opened.size) {
        answer += '\n\nSources: ' + [...opened].slice(0, 3).map(url => {
          const source = sources.get(url);
          return `[${source.title}](${source.url})`;
        }).join(', ');
      }
      return answer;
    },
  };
}
