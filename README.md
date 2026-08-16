# SpareScout

SpareScout is a phone-powered sourcing workspace for vehicle parts. A buyer enters the vehicle and part details once; SpareScout calls several dealers, verifies fitment, captures price and availability, and presents comparable offers with evidence.

The current version is a complete dry-run prototype. It demonstrates the request, approval, supplier outreach, comparison, and reservation-preview flow without placing calls or making commitments.

## Why this exists

Parts inventory is often fragmented across phone-first sellers. Finding the correct item means repeating vehicle details, checking compatibility, comparing prices, and coordinating delivery across several calls. SpareScout turns that work into one supervised workflow.

## Product principles

- Fitment before price: a cheaper incompatible part is not an offer.
- Evidence over summaries: every structured field should trace back to the call.
- Human approval at side effects: calls and reservation attempts are separate approval gates.
- No purchasing authority: the agent may never commit funds or place an order.
- Honest uncertainty: incomplete compatibility checks remain visibly incomplete.

## Current flow

1. Enter the vehicle, chassis, part, budget, location, and timing.
2. Review the exact supplier call plan and masked recipients.
3. Approve a dry run across three example dealers.
4. Compare normalized offers, confidence, and call evidence.
5. Select an offer and preview the separate reservation step.

## Local development

Requirements: Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

```bash
npm run build
npm test
npm run lint
```

## CALL-E integration boundary

CALL-E is authenticated in the development environment and exposes `plan_call`, `run_call`, and `get_call_run`. The prototype intentionally does not invoke those tools yet.

The production path will replace the timed dry-run activity with a server-side adapter that:

- creates one call plan for the selected suppliers;
- requires a fresh user approval before execution;
- stores only opaque plan and run identifiers;
- polls or receives run completion updates;
- validates extracted quote fields before display; and
- refuses payment, purchase, and reservation instructions during sourcing calls.

See [docs/call-e-integration.md](docs/call-e-integration.md) for the implementation contract.

## Stack

- React 19 and TypeScript
- vinext and Vite
- Cloudflare Workers-compatible runtime
- CALL-E for phone call planning and execution

## Status

- [x] Guided sourcing request
- [x] Call-plan approval gate
- [x] Realistic batch-call dry run
- [x] Structured quote comparison
- [x] Evidence and confidence treatment
- [x] Reservation approval preview
- [ ] Server-side CALL-E adapter
- [ ] Webhook-backed run updates
- [ ] Supplier and sourcing-request persistence
- [ ] Consenting pilot with Nairobi parts dealers
