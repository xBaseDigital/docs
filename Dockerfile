# syntax=docker/dockerfile:1
#
# Relm developer docs: the Jekyll site plus Ask AI, served by one small Node process.
# Built for Cloud Run (listens on $PORT, default 8080), but runs on any container host.
#
#   docker build -t relm-docs .
#   docker run -p 8080:8080 -e ANTHROPIC_API_KEY=... relm-docs     # Ask AI stays off without a key
#
# The Anthropic key is never baked into the image: pass it at run time (on Cloud Run, from Secret Manager).

ARG RUBY_VERSION=3.4.10
ARG NODE_VERSION=22

# --- 1. Build the docs site ------------------------------------------------------------------------
FROM ruby:${RUBY_VERSION}-slim AS site

# A few gems (google-protobuf, eventmachine, http_parser.rb) compile native extensions.
RUN apt-get update \
 && apt-get install -y --no-install-recommends build-essential \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /src
COPY Gemfile Gemfile.lock ./
RUN bundle config set --local deployment true \
 && bundle install --jobs 4

COPY . .

# Where the site is published, and where its pages send Ask AI questions ("" hides Ask AI).
ARG SITE_URL=https://docs.relm.co
ARG AI_ENDPOINT=/ai
RUN printf 'url: "%s"\nbaseurl: ""\nai_assist:\n  endpoint: "%s"\nsass:\n  sourcemap: never\n' "$SITE_URL" "$AI_ENDPOINT" > /tmp/_config.docker.yml \
 && JEKYLL_ENV=production bundle exec jekyll build --config _config.yml,/tmp/_config.docker.yml --destination /site \
 && test -f /site/index.html \
 && test -f /site/assets/ai/docs-index.json

# --- 2. Build the server ---------------------------------------------------------------------------
FROM node:${NODE_VERSION}-slim AS server
WORKDIR /ai
COPY ai-assist/package.json ai-assist/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY ai-assist/ ./
RUN npm run typecheck && npm test && npm run build:server

# --- 3. Runtime ------------------------------------------------------------------------------------
FROM node:${NODE_VERSION}-slim
ENV NODE_ENV=production \
    PORT=8080 \
    SITE_DIR=/srv/site
WORKDIR /srv
COPY --from=site /site ./site
COPY --from=server /ai/dist/server.mjs ./server.mjs
USER node
EXPOSE 8080
CMD ["node", "server.mjs"]
