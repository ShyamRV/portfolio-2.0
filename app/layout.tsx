import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PostHogProvider } from "@/components/analytics/posthog-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export const metadata: Metadata = {
  // [NEEDS INPUT] real name/handle/domain — placeholder until provided (Part 2).
  metadataBase: new URL(siteUrl),
  title: {
    default: "Portfolio — [Your Name]",
    template: "%s · [Your Name]",
  },
  description:
    "Personal portfolio — placeholder copy pending real resume data (Part 2).",
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Portfolio — [Your Name]",
    images: [{ url: "/api/og" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PostHogProvider>{children}</PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
