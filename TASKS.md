# TASKS — Portfolio 2.0

> Resume context here at the start of every session. Canonical spec:
> `docs/BUILD_PROMPT.md`. Hard rules: `.cursor/rules/project.mdc`.
> **Zero-cost only. Never fabricate content. One milestone at a time.**

## Open inputs (Part 2 — [NEEDS INPUT], blocking real content)

- [ ] Full resume / CV (Markdown or JSON) — until then: placeholders only
- [ ] Full name + preferred domain/handle
- [ ] Primary audience ranking (recruiters / research / founders / engineers / organizers / OSS)
- [ ] Color palette / visual reference (currently default: light+dark, neutral + blue accent)
- [ ] Repo public or private? (blocks GitHub Actions keepalive/CI minute strategy)
- [ ] Manual-curation tolerance vs full automation
- [ ] Final ordered list of auto-sync sources to wire first (default: GitHub first)

## Owner account actions (cannot be done for you — all free, no card)

- [ ] Create Supabase project; run `supabase/migrations/*.sql`; copy URL + anon + service_role keys into `.env.local`
- [ ] Create Vercel project (Hobby), import repo, set env vars + `CRON_SECRET`
- [ ] Create Google Gemini API key (ai.google.dev) — **verify live free-tier rate limits** before M3
- [ ] (Optional) GitHub token, YouTube API key, PostHog key — as each milestone needs them
- [ ] Confirm `/api/keepalive` cron fires on the Vercel preview (Cron tab / sync_logs row)

---

## MILESTONE 0 — Inputs & Setup
**Done when:** project scaffolded, deployed to a Vercel preview, Supabase reachable, keepalive cron confirmed firing.

- [x] Init Next.js + TypeScript (strict) + Tailwind + shadcn/ui base
- [x] Scaffold folder structure (Part 5)
- [x] Write Supabase schema migrations (Part 4, embeddings = 384 dims) + RLS
- [x] Build `/api/keepalive` route + 3-day Vercel cron (`vercel.json`) **before any other DB code**
- [x] `.env.example` (Part 8) — confirmed none require a card
- [x] CI: lint + typecheck + unit tests + build on every PR (`.github/workflows/ci.yml`)
- [x] Seed `TASKS.md`, `docs/BUILD_PROMPT.md`, `.cursor/rules/project.mdc`
- [ ] Resolve [NEEDS INPUT] items (owner) — see "Open inputs"
- [ ] Create Supabase project + run migrations (owner) → Supabase reachable
- [ ] Deploy to Vercel preview (owner) → confirm keepalive cron firing

## MILESTONE 1 — Foundation & Static MVP
**Done when:** site is live with real content, fully static, no third-party sync yet.

- [ ] Design tokens finalized in `tailwind.config.ts`
- [ ] shadcn primitives in `components/ui`
- [ ] hero / timeline / featured-work sections from `profile`/`projects`
- [ ] `/work`, `/work/[slug]`, `/resume`, `/contact` real content
- [ ] reduced-motion-safe animation wrappers (base added: `components/motion/reveal.tsx`)
- [ ] Seed `profile`/`projects` with REAL resume data (after Part 2 answered)
- [ ] Deploy to Vercel preview

## MILESTONE 2 — Content Pipeline
**Done when:** a commit/post appears on the site without a manual deploy, and Supabase never paused during testing.

- [ ] `lib/integrations/github.ts` + `/api/sync/github` (webhook + 6h cron)
- [ ] `lib/integrations/youtube.ts` + `/api/sync/youtube` (daily cron)
- [ ] `lib/integrations/rss.ts` + `/api/sync/rss` (12h cron)
- [ ] `lib/integrations/external-sources.ts` + `/api/sync/external` (weekly, per-source try/catch, Scholar manual-fallback)
- [ ] Wire Vercel Cron (hourly-minimum on Hobby) + GitHub webhook → `/api/revalidate`
- [ ] Surface `last_synced_at` / `sync_status` in footer or `/status`

## MILESTONE 3 — AI Assistant
**Done when:** every answer is cited or an explicit "I don't know" (verified vs ~20-question set), and it degrades gracefully when the free quota is hit.

- [ ] `lib/ai/embed.ts` (paragraph chunking + free embedding model + incremental re-embed by content hash)
- [ ] `lib/ai/retrieve.ts` (cosine top-k via hnsw + citation assembly)
- [ ] `lib/ai/prompt.ts` (grounded-or-refuse, injection-safe context)
- [ ] `/api/chat` with Gemini free-tier-aware rate limiting + `ai_query_logs` writes
- [ ] `components/ai-assistant/chat-widget.tsx` with citation rendering
- [ ] Adversarial prompt-injection test (crafted README chunk)
- [ ] Load-test rate limiting vs real Gemini free-tier quota
- [ ] Verify live Gemini free-tier limits at ai.google.dev before hardcoding limiter

## MILESTONE 4 — Polish & Launch
**Done when:** Lighthouse + a11y targets met (verified), and a full review confirms zero paid/trial services anywhere.

- [ ] Motion pass (selective, Part 9)
- [ ] a11y audit: axe-core in CI + manual screen reader pass
- [ ] Performance budget / Lighthouse CI gate
- [ ] Cross-browser/device QA
- [ ] PostHog analytics + cookie consent / IP anonymization
- [ ] SEO: structured data, sitemap, per-route OG images

---

## Notes / decisions log

- Tailwind v3 (not v4) chosen so `tailwind.config.ts` exists as the spec references it.
- `contact_messages` admin-read policy currently allows any authenticated user;
  tighten to an admin role once auth exists (M2+).
- Embeddings column locked to `vector(384)` for all-MiniLM-L6-v2.
