import assert from "node:assert/strict";
import test from "node:test";
import { signApproval, verifyApproval } from "../lib/calle/approval.ts";
import {
  buildCallTask,
  createSourcingCallPlan,
  parseSourcingRequest,
  type SourcingRequest,
} from "../lib/calle/contracts.ts";
import { executeFixture } from "../lib/calle/fixtures.ts";
import { executeSourcingPlan } from "../lib/calle/server.ts";

const request: SourcingRequest = {
  executionMode: "fixture",
  vehicle: "2014 Toyota Fielder",
  part: "front-left wheel bearing",
  fitmentReference: "NKE165-705K9",
  budgetAmount: 8000,
  currency: "KES",
  deliveryLocation: "Nairobi CBD",
  neededBy: "today",
  countryCode: "KE",
  locale: "en-KE",
  suppliers: [
    { id: "supplier-1", name: "Example Auto One", phone: "+254700000001" },
    { id: "supplier-2", name: "Example Auto Two", phone: "+254700000002" },
  ],
};

test("validates global sourcing inputs and E.164 suppliers", () => {
  assert.deepEqual(parseSourcingRequest(request), request);
  assert.throws(
    () => parseSourcingRequest({ ...request, suppliers: [{ ...request.suppliers[0], phone: "0700000001" }] }),
    /E\.164/,
  );
  assert.throws(
    () => parseSourcingRequest({ ...request, suppliers: [request.suppliers[0], request.suppliers[0]] }),
    /unique/,
  );
});

test("builds a disclosed, information-only call task", () => {
  const task = buildCallTask(request);
  assert.match(task, /disclose that you are an AI assistant/i);
  assert.match(task, /do not reserve, order, purchase, pay for, or commit/i);
  assert.match(task, /Do not accept a substitute part/i);
  assert.match(task, /KES 8000/);
});

test("requires an untampered, unexpired approval", async () => {
  const now = new Date("2026-08-17T08:00:00.000Z");
  const plan = createSourcingCallPlan(request, now);
  const secret = "a-long-test-secret-for-sparescout";
  const token = await signApproval(plan, secret);
  assert.equal((await verifyApproval(token, secret, now)).id, plan.id);
  await assert.rejects(() => verifyApproval(`${token}x`, secret, now), /invalid/);
  await assert.rejects(
    () => verifyApproval(token, secret, new Date("2026-08-17T08:16:00.000Z")),
    /expired/,
  );
});

test("returns deterministic structured fixture quotes without a call", () => {
  const execution = executeFixture(createSourcingCallPlan(request));
  assert.equal(execution.mode, "fixture");
  assert.equal(execution.status, "completed");
  assert.equal(execution.quotes.length, 2);
  assert.equal(execution.quotes[0].result?.currency, "KES");
  assert.match(String(execution.quotes[0].evidence[0]), /NKE165-705K9/);
});

test("uses the official SDK with schemas and an idempotency key in live mode", async () => {
  let outbound: Request | undefined;
  const livePlan = createSourcingCallPlan({ ...request, executionMode: "live" });
  const execution = await executeSourcingPlan(livePlan, "approved-plan-token", {
    mode: "live",
    apiKey: "calle_test_key",
    fetch: async (candidate) => {
      outbound = candidate;
      return Response.json(
        {
          id: "call_test_123",
          object: "call_task",
          status: "queued",
          task: livePlan.task,
          recipients: request.suppliers.map((supplier, index) => ({
            id: `recipient_${index + 1}`,
            phones: [supplier.phone],
            locale: request.locale,
            region: request.countryCode,
            status: "pending",
            structured_result: null,
            summary: null,
            attempts: [],
          })),
          structured_result: null,
          summary: null,
          task_completed: null,
          completion_confidence: null,
          evidence: [],
          metadata: { sparescout_plan_id: livePlan.id },
          failure_code: null,
          failure_message: null,
          created_at: "2026-08-17T08:00:00.000Z",
          completed_at: null,
        },
        { status: 201 },
      );
    },
  });

  assert.equal(execution.mode, "live");
  assert.equal(execution.callId, "call_test_123");
  assert.ok(outbound);
  assert.equal(outbound.headers.get("authorization"), "Bearer calle_test_key");
  assert.match(outbound.headers.get("idempotency-key") ?? "", /^sparescout_/);

  const body = await outbound.clone().json() as Record<string, unknown>;
  assert.equal((body.recipients as unknown[]).length, 2);
  assert.ok(body.result_schema);
  assert.ok(body.recipient_result_schema);
});
