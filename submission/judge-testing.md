# Judge testing guide

## Fast path: no-call product demo

1. Open the deployed SpareScout URL.
2. Leave the default `Kenya` market or choose another supported market.
3. Notice that language, currency, budget, delivery location, and masked fixture recipients change together.
4. Enter or edit the vehicle, part, and fitment reference.
5. Select **Review supplier call plan**. This persists and signs a plan but cannot place a call.
6. Review the disclosed purpose, three masked recipients, and the no-commitment boundary.
7. Select **Approve 3 demo calls**. The saved plan runs through the deterministic fixture adapter; no phone is dialed.
8. Compare the normalized quotes and expand the evidence attached to each result.
9. Select an offer and open the reservation preview. Confirm that this does not contact the supplier.
10. Visit **Pilot evidence** and confirm that fixture records are excluded from the displayed live metrics.

## What the safe demo proves

- The same validated request and strict schemas used by the live adapter.
- Plan signing, expiry, masked recipients, explicit approval, durable history, result normalization, confidence treatment, and evidence display.
- Supported-market localization and a complete public product experience.
- No-call behavior when fixture mode is selected.

## What requires a separately approved live test

- CALL-E dialing an authorized supplier or test line.
- Audio quality, interruption handling, and transcript accuracy.
- Real contact, quote-completeness, fitment, timing, and price-spread metrics.

No live test should be inferred from these instructions. It requires a consenting number, an exact call goal, and explicit approval for that specific run.
