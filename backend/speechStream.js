// Convert provider SSE audio events to bounded PCM without waiting for the full clip.
export async function readSpeechPcm(response, onAudio, signal) {
  const invalid = () => Object.assign(new Error('Speech is unavailable.'), { code: 'speech_unavailable', status: 503 });
  if (!response.body || !response.headers.get('content-type')?.startsWith('text/event-stream')) throw invalid();
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '', bytes = 0, audioBytes = 0, completed = false;
  const parts = [];
  async function frame(value) {
    signal?.throwIfAborted();
    const lines = value.split('\n');
    const text = lines.filter(line => line.startsWith('data:')).map(line => line.slice(5).trimStart()).join('\n');
    if (!text || text === '[DONE]') return;
    const event = JSON.parse(text);
    const type = event.event_type || event.type || lines.find(line => line.startsWith('event:'))?.slice(6).trim();
    if (type === 'error' || type === 'interaction.failed') throw invalid();
    if (type === 'interaction.completed') { if (event.interaction?.status === 'failed') throw invalid(); completed = true; }
    if (type !== 'step.delta' || event.delta?.type !== 'audio') return;
    if (completed || typeof event.delta.data !== 'string' || !/^[A-Za-z0-9+/]+={0,2}$/.test(event.delta.data)
      || event.delta.mime_type && !/^audio\/(?:l16|pcm)(?:;|$)/i.test(event.delta.mime_type)) throw invalid();
    const audio = Buffer.from(event.delta.data, 'base64');
    audioBytes += audio.length;
    if (!audio.length || audioBytes > 8 * 1024 * 1024) throw invalid();
    parts.push(audio);
    await onAudio(audio);
  }
  try {
    while (true) {
      signal?.throwIfAborted();
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.length;
      if (bytes > 12 * 1024 * 1024) throw invalid();
      buffer += decoder.decode(value, { stream: true });
      buffer = buffer.replace(/\r\n/g, '\n');
      let end;
      while ((end = buffer.indexOf('\n\n')) >= 0) { const value = buffer.slice(0, end); buffer = buffer.slice(end + 2); await frame(value); }
      if (buffer.length > 2 * 1024 * 1024) throw invalid();
    }
    buffer += decoder.decode();
    if (buffer.trim()) await frame(buffer);
    signal?.throwIfAborted();
    if (!completed || !audioBytes || audioBytes % 2) throw invalid();
    return Buffer.concat(parts);
  } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
}
