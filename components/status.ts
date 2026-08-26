// Shared status → color mapping for the component library.
// Keeps AlertCard / KPICard / TableRow from each inventing their own severity palette.

export type Tone = "primary" | "success" | "warning" | "critical" | "neutral";

/** Status text (trend lines, captions, pill labels). */
export const toneText: Record<Tone, string> = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  critical: "text-critical",
  neutral: "text-slate",
};

/** Solid fills — accent bars, ring fills. */
export const toneFill: Record<Tone, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  critical: "bg-critical",
  neutral: "bg-slate",
};

/** Status pill: deep bed + bright label. */
export const toneBadge: Record<Tone, string> = {
  primary: "bg-primary/20 text-primary",
  success: "bg-badge-success text-success",
  warning: "bg-badge-warning text-warning",
  critical: "bg-badge-critical text-critical",
  neutral: "bg-badge-neutral text-slate",
};

/** Ring stroke colors for the donut variant (SVG `stroke` needs a raw value). */
export const toneStroke: Record<Tone, string> = {
  primary: "var(--color-primary)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  critical: "var(--color-critical)",
  neutral: "var(--color-slate)",
};

/** Outlined pill: tinted bed, coloured hairline and label (Figma 132:329). */
export const toneOutline: Record<Tone, string> = {
  primary: "bg-primary/15 border-primary text-primary",
  success: "bg-success-dot/15 border-success text-success",
  warning: "bg-warning-dot/15 border-warning text-warning",
  critical: "bg-critical-dot/15 border-critical text-critical",
  neutral: "bg-badge-neutral border-hairline text-slate",
};
