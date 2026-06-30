"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  index: string;
  eyebrow: string;
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  /** Align the content column. */
  align?: "left" | "center";
}

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/**
 * A full-height "lab bay" — a scroll chapter with an index/eyebrow header,
 * title and content, revealed on scroll. Content sits in a frosted panel so
 * it stays legible over the live 3D background.
 */
export function Section({
  id,
  index,
  eyebrow,
  title,
  children,
  className,
  align = "left",
}: SectionProps) {
  return (
    <section
      id={id}
      data-section={id}
      className={cn(
        "relative flex min-h-screen w-full items-center px-6 py-24 md:px-10",
        className,
      )}
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        className={cn(
          "mx-auto w-full max-w-5xl",
          align === "center" && "text-center",
        )}
      >
        <motion.div variants={reveal} className="mb-6 flex items-center gap-3">
          <span className="font-mono text-xs text-synapse-1">{index}</span>
          <span className="h-px w-8 bg-synapse-1/50" />
          <span className="sys-label">{eyebrow}</span>
        </motion.div>

        {title && (
          <motion.h2
            variants={reveal}
            className="mb-10 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl"
          >
            {title}
          </motion.h2>
        )}

        <motion.div variants={reveal}>{children}</motion.div>
      </motion.div>
    </section>
  );
}

export const sectionReveal = reveal;
