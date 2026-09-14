"use client";

import { useRef, useState } from "react";

export function LabelReader({ onReference }: { onReference: (value: string) => void }) {
  const [text, setText] = useState("");
  const [reference, setReference] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [filename, setFilename] = useState("");
  const input = useRef<HTMLInputElement>(null);

  async function read(file: File) {
    if (!/image\/(jpeg|png|webp)/.test(file.type) || file.size > 10 * 1024 * 1024) {
      setStatus("Choose a JPG, PNG or WebP image smaller than 10 MB.");
      return;
    }
    setBusy(true); setText(""); setReference(""); setFilename(file.name); setStatus("Loading label reader…");
    let worker: Awaited<ReturnType<typeof import("tesseract.js")["createWorker"]>> | undefined;
    try {
      const { createWorker } = await import("tesseract.js");
      worker = await createWorker("eng", 1, { logger: (message) => {
        if (message.status === "recognizing text") setStatus(`Reading label… ${Math.round(message.progress * 100)}%`);
      } });
      const { data } = await worker.recognize(file);
      const extracted = data.text.trim();
      setText(extracted);
      const candidate = extracted.match(/\b[A-HJ-NPR-Z0-9]{17}\b|\b[A-Z0-9]{3,8}-[A-Z0-9]{3,10}\b/i)?.[0] ?? "";
      setReference(candidate.toUpperCase());
      setStatus(extracted ? "Label read. Check the characters against your photo before using them." : "No readable text found. Try a brighter, closer photo of the printed label.");
    } catch {
      setStatus("The label reader could not load. Check your connection or enter the reference manually.");
    } finally {
      await worker?.terminate();
      setBusy(false);
    }
  }

  return <details className="label-reader">
    <summary><span className="feature-icon" aria-hidden="true">⌗</span><span><strong>Have a photo of the label?</strong><small>Read a VIN or part number from a photo</small></span><span aria-hidden="true">+</span></summary>
    <div className="label-reader-body">
      <p>Use a close-up of printed text on the part, box or vehicle plate. This reads text; it doesn’t identify a part from its shape.</p>
      <input ref={input} className="sr-only" type="file" aria-label="Part label photo" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={(event) => { const file = event.target.files?.[0]; if (file) void read(file); }} />
      <button type="button" className="secondary-button" disabled={busy} onClick={() => input.current?.click()}>{busy ? "Reading photo…" : "Choose a label photo"}</button>
      {filename && <small>{filename}</small>}
      <p role="status">{status || "Your photo stays on this device. The reader downloads language files on first use."}</p>
      {text && <><label className="field"><span>Text found in the photo</span><textarea rows={3} value={text} onChange={(event) => setText(event.target.value)} /></label>
        <label className="field"><span>Confirm the VIN / part reference</span><input value={reference} maxLength={180} onChange={(event) => setReference(event.target.value)} placeholder="Copy the correct reference from the text above" /></label>
        <button type="button" className="secondary-button" disabled={!reference.trim()} onClick={() => { onReference(reference.trim()); setStatus("Reference added to your request. You can still edit it below."); }}>Use this reference</button></>}
    </div>
  </details>;
}
