"use client";

import { useState } from "react";
import { Card } from "../Card";
import { PulseMark } from "../PulseMark";
import { TableHeader, type TableHeaderColumn } from "../TableHeader";
import { TableRow } from "../TableRow";
import type { Report, ReportStatus } from "@/data/reports";
import { formatUtcDate } from "@/lib/format";

// Figma: 138:944 — generated reports with a download action per row.

const NAME_WIDTH = 440;
const PAGE_SIZE = 8;

const columns: TableHeaderColumn[] = [
  { key: "type", label: "Type", width: 180 },
  { key: "date", label: "Date", width: 150 },
  { key: "status", label: "Status", width: 130 },
];

const statusChrome: Record<
  ReportStatus,
  { pulse: "success" | "warning" | "critical"; text: string; label: string }
> = {
  completed: { pulse: "success", text: "text-success", label: "Completed" },
  generating: { pulse: "warning", text: "text-warning", label: "Generating…" },
  failed: { pulse: "critical", text: "text-critical", label: "Failed" },
};

function DownloadButton({ report }: { report: Report }) {
  const [state, setState] = useState<"idle" | "working" | "done">("idle");
  const ready = report.status === "completed";

  const run = () => {
    if (!ready || state !== "idle") return;
    setState("working");
    // Presentational only — no file is produced.
    window.setTimeout(() => setState("done"), 700);
    window.setTimeout(() => setState("idle"), 2200);
  };

  return (
    <button
      type="button"
      onClick={run}
      disabled={!ready}
      aria-label={
        ready ? `Download ${report.name}` : `${report.name} is not available`
      }
      className={`grid size-8 place-items-center rounded-sm border border-hairline bg-surface-sunken ${
        ready ? "text-slate hover:text-ink" : "cursor-default opacity-40"
      }`}
    >
      {state === "done" ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-3.5 text-success"
          aria-hidden
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`size-3.5 ${state === "working" ? "animate-pulse" : ""}`}
          aria-hidden
        >
          <path d="M12 3v12M7 11l5 5 5-5M4 21h16" />
        </svg>
      )}
    </button>
  );
}

export function ReportsTable({ reports }: { reports: Report[] }) {
  const [page, setPage] = useState(0);

  const pageCount = Math.max(1, Math.ceil(reports.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const visible = reports.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  return (
    <Card padding="p-0" className="overflow-hidden">
      <TableHeader
        nameLabel="Report Name"
        columns={columns}
        trailingLabel="Actions"
        nameWidth={NAME_WIDTH}
      />

      {visible.map((report) => {
        const chrome = statusChrome[report.status];
        return (
          <TableRow
            key={report.id}
            name={report.name}
            nameWidth={NAME_WIDTH}
            emphasis={report.status === "failed" ? "critical" : undefined}
            columns={[
              { key: "type", value: report.type, width: 180, muted: true },
              {
                key: "date",
                value: formatUtcDate(report.generatedAt),
                width: 150,
                mono: true,
              },
              {
                key: "status",
                value: (
                  <span className="flex items-center gap-2">
                    <PulseMark
                      status={chrome.pulse}
                      size={16}
                      animate={report.status === "generating"}
                    />
                    <span className={chrome.text}>{chrome.label}</span>
                  </span>
                ),
                width: 130,
              },
            ]}
            chart={<DownloadButton report={report} />}
          />
        );
      })}

      <div className="flex items-center justify-between p-5">
        <span className="text-[14px] text-slate">
          Showing {visible.length} of {reports.length} reports
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
