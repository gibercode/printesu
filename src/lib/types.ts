/** An extra printer; the main one lives in the flat Settings fields. */
export type Printer = {
  uid: string;
  name: string;
  printerCost: string;
  lifeHours: string;
  maintPerHour: string;
};

export type Settings = {
  printerName: string;
  printerCost: string;
  lifeHours: string;
  maintPerHour: string;
  failurePct: string;
  marginPct: string;
  printers: Printer[];
};

export type Part = {
  name: string;
  material: string;
  layer: string;
  infill: string;
  multicolor: boolean;
  modelG: string;
  supportG: string;
  purgeG: string;
  pricePerKg: string;
  hours: string;
  hourRate: string;
  qty: string;
  perPlate: string;
  /** uid of an extra printer; empty means the main one. */
  printerId: string;
};

export type Requester = {
  name: string;
  to: string;
  notes: string;
};

export type QuoteForm = {
  settings: Settings;
  parts: Part[];
  requester: Requester;
};
