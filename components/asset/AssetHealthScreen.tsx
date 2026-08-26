import Link from "next/link";
import { Button } from "../Button";
import { Card } from "../Card";
import { KPICard } from "../KPICard";
import { PulseMark } from "../PulseMark";
import { StatusPill } from "../StatusPill";
import type { Tone } from "../status";
import {
  WINDING_WARNING_C,
  loadHistory,
  oilTempHistory,
  windingTempHistory,
} from "@/data/assetHistory";
import { substations } from "@/data/substations";
import { workOrdersForAsset } from "@/data/workOrders";
import type { Status, Transformer } from "@/data/types";
import { formatPct, formatTempC } from "@/lib/format";
import { AssetTrendCard } from "./AssetTrendCard";
import { HistoryList, type HistoryEntry } from "./HistoryList";
import { RiskCard } from "./RiskCard";

// Figma: 134:360. A template parameterised by transformer — every panel
// derives from the resolved asset, so any transformer renders correctly.

const CURRENT_YEAR = 2026;

const statusTone: Record<Status, Tone> = {
  normal: "success",
  warning: "warning",
  critical: "critical",
};

const statusLabel: Record<Status, string> = {
  normal: "Nominal",
  warning: "Warning",
  critical: "Critical",
};

function healthBand(score: number): { label: string; tone: Tone } {
  if (score < 50) return { label: "Critical Condition", tone: "critical" };
  if (score < 75) return { label: "Elevated Stress", tone: "warning" };
  return { label: "Healthy", tone: "success" };
}

export function AssetHealthScreen({
  transformer,
}: {
  transformer: Transformer;
}) {
  const parent = substations.find((s) => s.id === transformer.substationId);
  const health = healthBand(transformer.healthScore);
  // Above the threshold is a different statement from approaching it.
  const overThreshold = transformer.temperatureC >= WINDING_WARNING_C;
  const nearThreshold = transformer.temperatureC >= WINDING_WARNING_C - 10;

  const maintenance: HistoryEntry[] = workOrdersForAsset(transformer.id).map(
    (order) => ({
      id: order.id,
      event: `${order.issue} — ${order.status === "completed" ? "Completed" : order.status === "in_progress" ? "In progress" : "Open"}`,
      date: order.dueDate,
      outcome:
        order.status === "completed"
          ? "normal"
          : order.priority === "urgent"
            ? "critical"
            : "warning",
    })
  );

  const faults: HistoryEntry[] = transformer.faultHistory.map((fault) => ({
    id: `${fault.date}-${fault.event}`,
    event: fault.event,
    date: fault.date,
    outcome: fault.outcome,
  }));

  return (
    <>
      <header className="mb-8 flex flex-col gap-3 border-b border-hairline pb-5">
        <Link
          href={parent ? `/substations/${parent.id}` : "/live-grid"}
          className="flex w-fit items-center gap-1.5 text-[13px] font-medium text-slate transition-[color] hover:text-ink"
        >
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
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to {parent ? parent.name : "grid map"}
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-[22px] font-semibold leading-tight text-ink">
              {transformer.id}
              {parent ? ` · ${parent.name}` : ""}
            </h1>
            <StatusPill
              label={statusLabel[transformer.status]}
              tone={statusTone[transformer.status]}
              icon={<PulseMark status={transformer.status} size={12} />}
            />
          </div>

          <div className="flex shrink-0 flex-col items-end gap-0.5">
            <span className="text-[14px] text-slate">
              Asset ID: {transformer.id}
            </span>
            <span className="text-[14px] text-slate">
              Commissioned: {CURRENT_YEAR - transformer.ageYears}
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          <KPICard
            variant="donut"
            label="Health Score"
            percent={transformer.healthScore}
            value={`${transformer.healthScore}/100`}
            caption={health.label}
            captionTone={health.tone}
            ringTone={health.tone}
            className="flex-1"
          />
          <KPICard
            label="Current Load"
            value={formatPct(transformer.loadPct, 0)}
            status={
              transformer.loadPct >= 85 ? "Elevated demand" : "Within rating"
            }
            statusTone={transformer.loadPct >= 85 ? "warning" : "success"}
            pulse
            pulseStatus={transformer.status}
            className="flex-1"
          />
          <KPICard
            label="Winding Temp"
            value={formatTempC(transformer.temperatureC)}
            status={
              overThreshold
                ? `Above threshold (${WINDING_WARNING_C}°)`
                : nearThreshold
                  ? `Near threshold (${WINDING_WARNING_C}°)`
                  : "Nominal range"
            }
            statusTone={
              overThreshold ? "critical" : nearThreshold ? "warning" : "success"
            }
            className="flex-1"
          />
          <KPICard
            label="Total Runtime"
            value={`${transformer.operatingHours.toLocaleString("en-US")} hrs`}
            status="Continuous operation"
            className="flex-1"
          />
          <KPICard
            label="Since Commissioning"
            value={`${transformer.ageYears} Years`}
            status={transformer.ageYears >= 15 ? "Late-life status" : "Mid-life status"}
            statusTone={transformer.ageYears >= 15 ? "warning" : "neutral"}
            className="flex-1"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <AssetTrendCard
              title="Winding Temperature — 30 Days"
              points={windingTempHistory(transformer)}
              unit="°C"
              threshold={WINDING_WARNING_C}
              thresholdLabel={`Warning Threshold (${WINDING_WARNING_C}°C)`}
            />
            <AssetTrendCard
              title="Load Profile — 30 Days"
              points={loadHistory(transformer)}
              unit="%"
            />
            <AssetTrendCard
              title="Oil Temperature — 30 Days"
              points={oilTempHistory(transformer)}
              unit="°C"
            />
          </div>

          <div className="flex w-120 shrink-0 flex-col gap-4">
            <RiskCard transformer={transformer} />
            <HistoryList
              title="Maintenance History"
              entries={maintenance}
              emptyLabel="No work orders raised against this asset."
            />
            <HistoryList
              title="Fault History"
              entries={faults}
              emptyLabel="No faults recorded."
            />
          </div>
        </div>

        <Card padding="p-4" className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[14px] text-slate">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="size-4"
              aria-hidden
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5M12 8h.01" strokeLinecap="round" />
            </svg>
            Pre-filled with asset {transformer.id} diagnostics
          </span>
          {/* Maintenance is still a placeholder route; the asset is carried in the query. */}
          <Button variant="primary" href={`/maintenance?asset=${transformer.id}`}>
            Create Work Order
          </Button>
        </Card>
      </div>
    </>
  );
}
