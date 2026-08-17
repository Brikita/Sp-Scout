import { getLiveCallContext, saveCallExecutionUpdate } from "../../../../../../db/sourcing";
import { getSourcingExecution } from "../../../../../../lib/calle/server";
import { getCalleRuntimeConfig } from "../../../runtime";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CALL_ID_PATTERN = /^[A-Za-z0-9_-]{3,160}$/;

export async function GET(
  _request: Request,
  context: { params: Promise<{ requestId: string; callId: string }> },
) {
  try {
    const { requestId, callId } = await context.params;
    if (!UUID_PATTERN.test(requestId) || !CALL_ID_PATTERN.test(callId)) {
      return Response.json({ error: "A valid sourcing request and call id are required." }, { status: 400 });
    }

    const run = await getLiveCallContext(requestId, callId);
    if (!run) {
      return Response.json({ error: "Live call run not found." }, { status: 404 });
    }

    const execution = await getSourcingExecution(callId, run.suppliers, getCalleRuntimeConfig());
    await saveCallExecutionUpdate(requestId, execution);
    return Response.json({ execution, requestId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to refresh the call run.";
    return Response.json({ error: message }, { status: 400 });
  }
}
