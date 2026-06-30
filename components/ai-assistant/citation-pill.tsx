import { ExternalLink } from "lucide-react";

function label(url: string): string {
  if (url.startsWith("/")) return url;
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "") + u.pathname.replace(/\/$/, "");
  } catch {
    return url;
  }
}

/**
 * Visible citation so a visitor can see exactly which source backs a claim
 * (Milestone 3 scope). Internal links (e.g. /work/slug) render as in-app links.
 */
export function CitationPill({ url }: { url: string }) {
  const isInternal = url.startsWith("/");
  return (
    <a
      href={url}
      target={isInternal ? undefined : "_blank"}
      rel={isInternal ? undefined : "noreferrer noopener"}
      className="inline-flex max-w-full items-center gap-1 truncate rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:border-accent/60 hover:text-foreground"
    >
      <ExternalLink className="size-3 shrink-0" />
      <span className="truncate">{label(url)}</span>
    </a>
  );
}
