# SpareScout demo — exact recording script

**Target length:** 2 minutes 40 seconds.
**Format:** desktop screen recording, 16:9, with captions. Record the supplier's ringing-phone shot separately and insert it at 1:30. Use one consenting supplier for the main demo.

Text in quotation marks is the exact narration. Text under **Action** is what to do on screen. Do not read the action notes aloud.

## Before recording

1. Use the D1-backed Sites deployment and confirm that **Live pilot** is enabled.
2. Use a supplier who consented to the call. Obtain separate permission before publishing its name, voice, or transcript. If that permission is absent, use **Consenting supplier** as the displayed name and mute the supplier audio.
3. Add only that supplier to the server allowlist. Set a calling window that covers the rehearsal and recording.
4. Rehearse once. Confirm that the completed live result appears in History.
5. Prepare a clear printed label image containing reference `43550-12030`.
6. Close notifications and unrelated tabs. Never record environment variables, the operator token, approval data, full phone numbers, browser developer tools, or private consent messages.
7. Crop or blur the phone-number field when the supplier form is visible. The password field may show dots, but the credential must never be revealed.

## 0:00–0:14 — The problem

**Action:** Start on the SpareScout home page. Keep the headline and request workspace visible.

**Say:**

> “The right vehicle part often exists, but its availability is trapped behind phone calls. Buyers repeat the same details to several suppliers and still struggle to compare fitment, stock, price, and delivery.”

## 0:14–0:38 — Build one reliable request

**Action:** In **Your part**, set:

- Vehicle: `2014 Toyota Fielder`
- Part needed: `Front-left wheel bearing`

Open **Have a photo of the label?**, choose the prepared image, wait for OCR, check that `43550-12030` appears, then select **Use this reference**.

**Say:**

> “SpareScout captures the request once. I can type the reference or read printed text from a label photo. The extracted value is never trusted automatically—I check it, then choose to use it.”

**Action:** Select **Continue to preferences**.

## 0:38–0:53 — Keep every quote comparable

**Action:** In **Your preferences**, leave or select:

- Calling market: `Kenya`
- Call language: `English`
- Budget ceiling: `8000`
- Needed by: `Today`
- Delivery location: `Nairobi CBD`

Select **Continue to suppliers**.

**Say:**

> “The same market, budget, deadline, and delivery destination are applied to every supplier conversation, so the answers can be compared fairly.”

## 0:53–1:12 — Choose the live pilot safely

**Action:** Select **Live pilot**. Use one preconfigured consenting supplier. Do not pause on the complete phone number. Set the calling-window start and end, then check the direct-consent statement.

**Say:**

> “For this live demonstration, I am using one supplier who agreed in advance to receive the AI-assisted call. The server independently requires operator authentication, an allowlisted recipient, direct consent, and an active calling window.”

**Action:** Select **Review supplier call plan**.

## 1:12–1:30 — Human approval before dialing

**Action:** Pause on **Review the call plan**. Slowly point to the fitment question, quote fields, delivery request, masked supplier number, consent confirmation, and **No commitments** panel.

**Say:**

> “Before anything happens, I review the exact recipient and questions. This approval expires after fifteen minutes and cannot authorize payment, purchase, or a reservation. The call only gathers a quote.”

**Action:** Select **Approve 1 supplier call** once.

## 1:30–1:47 — Show the real CALL-E call

**Action:** Show **Live calls in progress** and **Scout is on the line**. Insert three to five seconds of the consenting supplier's phone ringing or being answered. Mask the number. Then use a clean edit with the caption: `Live CALL-E result returned after the call`.

**Say:**

> “CALL-E now places the approved call and SpareScout monitors that same run. The interface polls for status; refreshing History retrieves the existing run rather than dialing again.”

## 1:47–2:15 — Turn the conversation into evidence

**Action:** On the live results screen, show **Live results**. Open **View call evidence**. Point to fitment status, price, brand and condition, stock, delivery, and the evidence text. If a field is missing, point to the missing or follow-up state instead of hiding it.

**Say:**

> “The conversation returns as structured evidence. Fitment comes before price, and missing answers stay missing. An offer becomes selectable only when compatibility, a positive price, confirmed stock, and supporting evidence are all present.”

**Action:** Select **Side by side**, then **Ready to select**.

**Say:**

> “Now I can compare only the offers that are ready for a decision, while incomplete outcomes remain available for follow-up.”

## 2:15–2:30 — Preserve the buyer's control

**Action:** Return to **Cards** if needed. Select the verified offer, then select **Preview reservation call**. Pause on **Draft only · nothing reserved**.

**Say:**

> “Selecting a quote still does not buy or reserve anything. SpareScout prepares a separate follow-up, and another explicit approval would be required before any future reservation call.”

## 2:30–2:40 — Close

**Action:** Select **Download brief**, then finish on **The project** page or the product headline.

**Say:**

> “SpareScout turns phone-only inventory into comparable evidence, while the buyer keeps control of every consequential step.”

End immediately after the final sentence.

## Required edit labels

Use these exact captions where applicable:

- `LIVE CALL — PRE-ARRANGED CONSENTING SUPPLIER`
- `PHONE NUMBER MASKED FOR PRIVACY`
- `Live CALL-E result returned after the call`
- `QUOTE COLLECTION ONLY — NOTHING PURCHASED OR RESERVED`

Do not label fixture footage as live. If fixture footage is included, keep `NO-CALL FIXTURE` visible for the entire fixture segment.

## Exact fallback if the live result is incomplete

Keep the real incomplete result in the video and replace the narration in the results section with:

> “This live call did not return every required field, and SpareScout does not invent the missing information. The offer remains unavailable for selection until fitment, price, stock, and evidence are confirmed.”

You may then insert up to ten seconds of the fixture comparison, with `NO-CALL FIXTURE` visible, and say:

> “This clearly labeled fixture shows the completed comparison interface without claiming that another call occurred.”

## Evidence to retain privately

- The deployed commit SHA and recording date
- Written consent for the call
- Separate permission for any publicly identifiable shop name, voice, or transcript
- The CALL-E run ID and masked History record
- The final public video URL
