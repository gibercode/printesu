export type Settings = {
  printerCost: string
  lifeHours: string
  maintPerHour: string
  failurePct: string
  marginPct: string
}

export type Part = {
  name: string
  material: string
  layer: string
  infill: string
  multicolor: boolean
  modelG: string
  supportG: string
  purgeG: string
  pricePerKg: string
  hours: string
  minutes: string
  /** Optional machine cost per hour for this part; empty falls back to the workshop settings. */
  hourRate: string
  qty: string
}

export type Requester = {
  name: string
  to: string
  notes: string
}

export type QuoteForm = {
  settings: Settings
  parts: Part[]
  requester: Requester
}
