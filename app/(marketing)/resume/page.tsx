import type { Metadata } from "next";
import { Timeline } from "@/components/sections/timeline";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PlaceholderNotice } from "@/components/sections/placeholder";
import { getProfile } from "@/lib/supabase/queries";

export const metadata: Metadata = { title: "Resume" };

export default async function ResumePage() {
  const { data: profile, isPlaceholder } = await getProfile();
  const resume = profile.resume_json;

  return (
    <div className="container max-w-3xl space-y-10 py-20">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          {profile.full_name}
        </h1>
        {profile.tagline ? (
          <p className="text-muted-foreground">{profile.tagline}</p>
        ) : null}
      </header>

      {isPlaceholder ? (
        <PlaceholderNotice label="Resume renders from profile.resume_json. This is placeholder structure — nothing here is real." />
      ) : null}

      <Timeline resume={resume} />

      {resume?.education?.length ? (
        <section className="container px-0">
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">
            Education
          </h2>
          <ul className="space-y-2">
            {resume.education.map((e, i) => (
              <li key={i} className="flex justify-between">
                <span>
                  {e.credential} · {e.school}
                </span>
                {e.year ? (
                  <span className="text-muted-foreground">{e.year}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {resume?.publications?.length ? (
        <>
          <Separator />
          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">
              Publications (in progress)
            </h2>
            <ul className="space-y-3">
              {resume.publications.map((p) => (
                <li key={p.title}>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-sm text-muted-foreground">{p.note}</p>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}

      {resume?.talks?.length ? (
        <>
          <Separator />
          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">Talks</h2>
            <ul className="space-y-3">
              {resume.talks.map((t) => (
                <li key={t.title}>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-sm text-muted-foreground">{t.venue}</p>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}

      {resume?.skillGroups?.length ? (
        <>
          <Separator />
          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">Skills</h2>
            <div className="space-y-3">
              {resume.skillGroups.map((g) => (
                <div key={g.label} className="flex flex-col gap-1.5 sm:flex-row">
                  <p className="w-40 shrink-0 text-sm font-medium text-muted-foreground">
                    {g.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {g.skills.map((s) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : resume?.skills?.length ? (
        <>
          <Separator />
          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {resume.skills.map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
