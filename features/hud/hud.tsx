"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { HudControls } from "./controls";

export interface HudSection {
  id: string;
  label: string;
  index: string; // e.g. "00"
}

interface HudProps {
  sections?: HudSection[];
  activeId?: string;
  onSelect?: (id: string) => void;
  status?: string;
}

function CornerBracket({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute h-5 w-5 border-synapse-1/40",
        className,
      )}
    />
  );
}

/**
 * Persistent heads-up display overlaid on the experience. The frame itself is
 * non-interactive; only the wordmark, controls and section rail capture events.
 */
export function Hud({ sections, activeId, onSelect, status }: HudProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[150] select-none">
      {/* Decorative lab frame */}
      <CornerBracket className="left-4 top-4 border-l border-t" />
      <CornerBracket className="right-4 top-4 border-r border-t" />
      <CornerBracket className="bottom-4 left-4 border-b border-l" />
      <CornerBracket className="bottom-4 right-4 border-b border-r" />

      {/* Top bar */}
      <header className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-5 md:px-10">
        <Link
          href="/"
          data-cursor="hover"
          className="pointer-events-auto flex items-center gap-3"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-pulse-glow rounded-full bg-synapse-1" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-synapse-1" />
          </span>
          <span className="font-display text-sm font-semibold tracking-tight">
            SHYAMJI<span className="text-synapse-1">.</span>SYS
          </span>
        </Link>

        <div className="pointer-events-auto">
          <HudControls />
        </div>
      </header>

      {/* Status line */}
      {status && (
        <div className="absolute left-6 top-16 hidden md:block md:left-10">
          <p className="sys-label">
            <span className="text-signal">●</span> {status}
          </p>
        </div>
      )}

      {/* Section index rail */}
      {sections && sections.length > 0 && (
        <nav className="pointer-events-auto absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 md:flex md:right-10">
          {sections.map((s) => {
            const active = s.id === activeId;
            return (
              <button
                key={s.id}
                type="button"
                data-cursor="hover"
                onClick={() => onSelect?.(s.id)}
                className="group flex items-center justify-end gap-3"
                aria-label={`Go to ${s.label}`}
                aria-current={active ? "true" : undefined}
              >
                <span
                  className={cn(
                    "font-mono text-[10px] tracking-widest transition-all duration-300",
                    active
                      ? "text-synapse-1 opacity-100"
                      : "text-muted-foreground opacity-0 group-hover:opacity-100",
                  )}
                >
                  {s.label}
                </span>
                <span
                  className={cn(
                    "h-px transition-all duration-300",
                    active
                      ? "w-8 bg-synapse-1"
                      : "w-4 bg-muted-foreground/40 group-hover:w-6 group-hover:bg-synapse-1/60",
                  )}
                />
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
