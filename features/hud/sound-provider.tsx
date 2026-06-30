"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useExperience } from "@/features/experience/experience-provider";

interface SoundApi {
  tick: () => void;
  hover: () => void;
  confirm: () => void;
}

const SoundContext = createContext<SoundApi>({
  tick: () => {},
  hover: () => {},
  confirm: () => {},
});

/**
 * Fully synthesized audio (Web Audio API) — no media files, so it ships
 * nothing and has no licensing cost. Ambient drone + UI blips, only ever
 * audible after the user opts in via the HUD sound toggle (autoplay-safe).
 */
export function SoundProvider({ children }: { children: React.ReactNode }) {
  const { soundEnabled } = useExperience();
  const ctxRef = useRef<AudioContext | null>(null);
  const ambientRef = useRef<{ stop: () => void } | null>(null);
  const masterRef = useRef<GainNode | null>(null);

  const ensureCtx = () => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      const ctx = new AC();
      const master = ctx.createGain();
      master.gain.value = 0.0;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    return ctxRef.current;
  };

  const startAmbient = (ctx: AudioContext, master: GainNode) => {
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 0.012;
    lfo.connect(lfoGain);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 380;
    filter.Q.value = 6;

    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.05;
    lfoGain.connect(droneGain.gain);

    const freqs = [55, 82.4, 110]; // A1, E2, A2
    const oscs = freqs.map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 0 ? "sine" : "triangle";
      o.frequency.value = f;
      o.detune.value = (i - 1) * 6;
      o.connect(filter);
      o.start();
      return o;
    });
    filter.connect(droneGain);
    droneGain.connect(master);
    lfo.start();

    return {
      stop: () => {
        oscs.forEach((o) => {
          try {
            o.stop();
          } catch {
            /* already stopped */
          }
        });
        try {
          lfo.stop();
        } catch {
          /* ignore */
        }
      },
    };
  };

  useEffect(() => {
    if (soundEnabled) {
      const ctx = ensureCtx();
      const master = masterRef.current;
      if (!ctx || !master) return;
      if (ctx.state === "suspended") void ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 1.2);
      if (!ambientRef.current) {
        ambientRef.current = startAmbient(ctx, master);
      }
    } else {
      const ctx = ctxRef.current;
      const master = masterRef.current;
      if (ctx && master) {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 0.4);
      }
    }
  }, [soundEnabled]);

  useEffect(() => {
    return () => {
      ambientRef.current?.stop();
      void ctxRef.current?.close();
    };
  }, []);

  const api = useMemo<SoundApi>(() => {
    const blip = (freq: number, dur: number, gainVal: number) => {
      const ctx = ctxRef.current;
      const master = masterRef.current;
      if (!ctx || !master || ctx.state !== "running") return;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      osc.connect(g);
      g.connect(master);
      osc.start();
      osc.stop(ctx.currentTime + dur + 0.02);
    };
    return {
      tick: () => blip(880, 0.06, 0.12),
      hover: () => blip(1320, 0.04, 0.05),
      confirm: () => {
        blip(660, 0.08, 0.12);
        setTimeout(() => blip(990, 0.12, 0.12), 70);
      },
    };
  }, []);

  return <SoundContext.Provider value={api}>{children}</SoundContext.Provider>;
}

export function useSound(): SoundApi {
  return useContext(SoundContext);
}
