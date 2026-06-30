import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import type { ContentItem } from "@/lib/content/types";

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ContentList({
  items,
  emptyLabel,
}: {
  items: ContentItem[];
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item, i) => {
        const date = formatDate(item.published_at);
        return (
          <li key={item.id}>
            <Reveal delay={i * 40}>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-start justify-between gap-4 rounded-lg border border-border p-4 transition-colors hover:border-accent/60"
              >
                <div className="min-w-0 space-y-1">
                  <p className="font-medium leading-snug group-hover:text-accent">
                    {item.title}
                  </p>
                  {item.description ? (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Badge variant="outline" className="capitalize">
                      {item.source_type}
                    </Badge>
                    {date ? (
                      <span className="text-xs text-muted-foreground">{date}</span>
                    ) : null}
                  </div>
                </div>
              </a>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}
