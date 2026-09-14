import type { Metadata } from "next";
import { PublicPage } from "../components/site-chrome";
import { SUPPORTED_MARKETS, supportsLiveMarketLocale } from "../../lib/markets";

export const metadata: Metadata = {
  title: "SpareScout Supported Markets",
  description: "The 17 localized demo markets and current live-calling coverage available in SpareScout.",
};

export default function MarketsPage() {
  return (
    <PublicPage
      eyebrow="Supported markets"
      title="Global-ready means precise about where calling works."
      intro="SpareScout localizes the complete no-call demo across 17 markets. Live calling is shown separately and depends on current CALL-E recipient and language coverage."
    >
      <section className="market-grid" aria-label="Supported CALL-E markets">
        {SUPPORTED_MARKETS.map((market) => (
          <article key={market.countryCode}>
            <span className="market-code">{market.countryCode}</span>
            <h2>{market.countryName}</h2>
            <p>{market.locales.map((locale) => locale.label).join(" · ")}</p>
            <small>{market.currency} quotes · {market.defaultLocation} demo · {supportsLiveMarketLocale(market.countryCode, market.defaultLocale) ? "live eligible" : "fixture only"}</small>
          </article>
        ))}
      </section>
      <p className="source-note">CALL-E currently rejects English calls to Kenyan recipients, so Kenya remains available as a clearly labeled fixture. Recheck provider coverage before each live pilot.</p>
    </PublicPage>
  );
}
