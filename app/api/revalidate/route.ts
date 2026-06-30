import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isCronAuthorized } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

/**
 * On-demand revalidation target (Milestone 2). Called by the GitHub webhook or
 * manually to refresh static pages without a full redeploy. Secret-protected.
 *
 * Body (optional): { "paths": ["/work", "/"] }. Defaults to the home + work.
 */
export async function POST(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let paths: string[] = ["/", "/work"];
  try {
    const body = (await request.json()) as { paths?: unknown };
    if (Array.isArray(body.paths)) {
      paths = body.paths.filter((p): p is string => typeof p === "string");
    }
  } catch {
    // no/invalid body → use defaults
  }

  for (const p of paths) revalidatePath(p);
  return NextResponse.json({ revalidated: true, paths });
}
