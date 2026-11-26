import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { MAX_EXTRA_PRINTERS, emptySettings, newPrinterUid } from '../lib/defaults'
import type { Printer, Settings } from '../lib/types'

/** Keeps only known string fields so a stale or hand-edited entry can never break the form. */
export function sanitizeSettings(raw: unknown): Settings {
  const base = emptySettings()
  if (typeof raw !== 'object' || raw === null) return base
  const src = raw as Record<string, unknown>
  const text = (o: Record<string, unknown>, k: string) => (typeof o[k] === 'string' ? o[k] : '')
  const printers: Printer[] = (Array.isArray(src.printers) ? src.printers : [])
    .filter((p): p is Record<string, unknown> => typeof p === 'object' && p !== null)
    .slice(0, MAX_EXTRA_PRINTERS)
    .map((p) => ({
      uid: text(p, 'uid') || newPrinterUid(),
      name: text(p, 'name'),
      printerCost: text(p, 'printerCost'),
      lifeHours: text(p, 'lifeHours'),
      maintPerHour: text(p, 'maintPerHour'),
    }))
  const strings = Object.fromEntries(
    (Object.keys(base) as (keyof Settings)[])
      .filter((k) => k !== 'printers')
      .map((k) => [k, typeof src[k] === 'string' ? src[k] : base[k]]),
  )
  return { ...strings, printers } as Settings
}

type SettingsStore = {
  settings: Settings
  setSettings: (settings: Settings) => void
  reset: () => void
}

/** Workshop settings, saved in this browser's localStorage. */
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: emptySettings(),
      setSettings: (settings) => set({ settings: sanitizeSettings(settings) }),
      reset: () => set({ settings: emptySettings() }),
    }),
    {
      name: 'printesu:settings',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ settings: state.settings }),
      merge: (persisted, current) => ({
        ...current,
        settings: sanitizeSettings((persisted as { settings?: unknown } | undefined)?.settings),
      }),
    },
  ),
)
