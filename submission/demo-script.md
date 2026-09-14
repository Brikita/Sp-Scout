# SpareScout demo — exact simulated-call recording script

**Target length:** 2 minutes 25 seconds.
**Format:** desktop screen recording, 16:9, with captions.

Text in quotation marks is the exact narration. Text under **Action** is what to do on screen. Do not read the action notes aloud.

Keep the caption **NO-CALL FIXTURE · SIMULATED SUPPLIER RESPONSES** visible for the entire workflow. This is the dependable submission version while CALL-E does not accept the Kenya/English recipient combination.

## Before recording

1. Open https://sp-scout.vercel.app in a clean browser window.
2. Confirm the mode banner says **Safe demo mode** and **DRY RUN**.
3. Prepare a clear printed label image containing reference `43550-12030`.
4. Close notifications and unrelated tabs.
5. Set the recorder to 1080p and enable your permanent fixture caption.

## 0:00–0:16 — State the problem and demo boundary

**Action:** Start on the headline and keep the **Safe demo mode** banner visible.

**Say:**

> “The right vehicle part often exists, but its availability is trapped behind phone calls. SpareScout turns those conversations into comparable evidence. This recording uses the clearly labeled no-call fixture, so no real supplier is contacted.”

## 0:16–0:40 — Build one reliable request

**Action:** In **Your part**, set:

- Vehicle: `2014 Toyota Fielder`
- Part needed: `Front-left wheel bearing`

Open **Have a photo of the label?**, choose the prepared image, wait for OCR, confirm that `43550-12030` appears, then select **Use this reference**.

**Say:**

> “I enter the vehicle and part once. SpareScout can read printed text from a label photo, but it never trusts the result automatically. I verify the reference before using it.”

**Action:** Select **Continue to preferences**.

## 0:40–0:56 — Keep every result comparable

**Action:** Leave or select:

- Calling market: `Kenya`
- Call language: `English`
- Budget ceiling: `8000`
- Needed by: `Today`
- Delivery location: `Nairobi CBD`

Select **Continue to suppliers**.

**Say:**

> “The same fitment reference, budget, deadline, language, and destination apply to every supplier, making the answers directly comparable.”

## 0:56–1:12 — Show the safe simulation

**Action:** Keep **Try the demo** selected. Pause on the three sample suppliers and the disabled live option.

**Say:**

> “The demo simulates three supplier conversations with fictional numbers and deterministic outcomes. Kenya remains fully available for this product walkthrough, while live calling is disabled when the provider does not support the selected recipient and language.”

**Action:** Select **Review supplier call plan**.

## 1:12–1:32 — Show human approval

**Action:** Point to the fitment question, requested quote fields, delivery request, masked fictional contacts, and **No commitments** panel.

**Say:**

> “Before execution, I review the exact scope. The same approval boundary protects the live adapter: calls may gather quotes, but they cannot purchase, pay, reserve, or accept a substitute part.”

**Action:** Select **Approve 3 demo calls** once.

## 1:32–1:45 — Show the simulated execution

**Action:** Let the complete progress sequence play without cutting away. Keep the fixture caption visible.

**Say:**

> “These progress events and supplier outcomes are simulated for the recording. In live mode, the server submits the approved plan to CALL-E once and monitors the existing run with a stable idempotency key.”

## 1:45–2:10 — Turn responses into a decision

**Action:** On the result cards, open **View call evidence**. Point to the verified quote and the incomplete or rejected outcome. Select **Side by side**, then filter to **Ready to select**.

**Say:**

> “SpareScout ranks evidence before price. Compatibility, a positive price, confirmed stock, and supporting evidence are all required before an offer can be selected. Missing information stays visible instead of becoming a confident guess.”

## 2:10–2:25 — Close on buyer control

**Action:** Select the verified offer, open **Preview reservation call**, then show **Draft only · nothing reserved**. Finish on **The project** page.

**Say:**

> “Selecting a quote still commits to nothing. SpareScout makes phone-based inventory reviewable, while the buyer keeps control of every consequential step.”

End immediately.

## Required caption

Keep this exact caption on screen throughout the workflow:

`NO-CALL FIXTURE · SIMULATED SUPPLIER RESPONSES`

Do not show the rejected live attempt in the main video. If a consenting recipient in a supported CALL-E region becomes available, use `submission/live-demo-plan.md` to record a separate short live proof and label it `LIVE CALL · PRE-ARRANGED CONSENTING RECIPIENT`.

## Evidence to retain

- Recording date and deployed commit SHA
- Confirmation that the public URL reports fixture-only capability
- Final public video URL
- Any separate live CALL-E run ID only if a supported, consenting live test is completed
