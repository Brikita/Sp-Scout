import { CalleClient } from "@call-e/calle";
import { approvalFingerprint } from "./approval.ts";
import { normalizeCall, type SourcingCallPlan, type SourcingExecution } from "./contracts.ts";
import { executeFixture } from "./fixtures.ts";

export type CalleRuntimeConfig = {
  mode: "fixture" | "live";
  apiKey?: string;
  baseUrl?: string;
  webhookUrl?: string;
  fetch?: (request: Request) => Promise<Response>;
};

export async function executeSourcingPlan(
  plan: SourcingCallPlan,
  approvalToken: string,
  config: CalleRuntimeConfig,
): Promise<SourcingExecution> {
  if (config.mode === "fixture") return executeFixture(plan);
  if (!config.apiKey) throw new Error("Live calling is unavailable because CALLE_API_KEY is not configured.");

  const client = new CalleClient({
    apiKey: config.apiKey,
    baseUrl: config.baseUrl ?? "https://api.heycall-e.com",
    fetch: config.fetch,
  });
  const idempotencyKey = `sparescout_${await approvalFingerprint(approvalToken)}`;
  const call = await client.calls.create(
    {
      task: plan.task,
      recipients: plan.request.suppliers.map((supplier) => ({
        phones: [supplier.phone],
        region: plan.request.countryCode,
        locale: plan.request.locale,
      })),
      resultSchema: plan.aggregateResultSchema,
      recipientResultSchema: plan.recipientResultSchema,
      metadata: { sparescout_plan_id: plan.id },
      webhookUrl: config.webhookUrl,
    },
    { idempotencyKey },
  );
  return normalizeCall(call, plan.request.suppliers);
}

export async function getSourcingExecution(
  callId: string,
  suppliers: SourcingCallPlan["request"]["suppliers"],
  config: CalleRuntimeConfig,
): Promise<SourcingExecution> {
  if (config.mode !== "live" || !config.apiKey) {
    throw new Error("Only live CALL-E runs can be polled.");
  }
  const client = new CalleClient({
    apiKey: config.apiKey,
    baseUrl: config.baseUrl ?? "https://api.heycall-e.com",
    fetch: config.fetch,
  });
  return normalizeCall(await client.calls.get(callId), suppliers);
}
