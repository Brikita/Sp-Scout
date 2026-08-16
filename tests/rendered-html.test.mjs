import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the SpareScout sourcing experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>SpareScout/);
  assert.match(html, /The right part/);
  assert.match(html, /Review supplier call plan/);
  assert.match(html, /Safe demo mode/);
  assert.match(html, /No phone calls or reservations will be made/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("keeps real-world side effects behind explicit approval", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /Approve 3 demo calls/);
  assert.match(page, /A separate approval is always required before a reservation call/);
  assert.match(page, /Payment, purchase, and reservation are blocked/);
  assert.match(page, /no supplier was contacted and nothing was reserved/i);
  assert.doesNotMatch(page, /run_call|call start|confirm_token/);
  assert.match(layout, /SpareScout — Phone-powered parts sourcing/);
  assert.doesNotMatch(layout, /codex-preview|_sites-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
