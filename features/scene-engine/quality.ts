import type { DeviceTier } from "@/features/experience/use-capabilities";

export interface QualitySettings {
  /** Particle count for the hero point-cloud. */
  particles: number;
  bloom: boolean;
  bloomIntensity: number;
  antialias: boolean;
  /** Enable depth-of-field / heavier post fx. */
  heavyPost: boolean;
  /** useFrame work cap — skip frames on weak GPUs. */
  maxFps: number;
}

const TABLE: Record<DeviceTier, QualitySettings> = {
  high: {
    particles: 34000,
    bloom: true,
    bloomIntensity: 0.7,
    antialias: true,
    heavyPost: true,
    maxFps: 60,
  },
  mid: {
    particles: 18000,
    bloom: true,
    bloomIntensity: 0.55,
    antialias: true,
    heavyPost: false,
    maxFps: 60,
  },
  low: {
    particles: 7000,
    bloom: false,
    bloomIntensity: 0.4,
    antialias: false,
    heavyPost: false,
    maxFps: 30,
  },
};

export function qualityFor(tier: DeviceTier): QualitySettings {
  return TABLE[tier];
}
