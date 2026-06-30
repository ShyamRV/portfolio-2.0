import type { NormalizedItem, SyncOutcome } from "@/lib/supabase/sync";

/**
 * Low-frequency external sources (Milestone 2, weekly cron). All free public
 * JSON APIs. Each source runs in its own try/catch so one failure produces a
 * `partial` outcome rather than breaking the others.
 *
 * Google Scholar: NO official API at any price. We do NOT scrape aggressively
 * (risks an IP block). Scholar entries are entered MANUALLY into content_items
 * with source_type='scholar' — see docs/SCHOLAR_FALLBACK.md. This function only
 * logs a documented warning so the gap is visible, never hidden.
 *
 * X/Twitter and LinkedIn are intentionally absent (Part 3): paid / not
 * automatable. Do not add them here.
 */

const UA = { "User-Agent": "portfolio-sync" };

async function getJson(url: string): Promise<any> {
  const res = await fetch(url, { headers: UA, next: { revalidate: 0 } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function fromHuggingFace(): Promise<NormalizedItem[]> {
  const user = process.env.HF_USERNAME;
  if (!user) return [];
  const data = await getJson(
    `https://huggingface.co/api/models?author=${encodeURIComponent(user)}&limit=50`,
  );
  return (data as any[]).map((m) => ({
    source_type: "huggingface",
    external_id: `hf:${m.id}`,
    title: m.id,
    description: (m.pipeline_tag as string) ?? null,
    url: `https://huggingface.co/${m.id}`,
    tags: (m.tags as string[]) ?? null,
    published_at: (m.lastModified as string) ?? null,
    raw_payload: { downloads: m.downloads, likes: m.likes },
  }));
}

async function fromPyPI(): Promise<NormalizedItem[]> {
  const packages = (process.env.PYPI_PACKAGES ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const items: NormalizedItem[] = [];
  for (const pkg of packages) {
    const data = await getJson(`https://pypi.org/pypi/${encodeURIComponent(pkg)}/json`);
    items.push({
      source_type: "pypi",
      external_id: `pypi:${pkg}`,
      title: `${data.info.name} ${data.info.version}`,
      description: data.info.summary ?? null,
      url: data.info.package_url ?? `https://pypi.org/project/${pkg}/`,
      tags: data.info.keywords
        ? String(data.info.keywords).split(/[\s,]+/).filter(Boolean)
        : null,
    });
  }
  return items;
}

async function fromNpm(): Promise<NormalizedItem[]> {
  const packages = (process.env.NPM_PACKAGES ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const items: NormalizedItem[] = [];
  for (const pkg of packages) {
    const data = await getJson(`https://registry.npmjs.org/${encodeURIComponent(pkg)}`);
    const latest = data["dist-tags"]?.latest;
    items.push({
      source_type: "npm",
      external_id: `npm:${pkg}`,
      title: `${data.name} ${latest ?? ""}`.trim(),
      description: data.description ?? null,
      url: `https://www.npmjs.com/package/${pkg}`,
      tags: (data.keywords as string[]) ?? null,
      published_at: data.time?.[latest] ?? null,
    });
  }
  return items;
}

async function fromOrcid(): Promise<NormalizedItem[]> {
  const orcid = process.env.ORCID_ID;
  if (!orcid) return [];
  const data = await getJson(`https://pub.orcid.org/v3.0/${orcid}/works`);
  const groups = (data.group as any[]) ?? [];
  return groups.flatMap((g) => {
    const summary = g["work-summary"]?.[0];
    if (!summary) return [];
    const title = summary.title?.title?.value;
    const url =
      summary.url?.value ??
      `https://orcid.org/${orcid}`;
    if (!title) return [];
    return [
      {
        source_type: "orcid" as const,
        external_id: `orcid:${summary["put-code"]}`,
        title,
        description: summary.type ?? null,
        url,
        published_at: summary["publication-date"]?.year?.value ?? null,
      },
    ];
  });
}

export async function syncExternalSources(): Promise<SyncOutcome> {
  const sources: Array<[string, () => Promise<NormalizedItem[]>]> = [
    ["huggingface", fromHuggingFace],
    ["pypi", fromPyPI],
    ["npm", fromNpm],
    ["orcid", fromOrcid],
  ];

  const items: NormalizedItem[] = [];
  const errors: string[] = [];

  for (const [name, fn] of sources) {
    try {
      items.push(...(await fn()));
    } catch (err) {
      errors.push(`${name}: ${err instanceof Error ? err.message : "failed"}`);
    }
  }

  // Documented manual-fallback note for Scholar (never scraped). Informational
  // only — it does not, by itself, mark the job as failed/partial.
  const warnings = [
    ...errors,
    "scholar: no API — add publications manually (see docs/SCHOLAR_FALLBACK.md)",
  ];

  const status: SyncOutcome["status"] =
    errors.length === 0
      ? "success"
      : items.length > 0
        ? "partial"
        : "failed";

  return { status, items, warnings };
}
