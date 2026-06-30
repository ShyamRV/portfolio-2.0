import { NextResponse } from "next/server";

/**
 * External sources — HF / PyPI / npm / ORCID (weekly), plus best-effort
 * Google Scholar with documented manual fallback — implemented in MILESTONE 2.
 */
export async function GET() {
  return NextResponse.json(
    { error: "External sources sync not implemented yet (Milestone 2)." },
    { status: 501 },
  );
}
