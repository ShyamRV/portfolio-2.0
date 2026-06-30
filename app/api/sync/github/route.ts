import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { runSync } from "@/lib/supabase/sync";
import { syncGitHub } from "@/lib/integrations/github";
import { isCronAuthorized } from "@/lib/api-auth";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function run() {
  const result = await runSync("github", syncGitHub);
  // Reflect new content on the site without a manual deploy.
  revalidatePath("/work");
  revalidatePath("/");
  return result;
}

/** Vercel Cron (6h) entrypoint. */
export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await run();
  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}

/** GitHub webhook (push / release). Verifies the HMAC signature if configured. */
export async function POST(request: Request) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  const body = await request.text();

  if (secret) {
    const sig = request.headers.get("x-hub-signature-256") ?? "";
    const expected =
      "sha256=" + createHmac("sha256", secret).update(body).digest("hex");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return NextResponse.json({ error: "Bad signature" }, { status: 401 });
    }
  } else if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await run();
  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}
