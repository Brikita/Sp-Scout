import { getPilotMetrics } from "../../../../db/pilot";

export async function GET() {
  try {
    return Response.json(
      { metrics: await getPilotMetrics() },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Pilot metrics are unavailable.";
    return Response.json({ error: message }, { status: 500 });
  }
}
