import { overviewKPIs } from "./overview";
import type { Feeder } from "./types";

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
