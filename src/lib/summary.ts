import { formatBs, formatRate, formatRef } from "./format";
import type { Part, Requester } from "./types";
import type { Quote } from "./pricing";
import type { RateState } from "../store/rate";

const pricePair = (usd: number, rate: RateState) =>
  rate.status === "ready"
    ? `${formatBs(usd, rate.rate)} (${formatRef(usd)})`
    : formatRef(usd);

export function buildSummary(
  parts: Part[],
  quote: Quote,
  rate: RateState,
  r: Requester,
): string {
  const lines = parts.map(
    (p, i) =>
      `${i + 1}. ${p.name.trim() ? `${p.name.trim()} · ` : ''}${p.material} ${p.layer} mm${p.multicolor ? " multicolor" : ""} · ${quote.lines[i].qty} uds · ${pricePair(quote.lines[i].final, rate)}`,
  );
  const rateLine =
    rate.status === "ready" ? `Tasa BCV: ${formatRate(rate.rate)} Bs/$` : "";
  return [
    r.name
      ? `Hola ${r.name}, este es tu presupuesto de impresión 3D:`
      : "Presupuesto de impresión 3D:",
    "",
    ...lines,
    "",
    `Total: ${pricePair(quote.total, rate)}`,
    rateLine,
    r.notes ? `\n${r.notes}` : "",
  ]
    .filter((l, i, a) => l !== "" || (i > 0 && a[i - 1] !== ""))
    .join("\n");
}
