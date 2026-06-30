"use client";

import { Button } from "@/components/ui/button";

const KEY = "ph-consent";

export function getStoredConsent(): "granted" | "denied" | "unset" {
  if (typeof window === "undefined") return "unset";
  const v = window.localStorage.getItem(KEY);
  return v === "granted" || v === "denied" ? v : "unset";
}

export function ConsentBanner({
  onChoice,
}: {
  onChoice: (granted: boolean) => void;
}) {
  function choose(granted: boolean) {
    window.localStorage.setItem(KEY, granted ? "granted" : "denied");
    onChoice(granted);
  }

  return (
    <div
      role="dialog"
      aria-label="Analytics consent"
      className="holo-panel fixed bottom-4 left-1/2 z-[170] flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 flex-col items-center gap-3 rounded-xl px-5 py-3 motion-safe:animate-fade-in sm:flex-row sm:gap-4"
    >
      <p className="flex items-center gap-2 text-center font-mono text-xs text-muted-foreground sm:text-left">
        <span className="text-synapse-1">●</span>
        Privacy-friendly analytics (PostHog, IP-anonymized) — only with consent.
      </p>
      <div className="flex shrink-0 gap-2">
        <Button size="sm" onClick={() => choose(true)} data-cursor="hover">
          Allow
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => choose(false)}
          data-cursor="hover"
        >
          Decline
        </Button>
      </div>
    </div>
  );
}
