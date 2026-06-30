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

- [x] Design tokens finalized in `tailwind.config.ts` (type scale, fonts, aurora keyframes)
- [x] shadcn primitives in `components/ui` (button, card, badge, separator, theme-toggle)
- [x] hero / timeline / featured-work sections from `profile`/`projects` (with placeholder fallback)
- [x] `/work`, `/work/[slug]`, `/resume`, `/contact`, `/status` routes
- [x] reduced-motion-safe animation wrappers (`reveal.tsx`, `use-reduced-motion.ts`, `aurora-background.tsx`)
- [x] Seed template written (`supabase/seed.sql`) — placeholder, awaiting REAL resume data (owner)
- [ ] Seed `profile`/`projects` with REAL resume data (BLOCKED on owner content)
- [ ] Deploy to Vercel preview (BLOCKED on owner Vercel/Supabase accounts)

## MILESTONE 2 — Content Pipeline
**Done when:** a commit/post appears on the site without a manual deploy, and Supabase never paused during testing.

- [x] `lib/integrations/github.ts` + `/api/sync/github` (HMAC-verified webhook + 6h cron)
- [x] `lib/integrations/youtube.ts` + `/api/sync/youtube` (daily cron, channel RSS — no quota)
- [x] `lib/integrations/rss.ts` + `/api/sync/rss` (12h cron, per-feed try/catch)
- [x] `lib/integrations/external-sources.ts` + `/api/sync/external` (weekly, per-source try/catch, Scholar manual-fallback in docs/SCHOLAR_FALLBACK.md)
- [x] `lib/supabase/sync.ts` — every run writes a sync_logs row (success/partial/failed), upsert dedup by URL (migration 0003)
- [x] Wire Vercel Cron (all ≥6h, hourly-minimum respected) + `/api/revalidate` (webhook calls it)
- [x] Surface `sync_status` honestly at `/status`; sync_logs public-read (migration 0003); /writing,/talks,/research render content_items locally
- [ ] Run real syncs against a live Supabase + confirm no auto-pause (BLOCKED on owner accounts)

## MILESTONE 3 — AI Assistant
**Done when:** every answer is cited or an explicit "I don't know" (verified vs ~20-question set), and it degrades gracefully when the free quota is hit.

- [x] `lib/ai/embed.ts` (paragraph chunking + HF free MiniLM 384-dim + incremental re-embed by content hash)
- [x] `lib/ai/retrieve.ts` (cosine top-k via hnsw `match_embeddings` RPC + relevance floor)
- [x] `lib/ai/prompt.ts` (grounded-or-refuse, injection-safe context wrapping)
- [x] `lib/ai/rate-limit.ts` + `lib/ai/gemini.ts` (Flash REST, 429→graceful)
- [x] `/api/chat` rate-limited BEFORE model call + `ai_query_logs` writes + refuse-without-spending-quota
- [x] `components/ai-assistant/{chat-widget,chat-bubble,citation-pill}.tsx` with visible citations
- [x] Adversarial injection unit test + e2e spec (`tests/.../ai-injection.spec.ts`, canary documented)
- [x] Rate-limiter burst unit test (deterministic); migration 0004 (content_hash + match_embeddings)
- [x] Verified live Gemini free-tier limits (Flash ~15 RPM/1500 RPD) — limiter sized under ceiling
- [ ] Run ~20-question test set + live injection e2e against provisioned env (BLOCKED on owner keys)
- [ ] Live burst load-test vs real Gemini quota (BLOCKED on owner keys/deploy)

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
