"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "../Button";
import { Card } from "../Card";
import type { DemandCurve, Timeframe } from "@/data/demandCurve";

// Figma: 135:445 — the day's demand profile with Today / 7-day / 30-day
// switches. Y axis is labelled in MW, x axis walks the window.

const ranges: { value: Timeframe; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7-day", label: "7-day" },
  { value: "30-day", label: "30-day" },
];

export function DemandCurveChart({
  curve,
  timeframe,
  onTimeframeChange,
}: {
  curve: DemandCurve;
  timeframe: Timeframe;
  onTimeframeChange: (next: Timeframe) => void;
}) {
  const { points } = curve;

  // Four evenly spaced labels keep the axis readable at every window size.
  const tickEvery = Math.max(1, Math.ceil(points.length / 6));
  const ticks = points
    .map((point) => point.hour)
    .filter((_, i) => i % tickEvery === 0);

  const max = Math.max(...points.map((p) => p.actualMW));

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-[0.66px] text-slate">
            Active demand profile
          </span>
          <h2 className="text-[22px] font-semibold text-ink">Demand Curve</h2>
        </div>
        <div className="flex items-center gap-2">
          {ranges.map((range) => (
            <Button
              key={range.value}
              variant={timeframe === range.value ? "primary" : "secondary"}
              onClick={() => onTimeframeChange(range.value)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-65 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
            <CartesianGrid
              vertical={false}
              stroke="var(--color-hairline)"
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="hour"
              ticks={ticks}
              interval={0}
              tick={{ fill: "var(--color-slate)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              width={72}
              domain={[0, Math.ceil((max * 1.15) / 50) * 50]}
              tick={{ fill: "var(--color-slate)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) =>
                `${value.toLocaleString("en-US")} MW`
              }
            />
            <Line
              type="monotone"
              dataKey="actualMW"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
