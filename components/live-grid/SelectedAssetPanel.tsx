"use client";

import { PulseMark } from "../PulseMark";
import { StatusPill } from "../StatusPill";
import type { Tone } from "../status";
import type { Substation, Status } from "@/data/types";
import { formatMVA, formatMW, formatPct, formatTempC } from "@/lib/format";

// Figma: 101:385 — details for whatever is currently selected. Receives the
// screen's single live snapshot rather than jittering again locally, so its
// figures always agree with the telemetry strip below.

const statusTone: Record<Status, Tone> = {
  normal: "success",
  warning: "warning",
  critical: "critical",
};

const connectionLabel: Record<Status, string> = {
  normal: "Online",
  warning: "Degraded",
  critical: "Critical",
};

function utilizationBand(pct: number): { label: string; tone: Tone } {
  if (pct >= 90) return { label: "Critical", tone: "critical" };
  if (pct >= 80) return { label: "Elevated", tone: "warning" };
  return { label: "Optimal", tone: "success" };
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-[0.66px] text-slate">
        {label}
      </span>
      <span className="text-[32px] font-semibold leading-none text-ink">
        {value}
      </span>
    </div>
  );
}

export function SelectedAssetPanel({ substation }: { substation: Substation }) {
  const band = utilizationBand(substation.utilizationPct);

  return (
    <div className="flex w-60 shrink-0 flex-col gap-5 overflow-y-auto border-l border-hairline p-5">
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-medium uppercase tracking-[0.66px] text-slate">
          Selected Substation
        </span>
        <h2 className="text-[22px] font-semibold leading-tight text-ink">
          {substation.name}
        </h2>
        <div className="pt-1">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${
              statusTone[substation.status] === "success"
                ? "bg-badge-success"
                : statusTone[substation.status] === "warning"
                  ? "bg-badge-warning"
                  : "bg-badge-critical"
            }`}
          >
            <PulseMark status={substation.status} size={12} />
            <span
              className={`text-[11px] font-medium uppercase tracking-[0.66px] ${
                statusTone[substation.status] === "success"
                  ? "text-success"
                  : statusTone[substation.status] === "warning"
                    ? "text-warning"
                    : "text-critical"
              }`}
            >
              {connectionLabel[substation.status]}
            </span>
          </span>
        </div>
      </div>

      <div className="h-px w-full bg-hairline" />

      <div className="flex flex-col gap-4">
        <Metric label="Current Load" value={formatMW(substation.loadMW)} />
        <Metric label="Max Capacity" value={formatMVA(substation.capacityMVA)} />
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-[0.66px] text-slate">
            Utilization
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[32px] font-semibold leading-none text-ink">
              {formatPct(substation.utilizationPct)}
            </span>
            <StatusPill label={band.label} tone={band.tone} shape="rounded" />
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-hairline" />

      <div className="flex flex-col gap-2.5">
        <h3 className="text-[16px] font-semibold text-ink">Transformers</h3>
        <div className="flex flex-col gap-2">
          {substation.transformers.map((transformer) => {
            const flagged = transformer.status !== "normal";
            return (
              <div
                key={transformer.id}
                className={`flex flex-col gap-1.5 rounded-sm border bg-surface-sunken p-2.5 ${
                  transformer.status === "warning"
                    ? "border-warning-dot"
                    : transformer.status === "critical"
                      ? "border-critical-dot"
                      : "border-hairline"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[14px] text-ink">{transformer.id}</span>
                  <StatusPill
                    label={transformer.status}
                    tone={statusTone[transformer.status]}
                    shape="rounded"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.66px]">
                  <span className="text-slate">
                    Load: {formatPct(transformer.loadPct, 0)}
                  </span>
                  <span className={flagged ? "text-warning" : "text-slate"}>
                    Temp: {formatTempC(transformer.temperatureC)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
