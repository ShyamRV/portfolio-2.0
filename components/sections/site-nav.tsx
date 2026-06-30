import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const links = [
  { href: "/work", label: "Work" },
  { href: "/research", label: "Research" },
  { href: "/writing", label: "Writing" },
  { href: "/talks", label: "Talks" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteNav({ name }: { name: string }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <nav className="container flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          {name}
        </Link>
        <div className="flex items-center gap-4">
          <ul className="hidden gap-6 text-sm text-muted-foreground sm:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={{ pathname: l.href }}
                  className="transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
