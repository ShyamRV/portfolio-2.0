"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useExperience } from "./experience-provider";

let registered = false;

/**
 * Premium inertia scrolling (Lenis) driven off the GSAP ticker so ScrollTrigger
 * timelines and the 3D camera stay perfectly in sync. No-ops under
 * reduced-motion to respect the user's OS preference.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const { caps } = useExperience();

  useEffect(() => {
    if (!caps.ready || caps.reducedMotion) return;

    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Expose for scenes that want to control scroll programmatically.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
    };
  }, [caps.ready, caps.reducedMotion]);

  return <>{children}</>;
}
