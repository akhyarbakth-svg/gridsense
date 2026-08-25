// Display formatting for telemetry values. Keeps rounding rules in one place so
// the same figure reads identically across KPI cards, tables and the drawer.

export function formatMW(value: number): string {
  return `${value.toLocaleString("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} MW`;
}

export function formatMWh(value: number): string {
  return `${Math.round(value).toLocaleString("en-US")} MWh`;
}

export function formatPct(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function formatMVA(value: number): string {
  return `${value.toLocaleString("en-US")} MVA`;
}

export function formatTempC(value: number): string {
  return `${Math.round(value)} °C`;
}

/** Clock time for the live "updated" readout. */
export function formatClock(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour12: false });
}

/** Compact elapsed label, e.g. "34 min ago" / "2 h 12 m ago". */
export function formatElapsed(minutes: number): string {
  const rounded = Math.round(minutes);
  if (rounded < 60) return `${rounded} min ago`;
  const hours = Math.floor(rounded / 60);
  const rest = rounded % 60;
  return rest === 0 ? `${hours} h ago` : `${hours} h ${rest} m ago`;
}
