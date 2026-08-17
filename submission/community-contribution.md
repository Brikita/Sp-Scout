# Awesome Phone Call Agents contribution plan

Contribution area: **User-facing Apps**
Target path: `apps/typescript/sparescout/`

The official contribution guide was rechecked on 17 August 2026. The prepared app README, exact upstream table row, pull-request body, and safe copy script live in `submission/awesome-phone-call-agents/`.

Proposed README entry:

> `apps/typescript/sparescout` — Approval-gated multi-supplier vehicle-part sourcing with strict fitment quote schemas, stable CALL-E idempotency, durable evidence history, supported-market localization, and a no-call fixture default.

The contribution bundle should include:

- application source and lockfile;
- setup and environment-variable instructions;
- explicit outbound-call side effects;
- fixture-first judge walkthrough;
- credential and phone-number handling;
- approval, retry, and cancellation limitations;
- structured result schema;
- tests that run without CALL-E credentials;
- verified screenshots or public demo link; and
- no real phone numbers, tokens, transcripts, or pilot personal data.

Before opening the pull request:

1. Clone or fork the upstream repository and run `prepare-contribution.ps1 -UpstreamRoot <path>` to copy the explicit source manifest without build output, private Sites ids, secrets, or local D1 state.
2. Adapt links so the app remains runnable from the monorepo path.
3. Add the factual one-line entry under **Apps** in the upstream README.
4. Run `python3 scripts/validate_repository.py` in the upstream repository.
5. Use the upstream naming conventions for the branch, commit, and pull-request title.
6. Put the resulting PR URL in the Devpost submission.
