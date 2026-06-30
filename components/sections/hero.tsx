import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { PlaceholderNotice } from "@/components/sections/placeholder";
import type { Profile } from "@/lib/content/types";

export function Hero({
  profile,
  isPlaceholder,
}: {
  profile: Profile;
  isPlaceholder: boolean;
}) {
  return (
    <section className="container py-20 sm:py-28">
      <div className="max-w-3xl space-y-6">
        <Reveal>
          <p className="font-mono text-sm uppercase tracking-widest text-accent">
            {profile.tagline ?? "Engineer · Builder"}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            {profile.full_name}
          </h1>
        </Reveal>
        {profile.bio ? (
          <Reveal delay={160}>
            <p className="text-pretty text-lg text-muted-foreground">
              {profile.bio}
            </p>
          </Reveal>
        ) : null}
        <Reveal delay={240} className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/work">View work</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">Get in touch</Link>
          </Button>
          {profile.social_links?.map((s) => (
            <Button key={s.url} variant="ghost" asChild>
              <a href={s.url} target="_blank" rel="noreferrer noopener">
                {s.label}
              </a>
            </Button>
          ))}
        </Reveal>
        {isPlaceholder ? (
          <PlaceholderNotice label="Hero is showing placeholder identity. Insert a real row into the profile table to replace it." />
        ) : null}
      </div>
    </section>
  );
}
