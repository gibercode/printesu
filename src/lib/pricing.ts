import type { Part, Settings } from './types'

export type Parsed = { value: number; invalid: boolean }

/** Accepts "12,5" and "12.5"; blank counts as 0; negatives and text are invalid. */
export function parse(raw: string | undefined): Parsed {
  const t = (raw ?? '').trim().replace(',', '.')
  if (t === '') return { value: 0, invalid: false }
  const v = Number(t)
  return Number.isFinite(v) && v >= 0 ? { value: v, invalid: false } : { value: 0, invalid: true }
}

export const num = (raw: string | undefined) => parse(raw).value

/** react-hook-form validator shared by every numeric field. */
export const validateNumber = (raw: string) => !parse(raw).invalid || 'Escribe un número de 0 o más.'

/** Repair allowance when maintenance is left blank: 5% of the printer's price over its life (Prusa's calculator default). */
export const REPAIR_ALLOWANCE = 0.05

/** Machine cost per print hour: printer price over its life plus maintenance (typed, or the repair allowance). */
export function machineRate(s: Settings): number {
  const life = num(s.lifeHours)
  if (life <= 0) return num(s.maintPerHour)
  const depreciation = num(s.printerCost) / life
  const maintenance = s.maintPerHour.trim() === '' ? depreciation * REPAIR_ALLOWANCE : num(s.maintPerHour)
  return depreciation + maintenance
}

export type LineCost = {
  grams: number
  hours: number
  qty: number
  material: number
  machine: number
  subtotal: number
  final: number
  missing: string[]
  /** Hours were entered but no machine rate is defined (neither on the part nor in settings). */
  machineIdle: boolean
}

export type Quote = {
  lines: LineCost[]
  material: number
  machine: number
  subtotal: number
  failure: number
  margin: number
  total: number
  totalHours: number
}

export const EMPTY_LINE: LineCost = {
  grams: 0,
  hours: 0,
  qty: 1,
  material: 0,
  machine: 0,
  subtotal: 0,
  final: 0,
  missing: [],
  machineIdle: false,
}

const factorOf = (s: Settings) => ({
  failure: 1 + num(s.failurePct) / 100,
  margin: 1 + num(s.marginPct) / 100,
})

export function lineCost(p: Part, s: Settings, factor: number): LineCost {
  const grams = num(p.modelG) + num(p.supportG) + (p.multicolor ? num(p.purgeG) : 0)
  const hours = num(p.hours) + num(p.minutes) / 60
  const qty = Math.max(1, Math.round(num(p.qty)) || 1)
  const own = num(p.hourRate)
  const rate = own > 0 ? own : machineRate(s)
  const material = (grams / 1000) * num(p.pricePerKg)
  const machine = hours * rate
  const subtotal = (material + machine) * qty

  const missing: string[] = []
  if (grams === 0) missing.push('peso')
  if (num(p.pricePerKg) === 0) missing.push('precio del material')
  if (hours === 0) missing.push('tiempo')

  return {
    grams: grams * qty,
    hours: hours * qty,
    qty,
    material: material * qty,
    machine: machine * qty,
    subtotal,
    final: subtotal * factor,
    missing,
    machineIdle: hours > 0 && rate === 0,
  }
}

export function computeQuote(parts: Part[], s: Settings): Quote {
  const { failure, margin } = factorOf(s)
  const lines = parts.map((p) => lineCost(p, s, failure * margin))
  const material = lines.reduce((a, l) => a + l.material, 0)
  const machine = lines.reduce((a, l) => a + l.machine, 0)
  const subtotal = material + machine
  const withFailure = subtotal * failure
  const total = withFailure * margin
  return {
    lines,
    material,
    machine,
    subtotal,
    failure: withFailure - subtotal,
    margin: total - withFailure,
    total,
    totalHours: lines.reduce((a, l) => a + l.hours, 0),
  }
}
