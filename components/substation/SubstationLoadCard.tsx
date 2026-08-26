"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, YAxis } from "recharts";
import { Card } from "../Card";
import { loadTrend } from "@/data/loadTrend";
import type { Substation } from "@/data/types";
import { formatMW } from "@/lib/format";

// Figma: 114:549 — 24h / 7d load trend with peak+min footer and remark lines.
// The shared day curve is scaled to this substation's own load so each
// substation shows its own numbers rather than the grid total.

type Range = "24H" | "7D";

export function SubstationLoadCard({ substation }: { substation: Substation }) {
  const [range, setRange] = useState<Range>("24H");

  // Scale the shared 24h shape down to this substation.
  const peakOfShape = Math.max(...loadTrend.map((p) => p.loadMW));
  const scale = substation.loadMW / peakOfShape;

  const base = loadTrend.map((point) => ({
    hour: point.hour,
    loadMW: Number((point.loadMW * scale).toFixed(1)),
  }));

  // 7d view samples every 4th hour across a week-shaped repeat of the day curve.
  const series =
    range === "24H"
      ? base
      : Array.from({ length: 28 }, (_, i) => {
          const point = base[(i * 6) % base.length];
          const drift = 1 + ((i % 7) - 3) * 0.015;
          return {
            hour: `D${Math.floor(i / 4) + 1}`,
            loadMW: Number((point.loadMW * drift).toFixed(1)),
          };
        });

  const values = series.map((p) => p.loadMW);
  const peak = Math.max(...values);
  const min = Math.min(...values);

  return (
    <Card padding="p-5" className="flex w-75 shrink-0 flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-ink">
          Load · {range === "24H" ? "24h" : "7d"} Trend
        </h2>
        <div className="flex items-start rounded-sm bg-badge-neutral p-0.5">
          {(["24H", "7D"] as Range[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRange(option)}
              aria-pressed={range === option}
              className={`rounded-[4px] px-2 py-[3px] text-[11px] font-medium uppercase tracking-[0.66px] transition-[color] ${
                range === option ? "bg-primary text-white" : "text-slate hover:text-ink"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="h-25 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="substationLoadShade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="var(--color-hairline)"
              strokeOpacity={0.4}
            />
            <YAxis hide domain={[min * 0.9, peak * 1.05]} />
            <Area
              type="monotone"
              dataKey="loadMW"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#substationLoadShade)"
              isAnimationActive={false}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-start justify-between text-[14px] text-slate">
        <span>Peak: {formatMW(peak)}</span>
        <span>Min: {formatMW(min)}</span>
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <div className="h-px w-full bg-hairline/60" />
        <p className="text-[12px] leading-4 text-slate">
          <span className="text-success">▲</span>{" "}
          Demand rose 12% vs. yesterday&apos;s avg
        </p>
        <p className="text-[12px] leading-4 text-slate">
          <span className="text-slate">●</span> Next peak forecast: ~
          {formatMW(peak * 1.04)} at 18:00
        </p>
        <p className="text-[12px] leading-4 text-slate">
          <span className="text-primary">▼</span> Off-peak window: 02:00 – 05:00
        </p>
      </div>
    </Card>
  );
}
