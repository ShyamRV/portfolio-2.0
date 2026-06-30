/**
 * Renders a JSON-LD <script>. Data must be real (Part 1, rule 1) — callers pass
 * values sourced from the profile/projects tables, never invented.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function personSchema(opts: {
  name: string;
  url: string;
  description?: string | null;
  sameAs?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: opts.name,
    url: opts.url,
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.sameAs?.length ? { sameAs: opts.sameAs } : {}),
  };
}

export function softwareApplicationSchema(opts: {
  name: string;
  description?: string | null;
  url?: string | null;
  codeRepository?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.url ? { url: opts.url } : {}),
    ...(opts.codeRepository ? { codeRepository: opts.codeRepository } : {}),
  };
}
