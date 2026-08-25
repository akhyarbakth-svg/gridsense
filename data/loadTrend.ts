import { overviewKPIs } from "./overview";

// 24-hour load curve for the trend card. Static series, scaled to the same
// numbers the KPI strip reports so the dashboard reads as one coherent system:
// it peaks at peakDemandMW (19:00) and lands on currentLoadMW at the final hour.

export interface LoadPoint {
  hour: string;
  loadMW: number;
}

/** Relative shape of a day's demand curve, 0–1, indexed by hour. */
const shape = [
  0.62, 0.58, 0.55, 0.54, 0.56, 0.61, 0.68, 0.74, 0.79, 0.82, 0.84, 0.85, 0.86,
  0.85, 0.84, 0.86, 0.89, 0.93, 0.97, 1.0, 0.97, 0.91, 0.83, 0.74,
];

export const PEAK_HOUR = "19:00";

export const loadTrend: LoadPoint[] = shape.map((factor, hour) => ({
  hour: `${String(hour).padStart(2, "0")}:00`,
  loadMW: Number((overviewKPIs.peakDemandMW * factor).toFixed(1)),
}));

// Land the final reading on the reported current load.
loadTrend[loadTrend.length - 1] = {
  hour: "23:00",
  loadMW: overviewKPIs.currentLoadMW,
};
