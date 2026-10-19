# Ask AI for the Relm docs

Lets developers ask questions in plain language on docs.relm.co and get answers drawn from the docs,
with links to the pages and sections used. Same approach as the portal's AI Assist
(`xbdgroup-onboard`, `/api/assist`), adapted to a static site.

```
Jekyll build ──► /assets/ai/docs-index.json   (_plugins/ai_docs_index.rb: raw Markdown of every page)
                          │
Browser (assets/js/ask-ai.js) ──POST /ask──► this service ──► finds the relevant sections (BM25)
                          ◄── streamed answer (SSE) ◄── Claude, grounded in those sections
```

- **Always in sync**: the service reads the index from the published site (cached 5 minutes), so a docs
  deploy updates the AI's knowledge with no extra step.
- **Grounded**: Claude only sees the matching sections plus a map of all pages, and is told never to invent
  endpoints, fields or values. Questions, history and doc text are treated as data, not instructions.
- **Safe to expose**: the API key stays on the server; browsers on other sites are refused (CORS allow-list);
  each visitor is rate limited; input sizes are capped; errors come back as messages a developer can act on.

## Deploy (Cloudflare Workers)

```bash
cd ai-assist
npm install
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY      # and ANTHROPIC_WORKSPACE_ID if the key needs one
npm run deploy                                  # prints the URL, e.g. https://relm-docs-ai.<account>.workers.dev
```

Then turn it on in the docs by setting the URL in `_config.yml`:

```yaml
ai_assist:
  endpoint: "https://relm-docs-ai.<account>.workers.dev"   # or a custom domain such as https://ai.docs.relm.co
```

Leaving `endpoint` empty hides Ask AI everywhere. Check the service at `GET /health`.

### Settings (`wrangler.toml` `[vars]`)

| Name | Default | |
| --- | --- | --- |
| `DOCS_INDEX_URL` | `https://docs.relm.co/assets/ai/docs-index.json` | Where the index is read from |
| `ALLOWED_ORIGINS` | docs.relm.co and localhost:4000 | Sites allowed to call the service |
| `MODEL` | `claude-opus-5-5` | Same model as the portal's AI Assist |
| `EFFORT` | `low` | `low`, `medium` or `high`; higher is slower but more thorough |
| `INDEX_TTL_SECONDS` | `300` | How long an index is reused before re-fetching |
| `RATE_LIMIT_PER_MINUTE` | `10` | Only used without the `ASK_LIMITER` binding |

`ASK_LIMITER` (in `wrangler.toml`) is Cloudflare's rate limiter: 10 questions a minute per visitor across all
locations. Remove the block to use the simpler per-instance limiter instead.

### Running somewhere else

`src/handler.ts` uses only the standard Fetch API (`Request` in, `Response` out). To host it on Vercel,
Netlify or as a Next.js route, call `handleRequest(request, process.env)` from that platform's handler;
`src/index.ts` is the only Cloudflare-specific file.

## Local development

```bash
# terminal 1: the docs (in the repo root)
bundle exec jekyll serve                         # builds the index at /assets/ai/docs-index.json

# terminal 2: the service
cd ai-assist
cp .dev.vars.example .dev.vars                   # add your API key
npm run dev                                      # http://127.0.0.1:8787
```

Set `ai_assist.endpoint` to `http://127.0.0.1:8787` in `_config.yml` while testing (don't commit it).

```bash
npm test            # retrieval, request validation, streaming and error handling (Claude is mocked)
npm run typecheck
```

## Using it

- **Ask AI** button in the header, the floating button on phones, or **⌘I / Ctrl+I**.
- Type in the docs search box and press **Tab** (or click the **Ask AI** row) to ask that question.
- Follow-up questions keep the conversation; links in answers jump to the exact section, and the chat stays
  open on the next page (kept for the browser tab only).
- Leave a page out of the AI's knowledge with `ai_exclude: true` in its front matter.
