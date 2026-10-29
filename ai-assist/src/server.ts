/**
 * Node entry point, used by the Docker image (Cloud Run or any container host).
 *
 * One process serves both halves of the docs:
 *   /ai/ask, /ai/health  → the Ask AI service (handler.ts, the same code the Cloudflare Worker runs)
 *   everything else      → the built Jekyll site in SITE_DIR
 *
 * Because the site and Ask AI share an origin, the site is built with `ai_assist.endpoint: "/ai"`
 * and no CORS set-up is needed.
 */
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { Readable } from 'node:stream';
import { gzipSync } from 'node:zlib';
import { defaultDependencies, handleRequest, type Dependencies, type Env } from './handler';

const PORT = Number(process.env.PORT) || 8080;
const SITE_DIR = resolve(process.env.SITE_DIR || 'site');
const AI_PREFIX = '/ai';
const MAX_BODY_BYTES = 256 * 1024;

// ---------------------------------------------------------------------------------------------------
// Ask AI

const env: Env = {
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  ANTHROPIC_WORKSPACE_ID: process.env.ANTHROPIC_WORKSPACE_ID,
  ANTHROPIC_BASE_URL: process.env.ANTHROPIC_BASE_URL,
  MODEL: process.env.MODEL,
  EFFORT: process.env.EFFORT,
  DOCS_INDEX_URL: process.env.DOCS_INDEX_URL, // unset: read the index from this image's own site
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  INDEX_TTL_SECONDS: process.env.INDEX_TTL_SECONDS,
  RATE_LIMIT_PER_MINUTE: process.env.RATE_LIMIT_PER_MINUTE,
};

const LOCAL_INDEX = 'local:docs-index';
const LOCAL_INDEX_FILE = join(SITE_DIR, 'assets', 'ai', 'docs-index.json');

/** Same as the Worker's dependencies, except the docs index is read from disk when no URL is set. */
const deps: Dependencies = {
  ...defaultDependencies,
  fetch: async (input, init) => {
    if (String(input) === LOCAL_INDEX) {
      const body = await readFile(LOCAL_INDEX_FILE);
      return new Response(body, { headers: { 'Content-Type': 'application/json' } });
    }
    return defaultDependencies.fetch(input, init);
  },
};

/** The site's own origin, as the browser sees it (Cloud Run terminates TLS in front of us). */
function publicOrigin(req: IncomingMessage): string {
  const proto = String(req.headers['x-forwarded-proto'] || 'http').split(',')[0].trim();
  return `${proto}://${req.headers.host}`;
}

const CLIENT_IP_HEADERS = new Set(['x-forwarded-for', 'cf-connecting-ip']);

function clientIpAddedByCloudRun(req: IncomingMessage): string {
  const forwardedFor = [req.headers['x-forwarded-for']].flat().join(',');
  const hops = forwardedFor.split(',').map((hop) => hop.trim()).filter(Boolean);
  return hops[hops.length - 1] || req.socket.remoteAddress || 'anon';
}

async function readBody(req: IncomingMessage): Promise<Buffer | null> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) return null;
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks);
}

async function serveAi(req: IncomingMessage, res: ServerResponse, path: string): Promise<void> {
  const origin = publicOrigin(req);
  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  const body = hasBody ? await readBody(req) : undefined;
  if (body === null) {
    send(res, 413, 'application/json', JSON.stringify({ error: { code: 'TOO_LARGE', message: 'Request is too large.' } }));
    return;
  }

  const headers = new Headers();
  for (const [name, value] of Object.entries(req.headers)) {
    if (CLIENT_IP_HEADERS.has(name)) continue;
    if (typeof value === 'string') headers.set(name, value);
    else if (Array.isArray(value)) headers.set(name, value.join(', '));
  }
  headers.set('X-Forwarded-For', clientIpAddedByCloudRun(req));
  const request = new Request(new URL(path || '/', origin), {
    method: req.method,
    headers,
    body: hasBody && body ? new Uint8Array(body) : undefined,
  });

  // The site itself may always call its own Ask AI; ALLOWED_ORIGINS adds any others.
  const requestEnv: Env = {
    ...env,
    DOCS_INDEX_URL: env.DOCS_INDEX_URL || LOCAL_INDEX,
    ALLOWED_ORIGINS: [origin, env.ALLOWED_ORIGINS].filter(Boolean).join(','),
  };

  const response = await handleRequest(request, requestEnv, { waitUntil: (p) => void p.catch(() => {}) }, deps);
  res.writeHead(response.status, Object.fromEntries(response.headers));
  if (!response.body || req.method === 'HEAD') {
    res.end();
    return;
  }
  // Stream as it arrives, so answers appear word by word.
  const stream = Readable.fromWeb(response.body as import('node:stream/web').ReadableStream);
  req.on('close', () => stream.destroy());
  stream.on('error', () => res.destroy());
  stream.pipe(res);
}

// ---------------------------------------------------------------------------------------------------
// Static site

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
};
const COMPRESSIBLE = /^(text\/|application\/(json|xml)|image\/svg)/;

interface StaticFile {
  type: string;
  body: Buffer;
  gzip?: Buffer;
}
/** The site never changes inside a running container, so files are cached after the first read. */
const cache = new Map<string, StaticFile | null>();

async function isFile(path: string): Promise<boolean> {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

/**
 * Jekyll writes /page.html and /dir/index.html; links use /page and /dir/.
 * A folder asked for without its trailing slash is redirected, so relative links keep working.
 */
async function locate(urlPath: string): Promise<{ file: string } | { redirect: string } | null> {
  let decoded: string;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  if (decoded.includes('\0')) return null;
  const base = resolve(SITE_DIR, '.' + decoded);
  if (base !== SITE_DIR && !base.startsWith(SITE_DIR + sep)) return null; // no ../ escapes

  if (decoded.endsWith('/')) {
    const index = join(base, 'index.html');
    return (await isFile(index)) ? { file: index } : null;
  }
  if (await isFile(base)) return { file: base };
  if (await isFile(base + '.html')) return { file: base + '.html' };
  if (await isFile(join(base, 'index.html'))) return { redirect: urlPath + '/' };
  return null;
}

async function load(file: string): Promise<StaticFile> {
  const cached = cache.get(file);
  if (cached) return cached;
  const body = await readFile(file);
  const type = TYPES[extname(file).toLowerCase()] || 'application/octet-stream';
  const entry: StaticFile = { type, body };
  if (COMPRESSIBLE.test(type) && body.length > 1024) entry.gzip = gzipSync(body);
  cache.set(file, entry);
  return entry;
}

function send(res: ServerResponse, status: number, type: string, body: string | Buffer, extra: Record<string, string> = {}) {
  res.writeHead(status, { 'Content-Type': type, 'Content-Length': Buffer.byteLength(body), ...extra });
  res.end(body);
}

async function serveStatic(req: IncomingMessage, res: ServerResponse, urlPath: string): Promise<void> {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, 'text/plain; charset=utf-8', 'Method not allowed', { Allow: 'GET, HEAD' });
    return;
  }

  const found = await locate(urlPath);
  if (found && 'redirect' in found) {
    res.writeHead(301, { Location: found.redirect });
    res.end();
    return;
  }

  let status = 200;
  let file = found ? found.file : null;
  if (!file) {
    status = 404;
    file = (await isFile(join(SITE_DIR, '404.html'))) ? join(SITE_DIR, '404.html') : null;
    if (!file) {
      send(res, 404, 'text/plain; charset=utf-8', 'Not found');
      return;
    }
  }

  const entry = await load(file);
  const gzip = entry.gzip && /\bgzip\b/.test(String(req.headers['accept-encoding'] || ''));
  const body = gzip ? entry.gzip! : entry.body;
  const isHtml = entry.type.startsWith('text/html');
  res.writeHead(status, {
    'Content-Type': entry.type,
    'Content-Length': body.length,
    'Cache-Control': isHtml || status !== 200 ? 'no-cache' : 'public, max-age=3600',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    ...(entry.gzip ? { Vary: 'Accept-Encoding' } : {}),
    ...(gzip ? { 'Content-Encoding': 'gzip' } : {}),
  });
  res.end(req.method === 'HEAD' ? undefined : body);
}

// ---------------------------------------------------------------------------------------------------

const server = createServer(async (req, res) => {
  const started = Date.now();
  const path = (req.url || '/').split('?')[0];
  try {
    if (path === AI_PREFIX || path.startsWith(AI_PREFIX + '/')) {
      await serveAi(req, res, (req.url || '/').slice(AI_PREFIX.length));
    } else {
      await serveStatic(req, res, path);
    }
  } catch (error) {
    console.error(JSON.stringify({ severity: 'ERROR', message: String(error), path }));
    if (!res.headersSent) send(res, 500, 'text/plain; charset=utf-8', 'Server error');
    else res.destroy();
  } finally {
    if (path.startsWith(AI_PREFIX)) {
      res.on('finish', () =>
        console.log(JSON.stringify({ severity: 'INFO', path, status: res.statusCode, ms: Date.now() - started }))
      );
    }
  }
});

server.listen(PORT, () => {
  console.log(
    JSON.stringify({
      severity: 'INFO',
      message: `Serving ${SITE_DIR} on :${PORT}; Ask AI ${env.ANTHROPIC_API_KEY ? 'on' : 'off (ANTHROPIC_API_KEY not set)'} at ${AI_PREFIX}`,
    })
  );
});

// Cloud Run sends SIGTERM before stopping an instance: finish what's in flight, then exit.
for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 9000).unref();
  });
}
