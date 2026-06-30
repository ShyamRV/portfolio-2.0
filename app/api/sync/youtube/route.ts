import { NextResponse } from "next/server";
import { runSync } from "@/lib/supabase/sync";
import { syncYouTube } from "@/lib/integrations/youtube";
import { isCronAuthorized } from "@/lib/api-auth";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Vercel Cron (daily) entrypoint. */
export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await runSync("youtube", syncYouTube);
  revalidatePath("/talks");
  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}
