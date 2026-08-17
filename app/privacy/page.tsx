import type { Metadata } from "next";
import { PublicPage } from "../components/site-chrome";

export const metadata: Metadata = {
  title: "SpareScout Privacy",
  description: "What SpareScout stores, why it is needed, and the current limits of the private prototype.",
};

export default function PrivacyPage() {
  return (
    <PublicPage
      eyebrow="Privacy"
      title="Collect what the sourcing decision needs—and no more."
      intro="This notice describes the current private hackathon prototype, not a generally available commercial service."
    >
      <section className="privacy-list">
        <article><h2>Request data</h2><p>Vehicle and part details, fitment reference, budget, location, deadline, market, language, and supplier business contacts are used to create the reviewed call plan.</p></article>
        <article><h2>Call records</h2><p>Approval timestamps, provider call identifiers, status, summaries, confidence, evidence, and structured supplier quotes are retained for audit and comparison.</p></article>
        <article><h2>Protected display</h2><p>Full supplier numbers are needed by the trusted server to place an approved call. User-facing plans and history mask those numbers.</p></article>
        <article><h2>What is excluded</h2><p>SpareScout does not ask for payment cards, banking credentials, or authority to purchase. Do not enter unrelated personal or sensitive information.</p></article>
        <article><h2>Prototype retention</h2><p>Private-preview records may remain in the project database until the project owner clears them. A public pilot requires a defined retention window and deletion process before launch.</p></article>
        <article><h2>Fixture mode</h2><p>The public demo path uses synthetic contacts and generated outcomes. It does not send the request data to a phone recipient.</p></article>
      </section>
      <p className="source-note">Last updated 17 August 2026. Live testing must use authorized contacts and follow applicable calling, recording, and privacy rules.</p>
    </PublicPage>
  );
}
