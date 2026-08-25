"use client";

import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import { Card } from "../Card";
import { loadTrend, PEAK_HOUR } from "@/data/loadTrend";
import type { OverviewKPIs } from "@/data/types";
import { formatMW } from "@/lib/format";

// Figma: 49:1890 — 24h load curve with a shaded area under an indigo line.
// The "NOW" figure tracks the live current-load KPI.

export function LoadTrendCard({ kpis }: { kpis: OverviewKPIs }) {
  // The final point is the live reading, so the curve lands on the KPI value.
  const series = [
    ...loadTrend.slice(0, -1),
    { hour: "23:00", loadMW: kpis.currentLoadMW },
  ];

  const min = Math.min(...series.map((p) => p.loadMW));
  const max = Math.max(...series.map((p) => p.loadMW));

  return (
    <Card className="flex flex-1 flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-[16px] font-semibold text-ink">Load · last 24 h</h2>
          <p className="text-[14px] text-slate">
            Peak {formatMW(kpis.peakDemandMW)} at {PEAK_HOUR}
          </p>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[11px] font-medium uppercase tracking-[0.66px] text-slate">
            Now
          </span>
          <span className="text-[16px] font-semibold text-ink">
            {formatMW(kpis.currentLoadMW)}
          </span>
        </div>
      </div>

      <div className="h-30 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="loadShade" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0.45}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            {/* Padded domain keeps the curve off the card edges, like the design. */}
            <YAxis hide domain={[min * 0.9, max * 1.05]} />
            <Area
              type="monotone"
              dataKey="loadMW"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#loadShade)"
              isAnimationActive={false}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
