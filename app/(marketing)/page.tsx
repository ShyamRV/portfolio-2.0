import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { PlaceholderNotice } from "@/components/sections/placeholder";

export default function HomePage() {
  return (
    <div className="container space-y-20 py-20">
      <section className="space-y-6">
        <Reveal>
          <p className="font-mono text-sm uppercase tracking-widest text-accent">
            {/* [NEEDS INPUT] audience-tuned eyebrow */}
            Engineer · Builder
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            {/* [NEEDS INPUT] hero copy depends on audience ranking (Part 2) */}
            Hi, I&apos;m [Your Name].
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="max-w-2xl text-lg text-muted-foreground">
            [Placeholder tagline] — replaced with real bio/tagline from the
            profile table once resume data is provided.
          </p>
        </Reveal>
        <Reveal delay={240} className="flex gap-3">
          <Button asChild>
            <Link href="/work">View work</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">Get in touch</Link>
          </Button>
        </Reveal>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Featured work</h2>
        <PlaceholderNotice label="Featured projects render from the projects table once seeded with real resume data (Milestone 1)." />
      </section>
    </div>
  );
}
