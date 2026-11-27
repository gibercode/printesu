import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  MAX_EXTRA_PRINTERS,
  emptySettings,
  newPrinterUid,
} from "../lib/defaults";
import type { Settings } from "../lib/types";

type Obj = Record<string, unknown>;

const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null;
const str = (v: unknown, fallback = "") =>
  typeof v === "string" ? v : fallback;

export function sanitizeSettings(raw: unknown): Settings {
  const base = emptySettings();
  if (!isObj(raw)) return base;
  const printers = (Array.isArray(raw.printers) ? raw.printers : [])
    .filter(isObj)
    .slice(0, MAX_EXTRA_PRINTERS)
    .map((p) => ({
      uid: str(p.uid) || newPrinterUid(),
      name: str(p.name),
      printerCost: str(p.printerCost),
      lifeHours: str(p.lifeHours),
      maintPerHour: str(p.maintPerHour),
    }));
  const fields = Object.entries(base).map(([k, d]) => [
    k,
    str(raw[k], d as string),
  ]);
  return { ...Object.fromEntries(fields), printers } as Settings;
}

type SettingsStore = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  reset: () => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: emptySettings(),
      setSettings: (settings) => set({ settings: sanitizeSettings(settings) }),
      reset: () => set({ settings: emptySettings() }),
    }),
    {
      name: "printesu:settings",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ settings: state.settings }),
      merge: (persisted, current) => ({
        ...current,
        settings: sanitizeSettings(isObj(persisted) && persisted.settings),
      }),
    },
  ),
);
