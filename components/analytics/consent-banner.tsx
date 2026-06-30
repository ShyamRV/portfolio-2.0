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
      className="glass fixed bottom-4 left-4 z-50 max-w-sm rounded-lg p-4 shadow-lg motion-safe:animate-fade-in"
    >
      <p className="text-sm text-muted-foreground">
        I use privacy-friendly analytics (PostHog) with IP anonymization, only if
        you allow it. No tracking happens until you choose.
      </p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={() => choose(true)}>
          Allow
        </Button>
        <Button size="sm" variant="outline" onClick={() => choose(false)}>
          Decline
        </Button>
      </div>
    </div>
  );
}
