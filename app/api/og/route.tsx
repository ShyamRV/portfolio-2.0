import { ImageResponse } from "next/og";

export const runtime = "edge";

/**
 * Dynamic Open Graph image. Fully refined in Milestone 4 (per-route OG).
 * Uses the built-in next/og renderer — no external image service, zero-cost.
 */
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title")?.slice(0, 120) ?? "Shyamji Pandey";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0a0a",
          color: "#fafafa",
          fontSize: 64,
          fontWeight: 600,
        }}
      >
        <div style={{ color: "#3b82f6", fontSize: 28, letterSpacing: 4 }}>
          PORTFOLIO
        </div>
        <div style={{ marginTop: 16 }}>{title}</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
