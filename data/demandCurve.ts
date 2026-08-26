import { dailyShape } from "./loadTrend";
import { overviewKPIs } from "./overview";

/**
 * NEW ENTITY — Demand Curve (Figma 135:445 / 135:506).
 *
 * Hourly actual-vs-forecast demand. None of the seven CLAUDE.md entities holds
 * a time series: Overview KPIs carries single readings and Feeder/Substation
 * carry instantaneous values. Add to CLAUDE.md as:
 *
 *   9. Demand Curve — points[] (hour, actualMW, forecastMW),
 *      forecastConfidencePct, expectedPeakMW, expectedPeakHour
 *
 * (Entity 8 is the Loss Breakdown added for the Loss Analysis screen.)
 *
 * Static — no jitter. The actual series is the shared `dailyShape` scaled to
 * peakDemandMW, so this curve and the Overview load-trend card describe the
 * same day rather than two different ones.
 */
export interface DemandPoint {
  hour: string;
  actualMW: number;
  forecastMW: number;
}

export interface DemandCurve {
  points: DemandPoint[];
  forecastConfidencePct: number;
  expectedPeakMW: number;
  expectedPeakHour: string;
}

export type Timeframe = "today" | "7-day" | "30-day";

/**
 * Forecast deviation per hour, as a fraction of actual. Fixed rather than
 * random so the server and the browser render identical numbers, and shaped to
 * stay believable: tightest overnight, widest around the evening ramp.
 */
const forecastDelta = [
  0.004, -0.003, 0.002, 0.005, -0.004, 0.008, 0.014, -0.012, 0.019, 0.011,
  -0.008, 0.006, -0.015, 0.009, 0.017, -0.011, 0.022, 0.026, -0.019, 0.031,
  -0.024, 0.013, -0.007, 0.005,
];

function hourLabel(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}

/** Hourly points for a single day, scaled by the active filter scope. */
function todayPoints(scale: number): DemandPoint[] {
  return dailyShape.map((factor, hour) => {
    const actualMW = overviewKPIs.peakDemandMW * factor * scale;
    return {
      hour: hourLabel(hour),
      actualMW: Number(actualMW.toFixed(1)),
      forecastMW: Number((actualMW * (1 + forecastDelta[hour])).toFixed(1)),
    };
  });
}

/** Daily averages across a longer window, drifting week over week. */
function dayPoints(days: number, scale: number): DemandPoint[] {
  const dayMean = dailyShape.reduce((a, b) => a + b, 0) / dailyShape.length;

  return Array.from({ length: days }, (_, i) => {
    const drift = 1 + Math.sin(i / 3) * 0.06;
    const actualMW = overviewKPIs.peakDemandMW * dayMean * drift * scale;
    return {
      hour: `D${i + 1}`,
      actualMW: Number(actualMW.toFixed(1)),
      forecastMW: Number(
        (actualMW * (1 + forecastDelta[i % forecastDelta.length])).toFixed(1)
      ),
    };
  });
}

/**
 * Build the curve for a timeframe and scope.
 * `scale` is the selected filter's share of total system demand (1 = whole grid).
 */
export function demandCurve(
  timeframe: Timeframe = "today",
  scale = 1
): DemandCurve {
  const points =
    timeframe === "today"
      ? todayPoints(scale)
      : dayPoints(timeframe === "7-day" ? 7 : 30, scale);

  // Confidence is the inverse of mean absolute percentage error, so the number
  // actually describes the two series rather than being written down.
  const mape =
    points.reduce(
      (sum, p) => sum + Math.abs(p.forecastMW - p.actualMW) / p.actualMW,
      0
    ) / points.length;

  const peak = points.reduce((a, b) => (b.forecastMW > a.forecastMW ? b : a));

  return {
    points,
    forecastConfidencePct: (1 - mape) * 100,
    expectedPeakMW: peak.forecastMW,
    expectedPeakHour: peak.hour,
  };
}
