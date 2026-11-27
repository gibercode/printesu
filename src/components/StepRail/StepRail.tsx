import { memo } from "react";
import { Skeleton } from "../Skeleton";
import { useRate } from "../../store/rate";
import { useActiveId } from "../../hooks/useActiveId";
import {
  formatBs,
  formatBsNumber,
  formatNumber,
  formatRef,
} from "../../lib/format";
import type { Quote } from "../../lib/pricing";
import { scrollToId } from "../../lib/scroll";
import type { Part } from "../../lib/types";
import "./StepRail.css";

type Props = { ids: string[]; parts: Part[]; quote: Quote };

export const StepRail = memo(function StepRail({ ids, parts, quote }: Props) {
  const rate = useRate();
  const active = useActiveId(ids);
  return (
    <nav className="rail" aria-label="Piezas del presupuesto">
      {ids.map((id, i) => {
        const price = quote.lines[i]?.final ?? 0;
        return (
          <button
            key={id}
            type="button"
            onClick={() => scrollToId(id)}
            className="tab"
            aria-current={id === active ? "true" : undefined}
            aria-label={`Pieza ${i + 1}${parts[i]?.name.trim() ? `, ${parts[i].name.trim()}` : ""}, ${rate.status === "ready" ? formatBs(price, rate.rate) : formatRef(price)}`}
          >
            <span className="tab-n">{i + 1}</span>
            <span className="tab-p">
              {rate.status === "loading" ? (
                <Skeleton width={5} />
              ) : rate.status === "ready" ? (
                formatBsNumber(price, rate.rate)
              ) : (
                formatNumber(price)
              )}
            </span>
          </button>
        );
      })}
    </nav>
  );
});
