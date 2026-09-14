export function parseCallWindow(value: string): { start: number; end: number } {
  const parts = value.split("/");
  const iso = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})$/;
  const start = Date.parse(parts[0]);
  const end = Date.parse(parts[1]);
  if (parts.length !== 2 || !parts.every((part) => iso.test(part)) || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    throw new Error("Choose a valid calling start and end time with a time zone.");
  }
  return { start, end };
}

export function assertCallWindowOpen(value: string, now = new Date()): void {
  const { start, end } = parseCallWindow(value);
  if (now.getTime() < start || now.getTime() >= end) {
    throw new Error("Calls can only start during the approved calling window. Review the times before approving again.");
  }
}
