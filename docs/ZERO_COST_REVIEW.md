# Zero-cost stack review (Milestone 4, step 7)

Final audit across all four milestones: every dependency, env var, and
third-party call vs. Part 3. **Result: no paid, trial-gated, card-required, or
usage-billing service was introduced anywhere.**

## Runtime dependencies (package.json) — all free OSS

| Package | Purpose | Cost |
|---|---|---|
| next, react, react-dom | framework | free OSS |
| @radix-ui/react-dialog, react-slot | UI primitives | free OSS |
| class-variance-authority, clsx, tailwind-merge, tailwindcss-animate | styling | free OSS |
| lucide-react | icons | free OSS |
| next-themes | dark/light toggle | free OSS |
| @supabase/supabase-js | DB client | free OSS (Supabase free tier) |
| fast-xml-parser | RSS/Atom parsing | free OSS |
| posthog-js | analytics client | free OSS (PostHog free tier) |
| zod | validation | free OSS |

Dev deps (vitest, testing-library, playwright, axe-core, eslint, typescript,
tailwind, postcss, autoprefixer, jsdom, @vitejs/plugin-react) — all free OSS.

**No SDK for any paid service.** Gemini is called via plain `fetch` (no SDK),
embeddings via HF Inference `fetch`.

## External services called — all free tier, no card

| Service | Tier relied on | Card? |
|---|---|---|
| Vercel Hobby | hosting + cron (all crons ≥6h, hourly-min respected) | No |
| Supabase Free | Postgres + pgvector; keepalive every 3 days vs 7-day pause | No |
| Google Gemini | Flash free tier (~15 RPM / 1500 RPD, verified); limiter sized under ceiling; 429 → graceful | No |
| Hugging Face Inference | free embeddings (all-MiniLM-L6-v2, 384-dim) | No |
| GitHub API | public REST (token optional, only raises limits) | No |
| YouTube | channel RSS (no key, no quota) | No |
| Dev.to/Hashnode/Medium | public RSS | No |
| HF/PyPI/npm/ORCID | public JSON | No |
| Google Scholar | manual entry only (no scraping) | No |
| PostHog | free tier, consent-gated, geoip disabled | No |

**Intentionally excluded** (per Part 3): Sentry (skipped for v1; GlitchTip noted
as a *future* decision, not built), X/Twitter API (paid — manual oEmbed only),
LinkedIn (not automatable — manual entry).

## Env vars (Part 8 + additions) — none require a card to obtain

All keys come from free signups: Supabase, Gemini (ai.google.dev), Hugging Face,
GitHub PAT, PostHog. `CRON_SECRET`/`GITHUB_WEBHOOK_SECRET` are self-generated.

## Caveats flagged (not silently worked around)

- **HF free Inference API** can cold-start/throttle; embed step retries on 503.
  If it becomes unreliable, the documented alternative is a Supabase Edge
  Function — still free. Flag before switching.
- **Gemini free-tier quotas shift** and are project-level; re-verify in AI Studio.
- **In-memory per-minute rate buckets** are per serverless instance; the daily
  budget is DB-backed (cross-instance). Acceptable on free tier.
