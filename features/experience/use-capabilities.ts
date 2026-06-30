"use client";

import { useEffect, useState } from "react";

export type DeviceTier = "high" | "mid" | "low";

export interface Capabilities {
  /** Resolved once on the client; null during SSR / first paint. */
  ready: boolean;
  webgl: boolean;
  reducedMotion: boolean;
  touch: boolean;
  tier: DeviceTier;
  /** Clamped device pixel ratio safe for GPU work. */
  dpr: number;
}

const DEFAULT: Capabilities = {
  ready: false,
  webgl: true,
  reducedMotion: false,
  touch: false,
  tier: "high",
  dpr: 1.5,
};

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

function detectTier(touch: boolean): DeviceTier {
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;

  if (touch) {
    // Mobile: rarely "high" for sustained GPU particle work.
    if (cores >= 8 && (memory ?? 4) >= 6) return "mid";
    return "low";
  }
  if (cores >= 8 && (memory ?? 8) >= 8) return "high";
  if (cores >= 4) return "mid";
  return "low";
}

/**
 * Resolves device capabilities once on mount. Drives quality tiers and the
 * accessibility fallback (no-WebGL / reduced-motion => static-cinematic path).
 */
export function useCapabilities(): Capabilities {
  const [caps, setCaps] = useState<Capabilities>(DEFAULT);

  useEffect(() => {
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const webgl = detectWebGL();
    const tier = detectTier(touch);
    const dpr = Math.min(
      window.devicePixelRatio || 1,
      tier === "high" ? 2 : tier === "mid" ? 1.5 : 1,
    );

    const resolve = () =>
      setCaps({
        ready: true,
        webgl,
        reducedMotion: reducedMotionQuery.matches,
        touch,
        tier,
        dpr,
      });

    resolve();
    reducedMotionQuery.addEventListener("change", resolve);
    return () => reducedMotionQuery.removeEventListener("change", resolve);
  }, []);

  return caps;
}
