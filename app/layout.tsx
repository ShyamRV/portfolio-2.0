import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import { ExperienceProvider } from "@/features/experience/experience-provider";
import { SmoothScroll } from "@/features/experience/smooth-scroll";
import { SoundProvider } from "@/features/hud/sound-provider";
import { CustomCursor } from "@/features/hud/custom-cursor";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shyamji Pandey — Agentic AI Engineer",
    template: "%s · Shyamji Pandey",
  },
  description:
    "Shyamji Pandey — Agentic AI Engineer & Developer Advocate @ Fetch.ai, CV & ML researcher. Autonomous multi-agent systems, computer vision, and LLM orchestration.",
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Shyamji Pandey — Agentic AI Engineer",
    images: [{ url: "/api/og?title=Shyamji+Pandey" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ExperienceProvider>
            <SoundProvider>
              <PostHogProvider>
                <SmoothScroll>{children}</SmoothScroll>
              </PostHogProvider>
              <CustomCursor />
            </SoundProvider>
          </ExperienceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
