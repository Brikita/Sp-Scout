"use client";

import { FormEvent, useMemo, useState } from "react";

type Stage = "request" | "plan" | "calling" | "results";

type Quote = {
  id: number;
  supplier: string;
  area: string;
  status: "Verified" | "Partial";
  brand: string;
  price: number;
  stock: string;
  delivery: string;
  confidence: number;
  evidence: string;
  note?: string;
};

const suppliers = [
  { name: "AutoHub Industrial", area: "Industrial Area", phone: "+254 7•• ••• 184" },
  { name: "Kirinyaga Parts Co.", area: "Kirinyaga Road", phone: "+254 7•• ••• 920" },
  { name: "Mombasa Road Motors", area: "Mombasa Road", phone: "+254 7•• ••• 447" },
];

const quotes: Quote[] = [
  {
    id: 1,
    supplier: "AutoHub Industrial",
    area: "Industrial Area",
    status: "Verified",
    brand: "SKF",
    price: 6500,
    stock: "2 in stock",
    delivery: "Today · before 5 PM",
    confidence: 96,
    evidence: "Confirmed against chassis suffix 5K9 and OEM reference 43550-12030.",
  },
  {
    id: 2,
    supplier: "Kirinyaga Parts Co.",
    area: "Kirinyaga Road",
    status: "Verified",
    brand: "NSK",
    price: 7200,
    stock: "1 in stock",
    delivery: "Collection only",
    confidence: 91,
    evidence: "Seller read back the vehicle year, model and front-left position.",
  },
  {
    id: 3,
    supplier: "Mombasa Road Motors",
    area: "Mombasa Road",
    status: "Partial",
    brand: "Aftermarket",
    price: 5800,
    stock: "Available",
    delivery: "Tomorrow · KSh 450",
    confidence: 68,
    evidence: "Vehicle model matched, but the seller could not verify the OEM reference.",
    note: "Compatibility needs manual confirmation before reservation.",
  },
];

const callActivity = [
  "Call plan approved — preparing three supplier calls",
  "AutoHub answered — checking chassis compatibility",
  "Kirinyaga Parts quoted an NSK bearing",
  "Mombasa Road Motors needs an OEM reference check",
  "Three conversations normalized into comparable offers",
];

const formatKes = (value: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);

export default function Home() {
  const [stage, setStage] = useState<Stage>("request");
  const [activeActivity, setActiveActivity] = useState(0);
  const [selectedQuote, setSelectedQuote] = useState<number | null>(null);
  const [reservationReady, setReservationReady] = useState(false);
  const [form, setForm] = useState({
    vehicle: "2014 Toyota Fielder",
    part: "Front-left wheel bearing",
    chassis: "NKE165-705K9",
    budget: "8000",
    location: "Nairobi CBD",
    timing: "Today",
  });

  const bestVerified = useMemo(
    () => quotes.filter((quote) => quote.status === "Verified").sort((a, b) => a.price - b.price)[0],
    [],
  );

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const reviewPlan = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStage("plan");
    setSelectedQuote(null);
    setReservationReady(false);
  };

  const runDryDemo = async () => {
    setStage("calling");
    setActiveActivity(0);
    for (let index = 1; index < callActivity.length; index += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 650));
      setActiveActivity(index);
    }
    await new Promise((resolve) => window.setTimeout(resolve, 500));
    setStage("results");
  };

  const resetDemo = () => {
    setStage("request");
    setSelectedQuote(null);
    setReservationReady(false);
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="SpareScout home">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>SpareScout</span>
        </a>
        <div className="header-actions">
          <span className="location-pill"><span className="status-dot" />Nairobi, KE</span>
          <button className="avatar" aria-label="Open account menu">BK</button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Phone-powered parts sourcing</p>
          <h1>The right part.<br /><em>One round of calls.</em></h1>
          <p className="hero-description">
            SpareScout calls trusted parts dealers, verifies fitment, and turns every
            conversation into a quote you can compare.
          </p>
        </div>
        <div className="hero-proof" aria-label="Product metrics">
          <div><strong>3×</strong><span>faster sourcing</span></div>
          <div><strong>100%</strong><span>human-approved</span></div>
          <div><strong>0</strong><span>surprise purchases</span></div>
        </div>
      </section>

      <div className="mode-banner" role="status">
        <span className="mode-icon" aria-hidden="true">◇</span>
        <div>
          <strong>Safe demo mode</strong>
          <span>Explore the full workflow with realistic sample calls. No phone calls or reservations will be made.</span>
        </div>
        <span className="mode-chip">DRY RUN</span>
      </div>

      <section className="workspace" aria-label="Parts sourcing workspace">
        <div className="request-panel">
          <div className="panel-heading">
            <span className="step-number">01</span>
            <div><p>Build a request</p><h2>What are we finding?</h2></div>
          </div>

          <form onSubmit={reviewPlan}>
            <div className="field-grid">
              <label className="field field-wide">
                <span>Vehicle</span>
                <input value={form.vehicle} onChange={(event) => updateField("vehicle", event.target.value)} required />
              </label>
              <label className="field field-wide">
                <span>Part needed</span>
                <input value={form.part} onChange={(event) => updateField("part", event.target.value)} required />
              </label>
              <label className="field field-wide">
                <span>Chassis / VIN</span>
                <input value={form.chassis} onChange={(event) => updateField("chassis", event.target.value)} required />
                <small>Used only to confirm compatibility</small>
              </label>
              <label className="field">
                <span>Budget ceiling</span>
                <div className="input-prefix"><b>KSh</b><input type="number" min="1" value={form.budget} onChange={(event) => updateField("budget", event.target.value)} required /></div>
              </label>
              <label className="field">
                <span>Needed by</span>
                <select value={form.timing} onChange={(event) => updateField("timing", event.target.value)}>
                  <option>Today</option><option>Tomorrow</option><option>This week</option>
                </select>
              </label>
              <label className="field field-wide">
                <span>Delivery area</span>
                <input value={form.location} onChange={(event) => updateField("location", event.target.value)} required />
              </label>
            </div>
            <button className="primary-button" type="submit">
              Review supplier call plan <span aria-hidden="true">→</span>
            </button>
            <p className="button-note"><span aria-hidden="true">⌾</span> You will review every call before it starts</p>
          </form>
        </div>

        <aside className="activity-panel" aria-live="polite">
          {stage === "request" && (
            <div className="empty-state">
              <span className="radar" aria-hidden="true"><i /><i /><b>3</b></span>
              <p className="eyebrow">Your supplier network</p>
              <h2>Three dealers are ready to check.</h2>
              <p>Complete the request to preview exactly what SpareScout will ask each supplier.</p>
              <ul className="supplier-mini-list">
                {suppliers.map((supplier) => <li key={supplier.name}><span>{supplier.name}</span><small>{supplier.area}</small></li>)}
              </ul>
            </div>
          )}

          {stage === "plan" && (
            <div className="plan-state">
              <div className="panel-heading compact">
                <span className="step-number">02</span>
                <div><p>Approval gate</p><h2>Review the call plan</h2></div>
              </div>
              <div className="call-script">
                <p>SpareScout will ask each supplier to:</p>
                <ol>
                  <li>Confirm a <strong>{form.part.toLowerCase()}</strong> fits the <strong>{form.vehicle}</strong> using chassis {form.chassis}.</li>
                  <li>Quote brand, condition, total price and available quantity.</li>
                  <li>Check delivery to {form.location} by {form.timing.toLowerCase()}.</li>
                  <li>Ask whether the item can be held—without reserving it.</li>
                </ol>
              </div>
              <div className="call-targets">
                {suppliers.map((supplier) => <div key={supplier.name}><span className="supplier-index">{supplier.name.charAt(0)}</span><span><strong>{supplier.name}</strong><small>{supplier.phone}</small></span><b>Ready</b></div>)}
              </div>
              <div className="guardrail"><span>!</span><p><strong>No commitments</strong>Calls may gather quotes only. Payment, purchase, and reservation are blocked.</p></div>
              <button className="primary-button light" type="button" onClick={runDryDemo}>Approve 3 demo calls <span>→</span></button>
              <button className="text-button" type="button" onClick={() => setStage("request")}>Edit request</button>
            </div>
          )}

          {stage === "calling" && (
            <div className="calling-state">
              <div className="signal-orbit" aria-hidden="true"><span>SS</span><i /><i /><i /></div>
              <p className="eyebrow">Calls in progress</p>
              <h2>Scout is on the line.</h2>
              <div className="progress-track"><span style={{ width: `${((activeActivity + 1) / callActivity.length) * 100}%` }} /></div>
              <ul className="activity-list">
                {callActivity.slice(0, activeActivity + 1).map((activity, index) => (
                  <li key={activity} className={index === activeActivity ? "active" : "done"}>
                    <span>{index < activeActivity ? "✓" : "●"}</span>{activity}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {stage === "results" && (
            <div className="summary-state">
              <p className="eyebrow">Sourcing complete</p>
              <h2>Two verified options found.</h2>
              <p>Best verified price is <strong>{formatKes(bestVerified.price)}</strong>, with same-day delivery.</p>
              <div className="summary-stats"><div><b>3/3</b><span>answered</span></div><div><b>2</b><span>verified</span></div><div><b>3m 42s</b><span>elapsed</span></div></div>
              <button className="secondary-button" type="button" onClick={resetDemo}>Start another search</button>
            </div>
          )}
        </aside>
      </section>

      {stage === "results" && (
        <section className="results-section" aria-labelledby="results-title">
          <div className="results-heading"><div><p className="eyebrow">03 · Compare verified offers</p><h2 id="results-title">Evidence, not guesswork.</h2></div><div className="legend"><span><i className="verified-dot" />Verified fitment</span><span><i className="partial-dot" />Needs confirmation</span></div></div>
          <div className="quote-grid">
            {quotes.map((quote) => (
              <article className={`quote-card ${selectedQuote === quote.id ? "selected" : ""}`} key={quote.id}>
                {quote.id === bestVerified.id && <span className="best-tag">BEST VERIFIED OFFER</span>}
                <div className="quote-top"><div><p>{quote.area}</p><h3>{quote.supplier}</h3></div><span className={`fitment ${quote.status.toLowerCase()}`}>{quote.status}</span></div>
                <div className="quote-price"><strong>{formatKes(quote.price)}</strong><span>{quote.brand} · new</span></div>
                <dl><div><dt>Availability</dt><dd>{quote.stock}</dd></div><div><dt>Delivery</dt><dd>{quote.delivery}</dd></div><div><dt>Confidence</dt><dd>{quote.confidence}%</dd></div></dl>
                <div className="confidence-bar"><span style={{ width: `${quote.confidence}%` }} /></div>
                <details><summary>View call evidence <span>+</span></summary><p>“{quote.evidence}”</p></details>
                {quote.note && <p className="warning-note"><span>!</span>{quote.note}</p>}
                <button type="button" className="select-button" onClick={() => { setSelectedQuote(quote.id); setReservationReady(false); }}>{selectedQuote === quote.id ? "Offer selected ✓" : "Select this offer"}</button>
              </article>
            ))}
          </div>
          <div className="reservation-bar">
            <div><span className="step-number">04</span><p><strong>{selectedQuote ? `${quotes.find((quote) => quote.id === selectedQuote)?.supplier} selected` : "Choose an offer to continue"}</strong><small>A separate approval is always required before a reservation call.</small></p></div>
            <button disabled={!selectedQuote} onClick={() => setReservationReady(true)}>Preview reservation call</button>
          </div>
          {reservationReady && <div className="reservation-message" role="status"><span>✓</span><div><strong>Reservation preview ready</strong><p>Demo complete—no supplier was contacted and nothing was reserved.</p></div></div>}
        </section>
      )}

      <footer><p>Built for people who know that the right answer is often still on the other end of a phone.</p><span>Powered by CALL-E · Dry-run prototype</span></footer>
    </main>
  );
}
