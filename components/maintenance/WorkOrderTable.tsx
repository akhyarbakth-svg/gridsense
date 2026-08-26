"use client";

import { useState } from "react";
import { Card } from "../Card";
import { StatusPill } from "../StatusPill";
import { TableHeader, type TableHeaderColumn } from "../TableHeader";
import { TableRow } from "../TableRow";
import type { Tone } from "../status";
import type { WorkOrder, WorkOrderPriority, WorkOrderStatus } from "@/data/types";

// Figma: 137:469 — the work order queue with an asset filter and paging.

const NAME_WIDTH = 96;
const PAGE_SIZE = 8;

const columns: TableHeaderColumn[] = [
  { key: "asset", label: "Asset Identity", width: 130 },
  { key: "issue", label: "Fault / Telemetry Issue" },
  { key: "priority", label: "Priority", width: 110 },
  { key: "team", label: "Assigned Team", width: 150 },
  { key: "due", label: "Due Target", width: 120 },
  { key: "status", label: "SCADA Status", width: 120 },
];

const priorityTone: Record<WorkOrderPriority, Tone> = {
  urgent: "critical",
  high: "warning",
  medium: "primary",
  low: "neutral",
};

const priorityLabel: Record<WorkOrderPriority, string> = {
  urgent: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const priorityDot: Record<Tone, string> = {
  critical: "bg-critical",
  warning: "bg-warning",
  primary: "bg-primary",
  neutral: "bg-slate",
  success: "bg-success",
};

const statusTone: Record<WorkOrderStatus, Tone> = {
  open: "primary",
  in_progress: "warning",
  completed: "success",
};

const statusLabel: Record<WorkOrderStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  completed: "Completed",
};

/** Rank used when sorting the queue: most urgent, soonest due, first. */
const priorityRank: Record<WorkOrderPriority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export function WorkOrderTable({ orders }: { orders: WorkOrder[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const needle = query.trim().toLowerCase();
  const filtered = orders.filter((order) =>
    needle === ""
      ? true
      : `${order.id} ${order.assetId} ${order.issue} ${order.assignedTeam}`
          .toLowerCase()
          .includes(needle)
  );

  const ranked = [...filtered].sort(
    (a, b) =>
      priorityRank[a.priority] - priorityRank[b.priority] ||
      a.dueDate.localeCompare(b.dueDate)
  );

  const pageCount = Math.max(1, Math.ceil(ranked.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const visible = ranked.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  return (
    <Card padding="p-0" className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between p-5">
        <h2 className="text-[16px] font-semibold text-ink">
          Active Work Orders Queue
        </h2>
        <label className="flex items-center gap-2 rounded-sm border border-hairline bg-surface-sunken px-3 py-1.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="size-3 text-slate"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            placeholder="Filter assets..."
            aria-label="Filter work orders"
            className="w-36 bg-transparent text-[13px] text-ink outline-none placeholder:text-slate"
          />
        </label>
      </div>

      <TableHeader
        nameLabel="WO ID"
        columns={columns}
        nameWidth={NAME_WIDTH}
      />

      {visible.length === 0 ? (
        <p className="px-5 py-8 text-[14px] text-slate">
          No work orders match “{query}”.
        </p>
      ) : (
        visible.map((order) => {
          const tone = priorityTone[order.priority];
          return (
            <TableRow
              key={order.id}
              name={order.id}
              nameWidth={NAME_WIDTH}
              emphasis={
                order.priority === "urgent" && order.status !== "completed"
                  ? "critical"
                  : undefined
              }
              columns={[
                { key: "asset", value: order.assetId, width: 130 },
                { key: "issue", value: order.issue, muted: true },
                {
                  key: "priority",
                  value: (
                    <span className="flex items-center gap-2">
                      <span
                        className={`size-1.5 rounded-full ${priorityDot[tone]}`}
                        aria-hidden
                      />
                      {priorityLabel[order.priority]}
                    </span>
                  ),
                  width: 110,
                },
                { key: "team", value: order.assignedTeam, width: 150 },
                { key: "due", value: order.dueDate, width: 120, mono: true },
                {
                  key: "status",
                  value: (
                    <StatusPill
                      label={statusLabel[order.status]}
                      tone={statusTone[order.status]}
                      shape="rounded"
                    />
                  ),
                  width: 120,
                },
              ]}
            />
          );
        })
      )}

      <div className="flex items-center justify-between p-5">
        <span className="text-[14px] text-slate">
          Showing {visible.length} of {ranked.length} active system work orders
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
            className="rounded-sm border border-hairline px-3 py-1.5 text-[13px] text-slate disabled:opacity-40 enabled:hover:text-ink"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={safePage >= pageCount - 1}
            className="rounded-sm border border-hairline px-3 py-1.5 text-[13px] text-slate disabled:opacity-40 enabled:hover:text-ink"
          >
            Next page
          </button>
        </div>
      </div>
    </Card>
  );
}
