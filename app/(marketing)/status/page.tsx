import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { getRecentSyncLogs } from "@/lib/supabase/queries";

export const metadata: Metadata = { title: "Sync status" };
export const dynamic = "force-dynamic";

const statusVariant: Record<string, "accent" | "outline" | "default"> = {
  success: "accent",
  partial: "outline",
  failed: "default",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export default async function StatusPage() {
  const logs = await getRecentSyncLogs(30);

  return (
    <div className="container max-w-3xl space-y-6 py-20">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Sync status</h1>
        <p className="text-muted-foreground">
          Honest view of what&apos;s automated, stale, or broken. Each row is a
          real <code className="font-mono text-sm">sync_logs</code> entry —
          including partial failures, surfaced not hidden.
        </p>
      </header>

      {logs.length === 0 ? (
        <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
          No sync logs yet. Once Supabase is connected and a sync (or the
          keepalive) runs, entries appear here.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {logs.map((log, i) => (
            <li
              key={`${log.source_type}-${log.started_at}-${i}`}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-mono text-sm">{log.source_type}</p>
                {log.error_message ? (
                  <p className="truncate text-xs text-destructive">
                    {log.error_message}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {log.items_synced ?? 0} items
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {timeAgo(log.started_at)}
                </span>
                <Badge variant={statusVariant[log.status ?? "failed"] ?? "default"}>
                  {log.status ?? "unknown"}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
