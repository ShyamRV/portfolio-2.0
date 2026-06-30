import { NextResponse } from "next/server";
import { runSync } from "@/lib/supabase/sync";
import { syncExternalSources } from "@/lib/integrations/external-sources";
import { isCronAuthorized } from "@/lib/api-auth";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Vercel Cron (weekly) entrypoint. Per-source try/catch lives in the lib. */
export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await runSync("external", syncExternalSources);
  revalidatePath("/research");
  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}
