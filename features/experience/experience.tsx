"use client";

import { useState } from "react";
import { useExperience } from "./experience-provider";
import { qualityFor } from "@/features/scene-engine/quality";
import { SceneCanvas } from "@/features/scene-engine/scene-canvas";
import { ExperienceScene } from "@/features/scene-engine/experience-scene";
import { BootLoader } from "./boot-loader";
import { Hud, type HudSection } from "@/features/hud/hud";
import { HeroOverlay } from "@/features/scenes/hero-overlay";
import {
  AboutSection,
  JourneySection,
  ResearchSection,
  SkillsSection,
  SpeakingSection,
  ContactSection,
} from "@/features/scenes/content-sections";
import { ProjectsSection } from "@/features/scenes/projects-section";
import { ConsoleSection } from "@/features/scenes/console-section";
import { useActiveSection } from "@/features/scenes/use-active-section";

interface ExperienceProps {
  name: string;
  identities: string[];
}

const SECTIONS: HudSection[] = [
  { id: "arrival", label: "ARRIVAL", index: "00" },
  { id: "essence", label: "ESSENCE", index: "01" },
  { id: "journey", label: "JOURNEY", index: "02" },
  { id: "research", label: "RESEARCH", index: "03" },
  { id: "systems", label: "SYSTEMS", index: "04" },
  { id: "capabilities", label: "CAPABILITIES", index: "05" },
  { id: "signal", label: "SIGNAL", index: "06" },
  { id: "console", label: "CONSOLE", index: "07" },
  { id: "contact", label: "CONTACT", index: "08" },
];

const SECTION_IDS = SECTIONS.map((s) => s.id);

export function Experience({ name, identities }: ExperienceProps) {
  const { caps, fallback, skipped } = useExperience();
  const [booted, setBooted] = useState(false);
  const active = useActiveSection(SECTION_IDS);

  const useCanvas = caps.ready && !fallback && !skipped;
  const quality = qualityFor(caps.tier);
  const showLoader = caps.ready && !caps.reducedMotion && useCanvas && !booted;

  const handleSelect = (id: string) => {
    document
      .querySelector(`[data-section="${id}"]`)
      ?.scrollIntoView({ behavior: caps.reducedMotion ? "auto" : "smooth" });
  };

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

      <Hud
        sections={SECTIONS}
        activeId={active}
        onSelect={handleSelect}
        status="digital twin online"
      />

      {/* Foreground content (scrollable). */}
      <main className="relative z-10">
        <HeroOverlay name={name} identities={identities} />
        <AboutSection />
        <JourneySection />
        <ResearchSection />
        <ProjectsSection />
        <SkillsSection />
        <SpeakingSection />
        <ConsoleSection />
        <ContactSection />
      </main>

      <footer className="relative z-10 border-t border-white/10 px-6 py-10 text-center md:px-10">
        <p className="font-mono text-xs text-muted-foreground">
          {name} · built as an autonomous system ·{" "}
          <span className="text-synapse-1">{new Date().getFullYear()}</span>
        </p>
      </footer>
    </div>
  );
}
