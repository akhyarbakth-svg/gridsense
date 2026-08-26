import { feeders } from "./feeders";

/**
 * NEW ENTITY — Loss Breakdown (Figma 136:466).
 *
 * The staged energy funnel (Total Input -> Substation Step -> Delivered) has no
 * home in the CLAUDE.md entity list, which tracks loss only as a single
 * `systemLossPct` on Overview KPIs and `lossPct` per Feeder. This is the small
 * entity that backs the Loss Analysis funnel. Add to CLAUDE.md as:
 *
 *   8. Loss Breakdown — totalInputMWh, transmissionLossMWh,
 *      distributionLossMWh, deliveredMWh
 *
 * All values are STATIC (no jitter). Only `totalInputMWh` and the transmission
 * share are seeded by hand; the rest derive from the feeder-weighted loss so
 * the funnel can never contradict the loss table on the same screen.
 */
export interface LossBreakdown {
  totalInputMWh: number;
  transmissionLossMWh: number;
  distributionLossMWh: number;
  deliveredMWh: number;
}

/** Grid input over the rolling 24h window the screen reports on. */
const TOTAL_INPUT_MWH = 10_240;

/** Share of total loss attributed to transmission rather than distribution. */
const TRANSMISSION_SHARE = 0.34;

/**
 * Overall loss is the feeders' loss weighted by how much load each carries —
 * a plain average would let a tiny feeder with a bad loss figure dominate.
 * The weights cancel the absolute MW, so this works off loadPct directly.
 */
export const weightedLossPct: number = (() => {
  const totalLoad = feeders.reduce((sum, f) => sum + f.loadPct, 0);
  const weighted = feeders.reduce((sum, f) => sum + f.loadPct * f.lossPct, 0);
  return weighted / totalLoad;
})();

const totalLossMWh = TOTAL_INPUT_MWH * (weightedLossPct / 100);
const transmissionLossMWh = Math.round(totalLossMWh * TRANSMISSION_SHARE);
const distributionLossMWh = Math.round(totalLossMWh) - transmissionLossMWh;

export const lossBreakdown: LossBreakdown = {
  totalInputMWh: TOTAL_INPUT_MWH,
  transmissionLossMWh,
  distributionLossMWh,
  deliveredMWh: TOTAL_INPUT_MWH - transmissionLossMWh - distributionLossMWh,
};

/** Energy lost on a feeder over the same window, in MWh. */
export function feederLossMWh(lossPct: number, loadPct: number): number {
  const totalLoad = feeders.reduce((sum, f) => sum + f.loadPct, 0);
  return (TOTAL_INPUT_MWH * (loadPct / totalLoad) * lossPct) / 100;
}
