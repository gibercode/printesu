import { useState } from "react";

export function useTotalDelta(total: number) {
  const [prev, setPrev] = useState(total);
  const [delta, setDelta] = useState(0);
  if (total !== prev) {
    setPrev(total);
    setDelta(total - prev);
  }
  const reset = (next: number) => {
    setPrev(next);
    setDelta(0);
  };
  return [delta, reset] as const;
}
