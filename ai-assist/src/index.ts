import { handleRequest, type Env } from './handler';

/** Cloudflare Worker entry point. All the logic lives in handler.ts, which is runtime-neutral. */
export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return handleRequest(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
