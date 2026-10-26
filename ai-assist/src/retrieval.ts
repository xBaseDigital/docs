/**
 * Finds the parts of the docs that answer a question. The docs are small (tens of pages), so a
 * keyword index (BM25) over heading-sized sections is fast, needs no embeddings service, and is
 * rebuilt in a few milliseconds whenever the published index changes.
 */

export interface DocsPage {
  url: string;
  title: string;
  parent?: string;
  grand_parent?: string;
  content: string;
}

export interface DocsIndex {
  version: number;
  site?: string;
  generated_at?: string;
  pages: DocsPage[];
}

export interface Chunk {
  id: number;
  /** Page URL plus the heading anchor, e.g. "/auth/signing-process#signature". */
  url: string;
  pageUrl: string;
  pageTitle: string;
  /** "Parent › Page" breadcrumb, for the model and the sources list. */
  breadcrumb: string;
  /** Heading path inside the page, e.g. "Request › Headers". Empty for the page intro. */
  section: string;
  text: string;
}

export interface SearchIndex {
  chunks: Chunk[];
  pages: DocsPage[];
  /** Per-chunk term frequencies, and how many chunks contain each term. */
  termFreqs: Map<string, number>[];
  lengths: number[];
  docFreq: Map<string, number>;
  avgLength: number;
}

/** Sections longer than this are split at paragraph breaks so one huge JSON sample can't crowd out the rest. */
const MAX_CHUNK_CHARS = 3500;
/** A single code block longer than this is cut, with a note to see the page. */
const MAX_CODE_CHARS = 3000;

const STOP_WORDS = new Set(
  (
    'a an and are as at be but by can do does for from how i if in into is it its me my of on or our so ' +
    'than that the their them then there these this to us use using was we what when where which who why ' +
    'will with you your yours should would could get want need about any all also via'
  ).split(' ')
);

const stem = (word: string) => {
  if (word.length > 4 && word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (word.length > 5 && word.endsWith('ing')) return word.slice(0, -3);
  if (word.length > 4 && word.endsWith('ed')) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
};

/** Lower-cased words, with camelCase and snake_case names also split ("feeHash" → feehash, fee, hash). */
export function tokenize(text: string): string[] {
  const tokens: string[] = [];
  for (const raw of text.split(/[^A-Za-z0-9_]+/)) {
    if (!raw) continue;
    const whole = raw.replace(/_/g, '').toLowerCase();
    if (whole.length > 1 && !STOP_WORDS.has(whole)) tokens.push(stem(whole));
    const parts = raw.split(/_|(?<=[a-z0-9])(?=[A-Z])/).filter(Boolean);
    if (parts.length > 1) {
      for (const part of parts) {
        const lower = part.toLowerCase();
        if (lower.length > 1 && !STOP_WORDS.has(lower)) tokens.push(stem(lower));
      }
    }
  }
  return tokens;
}

/** Same ids kramdown gives headings, so links can jump straight to a section. */
export function headingAnchor(heading: string): string {
  return heading
    .replace(/<[^>]+>/g, '')
    .replace(/[`*_]/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // kramdown's typography turns "--" into a dash before making the id
    .replace(/---?/g, '—')
    .toLowerCase()
    .replace(/[^a-z0-9 \-]/g, '')
    .trim()
    .replace(/ /g, '-');
}

const capCodeBlocks = (text: string, pageUrl: string) =>
  text.replace(/```[^\n]*\n[\s\S]*?```/g, (block) =>
    block.length <= MAX_CODE_CHARS
      ? block
      : `${block.slice(0, MAX_CODE_CHARS)}\n… (example shortened; the full version is on ${pageUrl})\n\`\`\``
  );

const splitLong = (text: string): string[] => {
  if (text.length <= MAX_CHUNK_CHARS) return [text];
  const pieces: string[] = [];
  let current = '';
  // Split on blank lines that are not inside a code block.
  const paragraphs: string[] = [];
  let buffer: string[] = [];
  let inFence = false;
  for (const line of text.split('\n')) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (!inFence && line.trim() === '' && buffer.length) {
      paragraphs.push(buffer.join('\n'));
      buffer = [];
    } else buffer.push(line);
  }
  if (buffer.length) paragraphs.push(buffer.join('\n'));

  for (const paragraph of paragraphs) {
    if (current && current.length + paragraph.length > MAX_CHUNK_CHARS) {
      pieces.push(current);
      current = '';
    }
    current = current ? `${current}\n\n${paragraph}` : paragraph;
  }
  if (current) pieces.push(current);
  return pieces;
};

/** Splits each page at its ## / ### / #### headings (ignoring "#" lines inside code blocks). */
export function chunkPages(pages: DocsPage[]): Chunk[] {
  const chunks: Chunk[] = [];
  for (const page of pages) {
    const breadcrumb = [page.grand_parent, page.parent, page.title].filter(Boolean).join(' › ');
    const headingStack: string[] = [];
    let anchor = '';
    let lines: string[] = [];
    let inFence = false;

    const flush = () => {
      const body = lines.join('\n').trim();
      lines = [];
      if (!body) return;
      const section = headingStack.filter(Boolean).join(' › ');
      for (const piece of splitLong(capCodeBlocks(body, page.url))) {
        chunks.push({
          id: chunks.length,
          url: anchor ? `${page.url}#${anchor}` : page.url,
          pageUrl: page.url,
          pageTitle: page.title,
          breadcrumb,
          section,
          text: piece,
        });
      }
    };

    for (const line of page.content.split('\n')) {
      if (/^\s*```/.test(line)) inFence = !inFence;
      const heading = !inFence && /^(#{1,4})\s+(.+?)\s*#*\s*$/.exec(line);
      if (heading) {
        flush();
        const level = heading[1].length;
        const title = heading[2].trim();
        // h1/h2 start a new path; h3/h4 nest under the latest h2.
        const depth = Math.max(0, level - 2);
        headingStack.length = depth;
        headingStack[depth] = level === 1 && title === page.title ? '' : title;
        anchor = headingAnchor(title);
      }
      lines.push(line);
    }
    flush();
  }
  return chunks;
}

export function buildSearchIndex(index: DocsIndex): SearchIndex {
  const pages = (index.pages ?? []).filter((page) => page && typeof page.content === 'string' && page.url);
  const chunks = chunkPages(pages);
  const docFreq = new Map<string, number>();
  const termFreqs: Map<string, number>[] = [];
  const lengths: number[] = [];

  for (const chunk of chunks) {
    // Words in the page title and headings count three times: they say what a section is about.
    const heading = tokenize(`${chunk.breadcrumb} ${chunk.section}`);
    const tokens = [...heading, ...heading, ...heading, ...tokenize(chunk.text)];
    const freqs = new Map<string, number>();
    for (const token of tokens) freqs.set(token, (freqs.get(token) ?? 0) + 1);
    for (const token of freqs.keys()) docFreq.set(token, (docFreq.get(token) ?? 0) + 1);
    termFreqs.push(freqs);
    lengths.push(tokens.length);
  }

  const avgLength = lengths.reduce((sum, n) => sum + n, 0) / Math.max(1, lengths.length);
  return { chunks, pages, termFreqs, lengths, docFreq, avgLength };
}

export interface SearchOptions {
  /** The page the user is reading; its sections get a small boost. */
  page?: string;
  /** Total characters of excerpts to return. */
  budget?: number;
  maxChunks?: number;
  maxPerPage?: number;
}

/** Ranks sections by BM25 and returns the best ones that fit the budget, best first. */
export function search(index: SearchIndex, query: string, options: SearchOptions = {}): Chunk[] {
  const { page = '', budget = 28_000, maxChunks = 12, maxPerPage = 5 } = options;
  const terms = Array.from(new Set(tokenize(query)));
  if (!terms.length) return [];

  const k1 = 1.2;
  const b = 0.75;
  const total = index.chunks.length;
  const scored: { chunk: Chunk; score: number }[] = [];

  index.chunks.forEach((chunk, i) => {
    const freqs = index.termFreqs[i];
    let score = 0;
    let matched = 0;
    for (const term of terms) {
      const tf = freqs.get(term);
      if (!tf) continue;
      matched++;
      const df = index.docFreq.get(term) ?? 0;
      const idf = Math.log(1 + (total - df + 0.5) / (df + 0.5));
      score += idf * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + (b * index.lengths[i]) / index.avgLength)));
    }
    if (!score) return;
    // Sections matching more of the question's words beat ones repeating a single word.
    score *= 0.6 + (0.4 * matched) / terms.length;
    if (page && chunk.pageUrl === page) score *= 1.25;
    scored.push({ chunk, score });
  });

  scored.sort((a, b2) => b2.score - a.score);
  const best = scored[0]?.score ?? 0;
  const picked: Chunk[] = [];
  const perPage = new Map<string, number>();
  let used = 0;

  for (const { chunk, score } of scored) {
    if (picked.length >= maxChunks) break;
    if (score < best * 0.15) break; // the long tail is noise
    if ((perPage.get(chunk.pageUrl) ?? 0) >= maxPerPage) continue;
    if (used + chunk.text.length > budget) continue;
    picked.push(chunk);
    used += chunk.text.length;
    perPage.set(chunk.pageUrl, (perPage.get(chunk.pageUrl) ?? 0) + 1);
  }
  return picked;
}
