"use client";

import { useRef, useState, type FormEvent } from "react";
import { SUPPORTED_MARKETS, type SupportedMarket } from "../../lib/markets.ts";
import { LabelReader } from "./label-reader";

export type RequestForm = { vehicle: string; part: string; chassis: string; budget: string; location: string; timing: string; countryCode: string; locale: string };
export type SupplierDraft = { id: string; name: string; area: string; phone: string };
type Props = {
  form: RequestForm; market: SupportedMarket; locked: boolean; busy: boolean; error: string | null;
  onField: (field: keyof RequestForm, value: string) => void; onMarket: (countryCode: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  mode: "fixture" | "live"; onMode: (value: "fixture" | "live") => void; liveAvailable: boolean; liveUnavailableReason: string;
  suppliers: SupplierDraft[]; onSuppliers: (value: SupplierDraft[]) => void;
  operatorToken: string; onOperator: (value: string) => void;
  consent: boolean; onConsent: (value: boolean) => void;
  start: string; end: string; onStart: (value: string) => void; onEnd: (value: string) => void;
};

export function GuidedRequest(p: Props) {
  const [step, setStep] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const titles = ["Tell us what needs replacing.", "Make the search work for you.", "Choose who Scout should ask."];
  const descriptions = ["Start with the vehicle and the exact part. A label photo can help with the reference.", "Set a budget, destination and deadline so every quote answers the same questions.", "Try three sample suppliers, or prepare your own contacts for an approved live pilot."];
  const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.form.vehicle} ${p.form.part} auto parts suppliers ${p.form.location} ${p.market.countryName}`)}`;
  const move = (next: number) => { setStep(next); window.setTimeout(() => heading.current?.focus(), 0); };
  const next = () => { if (formRef.current?.reportValidity()) move(Math.min(2, step + 1)); };
  const changeSupplier = (index: number, field: keyof SupplierDraft, value: string) => p.onSuppliers(p.suppliers.map((supplier, i) => i === index ? { ...supplier, [field]: value } : supplier));

  return <form ref={formRef} onSubmit={(event) => { if (step < 2) { event.preventDefault(); next(); } else p.onSubmit(event); }}>
    <nav className="wizard-progress" aria-label="Request steps">{["Your part", "Your preferences", "Suppliers"].map((label, index) => <button key={label} type="button" disabled={p.locked || p.busy || index > step} aria-current={index === step ? "step" : undefined} onClick={() => move(index)}><span>{index < step ? "✓" : index + 1}</span>{label}</button>)}</nav>
    <fieldset className="request-fields" disabled={p.locked || p.busy}>
      <div className="wizard-heading"><p className="eyebrow">Step {step + 1} of 3</p><h2 ref={heading} tabIndex={-1}>{titles[step]}</h2><p>{descriptions[step]}</p></div>
      {step === 0 && <div className="wizard-fields">
        <LabelReader onReference={(value) => p.onField("chassis", value)} />
        <label className="field"><span>Vehicle</span><input value={p.form.vehicle} onChange={(event) => p.onField("vehicle", event.target.value)} placeholder="e.g. 2014 Toyota Fielder" maxLength={180} required /><small>Year, make and model. Add the engine or trim if you know it.</small></label>
        <label className="field"><span>Part needed</span><input value={p.form.part} onChange={(event) => p.onField("part", event.target.value)} placeholder="e.g. Front-left wheel bearing" maxLength={180} required /></label>
        <div className="part-shortcuts" aria-label="Common parts">{["Front-left wheel bearing", "Front brake pads", "Alternator", "Headlight assembly"].map((part) => <button type="button" key={part} onClick={() => p.onField("part", part)}>{part}</button>)}</div>
        <label className="field"><span>Chassis / VIN or OEM reference</span><input value={p.form.chassis} onChange={(event) => p.onField("chassis", event.target.value)} maxLength={180} required /><small>Scout asks the supplier to verify this exact reference.</small></label>
      </div>}
      {step === 1 && <div className="field-grid wizard-fields">
        <label className="field"><span>Calling market</span><select value={p.form.countryCode} onChange={(event) => p.onMarket(event.target.value)}>{SUPPORTED_MARKETS.map((market) => <option key={market.countryCode} value={market.countryCode}>{market.countryName}</option>)}</select></label>
        <label className="field"><span>Call language</span><select value={p.form.locale} onChange={(event) => p.onField("locale", event.target.value)}>{p.market.locales.map((locale) => <option key={locale.code} value={locale.code}>{locale.label}</option>)}</select></label>
        <label className="field"><span>Budget ceiling ({p.market.currency})</span><input type="number" min="1" value={p.form.budget} onChange={(event) => p.onField("budget", event.target.value)} required /></label>
        <label className="field"><span>Needed by</span><select value={p.form.timing} onChange={(event) => p.onField("timing", event.target.value)}><option>Today</option><option>Tomorrow</option><option>This week</option><option>Flexible</option></select></label>
        <label className="field field-wide"><span>Delivery location</span><input value={p.form.location} onChange={(event) => p.onField("location", event.target.value)} maxLength={180} required /></label>
      </div>}
      {step === 2 && <div className="wizard-fields">
        <div className="discovery-card"><div><p className="eyebrow">Supplier discovery</p><h3>Find the people with the parts.</h3><p>Search business listings near {p.form.location}. Check the business and number before adding a contact.</p></div><a href={searchUrl} target="_blank" rel="noopener noreferrer" className="secondary-button">Search nearby suppliers ↗</a><small>Opens Google Maps. Listings don’t confirm stock or permission to call.</small></div>
        <fieldset className="mode-choice"><legend>How would you like to try Scout?</legend><label className={p.mode === "fixture" ? "selected" : ""}><input type="radio" name="execution-mode" aria-label="Safe fixture execution" checked={p.mode === "fixture"} onChange={() => p.onMode("fixture")} /><span><strong>Try the demo</strong><small>Three simulated supplier calls. No dialing.</small></span></label><label className={p.mode === "live" ? "selected" : ""}><input type="radio" name="execution-mode" aria-label="Live pilot execution" disabled={!p.liveAvailable} checked={p.mode === "live"} onChange={() => p.onMode("live")} /><span><strong>Live pilot</strong><small>{p.liveAvailable ? "Your approved supplier contacts." : p.liveUnavailableReason}</small></span></label></fieldset>
        {p.mode === "fixture" ? <div className="sample-suppliers">{["Independent Parts Dealer", "City Spares Centre", "Regional Parts Distributor"].map((name, i) => <div key={name}><span className="supplier-index">{i + 1}</span><div><strong>{name}</strong><small>Sample supplier · fictional number</small></div><span className="sample-tag">DEMO</span></div>)}</div> : <>
          <label className="field"><span>Operator access token</span><input type="password" value={p.operatorToken} onChange={(event) => p.onOperator(event.target.value)} autoComplete="off" minLength={32} required /><small>Used for this live pilot; never saved in browser history.</small></label>
          {p.suppliers.map((supplier, index) => <div className="contact-card" key={supplier.id}><div className="contact-title"><strong>Supplier {index + 1}</strong>{p.suppliers.length > 1 && <button type="button" onClick={() => p.onSuppliers(p.suppliers.filter((_, i) => i !== index))}>Remove</button>}</div><label className="field"><span>Business name</span><input value={supplier.name} onChange={(event) => changeSupplier(index, "name", event.target.value)} maxLength={120} required /></label><div className="field-grid"><label className="field"><span>Area</span><input value={supplier.area} onChange={(event) => changeSupplier(index, "area", event.target.value)} maxLength={120} /></label><label className="field"><span>Phone with country code</span><input type="tel" value={supplier.phone} onChange={(event) => changeSupplier(index, "phone", event.target.value)} placeholder="+254…" pattern="\+[1-9][0-9]{7,14}" required /></label></div></div>)}
          {p.suppliers.length < 10 && <button type="button" className="secondary-button" onClick={() => p.onSuppliers([...p.suppliers, { id: crypto.randomUUID(), name: "", area: "", phone: "" }])}>+ Add supplier</button>}
          <div className="field-grid"><label className="field"><span>Calling window starts</span><input type="datetime-local" value={p.start} onChange={(event) => p.onStart(event.target.value)} required /></label><label className="field"><span>Calling window ends</span><input type="datetime-local" value={p.end} min={p.start} onChange={(event) => p.onEnd(event.target.value)} required /></label></div><small>Times use your device’s time zone. Calls start only inside this window.</small>
          <label className="consent-check"><input type="checkbox" checked={p.consent} onChange={(event) => p.onConsent(event.target.checked)} required /><span>Each listed business directly consented to this AI-assisted call during the window above. Numbers must also be approved on the pilot server.</span></label>
        </>}
      </div>}
      <div className="wizard-actions">{step > 0 && <button type="button" className="text-button" onClick={() => move(step - 1)}>← Back</button>}{step < 2 ? <button type="button" className="primary-button" onClick={(event) => { event.preventDefault(); next(); }}>Continue to {step === 0 ? "preferences" : "suppliers"} <span>→</span></button> : <button className="primary-button" type="submit">{p.busy ? "Preparing signed plan…" : "Review supplier call plan"} <span>→</span></button>}</div>
    </fieldset>
    {p.error && <p className="inline-error" role="alert">{p.error}</p>}
    <p className="button-note">You review the exact request before any call starts.</p>
  </form>;
}
