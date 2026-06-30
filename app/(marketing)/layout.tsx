import Link from "next/link";
import { SiteNav } from "@/components/sections/site-nav";
import { getProfile } from "@/lib/supabase/queries";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: profile } = await getProfile();

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav name={profile.full_name} />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/60 py-8">
        <div className="container flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {profile.full_name}. Built zero-cost.
          </p>
          <Link
            href="/status"
            className="font-mono text-xs hover:text-foreground"
          >
            sync status →
          </Link>
        </div>
      </footer>
    </div>
  );
}
