import Anthropic from '@anthropic-ai/sdk';
import { LIMITS, parseAskRequest, type Source, type StreamEvent } from './contract';
import { SYSTEM_PROMPT, buildQuestionTurn, buildSiteMap, retrievalQuery } from './prompt';
import { buildSearchIndex, search, type DocsIndex, type SearchIndex } from './retrieval';

/**
 * The Ask AI service, written against the standard Fetch API (Request → Response) so the same code
 * runs as a Cloudflare Worker (src/index.ts) or inside any other runtime that speaks Fetch, such as a
 * Next.js route handler or Vercel/Netlify functions.
 */

/** Cloudflare's rate limiting binding. Optional: without it, a per-instance limiter is used. */
export interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

export interface Env {
  ANTHROPIC_API_KEY?: string;
  /** Needed when the key isn't scoped to a single workspace. */
  ANTHROPIC_WORKSPACE_ID?: string;
  /** Only for local testing against a mock API or a proxy. */
  ANTHROPIC_BASE_URL?: string;
  MODEL?: string;
  EFFORT?: string;
  /** Where the docs site publishes its index, e.g. https://docs.relm.co/assets/ai/docs-index.json */
  DOCS_INDEX_URL?: string;
  /** Comma-separated origins allowed to call the service from a browser. */
  ALLOWED_ORIGINS?: string;
  INDEX_TTL_SECONDS?: string;
  /** Questions per minute per visitor, for the built-in limiter. */
  RATE_LIMIT_PER_MINUTE?: string;
  ASK_LIMITER?: RateLimiter;
}

export interface Context {
  waitUntil(promise: Promise<unknown>): void;
}

export interface Dependencies {
  fetch: typeof fetch;
  createClient: (env: Env) => Pick<Anthropic, 'beta'>;
  now: () => number;
}

const DEFAULT_MODEL = 'claude-opus-5-5';
const DEFAULT_INDEX_URL = 'https://docs.relm.co/assets/ai/docs-index.json';
const DEFAULT_ORIGINS = 'https://docs.relm.co,http://localhost:4000,http://127.0.0.1:4000';
const EFFORTS = ['low', 'medium', 'high'] as const;

const UNAVAILABLE = "Ask AI isn't available right now. You can still search the docs as usual.";
const RETRY = 'Something went wrong. Please try again.';

export const defaultDependencies: Dependencies = {
  fetch: (...args) => fetch(...args),
  createClient: (env) =>
    new Anthropic({
      apiKey: env.ANTHROPIC_API_KEY,
      ...(env.ANTHROPIC_BASE_URL ? { baseURL: env.ANTHROPIC_BASE_URL } : {}),
      // Bounded so a slow upstream never keeps someone waiting for minutes (SDK default: 10 min).
      timeout: 60_000,
      maxRetries: 1,
      ...(env.ANTHROPIC_WORKSPACE_ID ? { defaultHeaders: { 'anthropic-workspace-id': env.ANTHROPIC_WORKSPACE_ID } } : {}),
    }),
  now: () => Date.now(),
};

// ---------------------------------------------------------------------------------------------------
// HTTP helpers

const allowedOrigins = (env: Env) =>
  (env.ALLOWED_ORIGINS || DEFAULT_ORIGINS)
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);

const corsHeaders = (origin: string | null, env: Env): Record<string, string> =>
  origin && allowedOrigins(env).includes(origin)
    ? {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        Vary: 'Origin',
      }
    : { Vary: 'Origin' };

const json = (status: number, body: unknown, headers: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  });

const fail = (status: number, code: string, msg: string, headers: Record<string, string>) =>
  json(status, { success: false, error: { code, msg } }, headers);

// ---------------------------------------------------------------------------------------------------
// Docs index, fetched from the published site and kept for a few minutes per instance.

interface LoadedIndex {
  search: SearchIndex;
  siteMap: string;
  generatedAt?: string;
  loadedAt: number;
}

let cached: LoadedIndex | undefined;
let loading: Promise<LoadedIndex> | undefined;

/** For tests. */
export const resetIndexCache = () => {
  cached = undefined;
  loading = undefined;
};

async function loadIndex(env: Env, deps: Dependencies): Promise<LoadedIndex> {
  const ttl = (Number(env.INDEX_TTL_SECONDS) || 300) * 1000;
  if (cached && deps.now() - cached.loadedAt < ttl) return cached;
  if (loading) return loading;

  loading = (async () => {
    try {
      const response = await deps.fetch(env.DOCS_INDEX_URL || DEFAULT_INDEX_URL, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`Docs index responded ${response.status}`);
      const index = (await response.json()) as DocsIndex;
      if (!Array.isArray(index?.pages) || !index.pages.length) throw new Error('Docs index has no pages');
      const searchIndex = buildSearchIndex(index);
      cached = {
        search: searchIndex,
        siteMap: buildSiteMap(searchIndex.pages),
        generatedAt: index.generated_at,
        loadedAt: deps.now(),
      };
      return cached;
    } catch (error) {
      // Keep answering from the last good copy if the site is briefly unreachable.
      if (cached) {
        console.error('Docs index refresh failed; using the cached copy.', error);
        cached.loadedAt = deps.now();
        return cached;
      }
      throw error;
    } finally {
      loading = undefined;
    }
  })();
  return loading;
}

// ---------------------------------------------------------------------------------------------------
// Rate limiting: Cloudflare's binding when configured, otherwise a simple per-instance window.

const recent = new Map<string, number[]>();

async function allow(key: string, env: Env, deps: Dependencies): Promise<boolean> {
  if (env.ASK_LIMITER) {
    try {
      return (await env.ASK_LIMITER.limit({ key })).success;
    } catch {
      // Fall through to the local limiter.
    }
  }
  const perMinute = Number(env.RATE_LIMIT_PER_MINUTE) || 10;
  const now = deps.now();
  const hits = (recent.get(key) ?? []).filter((time) => now - time < 60_000);
  if (hits.length >= perMinute) {
    recent.set(key, hits);
    return false;
  }
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 5000) recent.clear(); // bounded memory
  return true;
}

// ---------------------------------------------------------------------------------------------------
// Errors from Claude, mapped to messages a developer can act on.

/**
 * Out of credit or over a spend limit. Anthropic sends `billing_error` for this; older accounts get a 400
 * or 429 with a "credit balance is too low" / "usage limits" message instead, so match on both.
 */
const isOutOfCredit = (error: InstanceType<typeof Anthropic.APIError>) =>
  error.type === 'billing_error' ||
  /credit balance|purchase credits|plans & billing|usage limit|spend limit/i.test(error.message);

/** One JSON line per outage, so logs can alert on `event = docs_ai_unavailable`. */
const logUnavailable = (reason: string, error: InstanceType<typeof Anthropic.APIError>) =>
  console.error(
    JSON.stringify({
      severity: 'ERROR',
      event: 'docs_ai_unavailable',
      reason,
      status: error.status,
      type: error.type,
      requestId: error.requestID,
      message: error.message,
    })
  );

export function describeError(error: unknown): { code: string; msg: string } {
  if (error instanceof Anthropic.APIUserAbortError) return { code: 'ABORTED', msg: 'Stopped.' };
  if (error instanceof Anthropic.APIError && isOutOfCredit(error)) {
    logUnavailable('billing', error);
    return { code: 'UNAVAILABLE', msg: UNAVAILABLE };
  }
  if (error instanceof Anthropic.RateLimitError) {
    return { code: 'BUSY', msg: 'Ask AI is busy right now. Try again in a moment.' };
  }
  if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
    logUnavailable('auth', error);
    return { code: 'NOT_CONFIGURED', msg: UNAVAILABLE };
  }
  if (error instanceof Anthropic.APIConnectionTimeoutError) {
    return { code: 'TIMEOUT', msg: 'That took too long. Please try again.' };
  }
  if (error instanceof Anthropic.APIError) {
    console.error('Ask AI API error:', error.status, error.message);
    return { code: 'UPSTREAM', msg: RETRY };
  }
  console.error('Ask AI error:', error);
  return { code: 'INTERNAL', msg: RETRY };
}

// ---------------------------------------------------------------------------------------------------

export async function handleRequest(
  request: Request,
  env: Env,
  ctx?: Context,
  deps: Dependencies = defaultDependencies
): Promise<Response> {
  const origin = request.headers.get('Origin');
  const cors = corsHeaders(origin, env);
  const { pathname } = new URL(request.url);

  // Browsers on other sites may not use this service (and its API credit).
  if (origin && !cors['Access-Control-Allow-Origin']) {
    return fail(403, 'FORBIDDEN_ORIGIN', 'This site may not use Ask AI.', cors);
  }
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

  if (request.method === 'GET' && (pathname === '/' || pathname === '/health')) {
    try {
      const index = await loadIndex(env, deps);
      return json(
        200,
        {
          ok: true,
          configured: !!env.ANTHROPIC_API_KEY,
          pages: index.search.pages.length,
          sections: index.search.chunks.length,
          indexGeneratedAt: index.generatedAt ?? null,
        },
        cors
      );
    } catch {
      return json(503, { ok: false, configured: !!env.ANTHROPIC_API_KEY, pages: 0 }, cors);
    }
  }

  if (pathname !== '/ask') return fail(404, 'NOT_FOUND', 'Not found.', cors);
  if (request.method !== 'POST') return fail(405, 'METHOD_NOT_ALLOWED', 'Use POST.', cors);
  if (!env.ANTHROPIC_API_KEY) return fail(503, 'NOT_CONFIGURED', UNAVAILABLE, cors);

  const visitor =
    request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For')?.split(',')[0].trim() || 'anon';
  if (!(await allow(visitor, env, deps))) {
    return fail(429, 'RATE_LIMITED', "You're asking quickly. Wait a minute and try again.", cors);
  }

  const raw = await request.text().catch(() => '');
  if (raw.length > LIMITS.body) return fail(413, 'TOO_LARGE', 'That conversation is too long. Start a new chat.', cors);
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    body = undefined;
  }
  const ask = parseAskRequest(body);
  if (!ask) return fail(400, 'BAD_REQUEST', 'Type a question about the docs.', cors);

  let index: LoadedIndex;
  try {
    index = await loadIndex(env, deps);
  } catch (error) {
    console.error('Docs index unavailable:', error);
    return fail(503, 'INDEX_UNAVAILABLE', "Ask AI can't read the docs right now. Please try again shortly.", cors);
  }

  const question = ask.messages[ask.messages.length - 1].content;
  const chunks = search(index.search, retrievalQuery(ask.messages), { page: ask.page });

  const sources: Source[] = [];
  for (const chunk of chunks) {
    if (sources.length >= 4) break;
    if (sources.some((source) => source.url.split('#')[0] === chunk.pageUrl)) continue;
    sources.push({ url: chunk.url, title: chunk.pageTitle, ...(chunk.section ? { section: chunk.section } : {}) });
  }

  const effort = (EFFORTS as readonly string[]).includes(env.EFFORT ?? '') ? (env.EFFORT as (typeof EFFORTS)[number]) : 'low';
  const messages = [
    ...ask.messages.slice(0, -1),
    { role: 'user' as const, content: buildQuestionTurn(question, chunks, index.siteMap, ask.page) },
  ];

  const encoder = new TextEncoder();
  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();
  const send = (event: StreamEvent) =>
    writer.write(encoder.encode(`event: ${event.event}\ndata: ${JSON.stringify(event.data)}\n\n`));

  const pump = (async () => {
    const stream = deps.createClient(env).beta.messages.stream({
      model: env.MODEL || DEFAULT_MODEL,
      max_tokens: 2500,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort },
      system: SYSTEM_PROMPT,
      messages,
    });
    try {
      await send({ event: 'meta', data: { sources } });
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta' && event.delta.text) {
          await send({ event: 'delta', data: { text: event.delta.text } });
        }
      }
      const final = await stream.finalMessage();
      if (final.stop_reason === 'refusal') {
        await send({
          event: 'error',
          data: { code: 'REFUSED', msg: "I can't help with that. Ask me about building with the Relm APIs." },
        });
      } else {
        if (final.stop_reason === 'max_tokens') {
          await send({ event: 'delta', data: { text: '\n\n_That answer was cut short. Ask me to continue._' } });
        }
        await send({ event: 'done', data: {} });
      }
    } catch (error) {
      stream.abort();
      // The visitor closed the panel or stopped the answer: nothing to report.
      if (!(error instanceof Anthropic.APIUserAbortError)) {
        await send({ event: 'error', data: describeError(error) }).catch(() => undefined);
      }
    } finally {
      await writer.close().catch(() => undefined);
    }
  })();
  ctx?.waitUntil(pump);

  return new Response(readable, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...cors,
    },
  });
}
