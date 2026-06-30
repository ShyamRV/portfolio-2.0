"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type Capabilities, useCapabilities } from "./use-capabilities";

interface ExperienceContextValue {
  caps: Capabilities;
  /** True when we should render the lightweight, GPU-free fallback. */
  fallback: boolean;
  soundEnabled: boolean;
  toggleSound: () => void;
  /** User opted out of the cinematic experience (prefers classic DOM). */
  skipped: boolean;
  setSkipped: (v: boolean) => void;
}

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

const SOUND_KEY = "exp:sound";
const SKIP_KEY = "exp:skip";

export function ExperienceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const caps = useCapabilities();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [skipped, setSkippedState] = useState(false);

  useEffect(() => {
    try {
      setSoundEnabled(localStorage.getItem(SOUND_KEY) === "1");
      setSkippedState(localStorage.getItem(SKIP_KEY) === "1");
    } catch {
      /* storage unavailable */
    }
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SOUND_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const setSkipped = useCallback((v: boolean) => {
    setSkippedState(v);
    try {
      localStorage.setItem(SKIP_KEY, v ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const fallback = caps.ready && (!caps.webgl || caps.reducedMotion);

  const value = useMemo<ExperienceContextValue>(
    () => ({
      caps,
      fallback,
      soundEnabled,
      toggleSound,
      skipped,
      setSkipped,
    }),
    [caps, fallback, soundEnabled, toggleSound, skipped, setSkipped],
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience(): ExperienceContextValue {
  const ctx = useContext(ExperienceContext);
  if (!ctx) {
    throw new Error("useExperience must be used within <ExperienceProvider>");
  }
  return ctx;
}
