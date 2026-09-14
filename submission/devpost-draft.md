# Devpost submission draft

## Project name

SpareScout

## Tagline

The right vehicle part, from phone-only inventory, in one approval-gated round of CALL-E calls.

## Inspiration

Independent auto-parts dealers often have current stock that is missing or stale online. Buyers repeat vehicle and chassis details across several calls, receive inconsistent answers, and can choose a cheap but incompatible part. This is not a generic “AI makes a call” problem: the difficult work is coordinating several fitment conversations and producing evidence that can support one decision.

## What it does

SpareScout accepts a localized vehicle-part request, prepares a reviewable supplier call plan, and requires explicit approval before CALL-E can contact anyone. CALL-E gathers fitment, brand, condition, price, stock, and delivery information from one or more approved suppliers. Strict result schemas turn those conversations into comparable quotes with readiness labels and evidence. Anything incomplete remains visibly incomplete.

The public judge path is a clearly labeled no-call fixture with deterministic simulated supplier responses. A separate private pilot deployment runs the real CALL-E TypeScript SDK with stable idempotency, durable status monitoring and D1 history when the recipient and language are within current provider coverage. A sourcing approval never authorizes payment, purchase or a reservation.

## How we built it

The deployed interface includes a three-step request flow, confirmed part-label OCR, nearby business search, quote-readiness filters, a side-by-side comparison, a downloadable sourcing brief and a project information page. The public URL exposes the full fixture experience. The private pilot adds authenticated live mode and D1-backed history, and blocks unsupported recipient/language combinations before approval.

- React 19, TypeScript, vinext, Vite, and a Cloudflare Workers-compatible runtime.
- Official `@call-e/calle` server SDK for batch call creation and result retrieval.
- Strict JSON schemas for aggregate and per-recipient results.
- Authenticated live planning, server-side recipient allowlisting, and expiring browser approval data with phone values removed.
- Official CALL-E origin pinning for every credential-bearing SDK request.
- D1 persistence for requests, recipients, approvals, runs, evidence, and quotes.
- Seventeen localized demo markets with market-aware language and currency, plus a separate provider-coverage gate for live calls.
- Automated pilot metrics that include only durable live records and exclude every fixture.
- A private, browser-authorized sourcing ledger backed by durable D1 records and hashed per-request history credentials.
- Recovery of a saved non-terminal CALL-E run from History without creating another call. Recovery after provider acceptance but before the call ID is saved remains future work.

## Technical challenges

The hardest boundary was safe retry behavior. A network timeout after call creation must not become a second phone batch. SpareScout derives the provider idempotency key from the approved plan, records approval before execution, and uses a separate read-only status route for monitoring.

Another challenge was honest comparison. Required schema fields make results machine-comparable, while explicit `unknown` states and evidence arrays prevent the interface from filling gaps with plausible guesses.

## Accomplishments

- A complete localized sourcing, approval, execution, monitoring, and comparison flow.
- A fixture plan that cannot become live through a server configuration change.
- Durable, masked audit history and denominator-honest pilot reporting.
- A coherent public fixture experience covering workflow, markets, safety, privacy, project context and evidence.

## What we learned

Phone automation needs more than a natural voice. The useful product is the control system around the call: purpose-bound authorization, disclosure, idempotency, incomplete-outcome handling, evidence, and a clear boundary between collecting a quote and making a commitment.

## What is next

- Complete a consenting supplier pilot in a currently supported CALL-E recipient/language combination and publish the automatically calculated metrics.
- Add the separately signed reservation-call workflow.
- Reconcile terminal webhooks against canonical CALL-E API results once the production webhook authentication contract is configured.

## Submission links

- Functional demo: https://sp-scout.vercel.app
- Source: https://github.com/Brikita/Sp-Scout
- CALL-E community pull request: https://github.com/CALLE-AI/awesome-phone-call-agents/pull/261
- Demo video: `[YOUTUBE_OR_VIMEO_URL]`

Replace every bracketed value and insert only verified pilot results before submission.
