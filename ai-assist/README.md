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

## Deploy (Google Cloud Run)

The `Dockerfile` at the root of the repo builds the whole docs site and serves it together with Ask AI
from one container (`src/server.ts`). Ask AI is answered on the same domain at `/ai`, so there is no
separate service, URL or CORS set-up, and the docs index is read from the image itself.

One-time set-up (replace `PROJECT_ID`; `asia-south1` is Mumbai):

```bash
gcloud config set project PROJECT_ID
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com

# Store the key in Secret Manager: paste it, press Enter, then Ctrl-D. It is never put in the image.
gcloud secrets create anthropic-api-key --data-file=-

# Let Cloud Run read it (the default runtime service account).
PROJECT_NUMBER=$(gcloud projects describe "$(gcloud config get-value project)" --format='value(projectNumber)')
gcloud secrets add-iam-policy-binding anthropic-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role=roles/secretmanager.secretAccessor
```

Deploy (run from the root of the repo; Cloud Build builds the image from the `Dockerfile`):

```bash
gcloud run deploy relm-docs --source . --region asia-south1 --allow-unauthenticated \
  --set-secrets ANTHROPIC_API_KEY=anthropic-api-key:latest \
  --max-instances 3
```

It prints the service URL. Check Ask AI at `<url>/ai/health` (`"configured": true` means the key was found).
Each deploy rebuilds the site, so Ask AI always answers from the docs in that image.

- **Rate limit**: Cloud Run uses the per-instance limiter (`RATE_LIMIT_PER_MINUTE`, default 10 per visitor),
  so `--max-instances` also caps the total.
- **Settings**: `MODEL`, `EFFORT`, `RATE_LIMIT_PER_MINUTE` and `ANTHROPIC_WORKSPACE_ID` can be set with
  `--set-env-vars`. `ALLOWED_ORIGINS` is only needed for other sites calling `/ai`.
- **Custom domain**: map `docs.relm.co` to the service in Cloud Run (or behind a load balancer). The site is
  built with `SITE_URL=https://docs.relm.co`; to use another address, build with `--build-arg SITE_URL=...`.

Try the image locally (on an Apple silicon Mac, keep `--platform linux/amd64`; the gem lockfile is for x86 Linux):

```bash
docker build --platform linux/amd64 -t relm-docs .
docker run --rm -p 8080:8080 --env-file ai-assist/.dev.vars -e DOCS_INDEX_URL= relm-docs   # open http://localhost:8080
```

(`-e DOCS_INDEX_URL=` makes the container read the index it was built with, not your local `jekyll serve`.)

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
