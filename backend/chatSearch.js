const browserModels = new Set(['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'openai/gpt-oss-safeguard-20b']);

export function webSearchEnabled(model, setting = process.env.GROQ_WEB_SEARCH) {
  return setting?.trim().toLowerCase() !== 'false' && browserModels.has(model);
}

export function searchOptions(model, message, setting) {
  if (!webSearchEnabled(model, setting)) return {};
  // A vague current-information question may need clarification before any search.
  // Requiring a tool here makes Groq reject an otherwise useful clarifying answer.
  return { tools: [{ type: 'browser_search' }], tool_choice: 'auto' };
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
          if (source && !sources.has(source.url)) sources.set(source.url, source);
        }
        // Long PDF URLs may wrap onto the next numbered line in Groq's browser output.
        const pageOutput = tool.output?.replace(/^L\d+: ?/gm, '');
        const url = pageOutput?.match(/(?:^|\n)URL:\s*(https?:\/\/\S+)/)?.[1];
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
      // A generic homepage link must not hide the specific pages actually checked.
      const missingLinks = [...opened].filter(url => !linked.has(url));
      if (used && missingLinks.length) {
        answer += '\n\nPages checked: ' + missingLinks.slice(0, 3).map(url => {
          const source = sources.get(url);
          return `[${source.title}](${source.url})`;
        }).join(', ');
      }
      return answer;
    },
  };
}
