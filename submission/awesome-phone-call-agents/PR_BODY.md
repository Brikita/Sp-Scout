## Summary

Adds SpareScout, a TypeScript reference app for approval-gated multi-supplier vehicle-part sourcing with CALL-E.

SpareScout turns several fitment and inventory conversations into comparable structured quotes while keeping every consequential side effect human-owned. It includes a no-call fixture default, masked call-plan review, signed approval, provider idempotency, durable D1 history, credential-protected GET-only recovery, supported-market localization, and denominator-honest pilot metrics.

## Why this belongs in the repository

- Packages a focused real-world phone workflow rather than a generic caller.
- Uses the official CALL-E TypeScript SDK for batch creation and existing-run retrieval.
- Demonstrates approval, idempotency, incomplete-result handling, and evidence preservation.
- Runs without CALL-E credentials through the deterministic fixture path.

## Side effects and safety

- Fixture mode is the default and never dials.
- Live mode requires trusted server configuration and approval of the exact signed plan.
- Calls gather quotes only; they cannot purchase, pay, or reserve.
- Status recovery performs only an authenticated provider GET and cannot create a second call.
- Every fixture uses NANPA's reserved, non-working 555-0100–0199 fictional range and returns before constructing a provider client.
- Samples contain no credentials, recordings, transcripts, private phone numbers, or personal data.
- Medical, legal, financial, and emergency advice are explicitly outside the workflow; urgent safety issues stop sourcing and route to appropriate local help.
- The app creates no recurring jobs. Its current live-batch cancellation limitation is documented.

## Verification

```bash
cd apps/typescript/sparescout
npm ci
npm run check
```

Also run the repository validator from the upstream root:

```bash
python3 scripts/validate_repository.py
```

## Submission evidence

- Public demo: https://sp-scout.vercel.app
- Public video under three minutes: `[YOUTUBE_OR_VIMEO_URL]`
- Sanitized consenting-pilot note: `[PILOT_EVIDENCE_OR_NOT_YET_RUN]`

## Checklist

- [x] English-only repository content
- [x] No secrets, private phone numbers, or personal data
- [x] Host/provider and credential boundary documented
- [x] Outbound side effects documented
- [x] No-call fixture path provided by default
- [x] Install, usage, tests, and live opt-in documented
- [x] Duplicate-call and interruption behavior documented
- [x] Public judge demo added
- [x] Upstream repository validation passed
- [ ] Add the public demo video and sanitized pilot note
