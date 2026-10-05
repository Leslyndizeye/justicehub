/**
 * Read JSON events from the backend's server-sent response stream.
 * @param {Response} response
 * @param {(event: string, data: any) => void} onEvent
 * @returns {Promise<{reply: string, sessionId: string}>}
 */
export async function readChatStream(response, onEvent) {
  if (!response.body || !response.headers.get('content-type')?.includes('text/event-stream')) {
    throw new Error('The server did not return a streamed reply. Refresh after restarting the backend.');
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  /** @type {{reply: string, sessionId: string} | undefined} */
  let result;

  function processFrame(frame) {
    let event = 'message';
    const data = [];
    for (const line of frame.split('\n')) {
      if (line.startsWith('event:')) event = line.slice(6).trim();
      if (line.startsWith('data:')) data.push(line.slice(5).trimStart());
    }
    if (!data.length) return;
    const payload = JSON.parse(data.join('\n'));
    if (!payload || typeof payload !== 'object') throw new Error('The reply stream contained an invalid event.');
    if (event === 'token' && typeof payload.text !== 'string') throw new Error('The reply stream contained invalid text.');
    if (event === 'done' && (typeof payload.reply !== 'string' || typeof payload.sessionId !== 'string')) {
      throw new Error('The reply stream did not include a completed answer.');
    }
    if (event === 'error') throw new Error(payload.error || 'The reply could not be completed.');
    onEvent(event, payload);
    if (event === 'done') result = payload;
  }

  function processBuffer() {
    buffer = buffer.replace(/\r\n/g, '\n');
    let boundary;
    while ((boundary = buffer.indexOf('\n\n')) !== -1) {
      processFrame(buffer.slice(0, boundary));
      buffer = buffer.slice(boundary + 2);
    }
  }

  try {
    while (!result) {
      const { value, done } = await reader.read();
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
      processBuffer();
      if (done) {
        if (buffer.trim()) processFrame(buffer);
        break;
      }
    }
    if (!result) throw new Error('The connection ended before the reply finished. Please try again.');
    return result;
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
