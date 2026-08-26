"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "../Card";
import { feederHistory } from "@/data/feederHistory";
import type { Feeder } from "@/data/types";

// Figma: 132:422 — load in MW against line loss %, two series on one x axis
// with a 24h / 7d toggle. Each series gets its own hidden y axis so the two
// units stay independently scaled.

type Range = "24h" | "7d";

export function LoadLossChart({ feeder }: { feeder: Feeder }) {
  const [range, setRange] = useState<Range>("24h");
  const series = feederHistory(feeder, range === "24h" ? 1 : 7);

  // Show only a few x labels so the axis stays legible.
  const tickEvery = Math.ceil(series.length / 4);
  const ticks = series
    .map((point) => point.hour)
    .filter((_, i) => i % tickEvery === 0);

  return (
    <Card padding="p-4" className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-[16px] font-semibold text-ink">
            Load &amp; Loss History
          </h2>
          <p className="text-[12px] text-slate">
            {feeder.name} line transmission efficiency logs
          </p>
        </div>
        <div className="flex items-start rounded-sm bg-badge-neutral p-0.5">
          {(["24h", "7d"] as Range[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRange(option)}
              aria-pressed={range === option}
              className={`rounded-[4px] px-2 py-1 text-[12px] font-medium ${
                range === option
                  ? "bg-primary text-white"
                  : "text-slate hover:text-ink"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="h-55 w-full rounded-sm border border-hairline bg-surface-sunken p-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
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
            <YAxis yAxisId="load" hide />
            <YAxis yAxisId="loss" orientation="right" hide />
            <Line
              yAxisId="load"
              type="monotone"
              dataKey="loadMW"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              yAxisId="loss"
              type="monotone"
              dataKey="lossPct"
              stroke="var(--color-warning)"
              strokeWidth={2}
              strokeDasharray="4 3"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4">
        <span className="flex items-center gap-2">
          <span className="h-1 w-3 rounded-[2px] bg-primary" aria-hidden />
          <span className="text-[13px] text-ink">Peak Load (MW)</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="h-1 w-3 rounded-[2px] bg-warning" aria-hidden />
          <span className="text-[13px] text-ink">Line Loss % (Trend)</span>
        </span>
      </div>
    </Card>
  );
}
