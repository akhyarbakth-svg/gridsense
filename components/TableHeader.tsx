import type { TableColumn } from "./TableRow";

// Column header strip for dense tables (Figma 49:1830). Mirrors TableRow's
// geometry exactly — 216px name block, matching column widths, 24px gaps —
// so headers line up with the cells beneath them.

export interface TableHeaderColumn extends Pick<TableColumn, "key" | "width" | "align"> {
  label: string;
}

const labelCls =
  "text-[11px] font-medium uppercase tracking-[0.66px] text-slate";

export function TableHeader({
  nameLabel,
  columns,
  trailingLabel,
  nameWidth = 216,
  className = "",
}: {
  /** Label over the leading name block, e.g. "Feeder Name". */
  nameLabel: string;
  columns: TableHeaderColumn[];
  /** Label over the trailing status column. */
  trailingLabel?: string;
  /** Must match the TableRow nameWidth so headers line up with cells. */
  nameWidth?: number;
  className?: string;
}) {
  return (
    <div
      className={`flex h-8 items-center gap-6 border-b border-hairline px-4 ${className}`}
    >
      <div className="flex shrink-0 items-center" style={{ width: nameWidth }}>
        <span className={`px-3 ${labelCls}`}>{nameLabel}</span>
      </div>

      {columns.map(({ key, label, width, align = "left" }) => (
        <div
          key={key}
          className={`flex min-w-0 items-center px-3 ${
            align === "right" ? "justify-end" : ""
          } ${width === undefined ? "flex-1" : "shrink-0"}`}
          style={width === undefined ? undefined : { width }}
        >
          <span className={`truncate ${labelCls}`}>{label}</span>
        </div>
      ))}

      {trailingLabel && (
        <div className="flex flex-1 items-center justify-end px-3">
          <span className={labelCls}>{trailingLabel}</span>
        </div>
      )}
    </div>
  );
}
