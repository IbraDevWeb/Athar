import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const bootstrapSource = fs.readFileSync('js/components/ScholarV4Bootstrap.js', 'utf8');
const RAG = 'https://athar-rag-ibradevweb.onrender.com';

function loadWithFetch(fetchImpl, delays = [0, 0, 0]) {
  const window = {
    fetch: fetchImpl,
    location: { href: 'https://ibradevweb.github.io/Athar/index.html' },
    setTimeout,
    clearTimeout,
    __ATHAR_RAG_RETRY_DELAYS_MS__: delays
  };
  const context = vm.createContext({
    window,
    URL,
    DOMException,
    AbortController,
    Error,
    TypeError,
    Symbol,
    Set,
    Array,
    Number,
    String,
    Promise,
    console,
    setTimeout,
    clearTimeout
  });
  vm.runInContext(bootstrapSource, context, { filename: 'ScholarV4Bootstrap.js' });
  assert.equal(window.AtharRagFetchResilience?.installed, true);
  assert.equal(window.AtharRagFetchResilience?.version, 'athar-rag-fetch-resilience-1');
  return window;
}

{
  let calls = 0;
  const window = loadWithFetch(async () => {
    calls += 1;
    if (calls === 1) throw new TypeError('Failed to fetch');
    if (calls === 2) return { ok: false, status: 503 };
    return { ok: true, status: 200 };
  });
  const response = await window.fetch(`${RAG}/healthz`);
  assert.equal(response.status, 200);
  assert.equal(calls, 3, 'health must recover from network error + transient 503');
}

{
  let calls = 0;
  const window = loadWithFetch(async () => {
    calls += 1;
    throw new TypeError('Failed to fetch');
  });
  await assert.rejects(
    () => window.fetch(`${RAG}/api/rag/v5/ask`, { method: 'POST', body: '{}' }),
    /Failed to fetch/
  );
  assert.equal(calls, 1, 'POST /ask must never be replayed automatically');
}

{
  let calls = 0;
  const window = loadWithFetch(async () => {
    calls += 1;
    throw new TypeError('Failed to fetch');
  });
  await assert.rejects(() => window.fetch('https://example.com/healthz'), /Failed to fetch/);
  assert.equal(calls, 1, 'unrelated origins must not be retried');
}

{
  let calls = 0;
  const window = loadWithFetch(async () => {
    calls += 1;
    return { ok: false, status: 404 };
  });
  const response = await window.fetch(`${RAG}/api/rag/v5/status`);
  assert.equal(response.status, 404);
  assert.equal(calls, 1, 'non-transient HTTP errors must be returned immediately');
}

{
  let calls = 0;
  const window = loadWithFetch(async () => {
    calls += 1;
    throw new TypeError('Failed to fetch');
  }, [50, 50]);
  const controller = new AbortController();
  const pending = window.fetch(`${RAG}/healthz`, { signal: controller.signal });
  setTimeout(() => controller.abort(), 5);
  await assert.rejects(pending, error => error?.name === 'AbortError');
  assert.equal(calls, 1, 'abort must stop the retry loop immediately');
}

{
  let calls = 0;
  const window = loadWithFetch(async () => {
    calls += 1;
    return calls < 2 ? { ok: false, status: 502 } : { ok: true, status: 200 };
  });
  const response = await window.fetch(`${RAG}/api/rag/v5/books`);
  assert.equal(response.status, 200);
  assert.equal(calls, 2, 'catalogue GET should tolerate a transient gateway response');
}

console.log('RAG fetch resilience contract: PASS');
