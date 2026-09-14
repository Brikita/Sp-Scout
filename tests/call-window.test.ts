import assert from "node:assert/strict";
import test from "node:test";
import { assertCallWindowOpen, parseCallWindow } from "../lib/call-window.ts";

test("calling window enforces both boundaries and explicit time zones", () => {
  const window = "2026-09-11T15:00:00+03:00/2026-09-11T16:00:00+03:00";
  assert.doesNotThrow(() => assertCallWindowOpen(window, new Date("2026-09-11T12:00:00Z")));
  assert.throws(() => assertCallWindowOpen(window, new Date("2026-09-11T11:59:59Z")), /only start/);
  assert.throws(() => assertCallWindowOpen(window, new Date("2026-09-11T13:00:00Z")), /only start/);
  assert.throws(() => parseCallWindow("tomorrow afternoon"), /valid calling/);
  assert.throws(() => parseCallWindow("2026-09-11T15:00:00/2026-09-11T16:00:00"), /time zone/);
});
