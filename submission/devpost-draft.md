# Devpost submission draft

## Project name

SpareScout

## Tagline

The right vehicle part, from phone-only inventory, in one approval-gated round of CALL-E calls.

## Inspiration

Independent auto-parts dealers often have current stock that is missing or stale online. Buyers repeat vehicle and chassis details across several calls, receive inconsistent answers, and can choose a cheap but incompatible part. This is not a generic “AI makes a call” problem: the difficult work is coordinating several fitment conversations and producing evidence that can support one decision.

## What it does

SpareScout accepts a localized vehicle-part request, prepares a reviewable supplier call plan, and requires explicit approval before CALL-E can contact anyone. CALL-E gathers fitment, brand, condition, price, stock, and delivery information from several suppliers. Strict result schemas turn those conversations into comparable quotes with confidence and evidence. Anything incomplete remains visibly incomplete.

The public path is a safe no-call fixture. The trusted backend implements the real CALL-E TypeScript SDK, stable idempotency, durable status monitoring, and D1 history. A sourcing approval never authorizes payment, purchase, or a reservation.

## How we built it

- React 19, TypeScript, vinext, Vite, and a Cloudflare Workers-compatible runtime.
- Official `@call-e/calle` server SDK for batch call creation and result retrieval.
- Strict JSON schemas for aggregate and per-recipient results.
- HMAC-signed, expiring approval plans.
- D1 persistence for requests, recipients, approvals, runs, evidence, and quotes.
- Seventeen supported CALL-E regions with market-aware language and currency.
- Automated pilot metrics that include only durable live records and exclude every fixture.

## Technical challenges

The hardest boundary was safe retry behavior. A network timeout after call creation must not become a second phone batch. SpareScout derives the provider idempotency key from the approved plan, records approval before execution, and uses a separate read-only status route for monitoring.

Another challenge was honest comparison. Required schema fields make results machine-comparable, while explicit `unknown` states and evidence arrays prevent the interface from filling gaps with plausible guesses.

## Accomplishments

- A complete localized sourcing, approval, execution, monitoring, and comparison flow.
- A fixture plan that cannot become live through a server configuration change.
- Durable, masked audit history and denominator-honest pilot reporting.
- A coherent public product experience covering workflow, markets, safety, privacy, and evidence.

## What we learned

Phone automation needs more than a natural voice. The useful product is the control system around the call: purpose-bound authorization, disclosure, idempotency, incomplete-outcome handling, evidence, and a clear boundary between collecting a quote and making a commitment.

## What is next

- Complete the consenting supplier pilot and publish the automatically calculated metrics.
- Add the separately signed reservation-call workflow.
- Reconcile terminal webhooks against canonical CALL-E API results once the production webhook authentication contract is configured.

## Submission links

- Functional demo: `[PUBLIC_DEPLOYMENT_URL]`
- Source: `[PROJECT_REPOSITORY_URL]`
- CALL-E community pull request: `[AWESOME_PHONE_CALL_AGENTS_PR]`
- Demo video: `[YOUTUBE_OR_VIMEO_URL]`

Replace every bracketed value and insert only verified pilot results before submission.
