import { overviewKPIs } from "./overview";
import { substations } from "./substations";
import type { Feeder, Transformer } from "./types";

export const feeders: Feeder[] = [
  { id: "F-12", substationId: "SUB-MIRPUR", name: "F-12 Tejgaon Ind.", loadPct: 82, lossPct: 4.6, status: "warning" },
  { id: "F-03", substationId: "SUB-MIRPUR", name: "F-03 Mirpur Bypass", loadPct: 55, lossPct: 2.1, status: "normal" },
  { id: "F-19", substationId: "SUB-UTTARA", name: "F-19 Uttara Sector 11", loadPct: 96, lossPct: 7.8, status: "critical" },
  { id: "F-05", substationId: "SUB-GULSHAN", name: "F-05 Gulshan Sector 3", loadPct: 48, lossPct: 1.9, status: "normal" },
  { id: "F-27", substationId: "SUB-BANANI", name: "F-27 Banani Central", loadPct: 63, lossPct: 3.2, status: "normal" },
  { id: "F-14", substationId: "SUB-GULSHAN", name: "F-14 Mohakhali Express", loadPct: 71, lossPct: 3.9, status: "warning" },
];

// loadPct is a feeder's own utilization, not its share of the grid. Weighting
// each feeder against the total keeps derived MW summing to the system load
// reported on the Overview. Shared so every screen derives it identically.
const totalLoadPct = feeders.reduce((sum, feeder) => sum + feeder.loadPct, 0);

export function feederLoadMW(feeder: Feeder): number {
  return (overviewKPIs.currentLoadMW * feeder.loadPct) / totalLoadPct;
}

export function feedersForSubstation(substationId: string): Feeder[] {
  return feeders.filter((feeder) => feeder.substationId === substationId);
}

/**
 * Assets carried by a feeder.
 *
 * SCHEMA NOTE: Transformer belongs to a Substation, never to a Feeder, so there
 * is no direct feeder -> transformer link in the CLAUDE.md entity list. The
 * Feeder Details "Connected Assets" panel (Figma 132:457) is therefore resolved
 * through the feeder's origin substation. A Transformer.feederId would make the
 * relationship explicit if feeders are ever meant to own distinct asset sets.
 */
export function assetsForFeeder(feederId: string): Transformer[] {
  const feeder = feeders.find((f) => f.id === feederId);
  if (!feeder) return [];
  const origin = substations.find((s) => s.id === feeder.substationId);
  return origin ? origin.transformers : [];
}

/**
 * Zone is a presentation grouping rather than a stored field; derived from the
 * feeder id so it stays stable wherever it is shown.
 */
export function feederZone(feeder: Feeder): string {
  const n = Number(feeder.id.replace(/\D/g, ""));
  return `Zone ${String.fromCharCode(65 + (n % 3))}`;
}
