/** Contract between the docs site's Ask AI panel (assets/js/ask-ai.js) and this service. */

export type Role = 'user' | 'assistant';

export interface ChatTurn {
  role: Role;
  content: string;
}

export interface AskRequest {
  /** The conversation so far, oldest first, ending with the user's new question. */
  messages: ChatTurn[];
  /** Path of the docs page the user is reading, e.g. "/banking/endpoints/payout/create-payout-request". */
  page: string;
}

export interface Source {
  url: string;
  title: string;
  section?: string;
}

/**
 * The response is a text/event-stream with these events, in order:
 *   meta  → { sources: Source[] }        pages the answer draws on
 *   delta → { text: string }             answer text, streamed (Markdown)
 *   done  → {}                           finished normally
 *   error → { code: string; msg: string } stopped; `msg` is safe to show to the user
 * Errors before streaming starts come back as JSON instead: { success: false, error: { code, msg } }.
 */
export type StreamEvent =
  | { event: 'meta'; data: { sources: Source[] } }
  | { event: 'delta'; data: { text: string } }
  | { event: 'done'; data: Record<string, never> }
  | { event: 'error'; data: { code: string; msg: string } };

export const LIMITS = {
  /** Characters in the new question. */
  question: 1000,
  /** Characters kept from each earlier turn (answers can be long; the latest question is what matters). */
  historyTurn: 3000,
  /** Earlier turns sent along with the question. */
  historyTurns: 8,
  page: 300,
  /** Request body size in bytes. */
  body: 40_000,
} as const;

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.slice(0, max) : '');

/**
 * Validates and trims what the browser sent. Returns undefined for anything unusable so the caller can
 * answer 400. Turns must alternate and end with the user's question.
 */
export function parseAskRequest(body: unknown): AskRequest | undefined {
  if (!body || typeof body !== 'object') return undefined;
  const raw = body as { messages?: unknown; page?: unknown };
  if (!Array.isArray(raw.messages) || raw.messages.length === 0) return undefined;

  const turns = raw.messages
    .filter(
      (turn): turn is ChatTurn =>
        !!turn &&
        typeof turn === 'object' &&
        ((turn as ChatTurn).role === 'user' || (turn as ChatTurn).role === 'assistant') &&
        typeof (turn as ChatTurn).content === 'string'
    )
    .map((turn) => ({ role: turn.role, content: turn.content.trim() }))
    .filter((turn) => turn.content);

  const last = turns[turns.length - 1];
  if (!last || last.role !== 'user') return undefined;
  const question = last.content.slice(0, LIMITS.question);

  // Keep the most recent earlier turns, strictly alternating and starting with the user.
  const history: ChatTurn[] = [];
  for (let i = turns.length - 2; i >= 0 && history.length < LIMITS.historyTurns; i--) {
    const expected: Role = history.length % 2 === 0 ? 'assistant' : 'user';
    if (turns[i].role !== expected) break;
    history.unshift({ role: turns[i].role, content: turns[i].content.slice(0, LIMITS.historyTurn) });
  }
  if (history.length && history[0].role !== 'user') history.shift();

  const page = text(raw.page, LIMITS.page);
  return {
    messages: [...history, { role: 'user', content: question }],
    page: page.startsWith('/') ? page : '',
  };
}
