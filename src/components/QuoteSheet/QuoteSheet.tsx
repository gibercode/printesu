import { Logo } from "../Logo";
import { useRate } from "../../store/rate";
import { formatBs, formatRef } from "../../lib/format";
import type { Quote } from "../../lib/pricing";
import type { Part, Requester } from "../../lib/types";
import "./QuoteSheet.css";

type Props = {
  parts: Part[];
  quote: Quote;
  requester: Requester;
  date: string;
};

export function QuoteSheet({ parts, quote, requester, date }: Props) {
  const rate = useRate();
  const price = (usd: number) =>
    rate.status === "ready" ? formatBs(usd, rate.rate) : formatRef(usd);
  const secondary = (usd: number) =>
    rate.status === "ready" ? formatRef(usd) : "";

  return (
    <section className="quote-sheet" aria-hidden="true">
      <header className="q-head">
        <Logo />
        <div className="q-meta">
          <strong>Presupuesto</strong>
          <span>{date}</span>
        </div>
      </header>

      {requester.name && (
        <p className="q-for">
          Para <strong>{requester.name}</strong>
        </p>
      )}

      <ol className="q-items">
        {parts.map((p, i) => {
          const line = quote.lines[i];
          return (
            <li key={i}>
              <span className="q-n">{i + 1}</span>
              <div className="q-desc">
                {p.name.trim() ? (
                  <>
                    <strong>{p.name.trim()}</strong>
                    <span>
                      {p.material} · {p.layer} mm
                      {p.multicolor ? " · multicolor" : ""}
                    </span>
                  </>
                ) : (
                  <>
                    <strong>{p.material}</strong>
                    <span>
                      {p.layer} mm{p.multicolor ? " · multicolor" : ""}
                    </span>
                  </>
                )}
              </div>
              <span className="q-qty">×{line?.qty ?? 1}</span>
              <div className="q-price">
                <strong>{price(line?.final ?? 0)}</strong>
                <span>{secondary(line?.final ?? 0)}</span>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="q-total">
        <span>Total</span>
        <div>
          <strong>{price(quote.total)}</strong>
          <span>{secondary(quote.total)}</span>
        </div>
      </div>

      {requester.notes && <p className="q-notes">{requester.notes}</p>}
    </section>
  );
}
