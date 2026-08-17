import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const submissionRoot = new URL("../submission/awesome-phone-call-agents/", import.meta.url);

async function readSubmissionFile(name: string) {
  return readFile(new URL(name, submissionRoot), "utf8");
}

test("upstream contribution kit is safe, runnable, and free of private hosting metadata", async () => {
  const [appReadme, readmeEntry, pullRequestBody, prepareScript] = await Promise.all([
    readSubmissionFile("APP_README.md"),
    readSubmissionFile("README_ENTRY.md"),
    readSubmissionFile("PR_BODY.md"),
    readSubmissionFile("prepare-contribution.ps1"),
  ]);

  assert.match(appReadme, /deterministic fixture/i);
  assert.match(appReadme, /does not dial/i);
  assert.match(appReadme, /Real-world side effects/);
  assert.match(appReadme, /npm run check/);
  assert.match(appReadme, /no cancellation control/i);
  assert.match(readmeEntry, /apps\/typescript\/sparescout/);
  assert.match(pullRequestBody, /python3 scripts\/validate_repository\.py/);
  assert.match(prepareScript, /apps\\typescript\\sparescout/);
  assert.match(prepareScript, /"d1": "DB"/);
  assert.doesNotMatch(prepareScript, /project_id/);

  const permanentFiles = `${appReadme}\n${readmeEntry}\n${prepareScript}`;
  assert.doesNotMatch(permanentFiles, /codex\//i);
  assert.doesNotMatch(permanentFiles, /appgprj_[a-z0-9]+/i);
  assert.doesNotMatch(permanentFiles, /(?:CALLE_API_KEY|SPARESCOUT_APPROVAL_SECRET)\s*=\s*[^<\s]/);
});
