"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { ConsentBanner, getStoredConsent } from "./consent-banner";

/**
 * PostHog analytics (Milestone 4) — free tier, no card.
 *
 * Privacy-first for EU visitors:
 *  - No capturing AT ALL until the visitor explicitly consents (opt-in).
 *  - `disable_geoip: true` so PostHog does not derive location from IP, and
 *    IP anonymization should also be enabled in the PostHog project settings.
 *  - `person_profiles: "identified_only"` to avoid anonymous person bloat.
 *
 * If NEXT_PUBLIC_POSTHOG_KEY is unset, this is an inert pass-through.
 */

let initialized = false;

function initPostHog() {
  if (initialized) return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false, // we capture manually on route change
    autocapture: false,
  });
  // Disable IP-based geolocation on every event. IP anonymization should ALSO
  // be enabled in the PostHog project settings for defense in depth.
  posthog.register({ $geoip_disable: true });
  initialized = true;
}

function PageviewTracker({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (!enabled || !initialized) return;
    let url = window.origin + pathname;
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
    posthog.capture("$pageview", { $current_url: url });
  }, [enabled, pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = React.useState<"granted" | "denied" | "unset">(
    "unset",
  );

  React.useEffect(() => {
    const stored = getStoredConsent();
    setConsent(stored);
    if (stored === "granted") initPostHog();
  }, []);

  const handleConsent = (granted: boolean) => {
    setConsent(granted ? "granted" : "denied");
    if (granted) initPostHog();
  };

  return (
    <>
      {children}
      <React.Suspense fallback={null}>
        <PageviewTracker enabled={consent === "granted"} />
      </React.Suspense>
      {consent === "unset" ? <ConsentBanner onChoice={handleConsent} /> : null}
    </>
  );
}
