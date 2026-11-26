/** Inline placeholder sized in `ch`; it sits inside the real text's line box so nothing shifts when data arrives. */
export function Skeleton({ width, className }: { width: number; className?: string }) {
  return <span className={`skeleton${className ? ` ${className}` : ''}`} style={{ width: `${width}ch` }} aria-hidden="true" />
}

export function Spinner() {
  return <span className="spinner" aria-hidden="true" />
}
