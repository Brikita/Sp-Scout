import type { Metadata } from "next";
import { PublicPage } from "../components/site-chrome";

export const metadata: Metadata = {
  title: "SpareScout Pilot Evidence",
  description: "The pre-registered metrics and evidence standard for SpareScout's consenting supplier pilot.",
};

const measures = [
  ["Median sourcing time", "Request approval to comparable quote set"],
  ["Successful contact rate", "Suppliers reached ÷ attempted suppliers"],
  ["Quote completeness", "Required structured fields returned ÷ expected fields"],
  ["Compatible options", "Fitment-confirmed offers per sourcing request"],
  ["Price spread", "Highest minus lowest comparable verified quote"],
  ["Human intervention", "Runs needing clarification or manual fitment follow-up"],
] as const;

export default function PilotPage() {
  return (
    <PublicPage
      eyebrow="Pilot evidence"
      title="Measure the phone work, not the pitch."
      intro="The pilot has not started. This page pre-registers what SpareScout will measure so the eventual case study cannot quietly swap in flattering metrics."
    >
      <div className="pilot-status" role="status"><span>Awaiting consenting pilot calls</span><p>No real-world performance claim is published yet.</p></div>
      <section className="measure-grid">
        {measures.map(([title, definition]) => (
          <article key={title}><p>Not yet measured</p><h2>{title}</h2><span>{definition}</span></article>
        ))}
      </section>
      <section className="public-split pilot-method">
        <div><p className="section-kicker">Minimum credible study</p><h2>Five requests, consenting businesses, one fixed rubric.</h2></div>
        <div className="prose-stack">
          <p>Each request should use a real vehicle and part, contact two or more businesses that agreed to receive an AI-assisted sourcing call, and preserve the resulting structured record.</p>
          <p>Fixture runs, unanswered calls, failures, and incomplete quotes stay in the denominator. No synthetic outcome will be presented as pilot evidence.</p>
        </div>
      </section>
    </PublicPage>
  );
}
