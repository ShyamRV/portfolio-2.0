import { NextResponse } from "next/server";

/**
 * On-demand revalidation target for the GitHub webhook (Milestone 2).
 * Will verify a shared secret and call revalidatePath/revalidateTag.
 */
export async function POST() {
  return NextResponse.json(
    { error: "Revalidation not implemented yet (Milestone 2)." },
    { status: 501 },
  );
}
