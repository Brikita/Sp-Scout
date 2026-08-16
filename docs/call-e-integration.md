# CALL-E integration contract

This document defines the boundary between SpareScout and CALL-E. It is designed to keep phone activity inspectable, idempotent, and explicitly approved.

## Verified capability

The authenticated CALL-E environment provides:

- `plan_call` to produce a reviewable call plan;
- `run_call` to execute an approved plan; and
- `get_call_run` to retrieve progress and terminal results.

## Sourcing call lifecycle

### 1. Normalize the request

Validate the vehicle, chassis or VIN, requested part, budget ceiling, delivery location, and deadline. A missing phone number, country code, language, or region must not be guessed.

### 2. Build the plan

Call `plan_call` with the complete sourcing goal and selected supplier numbers. The user sees masked recipients, the full purpose, prohibited actions, and any clarification questions.

No external call starts in this step.

### 3. Capture approval

Execution is available only while the displayed plan is current and ready. Approval is scoped to the listed suppliers and sourcing goal. Editing either invalidates the approval.

### 4. Execute once

Submit the approved plan through `run_call` once. Store the opaque run identifier and mark the request as submitted before retrying any uncertain network response.

### 5. Track progress

Use `get_call_run` with the stored run identifier. Preserve the activity order and surface partial, no-answer, declined, and failed outcomes without turning them into successful quotes.

### 6. Validate offers

Map each terminal result to this minimum shape:

```json
{
  "part_found": true,
  "compatibility": "confirmed",
  "brand": "SKF",
  "condition": "new",
  "price_kes": 6500,
  "available_quantity": 2,
  "delivery_available": true,
  "delivery_eta": "today before 5pm",
  "reservation_possible": true,
  "confidence": 0.96,
  "evidence": ["Seller confirmed OEM reference 43550-12030"]
}
```

Unverified or absent fields remain unknown. They are never inferred from a different supplier or from general product knowledge.

## Reservation lifecycle

A sourcing-call approval never authorizes a reservation. After the user selects an offer, SpareScout creates a second plan limited to holding the exact item under stated terms. The user reviews and approves that plan independently.

Reservation calls may not:

- authorize payment;
- accept a changed price or substitute part;
- provide payment credentials; or
- agree to fees not already displayed.

Any changed commercial term returns control to the user.

## Data handling

- Mask supplier numbers in browser-visible records.
- Keep CALL-E credentials server-side.
- Treat transcripts and call summaries as untrusted external data.
- Retain only the evidence needed to support displayed quote fields.
- Never expose confirmation tokens to the browser or logs.
