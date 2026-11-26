import type { Part, Printer, QuoteForm, Requester, Settings } from "./types";

export const MATERIALS = [
  "PLA",
  "PETG",
  "ABS / ASA",
  "TPU",
  "Nylon",
  "Resina",
  "Otro",
];
export const LAYERS = ["0.08", "0.12", "0.16", "0.20", "0.28"];
export const MAX_PARTS = 20;

export const DEFAULT_LIFE_HOURS = "3000";
export const DEFAULT_PRINTER_COST = "600";
export const PRINTER_PRESETS = [
  { label: "Económica (≈ $300)", cost: "300" },
  { label: "Media (≈ $600)", cost: "600" },
  { label: "Alta (≈ $1.200)", cost: "1200" },
] as const;

export const MAX_EXTRA_PRINTERS = 5;

export const newPrinterUid = () => Math.random().toString(36).slice(2, 10);

export const emptyPrinter = (): Printer => ({
  uid: newPrinterUid(),
  name: "",
  printerCost: "",
  lifeHours: "",
  maintPerHour: "",
});

export const emptySettings = (): Settings => ({
  printerName: "",
  printerCost: "",
  lifeHours: "",
  maintPerHour: "",
  failurePct: "",
  marginPct: "",
  printers: [],
});

export const emptyRequester = (): Requester => ({
  name: "",
  to: "",
  notes: "",
});

export const emptyPart = (): Part => ({
  name: "",
  material: "PLA",
  layer: "0.20",
  infill: "",
  multicolor: false,
  modelG: "",
  supportG: "",
  purgeG: "",
  pricePerKg: "",
  hours: "",
  hourRate: "",
  qty: "1",
  perPlate: "",
  printerId: "",
});

export const emptyForm = (): QuoteForm => ({
  settings: emptySettings(),
  parts: [emptyPart()],
  requester: emptyRequester(),
});

// Synthetic example so the interface can be seen working. Not real prices.
export const exampleForm = (): QuoteForm => ({
  settings: {
    printerName: "",
    printerCost: "600",
    lifeHours: DEFAULT_LIFE_HOURS,
    maintPerHour: "",
    failurePct: "10",
    marginPct: "25",
    printers: [],
  },
  parts: [
    {
      ...emptyPart(),
      name: "Soporte de pared",
      material: "PETG",
      infill: "20",
      modelG: "84",
      supportG: "6",
      pricePerKg: "24",
      hours: "5:40",
      qty: "2",
    },
    {
      ...emptyPart(),
      name: "Figura multicolor",
      layer: "0.12",
      infill: "15",
      multicolor: true,
      modelG: "52",
      supportG: "4",
      purgeG: "28",
      pricePerKg: "22",
      hours: "8:15",
    },
  ],
  requester: emptyRequester(),
});
