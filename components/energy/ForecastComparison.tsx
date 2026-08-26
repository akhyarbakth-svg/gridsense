"use client";

import {
  Area,
  ComposedChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "../Card";
import type { DemandCurve } from "@/data/demandCurve";

// Figma: 135:506 — actual against forecast on one axis. The shaded band is the
// gap between the two series, so the deviation the confidence stat reports is
// visible rather than merely stated.

export function ForecastComparison({ curve }: { curve: DemandCurve }) {
  const data = curve.points.map((point) => ({
    ...point,
    // Recharts stacks an area from a base, so carry the gap as its own key.
    gapBase: Math.min(point.actualMW, point.forecastMW),
    gap: Math.abs(point.forecastMW - point.actualMW),
  }));

  const tickEvery = Math.max(1, Math.ceil(data.length / 6));
  const ticks = data.map((d) => d.hour).filter((_, i) => i % tickEvery === 0);

  const min = Math.min(...data.map((d) => Math.min(d.actualMW, d.forecastMW)));
  const max = Math.max(...data.map((d) => Math.max(d.actualMW, d.forecastMW)));

  return (
    <Card className="flex flex-1 flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-[0.66px] text-slate">
            Forecast correlation
          </span>
          <h2 className="text-[16px] font-semibold text-ink">
            Actual vs Forecasted Load
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-3 rounded-full bg-primary" aria-hidden />
            <span className="text-[14px] text-slate">Actual</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-3 rounded-full bg-warning" aria-hidden />
            <span className="text-[14px] text-slate">Forecast</span>
          </span>
        </div>
      </div>

      <div className="h-37 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
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
            <YAxis hide domain={[min * 0.9, max * 1.05]} />
            <Area
              dataKey="gapBase"
              stackId="deviation"
              stroke="none"
              fill="transparent"
              isAnimationActive={false}
            />
            <Area
              dataKey="gap"
              stackId="deviation"
              stroke="none"
              fill="var(--color-warning)"
              fillOpacity={0.18}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="actualMW"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="forecastMW"
              stroke="var(--color-warning)"
              strokeWidth={2}
              strokeDasharray="4 3"
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
