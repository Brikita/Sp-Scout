import { signApproval } from "../../../../lib/calle/approval";
import { createSourcingCallPlan, maskPhone, parseSourcingRequest } from "../../../../lib/calle/contracts";
import { savePlannedRequest } from "../../../../db/sourcing";
import { createHistoryAccessCredential } from "../../../../lib/history-access";
import { getApprovalSecret, getCalleRuntimeConfig } from "../runtime";

export async function POST(request: Request) {
  try {
    const input = parseSourcingRequest(await request.json());
    const plan = createSourcingCallPlan(input);
    const config = getCalleRuntimeConfig();
    const approvalToken = await signApproval(plan, getApprovalSecret(config.mode));
    const historyAccess = await createHistoryAccessCredential();
    await savePlannedRequest(plan, historyAccess.hash);

    return Response.json({
      mode: plan.request.executionMode === "fixture" ? "fixture" : config.mode,
      plan: {
        id: plan.id,
        createdAt: plan.createdAt,
        expiresAt: plan.expiresAt,
        task: plan.task,
        request: {
          ...plan.request,
          suppliers: plan.request.suppliers.map((supplier) => ({
            id: supplier.id,
            name: supplier.name,
            area: supplier.area,
            phone: maskPhone(supplier.phone),
          })),
        },
      },
      approvalToken,
      historyAccess: { requestId: plan.id, token: historyAccess.token },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create the call plan.";
    return Response.json({ error: message }, { status: 400 });
  }
}
