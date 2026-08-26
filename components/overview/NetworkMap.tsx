"use client";

import { Card, CardHeader } from "../Card";
import { PulseMark } from "../PulseMark";
import type { DrawerTarget } from "../Drawer";
import { substations } from "@/data/substations";
import {
  mapConnections,
  substationPoints,
  transformerPoints,
} from "@/data/mapLayout";
import type { Status } from "@/data/types";

// Figma: 49:1766 — placeholder network canvas (#0f172a, 320px) with a faint
// grid, transmission lines, circular substation markers and square transformer
// markers, each colored by status. Clicking a marker opens the contextual drawer.

const markerFill: Record<Status, string> = {
  normal: "bg-success-dot",
  warning: "bg-warning-dot",
  critical: "bg-critical-dot",
};

const legendFill: Record<Status, string> = markerFill;

// Markers grow slightly under the cursor. Scale composes with the centering
// translate on the same transform, so the marker stays anchored to its point.
const markerMotion = "transition-transform duration-150 ease-out";

const transformers = substations.flatMap((s) => s.transformers);
const pointById = new Map(substationPoints.map((p) => [p.id, p]));

function Legend({ status, label }: { status: Status; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`size-2 rounded-[2px] ${legendFill[status]}`} aria-hidden />
      <span className="text-[14px] text-slate">{label}</span>
    </span>
  );
}

export function NetworkMap({
  onSelect,
}: {
  onSelect: (target: DrawerTarget) => void;
}) {
  return (
    <Card padding="p-5" className="flex flex-1 flex-col gap-4">
      <CardHeader
        title="Grid network map"
        action={
          <div className="flex items-center gap-2.5">
            <span className="text-[14px] font-semibold text-ink">Entities</span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-ink" aria-hidden />
              <span className="text-[14px] text-slate">Substation</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 bg-ink" aria-hidden />
              <span className="text-[14px] text-slate">Transformer</span>
            </span>
          </div>
        }
      />

      <div className="relative h-80 w-full overflow-hidden rounded-sm bg-surface-sunken">
        {/* Faint reference grid + transmission lines */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {[20, 40, 60, 80].map((x) => (
            <line
              key={`v${x}`}
              x1={x}
              y1={0}
              x2={x}
              y2={100}
              stroke="var(--color-hairline)"
              strokeWidth={0.15}
              opacity={0.5}
            />
          ))}
          {[25, 50, 75].map((y) => (
            <line
              key={`h${y}`}
              x1={0}
              y1={y}
              x2={100}
              y2={y}
              stroke="var(--color-hairline)"
              strokeWidth={0.15}
              opacity={0.5}
            />
          ))}
          {mapConnections.map(([from, to]) => {
            const a = pointById.get(from);
            const b = pointById.get(to);
            if (!a || !b) return null;
            return (
              <line
                key={`${from}-${to}`}
                x1={a.xPct}
                y1={a.yPct}
                x2={b.xPct}
                y2={b.yPct}
                stroke="var(--color-slate)"
                strokeWidth={0.3}
                opacity={0.35}
              />
            );
          })}
        </svg>

        {/* Transformer markers — squares */}
        {transformerPoints.map((point) => {
          const transformer = transformers.find((t) => t.id === point.id);
          if (!transformer) return null;
          return (
            <button
              key={point.id}
              type="button"
              onClick={() => onSelect({ kind: "transformer", id: transformer.id })}
              aria-label={`Transformer ${transformer.id}`}
              title={`${transformer.id} · ${transformer.loadPct}%`}
              className={`absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-[2px] ${markerMotion} ${markerFill[transformer.status]} hover:scale-125 hover:ring-2 hover:ring-ink/40`}
              style={{ left: `${point.xPct}%`, top: `${point.yPct}%` }}
            />
          );
        })}

        {/* Substation markers — circles */}
        {substationPoints.map((point) => {
          const substation = substations.find((s) => s.id === point.id);
          if (!substation) return null;
          return (
            <button
              key={point.id}
              type="button"
              onClick={() => onSelect({ kind: "substation", id: substation.id })}
              aria-label={substation.name}
              title={`${substation.name} · ${substation.utilizationPct}%`}
              className={`absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full ${markerMotion} ${markerFill[substation.status]} hover:scale-125 hover:ring-2 hover:ring-ink/40`}
              style={{ left: `${point.xPct}%`, top: `${point.yPct}%` }}
            />
          );
        })}

        {/* Live telemetry marker */}
        <span className="absolute right-6 top-6">
          <PulseMark status="critical" size={16} animate />
        </span>

        <p className="absolute bottom-0 left-0 px-3 py-1.5 font-mono text-[10px] text-slate opacity-60">
          Map placeholder · geodata pending
        </p>
      </div>

      <div className="flex items-center justify-end gap-2.5 px-5 pt-1">
        <span className="text-[14px] font-semibold text-ink">Status</span>
        <Legend status="normal" label="Normal" />
        <Legend status="warning" label="Warning" />
        <Legend status="critical" label="Critical" />
      </div>
    </Card>
  );
}
