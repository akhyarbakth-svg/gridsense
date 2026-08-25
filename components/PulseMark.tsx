// Signature "pulse mark" — a dot with a soft outer ring, GridSense's live-status indicator.
// Component #1 in the CLAUDE.md build order; reused anywhere a "live" state is shown.
//
// Geometry matches Figma (node 34:39): the soft ring fills the box, the solid dot is
// half the box, both centered and sharing one hue — the ring is the same color at low alpha.
// Rendered at 8px (KPI status rows), 10px (alert bar) and 16px (table rows).

export type PulseStatus =
  | "normal" // indigo — the Figma "Normal" state
  | "primary" // alias of normal
  | "success"
  | "warning"
  | "critical";

const fills: Record<PulseStatus, string> = {
  normal: "bg-primary",
  primary: "bg-primary",
  success: "bg-success-dot",
  warning: "bg-warning-dot",
  critical: "bg-critical-dot",
};

export function PulseMark({
  status = "normal",
  size = 8,
  animate = false,
  className = "",
}: {
  status?: PulseStatus;
  /** Box size in px — the ring spans this, the dot is half of it. */
  size?: number;
  /** Adds a slow breathing animation to the ring. Static by default, matching the design. */
  animate?: boolean;
  className?: string;
}) {
  const fill = fills[status];

  return (
    <span
      className={`relative inline-block shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span
        className={`absolute inset-0 rounded-full opacity-30 ${fill} ${
          animate ? "animate-pulse" : ""
        }`}
      />
      <span
        className={`absolute rounded-full ${fill}`}
        style={{ inset: size / 4 }}
      />
    </span>
  );
}
