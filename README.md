# Relm Developer Docs

Source for the Relm developer portal at **[docs.relm.co](https://docs.relm.co)**: API authentication, Banking, Payroll, POS, Partner and SDK docs.

It's a [Jekyll](https://jekyllrb.com) site using the [Just the Docs](https://just-the-docs.github.io/just-the-docs/) theme (0.10.1), plus:

- an interactive **Try it** panel on endpoint pages, driven by OpenAPI specs;
- **Ask AI**, which answers questions from the docs using Claude (service in [`ai-assist/`](ai-assist/README.md));
- a sidebar built from one file, `_data/navigation.yml`.

## Repo layout

| Path | What it is |
| --- | --- |
| `authentication/`, `banking/`, `partner/`, `payroll/`, `pos/`, `sdk/` | The docs pages (Markdown) |
| `index.md` | Home page |
| `_data/navigation.yml` | Sidebar, breadcrumbs and Previous / Next links |
| `_data/openapi/*.yml` | OpenAPI 3.1 specs (banking, partner, payroll, pos) used by Try it |
| `assets/openapi/*.json` | The same specs published as JSON (importable into Postman) |
| `_includes/enums/` | Shared enum tables, included with `{% include enums/<name>.md %}` |
| `_layouts/endpoint.html` | Layout for endpoint pages (page plus Try it panel) |
| `_plugins/docs_navigation.rb` | Builds the navigation from `_data/navigation.yml` |
| `_plugins/ai_docs_index.rb` | Builds `/assets/ai/docs-index.json` for Ask AI |
| `assets/js/try-it.js`, `assets/js/ask-ai.js` | Try it panel and Ask AI chat |
| `_sass/custom/` | Style overrides |
| `ai-assist/` | Ask AI service (Node / TypeScript) and its own README |
| `Dockerfile` | Builds the site and Ask AI into one container for Cloud Run |

## Run locally

Requires Ruby 3.4.10 (see `.ruby-version`) and Bundler.

```bash
bundle install
bundle exec jekyll serve      # http://localhost:4000
```

Ask AI is hidden locally unless `ai_assist.endpoint` is set in `_config.yml`. To run it too, see [Local development](ai-assist/README.md#local-development) in `ai-assist/README.md`.

## Writing docs

### Add a page

1. Create the Markdown file with front matter. Give it a `permalink`.
2. Add the permalink to `_data/navigation.yml`. The sidebar is built only from this file; `parent` and `nav_order` front matter is ignored. The build **fails** if a URL in this file doesn't match a page's permalink. Pages left out still publish but don't appear in the sidebar (the build prints a warning).

### Endpoint pages and Try it

Endpoint pages use the `endpoint` layout and name the OpenAPI operation(s) they document:

```yaml
---
title: Create Payout Request
layout: endpoint
try_it: createPayout                       # operationId in the spec
permalink: /banking/endpoints/payout/create-payout-request
---
```

For a page with several endpoints, list them. Each `heading` must match a heading on the page:

```yaml
try_it:
  - op: getClientPayoutFeeEstimate
    heading: "Estimate Payout Fee"
  - op: createClientPayout
    heading: "Create Payout"
try_it_spec: /assets/openapi/partner.json  # default is banking
```

Try it only sends requests to the **sandbox** (`https://sandbox.api.relm.co`). When an endpoint's request or response changes, update the spec in `_data/openapi/` as well as the page. The specs follow the backend (kubera) validators and routes.

### Other front matter

- `ai_exclude: true` leaves a page out of Ask AI's knowledge.

## Deploy

### Google Cloud Run

The `Dockerfile` builds the site and the Ask AI server into one image, which serves both on `$PORT` (8080). Ask AI is on the same domain at `/ai`. The Anthropic API key is passed at run time from Secret Manager and is never put in the image.

Full set-up (Secret Manager, IAM, custom domain, settings) is in [`ai-assist/README.md`](ai-assist/README.md#deploy-google-cloud-run). Once set up, deploy from the repo root:

```bash
gcloud run deploy relm-docs --source . --region asia-south1 --allow-unauthenticated \
  --set-secrets ANTHROPIC_API_KEY=anthropic-api-key:latest \
  --max-instances 3
```

Cloud Build builds the image on x86 Linux. Check Ask AI afterwards at `<url>/ai/health`.

Build arguments: `SITE_URL` (default `https://docs.relm.co`) and `AI_ENDPOINT` (default `/ai`; `""` hides Ask AI).

### Building the image on an Apple silicon Mac

Cloud Run runs x86 (amd64) images, so build for that platform:

```bash
docker build --platform linux/amd64 -t relm-docs .
docker run --rm -p 8080:8080 --env-file ai-assist/.dev.vars -e DOCS_INDEX_URL= relm-docs
```

Without `--platform linux/amd64`, Docker builds for arm64 and `bundle install` fails with *"Your bundle only supports platforms … your local platform is aarch64-linux"*, because `Gemfile.lock` doesn't list that platform. To also build natively on arm64, add it to the lockfile and commit:

```bash
bundle lock --add-platform aarch64-linux
```

### GitHub Pages

`.github/workflows/` also builds and deploys the site to GitHub Pages on every push to `main` (`CNAME` is `docs.relm.co`). `ci.yml` builds the site and type-checks `ai-assist/` on pull requests.

## License

[MIT](LICENSE). Based on the [Just the Docs template](https://github.com/just-the-docs/just-the-docs-template).
