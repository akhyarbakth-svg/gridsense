import { toneBadge, type Tone } from "./status";

// Figma: 49:1853 — 22px tall, 10px/4px padding, fully rounded,
// 11px Outfit Medium uppercase with 0.66px tracking.

export function StatusPill({
  label,
  tone = "success",
  className = "",
}: {
  label: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.66px] ${toneBadge[tone]} ${className}`}
    >
      {label}
    </span>
  );
}
