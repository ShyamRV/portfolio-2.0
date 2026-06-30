import { NextResponse } from "next/server";

/** RSS sync — Dev.to/Hashnode/Medium (12h cron) — implemented in MILESTONE 2. */
export async function GET() {
  return NextResponse.json(
    { error: "RSS sync not implemented yet (Milestone 2)." },
    { status: 501 },
  );
}
