"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface HeroOverlayProps {
  name: string;
  identities: string[];
}

export function HeroOverlay({ name, identities }: HeroOverlayProps) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setI((p) => (p + 1) % identities.length),
      2400,
    );
    return () => clearInterval(id);
  }, [identities.length]);

  return (
    <section
      id="arrival"
      data-section="arrival"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      {/* Soft scrim improves text legibility over the bright figure core. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(var(--void) / 0.65) 0%, transparent 70%)",
        }}
      />
      <motion.p
        className="sys-label mb-6 relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Embodied Intelligence
      </motion.p>

      <motion.h1
        className="relative font-display text-7xl font-bold leading-[0.95] tracking-tight md:text-8xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.9 }}
      >
        {name.split(" ").map((word, idx) => (
          <span key={idx} className="block">
            {idx === 1 ? <span className="holo-text">{word}</span> : word}
          </span>
        ))}
      </motion.h1>

      <div className="relative mt-8 flex h-7 items-center justify-center overflow-hidden font-mono text-sm uppercase tracking-[0.25em] text-muted-foreground">
        <span className="mr-2 text-synapse-1">/</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={i}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {identities[i]}
          </motion.span>
        </AnimatePresence>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        <span className="sys-label">scroll to explore</span>
        <motion.span
          className="h-8 w-px bg-gradient-to-b from-synapse-1 to-transparent"
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </section>
  );
}
