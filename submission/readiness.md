# Submission readiness

Last verified: 31 August 2026

SpareScout is product-complete for a no-call judge walkthrough and has a real server-side CALL-E runtime behind explicit approval. The remaining work depends on deliberate external actions, so this ledger separates built evidence from claims that must not be made yet.

| Requirement | Status | Evidence or next action |
| --- | --- | --- |
| Complete product experience | Ready | Home, About, How it works, Markets, Safety, Privacy, History, and pilot-metrics surfaces are implemented. |
| Global adaptability | Ready | Seventeen CALL-E recipient regions, market-aware currencies, and supported call languages are versioned in the application. |
| Safe judge path | Ready | Deterministic fixture is the default and never calls a real number. |
| Real CALL-E runtime | Implemented, not pilot-proven | Official server SDK, authenticated operator, server recipient allowlist, phone-free browser approval, direct-consent/window enforcement, pinned provider origin, stable idempotency, durable monitoring, and structured results are implemented. Run only an explicitly approved consenting-supplier test. |
| Hosted live configuration | Ready | CALL-E CLI OAuth is usable, the trusted Sites runtime is configured, and the deployed no-call capability check reports live mode available. No secret values are committed. |
| Automated verification | Ready | `npm run check` builds, renders, tests contracts, and lints the project. |
| Durable pilot metrics | Infrastructure ready | Live-only calculations exclude fixtures. Populate them with the approved pilot; do not invent results. |
| Public functional demo | Ready | https://sp-scout.vercel.app returns 200 and completed a fixture-only plan, approval, and three-quote execution walkthrough. Live calling is disabled on the judge runtime. |
| Public source repository | Ready | `main` is publicly available at https://github.com/Brikita/Sp-Scout with no tracked runtime secrets. |
| Community contribution PR | Open | The validated contribution is available at https://github.com/CALLE-AI/awesome-phone-call-agents/pull/261. |
| Demo video under three minutes | Script ready | Record `submission/demo-script.md` after the pilot so the video can show verified evidence. Upload publicly to YouTube or Vimeo. |
| Devpost project copy | Draft ready | Replace every bracketed URL in `submission/devpost-draft.md` and include the public community PR URL. |
| CALL-E account email | User-provided at submission | Enter it directly in Devpost; do not commit it to the repository. |

## Critical path

1. Privately add the verified consenting supplier set to the deployment allowlist, provide one exact test window, authenticate as the operator, review the resulting plan, then explicitly approve the real CALL-E pilot.
2. Review the durable records and generated metrics; publish only sanitized evidence.
3. Recheck the public Vercel deployment after each release from `main`.
4. Record and upload the sub-three-minute demo.
5. Prepare and validate the upstream app contribution, then authorize the public pull request.
6. Replace all Devpost placeholders, perform a fresh judge walkthrough, and submit before 14 September 2026 at 18:45 Africa/Nairobi.

No live call, video upload, or final Devpost submission is performed by this checklist.
