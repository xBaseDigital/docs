import Anthropic from '@anthropic-ai/sdk';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { handleRequest, resetIndexCache, type Dependencies, type Env } from '../src/handler';
import { INDEX } from './fixtures';

const ORIGIN = 'https://docs.relm.co';
const env: Env = { ANTHROPIC_API_KEY: 'sk-test', DOCS_INDEX_URL: 'https://docs.relm.co/assets/ai/docs-index.json' };

/** A stand-in for client.beta.messages.stream(): yields text deltas, or throws partway through. */
function fakeStream(texts: string[], options: { error?: unknown; stopReason?: string } = {}) {
  return {
    abort: vi.fn(),
    async *[Symbol.asyncIterator]() {
      for (const text of texts) yield { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text } };
      if (options.error) throw options.error;
    },
    finalMessage: async () => ({ stop_reason: options.stopReason ?? 'end_turn' }),
  };
}

function setup(stream: ReturnType<typeof fakeStream> = fakeStream(['Sign with ', 'ECDSA.'])) {
  const create = vi.fn(() => stream);
  const deps: Dependencies = {
    fetch: vi.fn(async () => new Response(JSON.stringify(INDEX), { status: 200 })) as unknown as typeof fetch,
    createClient: () => ({ beta: { messages: { stream: create } } }) as unknown as Pick<Anthropic, 'beta'>,
    now: () => Date.now(),
  };
  return { deps, create, stream };
}

const ask = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('https://ai.example/ask', {
    method: 'POST',
    headers: { Origin: ORIGIN, 'Content-Type': 'application/json', 'CF-Connecting-IP': crypto.randomUUID(), ...headers },
    body: JSON.stringify(body),
  });

const question = (content: string, page = '') => ({ messages: [{ role: 'user', content }], page });

async function readEvents(response: Response) {
  const text = await response.text();
  return text
    .split('\n\n')
    .filter(Boolean)
    .map((block) => {
      const [eventLine, dataLine] = block.split('\n');
      return { event: eventLine.replace('event: ', ''), data: JSON.parse(dataLine.replace('data: ', '')) };
    });
}

beforeEach(() => resetIndexCache());

describe('handleRequest', () => {
  it('streams the sources, then the answer, then done', async () => {
    const { deps, create } = setup();
    const response = await handleRequest(ask(question('How do I sign a request?', '/auth')), env, undefined, deps);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/event-stream');
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe(ORIGIN);

    const events = await readEvents(response);
    expect(events.map((e) => e.event)).toEqual(['meta', 'delta', 'delta', 'done']);
    expect(events[0].data.sources[0]).toMatchObject({ title: 'Signing Process' });
    expect(events[0].data.sources[0].url).toMatch(/^\/auth\/signing-process#/);
    expect(events.filter((e) => e.event === 'delta').map((e) => e.data.text).join('')).toBe('Sign with ECDSA.');

    const params = (create.mock.calls[0] as unknown[])[0] as {
      model: string;
      output_config: { effort: string };
      messages: { role: string; content: string }[];
      system: string;
    };
    expect(params.model).toBe('claude-opus-5-5');
    expect(params.output_config.effort).toBe('low');
    expect(params.system).toContain('Never invent endpoints');
    const turn = params.messages[params.messages.length - 1].content;
    expect(turn).toContain('<excerpt url="/auth/signing-process#step-2--sign-the-canonical-string"');
    expect(turn).toContain('<page_map>');
    expect(turn).toContain('The developer is reading /auth.');
    expect(turn).toMatch(/<question>\nHow do I sign a request\?\n<\/question>$/);
  });

  it('sends earlier turns as conversation history', async () => {
    const { deps, create } = setup();
    await handleRequest(
      ask({
        messages: [
          { role: 'user', content: 'How do I sign a request?' },
          { role: 'assistant', content: 'Use ECDSA.' },
          { role: 'user', content: 'In Python?' },
        ],
      }),
      env,
      undefined,
      deps
    ).then((r) => r.text());
    const params = (create.mock.calls[0] as unknown[])[0] as { messages: { role: string; content: string }[] };
    expect(params.messages.slice(0, 2)).toEqual([
      { role: 'user', content: 'How do I sign a request?' },
      { role: 'assistant', content: 'Use ECDSA.' },
    ]);
    // The short follow-up is searched together with the previous question.
    expect(params.messages[2].content).toContain('signing-process');
  });

  it('turns a failure partway through into an error event with a safe message', async () => {
    const error = new Anthropic.RateLimitError(429, { type: 'error' }, 'rate limited', new Headers());
    const { deps, stream } = setup(fakeStream(['Partial'], { error }));
    const events = await readEvents(await handleRequest(ask(question('sign')), env, undefined, deps));
    expect(events.map((e) => e.event)).toEqual(['meta', 'delta', 'error']);
    expect(events[2].data).toEqual({ code: 'BUSY', msg: 'Ask AI is busy right now. Try again in a moment.' });
    expect(stream.abort).toHaveBeenCalled();
  });

  it('reports a billing problem as unavailable', async () => {
    const error = new Anthropic.BadRequestError(
      400,
      { type: 'error', error: { type: 'invalid_request_error', message: 'Your credit balance is too low to access the API.' } },
      undefined,
      new Headers()
    );
    const { deps } = setup(fakeStream([], { error }));
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const events = await readEvents(await handleRequest(ask(question('sign')), env, undefined, deps));
    expect(events[events.length - 1].data.code).toBe('UNAVAILABLE');
  });

  it('notes when an answer was cut short', async () => {
    const { deps } = setup(fakeStream(['Long answer'], { stopReason: 'max_tokens' }));
    const events = await readEvents(await handleRequest(ask(question('sign')), env, undefined, deps));
    expect(events.map((e) => e.event)).toEqual(['meta', 'delta', 'delta', 'done']);
    expect(events[2].data.text).toContain('cut short');
  });

  it('rejects browsers on other sites', async () => {
    const { deps, create } = setup();
    const response = await handleRequest(ask(question('sign'), { Origin: 'https://evil.example' }), env, undefined, deps);
    expect(response.status).toBe(403);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBeNull();
    expect(create).not.toHaveBeenCalled();
  });

  it('answers CORS preflight for allowed origins', async () => {
    const { deps } = setup();
    const response = await handleRequest(
      new Request('https://ai.example/ask', { method: 'OPTIONS', headers: { Origin: 'http://localhost:4000' } }),
      env,
      undefined,
      deps
    );
    expect(response.status).toBe(204);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:4000');
  });

  it('says it is not configured when there is no API key', async () => {
    const { deps } = setup();
    const response = await handleRequest(ask(question('sign')), {}, undefined, deps);
    expect(response.status).toBe(503);
    expect(((await response.json()) as { error: { code: string } }).error.code).toBe('NOT_CONFIGURED');
  });

  it('rejects empty questions', async () => {
    const { deps } = setup();
    const response = await handleRequest(ask(question('  ')), env, undefined, deps);
    expect(response.status).toBe(400);
  });

  it('limits how often one visitor can ask', async () => {
    const { deps } = setup();
    const limited = { ...env, RATE_LIMIT_PER_MINUTE: '2' };
    const headers = { 'CF-Connecting-IP': '203.0.113.9' };
    const statuses: number[] = [];
    for (let i = 0; i < 3; i++) {
      const response = await handleRequest(ask(question('sign'), headers), limited, undefined, deps);
      statuses.push(response.status);
      await response.text();
    }
    expect(statuses).toEqual([200, 200, 429]);
  });

  it('uses the rate limiting binding when there is one', async () => {
    const { deps } = setup();
    const ASK_LIMITER = { limit: vi.fn(async () => ({ success: false })) };
    const response = await handleRequest(ask(question('sign')), { ...env, ASK_LIMITER }, undefined, deps);
    expect(response.status).toBe(429);
    expect(ASK_LIMITER.limit).toHaveBeenCalled();
  });

  it('fails clearly when the docs index cannot be fetched', async () => {
    const { deps } = setup();
    deps.fetch = vi.fn(async () => new Response('nope', { status: 500 })) as unknown as typeof fetch;
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const response = await handleRequest(ask(question('sign')), env, undefined, deps);
    expect(response.status).toBe(503);
    expect(((await response.json()) as { error: { code: string } }).error.code).toBe('INDEX_UNAVAILABLE');
  });

  it('keeps serving the last good index when a refresh fails', async () => {
    const { deps } = setup();
    let time = 0;
    deps.now = () => time;
    await (await handleRequest(ask(question('sign')), env, undefined, deps)).text();
    time = 10 * 60 * 1000; // past the 5 minute cache
    deps.fetch = vi.fn(async () => new Response('down', { status: 502 })) as unknown as typeof fetch;
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const response = await handleRequest(ask(question('sign')), env, undefined, deps);
    expect(response.status).toBe(200);
    await response.text();
  });

  it('reports health with the index size', async () => {
    const { deps } = setup();
    const response = await handleRequest(new Request('https://ai.example/health'), env, undefined, deps);
    expect(await response.json()).toMatchObject({ ok: true, configured: true, pages: 3 });
  });
});
