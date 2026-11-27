import { Skeleton } from "../Skeleton";
import { useRate } from "../../store/rate"
import { formatBs, formatRef } from "../../lib/format";
import './Money.css'

export function Money({ usd, className }: { usd: number; className?: string }) {
  const rate = useRate();
  return (
    <span className={`money${className ? ` ${className}` : ""}`}>
      <strong className="num">
        {rate.status === "loading" ? (
          <Skeleton width={9} />
        ) : rate.status === "ready" ? (
          <span className="reveal">{formatBs(usd, rate.rate)}</span>
        ) : (
          formatRef(usd)
        )}
      </strong>
      <small className="num">
        {rate.status === "error" ? "Bs —" : formatRef(usd)}
      </small>
    </span>
  );
}
