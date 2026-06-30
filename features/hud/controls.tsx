"use client";

import { Volume2, VolumeX, FastForward, RotateCcw } from "lucide-react";
import { useExperience } from "@/features/experience/experience-provider";
import { useSound } from "./sound-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

function IconButton({
  label,
  onClick,
  children,
  active,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      data-cursor="hover"
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-muted-foreground backdrop-blur-xl transition-colors hover:text-foreground hover:border-synapse-1/40",
        active && "text-synapse-1 border-synapse-1/40",
      )}
    >
      {children}
    </button>
  );
}

export function HudControls() {
  const { soundEnabled, toggleSound, skipped, setSkipped } = useExperience();
  const sound = useSound();

  return (
    <div className="flex items-center gap-2">
      <IconButton
        label={soundEnabled ? "Mute ambient sound" : "Enable ambient sound"}
        active={soundEnabled}
        onClick={() => {
          toggleSound();
          sound.tick();
        }}
      >
        {soundEnabled ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <VolumeX className="h-4 w-4" />
        )}
      </IconButton>

      <ThemeToggle />

      <IconButton
        label={skipped ? "Resume immersive experience" : "Skip the experience"}
        active={skipped}
        onClick={() => {
          setSkipped(!skipped);
          sound.tick();
        }}
      >
        {skipped ? (
          <RotateCcw className="h-4 w-4" />
        ) : (
          <FastForward className="h-4 w-4" />
        )}
      </IconButton>
    </div>
  );
}
