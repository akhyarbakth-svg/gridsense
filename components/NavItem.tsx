import Link from "next/link";
import type { ReactNode } from "react";

// Figma: 49:1721 — 200x36, 12px side padding, 8px gap, 8px radius, 16px icon,
// 14px Outfit label. Active is a solid indigo (#4b4fe0) fill with white label
// plus a 2px left indicator bar; default is transparent with a slate label.

export function NavItem({
  href,
  label,
  icon,
  active = false,
  className = "",
}: {
  href: string;
  label: string;
  /** 16px icon node, e.g. <Icon name="overview" className="h-4 w-4" />. */
  icon?: ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`group relative flex h-9 items-center gap-2 overflow-hidden rounded-sm px-3 text-[14px] transition-[color] ${
        active
          ? "bg-primary font-medium text-white"
          : "text-slate hover:bg-white/5 hover:text-ink"
      } ${className}`}
    >
      {active && (
        <span
          className="absolute inset-y-0 left-0 w-0.5 bg-white/70"
          aria-hidden
        />
      )}
      {icon && (
        <span
          className={`grid size-4 shrink-0 place-items-center ${
            active ? "text-white" : "text-slate group-hover:text-ink"
          }`}
        >
          {icon}
        </span>
      )}
      <span className="truncate">{label}</span>
    </Link>
  );
}
