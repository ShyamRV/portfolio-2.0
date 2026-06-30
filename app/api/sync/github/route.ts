import { NextResponse } from "next/server";

/** GitHub sync (webhook + 6h cron) — implemented in MILESTONE 2. */
export async function POST() {
  return NextResponse.json(
    { error: "GitHub sync not implemented yet (Milestone 2)." },
    { status: 501 },
  );
}

export async function GET() {
  return NextResponse.json(
    { error: "GitHub sync not implemented yet (Milestone 2)." },
    { status: 501 },
  );
}
