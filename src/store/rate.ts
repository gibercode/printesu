import { create } from "zustand";
import { fetchBcvRate } from "../lib/bcv";

export type RateState =
  | { status: "loading" }
  | { status: "ready"; rate: number; stale: boolean }
  | { status: "error" };

type RateStore = {
  state: RateState;
  refreshing: boolean;
  load: () => void;
};

let inflight: AbortController | null = null;

export const useRateStore = create<RateStore>()((set, get) => ({
  state: { status: "loading" },
  refreshing: false,
  load: () => {
    inflight?.abort();
    const controller = new AbortController();
    inflight = controller;
    set({
      refreshing: true,
      state:
        get().state.status === "ready" ? get().state : { status: "loading" },
    });
    fetchBcvRate(controller.signal)
      .then(({ rate }) =>
        set({
          state: { status: "ready", rate, stale: false },
          refreshing: false,
        }),
      )
      .catch(() => {
        if (controller.signal.aborted) return;
        const s = get().state;
        set({
          state:
            s.status === "ready" ? { ...s, stale: true } : { status: "error" },
          refreshing: false,
        });
      });
  },
}));

export const useRate = () => useRateStore((s) => s.state);
