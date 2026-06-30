import { SiteNav } from "@/components/sections/site-nav";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/60 py-8">
        <div className="container flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} [Your Name]. Built zero-cost.</p>
          {/* Sync status surfaced here in Milestone 2 (last_synced_at / sync_status). */}
          <p className="font-mono text-xs">sync status · wired in Milestone 2</p>
        </div>
      </footer>
    </div>
  );
}
