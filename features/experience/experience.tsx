"use client";

import { useState } from "react";
import { useExperience } from "./experience-provider";
import { qualityFor } from "@/features/scene-engine/quality";
import { SceneCanvas } from "@/features/scene-engine/scene-canvas";
import { ExperienceScene } from "@/features/scene-engine/experience-scene";
import { BootLoader } from "./boot-loader";
import { Hud, type HudSection } from "@/features/hud/hud";
import { HeroOverlay } from "@/features/scenes/hero-overlay";

interface ExperienceProps {
  name: string;
  identities: string[];
}

const SECTIONS: HudSection[] = [
  { id: "arrival", label: "ARRIVAL", index: "00" },
  { id: "intro", label: "IDENTITY", index: "01" },
];

export function Experience({ name, identities }: ExperienceProps) {
  const { caps, fallback, skipped } = useExperience();
  const [booted, setBooted] = useState(false);

  const useCanvas = caps.ready && !fallback && !skipped;
  const quality = qualityFor(caps.tier);
  const showLoader = caps.ready && !caps.reducedMotion && useCanvas && !booted;

  return (
    <div className="relative bg-void text-foreground">
      {showLoader && <BootLoader onDone={() => setBooted(true)} />}

      {/* Background: live 3D or accessible static-cinematic fallback. */}
      {useCanvas ? (
        <div className="fixed inset-0 z-0">
          <SceneCanvas>
            <ExperienceScene quality={quality} pixelRatio={caps.dpr} />
          </SceneCanvas>
        </div>
      ) : (
        <div className="fixed inset-0 z-0 overflow-hidden bg-void">
          <div className="lab-grid absolute inset-0 opacity-30" />
          <div className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-synapse-1/20 blur-[120px] motion-safe:animate-aurora" />
          <div className="absolute left-[60%] top-[40%] h-[40vmin] w-[40vmin] rounded-full bg-synapse-2/20 blur-[120px]" />
          <div className="lab-vignette absolute inset-0" />
        </div>
      )}

      <Hud sections={SECTIONS} activeId="arrival" status="digital twin online" />

      {/* Foreground content (scrollable). */}
      <main className="relative z-10">
        <HeroOverlay name={name} identities={identities} />

        {/* Scroll runway so the figure morphs into the neural cloud. */}
        <section className="flex min-h-[120vh] items-center justify-center px-6">
          <p className="max-w-xl text-center font-display text-3xl font-medium leading-tight text-muted-foreground md:text-4xl">
            An engineer who builds{" "}
            <span className="text-foreground">autonomous systems</span> — and a
            site that behaves like one.
          </p>
        </section>
      </main>
    </div>
  );
}
