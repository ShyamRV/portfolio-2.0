"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const LINES = [
  "initializing neural core",
  "loading digital twin",
  "calibrating perception",
  "mounting agent runtime",
  "system online",
];

/**
 * An "AI system boot" loader — builds anticipation, then dissolves to reveal
 * the experience. Auto-completes quickly (assets are procedural) and is fully
 * skippable. Hidden entirely under reduced-motion.
 */
export function BootLoader({ onDone }: { onDone?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [line, setLine] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const DURATION = 2200;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      setLine(Math.min(LINES.length - 1, Math.floor(eased * LINES.length)));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setDone(true);
          onDone?.();
        }, 350);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-void"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="lab-grid absolute inset-0 opacity-40" />
          <div className="lab-vignette absolute inset-0" />

          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              className="font-display text-2xl font-semibold tracking-tight"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              SHYAMJI<span className="text-synapse-1">.</span>SYS
            </motion.div>

            <div className="h-px w-56 overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-synapse-1 to-synapse-2"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex w-56 items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span>{LINES[line]}</span>
              <span className="text-synapse-1">{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
