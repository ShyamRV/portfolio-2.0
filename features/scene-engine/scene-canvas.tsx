"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from "@react-three/drei";
import { useExperience } from "@/features/experience/experience-provider";
import { qualityFor } from "./quality";
import { startScrollTracking } from "./scroll-store";

/**
 * Single shared WebGL context for the whole experience. Mounts only on capable
 * devices (the no-WebGL / reduced-motion fallback is handled by the caller).
 * A PerformanceMonitor downgrades DPR automatically if the GPU struggles.
 */
export function SceneCanvas({ children }: { children: React.ReactNode }) {
  const { caps } = useExperience();
  const [dprFactor, setDprFactor] = useState(1);

  useEffect(() => startScrollTracking(), []);

  const quality = qualityFor(caps.tier);
  const baseDpr = caps.dpr;

  return (
    <Canvas
      className="!fixed inset-0"
      dpr={[1, baseDpr * dprFactor]}
      gl={{
        antialias: quality.antialias,
        powerPreference: "high-performance",
        alpha: true,
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 0, 6], fov: 50, near: 0.1, far: 100 }}
      frameloop="always"
    >
      <PerformanceMonitor
        onDecline={() => setDprFactor((f) => Math.max(0.6, f - 0.2))}
        onIncline={() => setDprFactor((f) => Math.min(1, f + 0.1))}
      />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      {children}
    </Canvas>
  );
}
