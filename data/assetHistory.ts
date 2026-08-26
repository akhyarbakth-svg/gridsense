import type { Transformer } from "./types";

// 30-day trend series behind the Asset Health charts (Figma 134:498/535/570).
// Derived from each transformer's current readings rather than stored, so a
// transformer's history always agrees with the figures shown beside it.
//
// Deterministic: the wobble comes from a fixed table, not Math.random, so the
// server and the browser render identical curves.

export interface AssetHistoryPoint {
  day: string;
  value: number;
}

/** Fixed ±1 wobble, walked over 30 days. */
const wobble = [
  -0.6, -0.2, 0.3, 0.8, 0.4, -0.1, 0.7, 1.0, 0.5, -0.3, -0.7, -0.2, 0.6, 0.9,
  0.2, -0.5, -0.9, -0.4, 0.1, 0.7, 1.0, 0.6, 0.0, -0.6, -1.0, -0.5, 0.2, 0.6,
  0.9, 0.4,
];

const DAYS = 30;

/**
 * A series ending at `current`, drifting up to it over the window.
 * `spread` is the peak-to-trough swing as a fraction of the current value.
 */
function series(current: number, spread: number, ramp: number): AssetHistoryPoint[] {
  return Array.from({ length: DAYS }, (_, i) => {
    // Older readings sit lower, so the trend climbs toward today's value.
    const trend = 1 - ramp * (1 - i / (DAYS - 1));
    const value = current * trend * (1 + wobble[i] * spread);
    return { day: `D${i + 1}`, value: Number(value.toFixed(1)) };
  });
}

/**
 * Oil runs cooler than the windings it surrounds. Derived at a fixed ratio
 * rather than stored, so it cannot drift away from the winding reading.
 */
export const OIL_TO_WINDING_RATIO = 0.76;

export function oilTemperatureC(transformer: Transformer): number {
  return transformer.temperatureC * OIL_TO_WINDING_RATIO;
}

export function windingTempHistory(transformer: Transformer): AssetHistoryPoint[] {
  return series(transformer.temperatureC, 0.05, 0.12);
}

export function loadHistory(transformer: Transformer): AssetHistoryPoint[] {
  return series(transformer.loadPct, 0.07, 0.15);
}

export function oilTempHistory(transformer: Transformer): AssetHistoryPoint[] {
  return series(oilTemperatureC(transformer), 0.05, 0.1);
}

/** Winding temperature above which the asset is flagged. */
export const WINDING_WARNING_C = 75;
