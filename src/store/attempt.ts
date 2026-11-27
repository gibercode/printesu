import { create } from "zustand";

type AttemptStore = {
  attempted: boolean;
  setAttempted: (attempted: boolean) => void;
};

export const useAttemptStore = create<AttemptStore>()((set) => ({
  attempted: false,
  setAttempted: (attempted) => set({ attempted }),
}));
