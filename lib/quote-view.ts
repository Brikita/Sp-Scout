import type { SourcingExecution } from "./calle/contracts.ts";

export type QuoteView = {
  id: number;
  supplier: string;
  area: string;
  status: "Verified" | "Partial" | "Rejected" | "Unavailable";
  brand: string;
  condition: string;
  price: number | null;
  stock: string;
  delivery: string;
  evidence: string;
  note?: string;
  selectable: boolean;
};

export function executionQuotes(execution: SourcingExecution, suppliers: { id: string; area?: string | null }[]): QuoteView[] {
  return execution.quotes.map((quote, index) => {
    const result = quote.result ?? {};
    const found = quote.status === "completed" && result.part_found === true;
    const compatible = found && result.compatibility === "confirmed";
    const price = typeof result.price_amount === "number" && Number.isFinite(result.price_amount) && result.price_amount > 0
      ? result.price_amount : null;
    const quantity = typeof result.available_quantity === "number" ? result.available_quantity : null;
    const evidence = Array.isArray(result.evidence)
      ? result.evidence.filter((item): item is string => typeof item === "string" && Boolean(item.trim())).join(" ") : "";
    const status = !found ? "Unavailable" : result.compatibility === "rejected" ? "Rejected" : compatible ? "Verified" : "Partial";
    return {
      id: index + 1,
      supplier: quote.supplierName,
      area: suppliers.find((supplier) => supplier.id === quote.supplierId)?.area ?? "Supplier",
      status,
      brand: typeof result.brand === "string" && result.brand ? result.brand : "Unknown brand",
      condition: ["new", "used", "remanufactured"].includes(String(result.condition)) ? String(result.condition) : "condition unknown",
      price,
      stock: quantity === null ? "Stock unknown" : quantity === 0 ? "Out of stock" : `${quantity} in stock`,
      delivery: result.delivery_available === "no" ? "Collection only" : typeof result.delivery_eta === "string" && result.delivery_eta ? result.delivery_eta : "Delivery unknown",
      evidence: evidence || quote.summary || "No evidence returned.",
      note: !found ? "No usable offer returned." : status === "Rejected" ? "This part does not fit the requested vehicle." : !compatible ? "Compatibility needs manual confirmation." : price === null ? "A price must be confirmed before selection." : quantity === null ? "Confirm available stock before selection." : quantity <= 0 ? "This part is currently out of stock." : undefined,
      selectable: compatible && price !== null && quantity !== null && quantity > 0 && Boolean(evidence),
    };
  });
}

export function bestVerifiedQuote(quotes: QuoteView[]): QuoteView | undefined {
  return quotes.filter((quote) => quote.selectable).sort((a, b) => a.price! - b.price!)[0];
}
