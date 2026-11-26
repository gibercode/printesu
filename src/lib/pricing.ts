import { DEFAULT_LIFE_HOURS, DEFAULT_PRINTER_COST } from "./defaults";
import type { Part, Settings } from "./types";

export type Parsed = { value: number; invalid: boolean };

export function parse(raw: string | undefined): Parsed {
  const t = (raw ?? "").trim().replace(",", ".");
  if (t === "") return { value: 0, invalid: false };
  const v = Number(t);
  return Number.isFinite(v) && v >= 0
    ? { value: v, invalid: false }
    : { value: 0, invalid: true };
}

export const num = (raw: string | undefined) => parse(raw).value;

export const validateNumber = (raw: string) =>
  !parse(raw).invalid || "Escribe un número de 0 o más.";

/** Print time as the slicer shows it: 3.5, 3:30, 3h 30m, 3h, 45m. Returns hours. */
export function parseHours(raw: string | undefined): Parsed {
  const t = (raw ?? "").trim().toLowerCase().replace(",", ".");
  const clock = t.match(/^(\d+):([0-5]?\d)$/);
  if (clock) return { value: Number(clock[1]) + Number(clock[2]) / 60, invalid: false };
  const units = t.match(/^(?:(\d+(?:\.\d+)?)\s*h[a-z]*)?\s*(?:(\d+(?:\.\d+)?)\s*m[a-z]*)?$/);
  if (units && (units[1] || units[2])) {
    return { value: Number(units[1] ?? 0) + Number(units[2] ?? 0) / 60, invalid: false };
  }
  return parse(raw);
}

export const validateHours = (raw: string) =>
  !parseHours(raw).invalid || "Escribe el tiempo como 3,5, 3:30 o 3h 30m.";

export const REPAIR_ALLOWANCE = 0.05;

type PrinterCosts = Pick<Settings, "printerCost" | "lifeHours" | "maintPerHour">;

function rateOf(p: PrinterCosts): number {
  const life = p.lifeHours.trim() === "" ? num(DEFAULT_LIFE_HOURS) : num(p.lifeHours);
  if (life <= 0) return num(p.maintPerHour);
  const cost = p.printerCost.trim() === "" ? num(DEFAULT_PRINTER_COST) : num(p.printerCost);
  const depreciation = cost / life;
  const maintenance =
    p.maintPerHour.trim() === ""
      ? depreciation * REPAIR_ALLOWANCE
      : num(p.maintPerHour);
  return depreciation + maintenance;
}

/** Hourly machine cost of one printer: an extra one by uid, otherwise the main one. */
export function machineRate(s: Settings, printerId = ""): number {
  return rateOf(s.printers.find((p) => p.uid === printerId) ?? s);
}

export type LineCost = {
  grams: number;
  hours: number;
  qty: number;
  runs: number;
  material: number;
  machine: number;
  subtotal: number;
  final: number;
  missing: string[];
  machineIdle: boolean;
};

export type Quote = {
  lines: LineCost[];
  material: number;
  machine: number;
  subtotal: number;
  failure: number;
  margin: number;
  total: number;
  totalHours: number;
};

export const EMPTY_LINE: LineCost = {
  grams: 0,
  hours: 0,
  qty: 1,
  runs: 1,
  material: 0,
  machine: 0,
  subtotal: 0,
  final: 0,
  missing: [],
  machineIdle: false,
};

const factorOf = (s: Settings) => ({
  failure: 1 + num(s.failurePct) / 100,
  margin: 1 + num(s.marginPct) / 100,
});

export function lineCost(p: Part, s: Settings, factor: number): LineCost {
  const grams =
    num(p.modelG) + num(p.supportG) + (p.multicolor ? num(p.purgeG) : 0);
  const hours = parseHours(p.hours).value;
  const qty = Math.max(1, Math.round(num(p.qty)) || 1);
  const perPlate = Math.max(1, Math.floor(num(p.perPlate)) || 1);
  const runs = Math.ceil(qty / perPlate);
  const own = num(p.hourRate);
  const rate = own > 0 ? own : machineRate(s, p.printerId);
  const material = (grams / 1000) * num(p.pricePerKg);
  const machine = hours * rate * runs;
  const subtotal = material * qty + machine;

  const missing: string[] = [];
  if (p.name.trim() === "") missing.push("nombre");
  if (grams === 0) missing.push("peso");
  if (num(p.pricePerKg) === 0) missing.push("precio del material");
  if (hours === 0) missing.push("tiempo");

  return {
    grams: grams * qty,
    hours: hours * runs,
    qty,
    runs,
    material: material * qty,
    machine,
    subtotal,
    final: subtotal * factor,
    missing,
    machineIdle: hours > 0 && rate === 0,
  };
}

export function computeQuote(parts: Part[], s: Settings): Quote {
  const { failure, margin } = factorOf(s);
  const lines = parts.map((p) => lineCost(p, s, failure * margin));
  const material = lines.reduce((a, l) => a + l.material, 0);
  const machine = lines.reduce((a, l) => a + l.machine, 0);
  const subtotal = material + machine;
  const withFailure = subtotal * failure;
  const total = withFailure * margin;
  return {
    lines,
    material,
    machine,
    subtotal,
    failure: withFailure - subtotal,
    margin: total - withFailure,
    total,
    totalHours: lines.reduce((a, l) => a + l.hours, 0),
  };
}
