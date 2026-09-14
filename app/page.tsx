"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { isTerminalExecution, type SourcingExecution, type SourcingRequest } from "../lib/calle/contracts.ts";
import { getSupportedMarket, SUPPORTED_MARKETS, type SupportedMarket } from "../lib/markets.ts";
import { rememberHistoryAccess } from "../lib/history-store.ts";
import { GuidedRequest } from "./components/guided-request";
import { QuoteComparison } from "./components/quote-comparison";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "./components/site-chrome";

import { executionQuotes, bestVerifiedQuote } from "../lib/quote-view.ts";

type Stage = "request" | "plan" | "calling" | "results";

type UiSupplier = { id: string; name: string; area: string; phone: string; fixturePhone: string };
type SupplierDraft = { id: string; name: string; area: string; phone: string };

const supplierTemplates = [
  { id: "independent-dealer", name: "Independent Parts Dealer", area: "Local specialist" },
  { id: "city-spares", name: "City Spares Centre", area: "Multi-brand stockist" },
  { id: "regional-distributor", name: "Regional Parts Distributor", area: "Delivery network" },
] as const;

function suppliersForMarket(market: SupportedMarket): UiSupplier[] {
  return supplierTemplates.map((supplier, index) => ({
    ...supplier,
    fixturePhone: market.fixturePhones[index],
    phone: market.fixturePhones[index].replace(/\d(?=\d{3})/g, "•"),
  }));
}

function maskPhoneForDisplay(phone: string): string {
  return phone.replace(/\d(?=\d{3})/g, "•");
}

const callActivity = [
  "Call plan approved — preparing three supplier calls",
  "Sample supplier 1 — checking the fitment reference",
  "Sample supplier 2 — preparing a comparison quote",
  "Sample supplier 3 — showing incomplete fitment evidence",
  "Three conversations normalized into comparable offers",
];

const liveCallActivity = [
  "Approved plan submitted once with a stable idempotency key",
  "CALL-E accepted the supplier batch",
  "Refreshing the existing run without redialing",
  "Terminal supplier results will be normalized and stored",
];

const formatMoney = (value: number, currency = "KES", locale = "en-KE") =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export default function Home() {
  const [draftKey, setDraftKey] = useState(0);
  const [reviewedRequest, setReviewedRequest] = useState<SourcingRequest | null>(null);
  const [stage, setStage] = useState<Stage>("request");
  const [activeActivity, setActiveActivity] = useState(0);
  const [approvalToken, setApprovalToken] = useState<string | null>(null);
  const [historyAccessToken, setHistoryAccessToken] = useState<string | null>(null);
  const [execution, setExecution] = useState<SourcingExecution | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionMode, setExecutionMode] = useState<"fixture" | "live">("fixture");
  const [operatorToken, setOperatorToken] = useState("");
  const [recipientConsentConfirmed, setRecipientConsentConfirmed] = useState(false);
  const [callWindowStart, setCallWindowStart] = useState("");
  const [callWindowEnd, setCallWindowEnd] = useState("");
  const authorizedCallWindow = callWindowStart && callWindowEnd
    ? `${new Date(callWindowStart).toISOString()}/${new Date(callWindowEnd).toISOString()}` : "";
  const [liveAvailable, setLiveAvailable] = useState(false);
  const [liveSuppliers, setLiveSuppliers] = useState<SupplierDraft[]>([
    { id: "live-supplier-1", name: "", area: "", phone: "" },
  ]);
  const [form, setForm] = useState({
    vehicle: "2014 Toyota Fielder",
    part: "Front-left wheel bearing",
    chassis: "NKE165-705K9",
    budget: "8000",
    location: "Nairobi CBD",
    timing: "Today",
    countryCode: "KE",
    locale: "en-KE",
  });

  const market = useMemo(() => getSupportedMarket(form.countryCode) ?? SUPPORTED_MARKETS[0], [form.countryCode]);
  const fixtureSuppliers = useMemo(() => suppliersForMarket(market), [market]);
  const activeSuppliers = useMemo<UiSupplier[]>(() => executionMode === "fixture"
    ? fixtureSuppliers
    : liveSuppliers.map((supplier) => ({
        ...supplier,
        fixturePhone: supplier.phone,
        phone: maskPhoneForDisplay(supplier.phone),
      })), [executionMode, fixtureSuppliers, liveSuppliers]);
  const displayQuotes = useMemo(() => execution ? executionQuotes(execution, reviewedRequest?.suppliers ?? activeSuppliers) : [], [execution, activeSuppliers, reviewedRequest]);
  const bestVerified = useMemo(
    () => bestVerifiedQuote(displayQuotes),
    [displayQuotes],
  );
  const displayedActivity = execution?.mode === "live" ? liveCallActivity : callActivity;

  useEffect(() => {
    if (stage !== "request") {
      document.getElementById(stage === "results" ? "results-title" : "call-review")?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, [stage]);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  useEffect(() => {
    let active = true;
    fetch("/api/calls/capabilities", { cache: "no-store" })
      .then(async (response) => {
        const capabilities = await response.json() as { liveAvailable?: boolean };
        if (active) setLiveAvailable(Boolean(capabilities.liveAvailable));
      })
      .catch(() => { if (active) setLiveAvailable(false); });
    return () => { active = false; };
  }, []);

  const updateMarket = (countryCode: string) => {
    const nextMarket = getSupportedMarket(countryCode);
    if (!nextMarket) return;
    setForm((current) => ({
      ...current,
      countryCode: nextMarket.countryCode,
      locale: nextMarket.defaultLocale,
      budget: String(nextMarket.defaultBudget),
      location: nextMarket.defaultLocation,
    }));
  };

  const reviewPlan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setRequestError(null);
    try {
      const response = await fetch("/api/calls/plan", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(executionMode === "live" ? { authorization: `Bearer ${operatorToken}` } : {}),
        },
        body: JSON.stringify({
          executionMode,
          recipientConsentConfirmed: executionMode === "live" && recipientConsentConfirmed,
          authorizedCallWindow: executionMode === "live" ? authorizedCallWindow : "No live call — fixture",
          vehicle: form.vehicle,
          part: form.part,
          fitmentReference: form.chassis,
          budgetAmount: Number(form.budget),
          currency: market.currency,
          deliveryLocation: form.location,
          neededBy: form.timing,
          countryCode: market.countryCode,
          locale: form.locale,
          suppliers: activeSuppliers.map((supplier) => ({
            id: supplier.id,
            name: supplier.name,
            area: supplier.area,
            phone: supplier.fixturePhone,
          })),
        }),
      });
      const payload = await response.json() as {
        approvalToken?: string;
        plan?: { request: SourcingRequest };
        historyAccess?: { requestId: string; token: string };
        error?: string;
      };
      if (!response.ok || !payload.approvalToken || !payload.plan) throw new Error(payload.error ?? "Unable to prepare the call plan.");
      if (payload.historyAccess) {
        rememberHistoryAccess(payload.historyAccess);
        setHistoryAccessToken(payload.historyAccess.token);
      }
      setReviewedRequest(payload.plan.request);
      setApprovalToken(payload.approvalToken);
      setStage("plan");
          setExecution(null);
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "Unable to prepare the call plan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pollLiveExecution = async (requestId: string, initial: SourcingExecution, accessToken: string) => {
    let current = initial;
    let temporaryFailures = 0;
    for (let attempt = 0; attempt < 120 && !isTerminalExecution(current); attempt += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 3000));
      const response = await fetch(
        `/api/calls/status/${encodeURIComponent(requestId)}/${encodeURIComponent(current.callId)}`,
        { cache: "no-store", headers: { authorization: `Bearer ${accessToken}` } },
      );
      const payload = await response.json() as { execution?: SourcingExecution; error?: string };
      if (!response.ok || !payload.execution) {
        temporaryFailures += 1;
        if (temporaryFailures < 4) continue;
        throw new Error(payload.error ?? "The call status could not be refreshed. Your run remains saved.");
      }
      temporaryFailures = 0;
      current = payload.execution;
      setExecution(current);
      setActiveActivity((value) => Math.min(liveCallActivity.length - 1, value + 1));
    }
    if (!isTerminalExecution(current)) {
      throw new Error("The calls are still running and remain saved. Refresh their status again shortly.");
    }
    return current;
  };

  const approveCalls = async () => {
    if (!approvalToken || isExecuting) return;
    setStage("calling");
    setActiveActivity(0);
    setRequestError(null);
    setIsExecuting(true);
    const executionRequest = fetch("/api/calls/execute", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(executionMode === "live" ? { authorization: `Bearer ${operatorToken}` } : {}),
      },
      body: JSON.stringify({ approvalToken, approved: true }),
    });
    let startedExecution: SourcingExecution | null = null;
    try {
      const response = await executionRequest;
      const payload = await response.json() as { execution?: SourcingExecution; requestId?: string; error?: string };
      if (!response.ok || !payload.execution) throw new Error(payload.error ?? "Unable to run the approved sourcing plan.");
      let finalExecution = payload.execution;
      startedExecution = finalExecution;
      setExecution(finalExecution);
      if (finalExecution.mode === "fixture") {
        for (let index = 1; index < callActivity.length; index += 1) {
          await new Promise((resolve) => window.setTimeout(resolve, 350));
          setActiveActivity(index);
        }
      } else if (!isTerminalExecution(finalExecution)) {
        if (!payload.requestId) throw new Error("The call run was created without a tracking id.");
        if (!historyAccessToken) throw new Error("The private history credential is unavailable. The saved run was not polled again.");
        finalExecution = await pollLiveExecution(payload.requestId, finalExecution, historyAccessToken);
      }
      if (finalExecution.status === "failed" || finalExecution.status === "canceled") {
        throw new Error(finalExecution.summary ?? `The call run ended with status ${finalExecution.status}.`);
      }
      if (!finalExecution.quotes.length) {
        throw new Error("The calls completed without a usable quote. Review the saved run before trying again.");
      }
      setExecution(finalExecution);
      setStage("results");
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "Unable to run the approved sourcing plan.");
      setStage(startedExecution?.mode === "live" && !isTerminalExecution(startedExecution) ? "calling" : "plan");
    } finally {
      setIsExecuting(false);
    }
  };

  const resetDemo = () => {
    setDraftKey((value) => value + 1);
    setStage("request");
    setApprovalToken(null);
    setReviewedRequest(null);
    setHistoryAccessToken(null);
    setExecution(null);
    setRequestError(null);
    setIsExecuting(false);
    setOperatorToken("");
  };

  return (
    <main className="scout-app">
      <SiteHeader badge={`${market.countryName} · ${market.countryCode}`} />

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Your parts-sourcing copilot · powered by CALL-E</p>
          <h1>The right part.<br /><em>Without the runaround.</em></h1>
          <p className="hero-description">
            Give Scout the details once. Review the calls. Compare supplier answers with the evidence right beside them.
          </p>
        </div>
        <div className="hero-proof" aria-label="Product metrics">
          <div><strong>17</strong><span>CALL-E markets</span></div>
          <div><strong>01</strong><span>brief for every supplier</span></div>
          <div><strong>You</strong><span>make the final choice</span></div>
        </div>
      </section>

      <div className={`mode-banner ${executionMode === "live" ? "live-mode" : ""}`} role="status">
        <span className="mode-icon" aria-hidden="true">◇</span>
        <div>
          <strong>{executionMode === "live" ? "Live pilot mode" : "Safe demo mode"}</strong>
          <span>{executionMode === "live"
            ? `Approving the reviewed plan will place real calls to ${activeSuppliers.length} business contacts.`
            : "Explore the complete workflow with sample suppliers. No phone calls or reservations will be made."}</span>
        </div>
        <span className="mode-chip">{executionMode === "live" ? "REAL CALLS" : "DRY RUN"}</span>
      </div>

      <section className={`workspace ${stage === "results" ? "workspace-complete" : ""}`} aria-label="Parts sourcing workspace">
        <div className="request-panel">
          <div className="panel-heading">
            <span className="step-number">01</span>
            <div><p>Start your search</p><h2>What are we finding?</h2></div>
          </div>

          <GuidedRequest key={draftKey} form={form} market={market} locked={stage !== "request"} busy={isSubmitting} error={requestError}
            onField={updateField} onMarket={updateMarket} onSubmit={reviewPlan} mode={executionMode} onMode={setExecutionMode}
            liveAvailable={liveAvailable} suppliers={liveSuppliers} onSuppliers={setLiveSuppliers} operatorToken={operatorToken} onOperator={setOperatorToken}
            consent={recipientConsentConfirmed} onConsent={setRecipientConsentConfirmed} start={callWindowStart} end={callWindowEnd} onStart={setCallWindowStart} onEnd={setCallWindowEnd} />
        </div>

        <aside className="activity-panel" id="call-review">
          {stage === "request" && (
            <div className="request-summary">
              <p className="eyebrow">Your request, at a glance</p><h2>One brief.<br />Every supplier.</h2>
              <dl><div><dt>Vehicle</dt><dd>{form.vehicle || "Add your vehicle"}</dd></div><div><dt>Looking for</dt><dd>{form.part || "Choose a part"}</dd></div><div><dt>Fitment reference</dt><dd>{form.chassis || "Add a VIN or part number"}</dd></div><div><dt>Budget</dt><dd>{Number(form.budget) > 0 ? formatMoney(Number(form.budget), market.currency, form.locale) : "Set a budget"}</dd></div><div><dt>Destination</dt><dd>{form.location} · {form.timing}</dd></div></dl>
              <div className="summary-promise"><span aria-hidden="true">✓</span><p>Fitment checked before price. Unknown answers stay visible.</p></div>
              <Link href="/about">Meet the project behind Scout ↗</Link>
            </div>
          )}

          {stage === "plan" && reviewedRequest && (
            <div className="plan-state">
              <div className="panel-heading compact">
                <span className="step-number">02</span>
                <div><p>Approval gate</p><h2>Review the call plan</h2></div>
              </div>
              <div className="call-script">
                <p>SpareScout will ask each supplier to:</p>
                <ol>
                  <li>Confirm a <strong>{reviewedRequest.part.toLowerCase()}</strong> fits the <strong>{reviewedRequest.vehicle}</strong> using chassis {reviewedRequest.fitmentReference}.</li>
                  <li>Quote brand, condition, total price and available quantity.</li>
                  <li>Check delivery to {reviewedRequest.deliveryLocation} by {reviewedRequest.neededBy.toLowerCase()}.</li>
                  <li>Ask whether the item can be held—without reserving it.</li>
                </ol>
              </div>
              <div className="call-targets">
                {reviewedRequest.suppliers.map((supplier) => <div key={supplier.id}><span className="supplier-index">{supplier.name.charAt(0)}</span><span><strong>{supplier.name}</strong><small>{supplier.phone}</small></span><b>Ready</b></div>)}
              </div>
              {executionMode === "live" && (
                <div className="consent-review">
                  <span aria-hidden="true">✓</span>
                  <p><strong>Operator authenticated · recipients allowlisted</strong>Consent attested for: {reviewedRequest.authorizedCallWindow}</p>
                </div>
              )}
              <div className="guardrail"><span>!</span><p><strong>No commitments</strong>Calls may gather quotes only. Payment, purchase, and reservation are blocked.</p></div>
              <button className="primary-button light" type="button" onClick={approveCalls} disabled={isExecuting}>{executionMode === "live" ? `Approve ${reviewedRequest.suppliers.length} supplier ${reviewedRequest.suppliers.length === 1 ? "call" : "calls"}` : "Approve 3 demo calls"} <span>→</span></button>
              {requestError && <p className="inline-error dark" role="alert">{requestError}</p>}
              <button className="text-button" type="button" onClick={() => { setApprovalToken(null); setReviewedRequest(null); setStage("request"); }}>Edit request</button>
            </div>
          )}

          {stage === "calling" && (
            <div className="calling-state">
              <div className="signal-orbit" aria-hidden="true"><span>SS</span><i /><i /><i /></div>
              <p className="eyebrow">{execution?.mode === "live" ? "Live calls in progress" : "Demo calls in progress"}</p>
              <h2>{execution?.mode === "live" ? "Scout is on the line." : "Scout is simulating the workflow."}</h2>
              <div className="progress-track"><span style={{ width: `${((activeActivity + 1) / displayedActivity.length) * 100}%` }} /></div>
              <ul className="activity-list">
                {displayedActivity.slice(0, activeActivity + 1).map((activity, index) => (
                  <li key={activity} className={index === activeActivity ? "active" : "done"}>
                    <span>{index < activeActivity ? "✓" : "●"}</span>{activity}
                  </li>
                ))}
              </ul>
              {requestError && <p className="inline-error dark" role="alert">{requestError}</p>}
              {requestError && execution?.mode === "live" && <Link className="inline-cta" href="/history">Refresh this run in History →</Link>}
            </div>
          )}

          {stage === "results" && (
            <div className="summary-state">
              <p className="eyebrow">Sourcing complete</p>
              <h2>{displayQuotes.filter((quote) => quote.status === "Verified").length} verified options found.</h2>
              {bestVerified ? <p>Best verified price is <strong>{formatMoney(bestVerified.price!, market.currency, form.locale)}</strong>, with evidence attached.</p> : <p>No offer is ready to select. Review the missing information below.</p>}
              <div className="summary-stats"><div><b>{displayQuotes.length}/{activeSuppliers.length}</b><span>results</span></div><div><b>{displayQuotes.filter((quote) => quote.status === "Verified").length}</b><span>verified</span></div><div><b>{execution?.mode === "live" ? "Live" : "Fixture"}</b><span>{execution?.mode === "live" ? "CALL-E run" : "safe mode"}</span></div></div>
              <button className="secondary-button" type="button" onClick={resetDemo}>Start another search</button>
            </div>
          )}
        </aside>
      </section>

      {stage === "results" && reviewedRequest && <QuoteComparison quotes={displayQuotes} request={reviewedRequest} fixture={execution?.mode !== "live"} />}

      <SiteFooter />
    </main>
  );
}
