import { Button } from "./Button";
import { toneFill, type Tone } from "./status";
import type { AlertSeverity } from "@/data/types";

// Figma: 49:1824 — 344x148 (4px accent + 340px content), 12px radius, 24px padding,
// 16px gap. Severity drives the accent bar color and is a prop, never hardcoded.

const severityTone: Record<AlertSeverity, Tone> = {
  critical: "critical",
  warning: "warning",
  info: "primary",
};

export function AlertCard({
  severity,
  title,
  context,
  onDismiss,
  onViewDetails,
  detailsHref,
  className = "",
}: {
  severity: AlertSeverity;
  title: string;
  /** Metric / context line, e.g. "Load 108% · Zone B · 2 min ago". */
  context: string;
  onDismiss?: () => void;
  /** Opens the contextual drawer for the affected asset. */
  onViewDetails?: () => void;
  /** Use instead of onViewDetails to route straight to a detail screen. */
  detailsHref?: string;
  className?: string;
}) {
  return (
    <article
      className={`flex items-stretch overflow-hidden rounded-lg ${className}`}
    >
      <div
        className={`w-1 shrink-0 ${toneFill[severityTone[severity]]}`}
        aria-hidden
      />
      <div className="flex flex-1 flex-col gap-4 border-y border-r border-hairline bg-surface p-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-[16px] font-semibold text-ink">{title}</h3>
          <p className="text-[14px] text-slate">{context}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={onDismiss}>
            Dismiss
          </Button>
          {detailsHref ? (
            <Button variant="secondary" size="sm" href={detailsHref}>
              View Details
            </Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={onViewDetails}>
              View Details
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
