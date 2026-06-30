# Build Prompt — canonical spec

This file is the canonical spec for the project. The full text was provided by
the project owner in the kickoff prompt. Key invariants (do not drift from these):

- **Zero-cost stack only** (Part 3): Next.js + Vercel Hobby, Supabase free
  (Postgres + pgvector), Gemini free tier (chat), free local/HF embeddings
  (MiniLM, 384 dims), GitHub/YouTube/RSS/HF/PyPI/npm/ORCID free APIs, PostHog
  free tier. No card, no trial-that-converts, no usage billing risk.
- **No fabricated content** (Part 1.1).
- **Milestones one at a time** (Part 7): M0 setup → M1 static MVP → M2 content
  pipeline → M3 AI assistant → M4 polish/launch.
- **DB schema**: Part 4 (mirrored in `supabase/migrations/`). Embedding vector
  dim = **384**.
- **RAG pipeline**: Part 6 (chunk → embed → retrieve top-k → grounded prompt →
  log). Injection defense + Gemini rate limiting are mandatory.
- **Supabase keepalive**: `/api/keepalive` on a 3-day Vercel cron, logged to
  `sync_logs` (Part 3).

## Open inputs ([NEEDS INPUT], Part 2)

Tracked in `TASKS.md` → "Open inputs". Until resolved, UI uses clearly-labeled
placeholders (`PlaceholderNotice`); nothing is invented.

## Defaults chosen during Milestone 0 (pending owner confirmation)

- Theme: light + dark toggle, neutral base + blue accent.
- Embedding execution path: Supabase Edge Function (recommended) — not finalized.
- First sync source: GitHub.
- Repo visibility: assumed **local/private** until the owner says to make it public
  (cannot be made public without the owner's GitHub account anyway).
