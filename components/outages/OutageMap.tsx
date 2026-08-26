"use client";

import { Card, CardHeader } from "../Card";
import { PulseMark } from "../PulseMark";
import { outages } from "@/data/outages";
import { substations } from "@/data/substations";
import { mapConnections, outagePoints, substationPoints } from "@/data/mapLayout";
import type { Outage, OutageStatus, Status } from "@/data/types";

// Figma: 133:499 — same schematic canvas treatment as the Live Grid and
// Overview maps, with fault markers laid over the network.

const substationFill: Record<Status, string> = {
  normal: "bg-success-dot",
  warning: "bg-warning-dot",
  critical: "bg-critical-dot",
};

const outageChrome: Record<OutageStatus, { bg: string; text: string; label: string }> = {
  active: { bg: "bg-critical-dot", text: "text-critical", label: "Active Fault" },
  restoring: { bg: "bg-warning-dot", text: "text-warning", label: "Restoring" },
  resolved: { bg: "bg-success-dot", text: "text-success", label: "Resolved" },
};

const subPos = new Map(substationPoints.map((p) => [p.id, p]));
const outagesById = new Map<string, Outage>(outages.map((o) => [o.id, o]));

function MarkerGlyph({ status }: { status: OutageStatus }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "size-3.5 text-white",
    "aria-hidden": true,
  };

  if (status === "active") {
    return (
      <svg {...common}>
        <path d="M12 3 22 20H2Z" />
        <path d="M12 10v4M12 17h.01" />
      </svg>
    );
  }
  if (status === "restoring") {
    return (
      <svg {...common}>
        <path d="M21 12a9 9 0 1 1-3-6.7" />
        <path d="M21 3v6h-6" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={swatch} aria-hidden />
      <span className="text-[13px] text-slate">{label}</span>
    </span>
  );
}

export function OutageMap({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (outageId: string) => void;
}) {
  return (
    <Card padding="p-5" className="flex flex-col gap-4">
      <CardHeader
        title="Outage map · Dhaka distribution"
        action={
          <span className="flex items-center gap-2">
            <PulseMark status="success" size={8} animate />
            <span className="text-[11px] font-medium uppercase tracking-[0.66px] text-slate">
              Telemetry feed active
            </span>
          </span>
        }
      />

      <div className="relative h-80 w-full overflow-hidden rounded-sm bg-surface-sunken">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {[20, 40, 60, 80].map((x) => (
            <line key={`v${x}`} x1={x} y1={0} x2={x} y2={100}
              stroke="var(--color-hairline)" strokeWidth={0.15} opacity={0.5} />
          ))}
          {[25, 50, 75].map((y) => (
            <line key={`h${y}`} x1={0} y1={y} x2={100} y2={y}
              stroke="var(--color-hairline)" strokeWidth={0.15} opacity={0.5} />
          ))}
          {mapConnections.map(([from, to]) => {
            const a = subPos.get(from);
            const b = subPos.get(to);
            if (!a || !b) return null;
            return (
              <line key={`${from}-${to}`} x1={a.xPct} y1={a.yPct} x2={b.xPct} y2={b.yPct}
                stroke="var(--color-slate)" strokeWidth={0.3} opacity={0.35} />
            );
          })}
        </svg>

        {substationPoints.map((point) => {
          const substation = substations.find((s) => s.id === point.id);
          if (!substation) return null;
          return (
            <span
              key={point.id}
              className={`absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full ${substationFill[substation.status]}`}
              style={{ left: `${point.xPct}%`, top: `${point.yPct}%` }}
              title={substation.name}
            />
          );
        })}

        {outagePoints.map((point) => {
          const outage = outagesById.get(point.id);
          if (!outage) return null;
          const chrome = outageChrome[outage.status];
          const selected = outage.id === selectedId;
          return (
            <button
              key={point.id}
              type="button"
              onClick={() => onSelect(outage.id)}
              aria-label={`Outage ${outage.id}`}
              aria-current={selected ? "true" : undefined}
              title={`${outage.id} · ${chrome.label}`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${point.xPct}%`, top: `${point.yPct}%` }}
            >
              <span
                className={`grid size-7 place-items-center rounded-full ${chrome.bg} ${
                  selected ? "ring-2 ring-ink" : "hover:ring-2 hover:ring-ink/40"
                }`}
              >
                <MarkerGlyph status={outage.status} />
              </span>
              <span className="absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap pt-1 text-[11px] font-medium text-slate">
                {outage.id}
              </span>
            </button>
          );
        })}

        <p className="absolute bottom-0 left-0 px-3 py-1.5 font-mono text-[10px] text-slate opacity-60">
          Schematic view · Dhaka Metropolitan Grid Sub-division
        </p>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-[13px] font-semibold text-ink">Status</span>
        <Legend swatch="size-2 rounded-full bg-critical-dot" label="Active Fault" />
        <Legend swatch="size-2 rounded-full bg-warning-dot" label="Restoring" />
        <Legend swatch="size-2 rounded-full bg-success-dot" label="Resolved" />
        <span className="ml-auto text-[13px] font-semibold text-ink">Entities</span>
        <Legend swatch="size-2 rounded-full bg-ink" label="Substation" />
      </div>
    </Card>
  );
}
