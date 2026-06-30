import type { Metadata } from "next";
import { Experience } from "@/features/experience/experience";
import { REAL_PROFILE } from "@/lib/content/resume-data";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "An immersive, AI-lab portfolio experience for Shyamji Pandey — Agentic AI Engineer.",
};

const IDENTITIES = [
  "Agentic AI Engineer",
  "Developer Advocate",
  "Computer Vision Researcher",
  "Graph ML Researcher",
  "Robotics Engineer",
  "Open Source Builder",
  "Public Speaker",
  "Community Builder",
  "AI Content Creator",
];

export default function ExperiencePage() {
  return (
    <Experience name={REAL_PROFILE.full_name} identities={IDENTITIES} />
  );
}
