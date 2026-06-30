import type { Metadata } from "next";
import { PlaceholderNotice } from "@/components/sections/placeholder";

export const metadata: Metadata = { title: "Resume" };

export default function ResumePage() {
  return (
    <div className="container space-y-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">Resume</h1>
      <PlaceholderNotice label="Renders from profile.resume_json (Part 4) once the real CV is provided (Part 2 [NEEDS INPUT]). Nothing here is invented." />
    </div>
  );
}
