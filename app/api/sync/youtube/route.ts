import { NextResponse } from "next/server";

/** YouTube sync (daily cron) — implemented in MILESTONE 2. */
export async function GET() {
  return NextResponse.json(
    { error: "YouTube sync not implemented yet (Milestone 2)." },
    { status: 501 },
  );
}
