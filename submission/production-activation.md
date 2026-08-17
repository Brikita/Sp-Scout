# Production activation handoff

Last verified: 17 August 2026

## Current evidence

- The local CALL-E CLI is authenticated and reports `usable: true`.
- `plan_call`, `run_call`, and `get_call_run` are available.
- The deployed Sites environment currently has no production runtime variables.
- `GET /api/calls/capabilities` therefore reports `liveAvailable: false`.
- A direct consented live-plan request returns `503` before signing or persistence, and the live-record count remains unchanged.
- No call was placed during these checks.

CLI OAuth and the CALL-E Developer API key are separate credential surfaces. Do not copy the CLI token cache into the website runtime.

## Activate the trusted server

1. Open the [CALL-E dashboard](https://dashboard.heycall-e.com/) and create or retrieve a Developer API key. The [official quickstart](https://docs.heycall-e.com/quickstart) identifies the dashboard as the source for API keys.
2. Add these production runtime values through Sites settings, never through a committed file:

   | Key | Secret | Value |
   | --- | --- | --- |
   | `CALLE_MODE` | No | `live` |
   | `CALLE_API_KEY` | Yes | Developer API key from the CALL-E dashboard |
   | `SPARESCOUT_APPROVAL_SECRET` | Yes | Newly generated high-entropy application secret |
   | `CALLE_BASE_URL` | No | Optional; omit to use the SDK default |
   | `CALLE_WEBHOOK_URL` | No | Leave unset until a verified webhook receiver is deployed |

3. Deploy the already validated site version again so the environment revision is applied.
4. Verify `/api/calls/capabilities` returns `liveAvailable: true`. This check cannot place a call.
5. Enter only businesses that directly consented, record the authorized calling window, and prepare the exact signed plan.
6. Review the masked recipients and task. Place the smoke-test call only after explicit approval of that specific plan.

## Credential rules

- Never commit, log, paste into Devpost, or include in screenshots any API key, approval secret, OAuth token, or CLI cache contents.
- Keep the API key in the trusted Sites runtime only; browser code must never receive it.
- Rotate the API key or approval secret immediately if either is exposed.
- Do not enable a webhook URL until its signature-verification path is configured and tested.
