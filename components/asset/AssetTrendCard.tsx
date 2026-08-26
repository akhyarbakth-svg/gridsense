"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  YAxis,
} from "recharts";
import { Card } from "../Card";
import type { AssetHistoryPoint } from "@/data/assetHistory";

// Figma: 134:498 / 134:535 / 134:570 — three 30-day trend cards sharing one
// shape: title, max/avg summary, and a sparkline with optional threshold.

export function AssetTrendCard({
  title,
  points,
  unit,
  threshold,
  thresholdLabel,
}: {
  title: string;
  points: AssetHistoryPoint[];
  unit: string;
  /** Draws a dashed warning line at this value. */
  threshold?: number;
  thresholdLabel?: string;
}) {
  const values = points.map((p) => p.value);
  const max = Math.max(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;

  const breached = threshold !== undefined && max >= threshold;
  const upper = threshold !== undefined ? Math.max(max, threshold) : max;

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-ink">{title}</h2>
        <span className="font-mono text-[13px] text-slate">
          Max: {max.toFixed(0)}
          {unit} · Avg: {avg.toFixed(0)}
          {unit}
        </span>
      </div>

      <div className="h-30 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
            <CartesianGrid
              vertical={false}
              stroke="var(--color-hairline)"
              strokeOpacity={0.5}
            />
            <YAxis hide domain={[Math.min(...values) * 0.85, upper * 1.08]} />
            {threshold !== undefined && (
              <ReferenceLine
                y={threshold}
                stroke="var(--color-warning)"
                strokeDasharray="4 4"
                label={{
                  value: thresholdLabel,
                  position: "insideTopLeft",
                  fill: "var(--color-warning)",
                  fontSize: 11,
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="value"
              stroke={
                breached ? "var(--color-critical)" : "var(--color-primary)"
              }
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
