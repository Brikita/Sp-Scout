import { getD1 } from "./index";
import { ensureSourcingStorage } from "./init";
import { approvalFingerprint } from "../lib/calle/approval";
import { maskPhone, type SourcingCallPlan, type SourcingExecution } from "../lib/calle/contracts";

export async function savePlannedRequest(plan: SourcingCallPlan, db = getD1()): Promise<void> {
  await ensureSourcingStorage(db);
  const request = plan.request;
  const statements = [
    db.prepare(
      `INSERT INTO sourcing_requests (
        id, status, execution_mode, vehicle, part, fitment_reference, budget_amount,
        currency, delivery_location, needed_by, country_code, locale, created_at, expires_at, updated_at
      ) VALUES (?, 'awaiting_approval', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO NOTHING`,
    ).bind(
      plan.id,
      request.executionMode,
      request.vehicle,
      request.part,
      request.fitmentReference,
      request.budgetAmount,
      request.currency,
      request.deliveryLocation,
      request.neededBy,
      request.countryCode,
      request.locale,
      plan.createdAt,
      plan.expiresAt,
      plan.createdAt,
    ),
    ...request.suppliers.map((supplier) =>
      db.prepare(
        `INSERT INTO request_suppliers (
          request_id, supplier_id, name, phone_e164, phone_masked, area, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(request_id, supplier_id) DO NOTHING`,
      ).bind(
        plan.id,
        supplier.id,
        supplier.name,
        supplier.phone,
        maskPhone(supplier.phone),
        supplier.area ?? null,
        plan.createdAt,
      ),
    ),
  ];
  await db.batch(statements);
}

export async function saveCallApproval(
  plan: SourcingCallPlan,
  approvalToken: string,
  db = getD1(),
): Promise<void> {
  await ensureSourcingStorage(db);
  const fingerprint = await approvalFingerprint(approvalToken);
  const approvedAt = new Date().toISOString();
  await db.batch([
    db.prepare(
      `INSERT INTO call_approvals (id, request_id, plan_fingerprint, approved_at, consumed_at)
       VALUES (?, ?, ?, ?, NULL)
       ON CONFLICT(plan_fingerprint) DO NOTHING`,
    ).bind(crypto.randomUUID(), plan.id, fingerprint, approvedAt),
    db.prepare("UPDATE sourcing_requests SET status = 'approved', updated_at = ? WHERE id = ?").bind(
      approvedAt,
      plan.id,
    ),
  ]);
}

export async function saveCallExecution(
  plan: SourcingCallPlan,
  approvalToken: string,
  execution: SourcingExecution,
  db = getD1(),
): Promise<void> {
  await ensureSourcingStorage(db);
  const fingerprint = await approvalFingerprint(approvalToken);
  const now = new Date().toISOString();
  const runId = `${plan.id}:${execution.callId}`;
  const statements = [
    db.prepare(
      "UPDATE call_approvals SET consumed_at = ? WHERE request_id = ? AND plan_fingerprint = ?",
    ).bind(now, plan.id, fingerprint),
    db.prepare(
      `INSERT INTO call_runs (
        id, request_id, provider_call_id, mode, status, task_completed, confidence_score,
        confidence_label, summary, evidence_json, created_at, completed_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(provider_call_id) DO UPDATE SET
        status = excluded.status,
        task_completed = excluded.task_completed,
        confidence_score = excluded.confidence_score,
        confidence_label = excluded.confidence_label,
        summary = excluded.summary,
        evidence_json = excluded.evidence_json,
        completed_at = excluded.completed_at,
        updated_at = excluded.updated_at`,
    ).bind(
      runId,
      plan.id,
      execution.callId,
      execution.mode,
      execution.status,
      execution.taskCompleted === null ? null : Number(execution.taskCompleted),
      execution.completionConfidence?.score ?? null,
      execution.completionConfidence?.label ?? null,
      execution.summary,
      JSON.stringify(execution.evidence),
      execution.createdAt,
      execution.completedAt,
      now,
    ),
    ...execution.quotes.map((quote) =>
      db.prepare(
        `INSERT INTO supplier_quotes (
          id, request_id, call_run_id, supplier_id, supplier_name, status,
          result_json, summary, evidence_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(call_run_id, supplier_id) DO UPDATE SET
          status = excluded.status,
          result_json = excluded.result_json,
          summary = excluded.summary,
          evidence_json = excluded.evidence_json`,
      ).bind(
        `${runId}:${quote.supplierId}`,
        plan.id,
        runId,
        quote.supplierId,
        quote.supplierName,
        quote.status,
        quote.result ? JSON.stringify(quote.result) : null,
        quote.summary,
        JSON.stringify(quote.evidence),
        now,
      ),
    ),
    db.prepare("UPDATE sourcing_requests SET status = ?, updated_at = ? WHERE id = ?").bind(
      execution.status === "completed" ? "quotes_ready" : "calls_in_progress",
      now,
      plan.id,
    ),
  ];
  await db.batch(statements);
}

type RequestRow = {
  id: string;
  status: string;
  execution_mode: string;
  vehicle: string;
  part: string;
  fitment_reference: string;
  budget_amount: number;
  currency: string;
  delivery_location: string;
  needed_by: string;
  country_code: string;
  locale: string;
  created_at: string;
  updated_at: string;
};

type SupplierRow = {
  supplier_id: string;
  name: string;
  phone_masked: string;
  area: string | null;
};

type RunRow = {
  id: string;
  provider_call_id: string;
  mode: string;
  status: string;
  task_completed: number | null;
  confidence_score: number | null;
  confidence_label: string | null;
  summary: string | null;
  evidence_json: string;
  created_at: string;
  completed_at: string | null;
};

type QuoteRow = {
  call_run_id: string;
  supplier_id: string;
  supplier_name: string;
  status: string;
  result_json: string | null;
  summary: string | null;
  evidence_json: string;
  created_at: string;
};

function parseJson(value: string | null): unknown {
  if (value === null) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function getSourcingRequestHistory(requestId: string, db = getD1()) {
  await ensureSourcingStorage(db);
  const request = await db.prepare(
    `SELECT id, status, execution_mode, vehicle, part, fitment_reference, budget_amount,
      currency, delivery_location, needed_by, country_code, locale, created_at, updated_at
     FROM sourcing_requests WHERE id = ?`,
  ).bind(requestId).first<RequestRow>();
  if (!request) return null;

  const [{ results: suppliers }, { results: runs }, { results: quotes }] = await Promise.all([
    db.prepare(
      `SELECT supplier_id, name, phone_masked, area
       FROM request_suppliers WHERE request_id = ? ORDER BY created_at, supplier_id`,
    ).bind(requestId).all<SupplierRow>(),
    db.prepare(
      `SELECT id, provider_call_id, mode, status, task_completed, confidence_score,
        confidence_label, summary, evidence_json, created_at, completed_at
       FROM call_runs WHERE request_id = ? ORDER BY created_at DESC`,
    ).bind(requestId).all<RunRow>(),
    db.prepare(
      `SELECT call_run_id, supplier_id, supplier_name, status, result_json, summary,
        evidence_json, created_at
       FROM supplier_quotes WHERE request_id = ? ORDER BY created_at, supplier_id`,
    ).bind(requestId).all<QuoteRow>(),
  ]);

  return {
    id: request.id,
    status: request.status,
    executionMode: request.execution_mode,
    vehicle: request.vehicle,
    part: request.part,
    fitmentReference: request.fitment_reference,
    budgetAmount: request.budget_amount,
    currency: request.currency,
    deliveryLocation: request.delivery_location,
    neededBy: request.needed_by,
    countryCode: request.country_code,
    locale: request.locale,
    createdAt: request.created_at,
    updatedAt: request.updated_at,
    suppliers: suppliers.map((supplier) => ({
      id: supplier.supplier_id,
      name: supplier.name,
      phone: supplier.phone_masked,
      area: supplier.area,
    })),
    runs: runs.map((run) => ({
      id: run.provider_call_id,
      mode: run.mode,
      status: run.status,
      taskCompleted: run.task_completed === null ? null : Boolean(run.task_completed),
      completionConfidence: run.confidence_score === null
        ? null
        : { score: run.confidence_score, label: run.confidence_label },
      summary: run.summary,
      evidence: parseJson(run.evidence_json),
      createdAt: run.created_at,
      completedAt: run.completed_at,
      quotes: quotes
        .filter((quote) => quote.call_run_id === run.id)
        .map((quote) => ({
          supplierId: quote.supplier_id,
          supplierName: quote.supplier_name,
          status: quote.status,
          result: parseJson(quote.result_json),
          summary: quote.summary,
          evidence: parseJson(quote.evidence_json),
          createdAt: quote.created_at,
        })),
    })),
  };
}
