# QA — what was actually tested vs. pending owner deploy

Honesty note (Part 1 / Milestone 4): nothing below claims a result that wasn't
actually produced. Items needing a live deployment or owner accounts are marked
PENDING, not asserted as passing.

## Verified locally / in CI (reproducible)

- **Typecheck**: `npm run typecheck` — passes (TS strict, `noUncheckedIndexedAccess`).
- **Lint**: `npm run lint` — clean.
- **Unit tests**: `npm test` — passing, covering:
  - `cn` utility
  - prompt grounding + injection defense (`prompt.test.ts`)
  - rate-limiter burst behavior (`rate-limit.test.ts`)
  - accessibility structure via axe-core (`a11y.test.tsx`)
- **Production build**: `npm run build` — all routes compile; project pages SSG.

## Wired but requires a live environment to PRODUCE numbers (PENDING)

- **Lighthouse CI gate** (`lighthouserc.json`, `.github/workflows/lighthouse.yml`):
  mobile, Performance/Accessibility/Best-Practices/SEO ≥ 95. The gate runs in CI
  on PRs; actual scores come from that run — do not assume them.
- **Live AI e2e** (`tests/e2e/ai-injection.spec.ts`): runs with `E2E_CHAT_ENABLED=1`
  against a provisioned env (Supabase + Gemini + HF + seeded canary).
- **Burst load test vs real Gemini quota**: deterministic limiter test passes in
  CI; the real-ceiling burst test needs a deployment.

## PENDING — needs owner action (cannot be faked)

- **Manual screen-reader pass** (NVDA/VoiceOver): tab order, focus traps in the
  chat dialog, landmark navigation. How to run: deploy preview → navigate with
  keyboard only + screen reader; verify the chat toggle, form, and citations are
  announced.
- **Cross-browser/device matrix**: Chrome, Firefox, Safari (incl. iOS Safari),
  Edge; mobile + desktop. Document actual results here after the preview is up.
- **Real analytics verification**: confirm PostHog receives events only after
  consent and with IP anonymization enabled in project settings.
