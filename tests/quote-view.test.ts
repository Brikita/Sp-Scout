import assert from "node:assert/strict";
import test from "node:test";
import { bestVerifiedQuote, executionQuotes } from "../lib/quote-view.ts";
import type { SourcingExecution } from "../lib/calle/contracts.ts";

function execution(result: Record<string, unknown> | null, status = "completed"): SourcingExecution {
  return { mode: "live", callId: "test", status: "completed", taskCompleted: null, completionConfidence: null,
    summary: null, evidence: [], createdAt: "2026-09-11T10:00:00Z", completedAt: null,
    quotes: [{ supplierId: "supplier", supplierName: "Test supplier", status, result, summary: null, evidence: [] }] };
}
const valid = { part_found: true, compatibility: "confirmed", price_amount: 500, available_quantity: 1, condition: "used", evidence: ["OEM reference read back."] };

test("failed calls never become free verified offers", () => {
  const quotes = executionQuotes(execution(null, "failed"), []);
  assert.equal(quotes[0].price, null);
  assert.equal(quotes[0].status, "Unavailable");
  assert.equal(quotes[0].selectable, false);
  assert.equal(bestVerifiedQuote(quotes), undefined);
});

test("ranking excludes rejected fitment, missing prices, zero stock, and absent evidence", () => {
  for (const change of [{ compatibility: "rejected" }, { compatibility: "unknown" }, { price_amount: null }, { price_amount: 0 }, { available_quantity: null }, { available_quantity: 0 }, { evidence: [] }, { part_found: false }]) {
    assert.equal(bestVerifiedQuote(executionQuotes(execution({ ...valid, ...change }), [])), undefined);
  }
  const quotes = executionQuotes(execution(valid), []);
  assert.equal(bestVerifiedQuote(quotes)?.price, 500);
  assert.equal(quotes[0].condition, "used");
});
