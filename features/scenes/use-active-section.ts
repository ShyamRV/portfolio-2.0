"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which `[data-section]` is currently centered in the viewport so the
 * HUD rail can highlight it. Uses IntersectionObserver (cheap, no scroll spam).
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const els = ids
      .map((id) => document.querySelector(`[data-section="${id}"]`))
      .filter((el): el is Element => Boolean(el));
    if (els.length === 0) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.getAttribute("data-section") ?? "";
          visible.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let best = active;
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (bestRatio > 0) setActive(best);
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-10% 0px -10% 0px" },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  return active;
}
