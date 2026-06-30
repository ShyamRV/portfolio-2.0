import type { Metadata } from "next";
import { PlaceholderNotice } from "@/components/sections/placeholder";

export const metadata: Metadata = { title: "Post" };

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="container space-y-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">
        Post: <span className="font-mono text-accent">{slug}</span>
      </h1>
      <PlaceholderNotice label="MDX post body rendered here in Milestone 1/2." />
    </div>
  );
}
