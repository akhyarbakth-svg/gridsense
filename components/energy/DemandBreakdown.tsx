import { Button } from "../Button";
import { Card } from "../Card";
import { TableHeader, type TableHeaderColumn } from "../TableHeader";
import { TableRow } from "../TableRow";
import type { Tone } from "../status";
import { StatusPill } from "../StatusPill";
import { feedersForSubstation } from "@/data/feeders";
import { substations } from "@/data/substations";
import { dailyShape } from "@/data/loadTrend";
import { zones } from "@/data/zones";
import type { Status } from "@/data/types";
import { formatPct } from "@/lib/format";

// Figma: 135:585 — demand broken down per substation, with the zone each one
// sits in. Peak load derives from the shared day curve so it agrees with the
// demand chart above.

const NAME_WIDTH = 216;

const columns: TableHeaderColumn[] = [
  { key: "zone", label: "Active Zone", width: 140 },
  { key: "current", label: "Current Load (MW)", width: 150, align: "right" },
  { key: "peak", label: "Peak Load (MW)", width: 150, align: "right" },
  { key: "efficiency", label: "Avg Efficiency %", width: 150, align: "right" },
];

const statusTone: Record<Status, Tone> = {
  normal: "success",
  warning: "warning",
  critical: "critical",
};

const statusLabel: Record<Status, string> = {
  normal: "Nominal",
  warning: "Strained",
  critical: "Critical",
};

/**
 * Current load is a mid-curve reading, so peak is it scaled from the day
 * curve's mean up to its maximum — tying this column to the same shape the
 * charts above are drawn from instead of an arbitrary headroom factor.
 */
const meanShape = dailyShape.reduce((a, b) => a + b, 0) / dailyShape.length;
const PEAK_FACTOR = Math.max(...dailyShape) / meanShape;

/**
 * Efficiency is what survives the losses on this substation's feeders, weighted
 * by how much load each carries. Derived rather than invented, so a heavily
 * loaded substation reads as LESS efficient — the previous formula had it
 * backwards, ranking the critical substation as the most efficient.
 */
function efficiencyOf(substationId: string): number {
  const own = feedersForSubstation(substationId);
  if (own.length === 0) return 100;
  const load = own.reduce((sum, f) => sum + f.loadPct, 0);
  const weightedLoss = own.reduce((sum, f) => sum + f.loadPct * f.lossPct, 0);
  return 100 - weightedLoss / load;
}

function zoneOf(substationId: string): string {
  const zone = zones.find((z) => z.substationIds.includes(substationId));
  return zone ? zone.name : "Unassigned";
}

export function DemandBreakdown() {
  return (
    <Card padding="p-0" className="overflow-hidden">
      <div className="flex items-start justify-between p-6">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-[0.66px] text-slate">
            Substation metrics
          </span>
          <h2 className="text-[16px] font-semibold text-ink">
            Demand Breakdown by Zone
          </h2>
        </div>
        <Button variant="secondary">Export data</Button>
      </div>

      <TableHeader
        nameLabel="Zone / Substation"
        columns={columns}
        nameWidth={NAME_WIDTH}
      />

      {substations.map((substation) => {
        const efficiency = efficiencyOf(substation.id);
        return (
          <TableRow
            key={substation.id}
            status={substation.status}
            name={substation.name}
            nameWidth={NAME_WIDTH}
            columns={[
              { key: "zone", value: zoneOf(substation.id), width: 140, muted: true },
              {
                key: "current",
                value: substation.loadMW.toFixed(1),
                width: 150,
                align: "right",
                mono: true,
              },
              {
                key: "peak",
                value: (substation.loadMW * PEAK_FACTOR).toFixed(1),
                width: 150,
                align: "right",
                mono: true,
              },
              {
                key: "efficiency",
                value: formatPct(efficiency),
                width: 150,
                align: "right",
                mono: true,
              },
            ]}
            chart={
              <StatusPill
                label={statusLabel[substation.status]}
                tone={statusTone[substation.status]}
              />
            }
            href={`/substations/${substation.id}`}
          />
        );
      })}
    </Card>
  );
}
