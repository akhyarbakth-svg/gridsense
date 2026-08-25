import { toneBadge, type Tone } from "./status";

// Figma: 49:1853 — 22px tall, 10px/4px padding, fully rounded,
// 11px Outfit Medium uppercase with 0.66px tracking.
// The drawer (70:249) uses the same badge with an 8px radius and sentence case,
// so shape and caps are options rather than a second component.

export function StatusPill({
  label,
  tone = "success",
  shape = "pill",
  caps = true,
  className = "",
}: {
  label: string;
  tone?: Tone;
  shape?: "pill" | "rounded";
  caps?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[11px] font-medium ${
        shape === "pill" ? "rounded-full" : "rounded-sm"
      } ${caps ? "uppercase tracking-[0.66px]" : ""} ${toneBadge[tone]} ${className}`}
    >
      {label}
    </span>
  );
}
