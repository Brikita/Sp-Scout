import { verifyApproval } from "../../../../lib/calle/approval";
import { executeSourcingPlan } from "../../../../lib/calle/server";
import { saveCallApproval, saveCallExecution } from "../../../../db/sourcing";
import { getApprovalSecret, getCalleRuntimeConfig } from "../runtime";
import { getOptionalD1 } from "../../../../db";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { approvalToken?: unknown; approved?: unknown };
    if (body.approved !== true) {
      return Response.json({ error: "Explicit call approval is required." }, { status: 409 });
    }
    if (typeof body.approvalToken !== "string") {
      return Response.json({ error: "A valid approval token is required." }, { status: 400 });
    }

    const config = getCalleRuntimeConfig();
    const plan = await verifyApproval(body.approvalToken, getApprovalSecret(config.mode));
    const database = getOptionalD1();
    if (!database && plan.request.executionMode === "live") {
      return Response.json({ error: "Live calling requires private persistent storage." }, { status: 503 });
    }
    if (database) await saveCallApproval(plan, body.approvalToken, database);
    const execution = await executeSourcingPlan(plan, body.approvalToken, config);
    if (database) await saveCallExecution(plan, body.approvalToken, execution, database);
    return Response.json(
      {
        execution,
        requestId: plan.id,
        historyUrl: database ? `/api/sourcing/requests/${plan.id}` : undefined,
      },
      { status: 202 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start the supplier calls.";
    return Response.json({ error: message }, { status: 400 });
  }
}
