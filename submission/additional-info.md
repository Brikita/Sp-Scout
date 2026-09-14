# Additional information for judges and organizers

Copy the entries below into Devpost. Replace the three bracketed personal details before saving.

## Submitter details

- **Submitter Type:** `[Individual or Team]`
- **Country of residence/incorporation:** `[Your country; for a team, list every member's country]`
- **Organization name:** Leave blank unless the submission belongs to an organization.
- **App status:** Pre-existing and updated
- **CALL-E account email:** `[Email used for your CALL-E account]`

## What was updated during the submission period

During the submission period, SpareScout was expanded from an initial phone-powered parts-sourcing prototype into a reviewable end-to-end product. We added a three-step request workflow, printed-label OCR with user confirmation, supplier discovery, market-aware call settings, an explicit approval gate, evidence-based quote readiness, side-by-side comparison, downloadable sourcing briefs, request history, pilot reporting, and a project information page. We also strengthened server-side recipient allowlisting, signed approvals, idempotent CALL-E execution, call-window enforcement, D1 persistence, incomplete-result handling, responsive accessibility, automated API and contract tests, and dependency security.

## Testing instructions for application

1. Open https://sp-scout.vercel.app on desktop or mobile.
2. The public build starts in **Safe demo mode**. It uses fictional suppliers and never places a phone call or reservation.
3. Enter or keep the sample vehicle, part, and reference. Optionally open the label-photo reader; confirm any extracted reference before using it.
4. Select **Continue to preferences**, review the market, budget, deadline, and delivery location, then continue to suppliers.
5. Review the three fictional suppliers and select **Review supplier call plan**.
6. Confirm the exact call scope at the approval gate, then select **Approve 3 demo calls**.
7. Compare the returned quotes. Switch between Cards and Side by side, inspect evidence, filter to Ready to select, choose an offer, and download the sourcing brief.
8. Visit **The project**, **Safety**, and **Pilot evidence** from the navigation for architecture, limitations, and evidence boundaries.

The fixture is deliberately labeled throughout. Live calling is enabled only on a separately configured trusted deployment with D1 storage, a CALL-E API key, explicit recipient consent, and an active authorized call window.

## Required URLs and classification

- **Functional demo URL:** https://sp-scout.vercel.app
- **Project submission pull request URL:** https://github.com/CALLE-AI/awesome-phone-call-agents/pull/261
- **Primary use case:** Service coordination & dispatch
- **One-sentence real-world task:** SpareScout calls consenting auto-parts suppliers in parallel to verify vehicle-part fitment, stock, price, and delivery, then returns evidence-backed quotes for the buyer to compare.

## Eligibility checkboxes

Only the submitter can truthfully confirm the age-of-majority, eligible-jurisdiction, and sponsor-employment statements. Review each statement personally before checking it.
