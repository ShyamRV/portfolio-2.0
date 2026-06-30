import { cn } from "@/lib/utils";

/**
 * Renders an unmistakable "PLACEHOLDER" banner. Used everywhere real content
 * is not yet available (Part 1, rule 1 / Part 2 [NEEDS INPUT]). NEVER replace
 * these with invented specifics — they must be filled from real source data.
 */
export function PlaceholderNotice({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-md border border-dashed border-accent/60 bg-accent/5 px-4 py-3 text-sm text-muted-foreground",
        className,
      )}
    >
      <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
        Placeholder
      </span>
      <span className="ml-2">{label}</span>
    </div>
  );
}
