import type { DeadlineState, FundingOpportunity } from "./contracts";

const DAY = 86_400_000;

/** Pure business rule: open, closing soon (≤ 14 days) or closed. */
export function deadlineState(deadline: string, now: Date = new Date()): DeadlineState {
  const ms = new Date(deadline).getTime() - now.getTime();
  if (ms < 0) return "closed";
  if (ms <= 14 * DAY) return "closing-soon";
  return "open";
}

export function formatDeadline(deadline: string, now: Date = new Date()): string {
  const d = new Date(deadline);
  const days = Math.ceil((d.getTime() - now.getTime()) / DAY);
  const date = d.toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  if (days < 0) return `Closed ${date}`;
  if (days === 0) return `Closes today`;
  if (days === 1) return `Closes tomorrow`;
  if (days <= 14) return `Closes in ${days} days`;
  return `Closes ${date}`;
}

export function formatAmount(o: Pick<FundingOpportunity, "amountMin" | "amountMax" | "currency">): string {
  const f = (n: number) => `$${n.toLocaleString("en-CA")}`;
  return o.amountMin === o.amountMax ? `${f(o.amountMax)} ${o.currency}` : `${f(o.amountMin)}–${f(o.amountMax)} ${o.currency}`;
}
