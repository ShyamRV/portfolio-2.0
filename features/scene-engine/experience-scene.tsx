"use client";

import { Suspense } from "react";
import { Stars } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";
import { CameraRig } from "./camera-rig";
import { DigitalTwin } from "./digital-twin";
import type { QualitySettings } from "./quality";

interface ExperienceSceneProps {
  quality: QualitySettings;
  pixelRatio: number;
}

/**
 * 3D contents rendered inside the shared Canvas. Receives quality as props
 * (React context doesn't cross the R3F renderer boundary).
 */
export function ExperienceScene({ quality, pixelRatio }: ExperienceSceneProps) {
  return (
    <>
      <color attach="background" args={["#05060a"]} />
      <fog attach="fog" args={["#05060a", 6, 18]} />

      <CameraRig />

      <Suspense fallback={null}>
        <DigitalTwin count={quality.particles} pixelRatio={pixelRatio} />
        <Stars
          radius={60}
          depth={40}
          count={quality.heavyPost ? 1000 : 500}
          factor={3}
          saturation={0}
          fade
          speed={0.3}
        />
      </Suspense>

      {quality.bloom && (
        <EffectComposer multisampling={quality.antialias ? 4 : 0}>
          <Bloom
            intensity={quality.bloomIntensity}
            luminanceThreshold={0.55}
            luminanceSmoothing={0.4}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.25} darkness={0.85} />
        </EffectComposer>
      )}
    </>
  );
}
