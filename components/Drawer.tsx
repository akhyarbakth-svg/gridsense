"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PulseMark } from "./PulseMark";
import { StatusPill } from "./StatusPill";
import { toneText, type Tone } from "./status";
import { substations } from "@/data/substations";
import { feeders } from "@/data/feeders";
import type { AssetRef, Status, Transformer } from "@/data/types";
import {
  formatMVA,
  formatMW,
  formatPct,
  formatTempC,
} from "@/lib/format";

// Figma: 70:198 — 400px right-side overlay, #111827 on a left hairline, 24px
// padding and gaps. An overlay, never a route. Content swaps in place when a
// different entity is selected: the panel stays mounted and only its data changes.

export type DrawerTarget = AssetRef;

const statusTone: Record<Status, Tone> = {
  normal: "success",
  warning: "warning",
  critical: "critical",
};

const statusLabel: Record<Status, string> = {
  normal: "Operational",
  warning: "Elevated",
  critical: "Critical",
};

interface Metric {
  label: string;
  value: string;
}

interface DrawerContent {
  kind: string;
  title: string;
  status: Status;
  metrics: Metric[];
  transformers?: Transformer[];
  /** Shown when the entity can't be found in the mock data. */
  missing?: boolean;
}

function resolve(target: DrawerTarget): DrawerContent {
  if (target.kind === "substation") {
    const substation = substations.find((s) => s.id === target.id);
    if (!substation)
      return { kind: "Substation", title: target.id, status: "normal", metrics: [], missing: true };

    return {
      kind: "Substation",
      title: substation.name,
      status: substation.status,
      metrics: [
        { label: "Load", value: formatMW(substation.loadMW) },
        { label: "Capacity", value: formatMVA(substation.capacityMVA) },
        { label: "Utilization", value: formatPct(substation.utilizationPct) },
      ],
      transformers: substation.transformers,
    };
  }

  if (target.kind === "feeder") {
    const feeder = feeders.find((f) => f.id === target.id);
    if (!feeder)
      return { kind: "Feeder", title: target.id, status: "normal", metrics: [], missing: true };

    return {
      kind: "Feeder",
      title: feeder.name,
      status: feeder.status,
      metrics: [
        { label: "Load", value: formatPct(feeder.loadPct, 0) },
        { label: "Loss", value: formatPct(feeder.lossPct) },
        { label: "Status", value: statusLabel[feeder.status] },
      ],
    };
  }

  const transformer = substations
    .flatMap((s) => s.transformers)
    .find((t) => t.id === target.id);
  if (!transformer)
    return { kind: "Transformer", title: target.id, status: "normal", metrics: [], missing: true };

  const parent = substations.find((s) => s.id === transformer.substationId);

  return {
    kind: parent ? `Transformer · ${parent.name}` : "Transformer",
    title: transformer.id,
    status: transformer.status,
    metrics: [
      { label: "Load", value: formatPct(transformer.loadPct, 0) },
      { label: "Temp", value: formatTempC(transformer.temperatureC) },
      { label: "Health", value: `${transformer.healthScore}/100` },
    ],
  };
}

export function Drawer({
  target,
  open,
  onClose,
  onViewDetails,
}: {
  /** Stays set after closing so the panel never blanks mid-transition. */
  target: DrawerTarget | null;
  open: boolean;
  onClose: () => void;
  /** Overrides the default routing for "View details". */
  onViewDetails?: () => void;
}) {
  const router = useRouter();
  // Escape closes the drawer.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!target) return null;

  const content = resolve(target);

  // Detail route per entity kind. Feeder and asset screens are still
  // placeholders, so only the built ones are offered.
  const detailHref =
    target.kind === "substation" ? `/substations/${target.id}` : null;

  const viewDetails = () => {
    if (onViewDetails) return onViewDetails();
    if (detailHref) {
      onClose();
      router.push(detailHref);
    }
  };

  return (
    <>
      {/* Click-outside surface */}
      <div
        onClick={onClose}
        aria-hidden
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`${content.kind} details`}
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-100 flex-col gap-6 overflow-y-auto border-l border-hairline bg-surface p-6 transition-transform duration-200 ${
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
      >
        <header className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium uppercase tracking-[0.66px] text-slate">
              {content.kind}
            </span>
            <h2 className="text-[22px] font-semibold leading-tight text-ink">
              {content.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-[30px] shrink-0 place-items-center rounded-sm border border-hairline text-slate transition-[color] hover:text-ink"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="size-3"
              aria-hidden
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        {content.missing ? (
          <p className="text-[14px] text-slate">
            No telemetry available for this asset.
          </p>
        ) : (
          <>
            <div>
              <span className="inline-flex items-center gap-2 rounded-sm border border-hairline bg-surface-sunken px-3 py-1.5">
                <PulseMark status={content.status} size={16} />
                <span
                  className={`text-[11px] font-medium uppercase tracking-[0.66px] ${toneText[statusTone[content.status]]}`}
                >
                  {statusLabel[content.status]}
                </span>
              </span>
            </div>

            <div className="flex gap-3">
              {content.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex flex-1 flex-col gap-2 rounded-lg border border-hairline bg-surface-sunken px-3.5 py-4"
                >
                  <span className="text-[11px] font-medium uppercase tracking-[0.66px] text-slate">
                    {metric.label}
                  </span>
                  <span className="font-mono text-[16px] text-ink">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>

            {content.transformers && content.transformers.length > 0 && (
              <>
                <div className="h-px w-full bg-hairline" />
                <div className="flex flex-col gap-3">
                  <h3 className="text-[16px] font-semibold text-ink">
                    Transformers
                  </h3>
                  <div className="flex items-center gap-2.5 border-b border-hairline pb-3 text-[11px] font-medium uppercase tracking-[0.66px] text-slate">
                    <span className="flex-1">Asset</span>
                    <span className="w-14">Load</span>
                    <span className="w-18">Temp</span>
                    <span className="w-21">Status</span>
                  </div>
                  {content.transformers.map((transformer) => (
                    <div
                      key={transformer.id}
                      className="flex items-center gap-2.5 border-b border-hairline pb-3 text-[14px]"
                    >
                      <span className="flex-1 text-ink">{transformer.id}</span>
                      <span className="w-14 font-mono text-ink">
                        {formatPct(transformer.loadPct, 0)}
                      </span>
                      <span className="w-18 font-mono text-slate">
                        {formatTempC(transformer.temperatureC)}
                      </span>
                      <span className="w-21">
                        <StatusPill
                          label={statusLabel[transformer.status]}
                          tone={statusTone[transformer.status]}
                          shape="rounded"
                          caps={false}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        <div className="mt-auto pt-3">
          <button
            type="button"
            onClick={viewDetails}
            disabled={!onViewDetails && !detailHref}
            className="flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline disabled:cursor-default disabled:opacity-40 disabled:hover:no-underline"
          >
            View details
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-3"
              aria-hidden
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
}
