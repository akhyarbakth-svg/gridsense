import { feederLoadMW } from "./feeders";
import { loadTrend } from "./loadTrend";
import type { Feeder } from "./types";

// Series behind the Load & Loss History chart (Figma 132:422): load in MW and
// line loss as a percentage, sharing an x axis. Derived from the same day curve
// the rest of the app uses, scaled to this feeder, so no new mock series is
// invented and every screen tells the same story.

export interface FeederHistoryPoint {
  hour: string;
  loadMW: number;
  lossPct: number;
}

export function feederHistory(feeder: Feeder, days: 1 | 7 = 1): FeederHistoryPoint[] {
  const peakOfShape = Math.max(...loadTrend.map((p) => p.loadMW));
  const scale = feederLoadMW(feeder) / peakOfShape;

  const day = loadTrend.map((point) => {
    const loadMW = point.loadMW * scale;
    // Loss climbs with load: heavier lines run less efficiently.
    const utilisation = point.loadMW / peakOfShape;
    return {
      hour: point.hour,
      loadMW: Number(loadMW.toFixed(2)),
      lossPct: Number((feeder.lossPct * (0.72 + utilisation * 0.4)).toFixed(2)),
    };
  });

  if (days === 1) return day;

  // 7d view samples the day curve every six hours across a week.
  return Array.from({ length: 28 }, (_, i) => {
    const point = day[(i * 6) % day.length];
    const drift = 1 + ((i % 7) - 3) * 0.02;
    return {
      hour: `D${Math.floor(i / 4) + 1}`,
      loadMW: Number((point.loadMW * drift).toFixed(2)),
      lossPct: Number((point.lossPct * drift).toFixed(2)),
    };
  });
}
