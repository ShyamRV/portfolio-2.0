"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import { Section, sectionReveal } from "./section";
import type { YouTubeVideo } from "@/lib/content/youtube-feed";

interface VideosSectionProps {
  videos: YouTubeVideo[];
}

/* ── 07 · BROADCAST (YouTube) ─────────────────────────────── */
export function VideosSection({ videos }: VideosSectionProps) {
  if (!videos || videos.length === 0) return null;

  return (
    <Section
      id="broadcast"
      index="07"
      eyebrow="Broadcast"
      title="Latest from the channel"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <motion.a
            key={video.id}
            variants={sectionReveal}
            href={video.url}
            target="_blank"
            rel="noreferrer"
            data-cursor="hover"
            className="holo-panel group overflow-hidden rounded-xl transition-colors hover:border-synapse-1/40"
          >
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-synapse-1/90 text-void shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Play className="h-5 w-5 translate-x-[1px] fill-current" />
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="line-clamp-2 font-display text-sm font-semibold leading-snug">
                {video.title}
              </h3>
              {video.published && (
                <p className="mt-2 font-mono text-xs text-synapse-1">
                  {new Date(video.published).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
          </motion.a>
        ))}
      </div>
    </Section>
  );
}
