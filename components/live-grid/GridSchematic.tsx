"use client";

import type { ReactNode } from "react";
import { PulseMark } from "../PulseMark";
import type { DrawerTarget } from "../Drawer";
import { substations } from "@/data/substations";
import { feeders } from "@/data/feeders";
import {
  feederNodes,
  substationLinks,
  substationNodes,
  transformerNodes,
  transformerParents,
} from "@/data/schematic";
import type { Status } from "@/data/types";

// Figma: 101:328 — schematic canvas with a reference grid, transmission lines
// and status-coloured markers. Substations are circles, transformers squares,
// feeders small taps. Any marker opens the shared contextual drawer; the
// selected substation carries the ring highlight the tree also drives.

const fill: Record<Status, string> = {
  normal: "bg-success-dot",
  warning: "bg-warning-dot",
  critical: "bg-critical-dot",
};

const stroke: Record<Status, string> = {
  normal: "var(--color-success-dot)",
  warning: "var(--color-warning-dot)",
  critical: "var(--color-critical-dot)",
};

const transformers = substations.flatMap((s) => s.transformers);
const subPos = new Map(substationNodes.map((n) => [n.id, n]));

function Legend({ swatch, label }: { swatch: ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      {swatch}
      <span className="text-[11px] font-medium uppercase tracking-[0.66px] text-slate">
        {label}
      </span>
    </span>
  );
}

export function GridSchematic({
  selectedId,
  onSelect,
  onOpen,
}: {
  selectedId: string | null;
  /** Raises the shared selection, shared with the tree and side panel. */
  onSelect: (substationId: string) => void;
  /** Opens the contextual drawer on any entity. */
  onOpen: (target: DrawerTarget) => void;
}) {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] font-semibold text-ink">
          Dhaka Metropolitan Grid Schematic
        </h2>
        <p className="text-[14px] text-slate">
          Live feeder topology mapping of Dhaka distribution zone
        </p>
      </div>

      <div className="relative flex-1 overflow-hidden rounded-sm bg-surface-sunken">
        <div className="absolute left-4 top-4 z-10 flex items-center gap-4">
          <Legend
            swatch={<span className="size-2 rounded-full ring-2 ring-primary" />}
            label="Selected Substation"
          />
          <Legend
            swatch={<span className="size-2 rounded-full bg-ink" />}
            label="Substation"
          />
          <Legend
            swatch={<span className="size-2 rounded-[2px] bg-ink" />}
            label="Transformer Node"
          />
        </div>

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {[12.5, 25, 37.5, 50, 62.5, 75, 87.5].map((x) => (
            <line
              key={`v${x}`}
              x1={x}
              y1={0}
              x2={x}
              y2={100}
              stroke="var(--color-hairline)"
              strokeWidth={0.12}
              opacity={0.45}
            />
          ))}
          {[14, 28, 42, 56, 70, 84].map((y) => (
            <line
              key={`h${y}`}
              x1={0}
              y1={y}
              x2={100}
              y2={y}
              stroke="var(--color-hairline)"
              strokeWidth={0.12}
              opacity={0.45}
            />
          ))}

          {substationLinks.map(([from, to]) => {
            const a = subPos.get(from);
            const b = subPos.get(to);
            if (!a || !b) return null;
            return (
              <line
                key={`${from}-${to}`}
                x1={a.xPct}
                y1={a.yPct}
                x2={b.xPct}
                y2={b.yPct}
                stroke="var(--color-slate)"
                strokeWidth={0.35}
                opacity={0.4}
              />
            );
          })}

          {transformerNodes.map((node) => {
            const parent = subPos.get(transformerParents[node.id]);
            const transformer = transformers.find((t) => t.id === node.id);
            if (!parent || !transformer) return null;
            return (
              <line
                key={`spur-${node.id}`}
                x1={parent.xPct}
                y1={parent.yPct}
                x2={node.xPct}
                y2={node.yPct}
                stroke={stroke[transformer.status]}
                strokeWidth={0.2}
                opacity={0.35}
              />
            );
          })}
        </svg>

        {feederNodes.map((node) => {
          const feeder = feeders.find((f) => f.id === node.id);
          if (!feeder) return null;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => onOpen({ kind: "feeder", id: feeder.id })}
              aria-label={feeder.name}
              title={`${feeder.name} · ${feeder.loadPct}%`}
              className={`absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 ${fill[feeder.status]} hover:ring-2 hover:ring-ink/40`}
              style={{ left: `${node.xPct}%`, top: `${node.yPct}%` }}
            />
          );
        })}

        {transformerNodes.map((node) => {
          const transformer = transformers.find((t) => t.id === node.id);
          if (!transformer) return null;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => onOpen({ kind: "transformer", id: transformer.id })}
              aria-label={`Transformer ${transformer.id}`}
              title={`${transformer.id} · ${transformer.loadPct}%`}
              className={`absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-[2px] ${fill[transformer.status]} hover:ring-2 hover:ring-ink/40`}
              style={{ left: `${node.xPct}%`, top: `${node.yPct}%` }}
            />
          );
        })}

        {substationNodes.map((node) => {
          const substation = substations.find((s) => s.id === node.id);
          if (!substation) return null;
          const selected = substation.id === selectedId;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => {
                onSelect(substation.id);
                onOpen({ kind: "substation", id: substation.id });
              }}
              aria-label={substation.name}
              aria-current={selected ? "true" : undefined}
              title={`${substation.name} · ${substation.utilizationPct}%`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${node.xPct}%`, top: `${node.yPct}%` }}
            >
              <span className="relative grid size-10 place-items-center">
                {selected && (
                  <span className="absolute inset-0 rounded-full border-2 border-primary" />
                )}
                <span
                  className={`size-4 rounded-full ${fill[substation.status]} ${
                    selected
                      ? "ring-2 ring-primary/40"
                      : "hover:ring-2 hover:ring-ink/40"
                  }`}
                />
              </span>
              <span className="absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap text-[11px] font-medium text-slate">
                {substation.name.replace(" Substation", " SS")}
              </span>
            </button>
          );
        })}

        <span className="absolute right-8 top-12">
          <PulseMark status="critical" size={16} animate />
        </span>

        <div className="absolute bottom-3 right-4 flex items-center gap-4">
          <Legend
            swatch={<span className="size-2 rounded-full bg-success-dot" />}
            label="Normal"
          />
          <Legend
            swatch={<span className="size-2 rounded-full bg-warning-dot" />}
            label="Warning"
          />
          <Legend
            swatch={<span className="size-2 rounded-full bg-critical-dot" />}
            label="Critical"
          />
        </div>

        <p className="absolute bottom-3 left-4 font-mono text-[10px] text-slate opacity-60">
          Dhaka grid schematic · telemetry live
        </p>
      </div>
    </div>
  );
}
