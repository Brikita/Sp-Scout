import type { Metadata } from "next";
import Link from "next/link";
import { PublicPage } from "../components/site-chrome";

export const metadata: Metadata = {
  title: "About SpareScout",
  description: "Why SpareScout turns hard-to-search auto-parts inventory into comparable, evidence-backed phone quotes.",
};

export default function AboutPage() {
  return (
    <PublicPage
      eyebrow="About SpareScout"
      title="The inventory exists. The search box often doesn’t."
      intro="SpareScout is a focused procurement assistant for the part of the auto-parts market that still runs through phone conversations."
    >
      <section className="public-split">
        <div>
          <p className="section-kicker">The problem</p>
          <h2>A correct part is more than a product name.</h2>
        </div>
        <div className="prose-stack">
          <p>Vehicle year, trim, chassis or VIN, OEM references, position, condition, and delivery timing can all change the answer. Many independent dealers have useful stock but incomplete or stale online listings.</p>
          <p>Buyers call shop after shop, repeat the same details, write down incompatible answers, and still risk choosing the wrong part. SpareScout gives that phone work a repeatable structure.</p>
        </div>
      </section>

      <section className="belief-grid" aria-label="Product principles">
        <article><span>01</span><h3>Phone-native</h3><p>The workflow exists because the freshest inventory answer is often spoken, not indexed.</p></article>
        <article><span>02</span><h3>Fitment-first</h3><p>A cheap quote is not a useful quote until the compatibility evidence is visible.</p></article>
        <article><span>03</span><h3>Human-decided</h3><p>Automation gathers and structures information. People approve calls and decide what happens next.</p></article>
      </section>

      <section className="architecture-panel">
        <div><p className="section-kicker">Inside the project</p><h2>From a part label to a decision.</h2></div>
        <ul><li><strong>Read the reference</strong><span>A photo reader extracts printed text locally. The buyer confirms the VIN or OEM reference before using it.</span></li><li><strong>Find suppliers</strong><span>A location-aware business search helps the buyer find contacts. A listing is not a stock guarantee or permission to call.</span></li><li><strong>Make the calls</strong><span>CALL-E receives one reviewed sourcing brief and structured questions for each authorized recipient.</span></li><li><strong>Compare answers</strong><span>Quotes show fitment, condition, price, stock, delivery and evidence. Incomplete answers remain visible.</span></li><li><strong>Keep the brief</strong><span>Download a comparison for your mechanic. Configured pilot deployments also keep private request history.</span></li></ul>
      </section>

      <section className="public-split">
        <div><p className="section-kicker">Built for the CALL-E hackathon</p><h2>A focused use for voice agents.</h2></div>
        <div className="prose-stack"><p>SpareScout connects a React and TypeScript interface to the official CALL-E SDK. Its trusted runtime uses Cloudflare Workers and D1 for approved call plans, supplier results and private history.</p><p>The public demo uses clearly labeled sample results. The live integration is implemented; a completed consenting-supplier pilot has not yet been published. The evidence page keeps those two things separate.</p><div className="project-links"><a className="secondary-button" href="https://github.com/Brikita/Sp-Scout" target="_blank" rel="noopener noreferrer">Explore the source ↗</a><Link className="secondary-button" href="/pilot">View pilot evidence →</Link><a className="secondary-button" href="https://github.com/CALLE-AI/awesome-phone-call-agents/pull/261" target="_blank" rel="noopener noreferrer">Community contribution ↗</a></div></div>
      </section>

      <section className="project-faq" aria-labelledby="project-questions"><p className="section-kicker">A little more context</p><h2 id="project-questions">Before you try Scout.</h2>
        <details><summary>Will the demo call a real shop?</summary><p>No. The default demo uses fictional numbers and sample quotes. Real calls require a configured pilot server, an authenticated operator, directly consenting suppliers and approval of the exact plan.</p></details>
        <details><summary>Can a photo tell me whether a part fits?</summary><p>The photo reader extracts printed text, such as a part number. It does not identify unlabelled parts or prove compatibility. Check the extracted characters, then ask the supplier to verify fitment.</p></details>
        <details><summary>How is the recommended offer chosen?</summary><p>Scout ranks the lowest priced selectable offer with confirmed fitment and supporting evidence. Rejected fitment, missing prices and known zero stock are excluded. The recommendation compares returned information; it is not an independent inspection of the part.</p></details>
        <details><summary>Does selecting an offer place an order?</summary><p>No. Selection opens a draft follow-up preview. No purchase, payment or reservation is made.</p></details>
      </section>

      <section className="public-callout">
        <div><p className="section-kicker">Built for worldwide use</p><h2>One workflow, localized to supported calling markets.</h2></div>
        <p>Market, spoken language, currency, number format, budget, and delivery location travel together. SpareScout currently exposes exactly the regions CALL-E supports rather than pretending every destination is callable.</p>
        <Link className="inline-cta" href="/markets">See supported markets <span>→</span></Link>
      </section>
    </PublicPage>
  );
}
