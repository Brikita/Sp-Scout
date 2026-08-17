import { env } from "cloudflare:workers";
import { calculateCalleCapabilities } from "../../../lib/calle/capabilities";
import type { CalleRuntimeConfig } from "../../../lib/calle/server";

type RuntimeBindings = {
  CALLE_MODE?: string;
  CALLE_API_KEY?: string;
  CALLE_BASE_URL?: string;
  CALLE_WEBHOOK_URL?: string;
  SPARESCOUT_APPROVAL_SECRET?: string;
};

function bindings(): RuntimeBindings {
  return env as unknown as RuntimeBindings;
}

export function getCalleRuntimeConfig(): CalleRuntimeConfig {
  const runtime = bindings();
  return {
    mode: runtime.CALLE_MODE === "live" ? "live" : "fixture",
    apiKey: runtime.CALLE_API_KEY,
    baseUrl: runtime.CALLE_BASE_URL,
    webhookUrl: runtime.CALLE_WEBHOOK_URL,
  };
}

export function getCalleCapabilities() {
  return calculateCalleCapabilities(bindings());
}

export function getApprovalSecret(mode: "fixture" | "live"): string {
  const secret = bindings().SPARESCOUT_APPROVAL_SECRET;
  if (secret) return secret;
  if (mode === "fixture") return "sparescout-fixture-approval-secret";
  throw new Error("Live calling is unavailable because SPARESCOUT_APPROVAL_SECRET is not configured.");
}
