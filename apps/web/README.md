# Orange Cloud Web

The landing page and OAuth callback relay for [Orange Cloud](https://github.com/chen2he/orange-cloud), deployed at [o-c.do](https://o-c.do) on Cloudflare Workers.

## What this app does

- **Landing page** in the locales defined under [`src/messages/`](src/messages/) (currently 13: en, zh-Hans, zh-Hant, zh-HK, ja, es-MX, ko, pt-BR, pt-PT, de, fr, ar, tr) via `next-intl`, with `localePrefix: "as-needed"` — English lives at `/`, other locales at `/zh-Hans` etc. Also serves `/privacy`, `/terms`, and `/contact`, which the iOS app links to.
- **OAuth callback relay** at `/oauth/callback` ([route.ts](src/app/oauth/callback/route.ts)): Cloudflare's OAuth only accepts `https` redirect URIs, so this route 302-redirects the authorization `code` and `state` straight to the iOS app's custom scheme (`orangecloud://oauth/callback`). It stores nothing and never exchanges the code — the token exchange and `state` validation happen on-device, secured by PKCE.

> **Note:** this is a stripped-down personal-use build. The storefront (activation codes, Stripe, Apple IAP), admin dashboard, App Store ranking cron, and the SEO/GEO infrastructure (`robots.ts`, `sitemap.ts`, `public/llms.txt`, IndexNow key) have all been removed. `generateMetadata` still emits canonical / hreflang / Open Graph / Twitter metadata for link previews, and JSON-LD (`SoftwareApplication`) is kept for Bing/Copilot enrichment.

## Stack

- Next.js 16 (App Router) + React 19
- `next-intl` for routing/messages — translations live in [`src/messages/`](src/messages/)
- Tailwind CSS 4
- Deployed to Cloudflare Workers with [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare); config in [`wrangler.jsonc`](wrangler.jsonc)

## Gotchas (read before touching routing or deploying)

- `/oauth/callback` sits **outside** the `[locale]` segment, and the middleware matcher in [`src/middleware.ts`](src/middleware.ts) explicitly excludes `oauth` — the callback must reach the route handler untouched. Don't let locale routing swallow it.
- On Cloudflare Workers, next-intl's middleware must be an **edge `middleware.ts`** — the Next 16 `proxy.ts` convention runs on the Node runtime, which Workers doesn't support. **Do NOT rename this file to `proxy.ts`**: OpenNext Cloudflare (`@opennextjs/cloudflare`, incl. v1.19.x) only supports Edge Middleware and will fail the build with `Node.js middleware is not currently supported` if it sees a Node-runtime `proxy.ts`. Next 16 still compiles `middleware.ts` on the Edge runtime, so it works — the `middleware` deprecation warning during `next build` is expected and harmless until OpenNext Cloudflare adds edge-`proxy.ts` support.
- The screenshot gallery images live in `public/shots/<locale>/` (`01_dashboard.jpg` …); zh-HK reuses the zh-Hant set.

## Develop

From the repo root (pnpm workspace):

```bash
pnpm install
pnpm dev          # turbo dev --filter=web → next dev on http://localhost:3000
```

Or inside `apps/web/`:

```bash
pnpm dev          # Next.js dev server
pnpm preview      # build with OpenNext and preview on the Workers runtime
pnpm cf-typegen   # regenerate cloudflare-env.d.ts after changing wrangler.jsonc
```

## Deploy

```bash
pnpm deploy       # opennextjs-cloudflare build && deploy
```

The official deployment uses the custom domain `o-c.do` (configured in `wrangler.jsonc` `routes`). For your own fork: change the `name` and `routes` in [`wrangler.jsonc`](wrangler.jsonc), deploy under your own Cloudflare account, then register `https://<your-domain>/oauth/callback` as the redirect URI of **your own** Cloudflare OAuth client (see [CONTRIBUTING.md](../../CONTRIBUTING.md)).
