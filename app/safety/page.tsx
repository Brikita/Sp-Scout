import type { Metadata } from "next";
import { PublicPage } from "../components/site-chrome";

export const metadata: Metadata = {
  title: "SpareScout Safety",
  description: "Approval gates, disclosure, data minimization, dry runs, and no-purchase boundaries for supplier calls.",
};

const controls = [
  ["Explicit approval", "A reviewed plan must carry a valid, untampered approval token before execution."],
  ["AI disclosure", "The call task instructs SpareScout to identify itself as an AI assistant collecting a quote for a buyer."],
  ["Information only", "Calls may ask about price, stock, fitment, delivery, and whether a later hold is possible. They cannot reserve, order, pay, purchase, or commit."],
  ["Masked recipients", "The approval screen and public history show masked supplier numbers. Full numbers remain server-side for authorized execution."],
  ["Fail-closed live mode", "A fixture plan can never become live because configuration changes. Live execution requires both a live plan and trusted server credentials."],
  ["Traceable outcomes", "Requests, approvals, call runs, confidence, evidence, and normalized quotes are stored together for review."],
] as const;

export default function SafetyPage() {
  return (
    <PublicPage
      eyebrow="Safety by design"
      title="A phone call is a real-world side effect. We treat it like one."
      intro="SpareScout separates planning, approval, calling, comparison, and any later reservation into distinct decisions."
    >
      <section className="control-grid">
        {controls.map(([title, text], index) => (
          <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h2>{title}</h2><p>{text}</p></article>
        ))}
      </section>

      <section className="boundary-panel">
        <div><p className="section-kicker">Hard boundary</p><h2>Quote gathering is not purchasing authority.</h2></div>
        <p>SpareScout rejects substitute-part acceptance and records missing information as unknown. Selecting an offer in the interface only prepares a separate reservation preview; it does not contact the seller.</p>
      </section>
    </PublicPage>
  );
}
