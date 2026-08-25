// Signature "pulse mark" — a dot with a soft outer ring, GridSense's live-status indicator.
// Component #1 in the CLAUDE.md build order; reused anywhere a "live" state is shown.

type PulseStatus = "success" | "warning" | "critical" | "primary";

const colors: Record<PulseStatus, { dot: string; ping: string }> = {
  success: { dot: "bg-success-dot", ping: "bg-success" },
  warning: { dot: "bg-warning-dot", ping: "bg-warning" },
  critical: { dot: "bg-critical-dot", ping: "bg-critical" },
  primary: { dot: "bg-primary", ping: "bg-primary" },
};

export function PulseMark({
  status = "success",
  className = "",
}: {
  status?: PulseStatus;
  className?: string;
}) {
  const c = colors[status];
  return (
    <span className={`relative inline-flex h-2 w-2 shrink-0 ${className}`}>
      <span
        className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping ${c.ping}`}
      />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${c.dot}`} />
    </span>
  );
}
