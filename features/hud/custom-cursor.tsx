"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useExperience } from "@/features/experience/experience-provider";

/**
 * A "focus reticle" cursor: a precise center dot with a soft ring that lags
 * behind via spring physics and expands when hovering interactive targets.
 * Falls back to the native cursor on touch devices or under reduced-motion.
 */
export function CustomCursor() {
  const { caps } = useExperience();
  const active = caps.ready && !caps.touch && !caps.reducedMotion;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.5 });

  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!active) return;
    document.documentElement.classList.add("custom-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement | null;
      setHovering(
        Boolean(
          target?.closest(
            "a, button, [role='button'], input, textarea, [data-cursor='hover']",
          ),
        ),
      );
    };
    const downFn = () => setDown(true);
    const upFn = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", downFn);
    window.addEventListener("pointerup", upFn);

    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", downFn);
      window.removeEventListener("pointerup", upFn);
    };
  }, [active, x, y]);

  if (!active) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[200]">
      {/* Center dot — tracks exactly. */}
      <motion.div
        className="absolute h-1.5 w-1.5 rounded-full bg-synapse-1"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      {/* Lagging reticle ring. */}
      <motion.div
        className="absolute rounded-full border border-synapse-1/70"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: hovering ? 56 : 30,
          height: hovering ? 56 : 30,
          opacity: down ? 1 : 0.7,
          borderColor: hovering
            ? "hsl(var(--hologram) / 0.9)"
            : "hsl(var(--synapse-1) / 0.7)",
          scale: down ? 0.85 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      />
    </div>
  );
}
