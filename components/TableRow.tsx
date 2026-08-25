import Link from "next/link";
import type { ReactNode } from "react";
import { PulseMark, type PulseStatus } from "./PulseMark";
import { StatusPill } from "./StatusPill";
import type { Tone } from "./status";

// Figma: 49:1838 — 40px tall, bottom hairline, 16px side padding, 24px column gap.
// Name group is 216px (56px status cell + 160px label); numeric columns are
// right-aligned mono; the status pill sits at the end of the row.
//
// Columns are arbitrary so every table in the app (feeders, substations,
// transformers, work orders) can drive this one row component from data.

export interface TableColumn {
  key: string;
  value: ReactNode;
  /** Fixed column width in px. Omit to let the column flex. */
  width?: number;
  align?: "left" | "right";
  /** Render with IBM Plex Mono — use for dense numeric telemetry. */
  mono?: boolean;
  /** Slate rather than ink, for secondary values like zone. */
  muted?: boolean;
}

export interface TableRowProps {
  /** Leading pulse mark; omit to hide the status cell. */
  status?: PulseStatus;
  /** Primary label, e.g. "F-01 Gulshan North". */
  name: ReactNode;
  columns?: TableColumn[];
  badge?: { label: string; tone?: Tone };
  /** Inline sparkline slot, sits before the badge. */
  chart?: ReactNode;
  /** Routes to a detail screen. */
  href?: string;
  /** Opens the contextual drawer. Ignored when `href` is set. */
  onClick?: () => void;
  className?: string;
}

function Cell({ column }: { column: TableColumn }) {
  const { value, width, align = "left", mono, muted } = column;
  return (
    <div
      className={`flex h-full min-w-0 items-center px-3 ${
        align === "right" ? "justify-end" : ""
      } ${width === undefined ? "flex-1" : "shrink-0"}`}
      style={width === undefined ? undefined : { width }}
    >
      <span
        className={`truncate text-[14px] ${mono ? "font-mono" : ""} ${
          muted ? "text-slate" : "text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function TableRow({
  status,
  name,
  columns = [],
  badge,
  chart,
  href,
  onClick,
  className = "",
}: TableRowProps) {
  const interactive = Boolean(href || onClick);

  const content = (
    <>
      <div className="flex h-full w-54 shrink-0 items-center">
        {status && (
          <div className="flex h-full w-14 shrink-0 items-center justify-center px-3">
            <PulseMark status={status} size={16} />
          </div>
        )}
        <div className="flex h-full min-w-0 flex-1 items-center px-3">
          <span className="truncate text-[14px] text-ink">{name}</span>
        </div>
      </div>

      {columns.map((column) => (
        <Cell key={column.key} column={column} />
      ))}

      {(chart || badge) && (
        <div className="flex h-full flex-1 items-center justify-end gap-3 px-3">
          {chart}
          {badge && <StatusPill label={badge.label} tone={badge.tone} />}
        </div>
      )}
    </>
  );

  const classes = `flex h-10 items-center gap-6 border-b border-hairline bg-surface px-4 ${
    interactive ? "cursor-pointer transition-[background-color] hover:bg-white/[0.03]" : ""
  } ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${classes} w-full text-left`}>
        {content}
      </button>
    );
  }

  return <div className={classes}>{content}</div>;
}
