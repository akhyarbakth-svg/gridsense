import { Button } from "../Button";
import { Card } from "../Card";
import { PulseMark } from "../PulseMark";
import { feeders } from "@/data/feeders";
import { substations } from "@/data/substations";
import { restorationHours } from "@/data/outages";
import type { Outage, OutageStatus, TimelineState } from "@/data/types";
import { formatPct, formatUtcDate, formatUtcTime } from "@/lib/format";

// Figma: 133:556 — an INLINE panel under the map, not the contextual drawer:
// two columns (detail grid beside a restoration timeline) sitting in the page
// rather than a right-side overlay. Built as its own component for that reason.

const statusChrome: Record<
  OutageStatus,
  { bed: string; text: string; label: string; pulse: "critical" | "warning" | "success" }
> = {
  active: {
    bed: "bg-badge-critical",
    text: "text-critical",
    label: "Critical fault",
    pulse: "critical",
  },
  restoring: {
    bed: "bg-badge-warning",
    text: "text-warning",
    label: "Restoring",
    pulse: "warning",
  },
  resolved: {
    bed: "bg-badge-success",
    text: "text-success",
    label: "Resolved",
    pulse: "success",
  },
};

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-[0.66px] text-slate">
        {label}
      </span>
      <span className="text-[14px] text-ink">{value}</span>
    </div>
  );
}

function TimelineIndicator({ state }: { state: TimelineState }) {
  if (state === "current") return <PulseMark status="primary" size={16} animate />;
  return (
    <span className="grid size-4 place-items-center" aria-hidden>
      <span
        className={`size-2 rounded-full ${state === "done" ? "bg-success-dot" : "bg-slate/40"}`}
      />
    </span>
  );
}

/** Human date for the incident header fields. Both halves pinned to UTC. */
function formatDateTime(iso: string): string {
  return `${formatUtcDate(iso)} · ${formatUtcTime(iso)}`;
}

export function IncidentPanel({
  outage,
  onUpdateStatus,
}: {
  outage: Outage;
  onUpdateStatus?: () => void;
}) {
  const chrome = statusChrome[outage.status];
  const feeder = feeders.find((f) => f.id === outage.feederId);
  const origin = feeder
    ? substations.find((s) => s.id === feeder.substationId)
    : undefined;

  const hours = restorationHours(outage);
  const doneSteps = outage.timeline.filter((s) => s.state === "done").length;
  const progressPct = (doneSteps / outage.timeline.length) * 100;

  return (
    <Card padding="p-5" className="flex gap-6">
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <h2 className="text-[16px] font-semibold text-ink">
              Incident Details: {outage.id}
            </h2>
            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 ${chrome.bed}`}
            >
              <PulseMark status={chrome.pulse} size={12} />
              <span
                className={`text-[11px] font-medium uppercase tracking-[0.66px] ${chrome.text}`}
              >
                {chrome.label}
              </span>
            </span>
          </div>
          <Button variant="primary" onClick={onUpdateStatus}>
            Update Status
          </Button>
        </div>

        <div className="h-px w-full bg-hairline" />

        <div className="flex flex-col gap-4">
          <div className="flex gap-5">
            <Detail
              label="Feeder"
              value={
                origin
                  ? `${origin.name.replace(" Substation", "")} · ${outage.feederId}`
                  : outage.feederId
              }
            />
            <Detail label="Location" value={outage.location} />
            <Detail label="Started" value={formatDateTime(outage.startedAt)} />
          </div>
          <div className="flex gap-5">
            <Detail
              label="Customers Affected"
              value={`${outage.customersAffected.toLocaleString("en-US")} homes / commercial`}
            />
            <Detail label="Probable Cause" value={outage.probableCause} />
            <Detail label="Assigned Crew" value={outage.crew} />
          </div>
          <div className="flex gap-5">
            <Detail
              label="Estimated Restoration"
              value={`${formatDateTime(outage.estimatedRestoration)} (${hours.toFixed(1)} h window)`}
            />
          </div>
        </div>
      </div>

      <div className="w-px shrink-0 self-stretch bg-hairline" aria-hidden />

      <div className="flex w-75 shrink-0 flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-[16px] font-semibold text-ink">
            Restoration Progress
          </h3>
          <span className="font-mono text-[11px] text-slate">
            {formatPct(progressPct, 0)}
          </span>
        </div>

        <ol className="flex flex-col gap-3">
          {outage.timeline.map((step) => (
            <li key={step.event} className="flex items-center gap-3">
              <TimelineIndicator state={step.state} />
              <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                <span
                  className={`text-[13px] font-medium ${
                    step.state === "pending" ? "text-slate/60" : "text-ink"
                  }`}
                >
                  {step.event}
                </span>
                <span
                  className={`font-mono text-[11px] ${
                    step.state === "done"
                      ? "text-success"
                      : step.state === "current"
                        ? "text-slate"
                        : "text-slate/60"
                  }`}
                >
                  {formatUtcTime(step.timestamp)}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
}
