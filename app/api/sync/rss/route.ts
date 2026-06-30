import { NextResponse } from "next/server";
import { runSync } from "@/lib/supabase/sync";
import { syncRss } from "@/lib/integrations/rss";
import { isCronAuthorized } from "@/lib/api-auth";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Vercel Cron (12h) entrypoint. */
export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await runSync("rss", syncRss);
  revalidatePath("/writing");
  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}
