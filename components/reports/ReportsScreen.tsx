"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../Button";
import { Card } from "../Card";
import { Field, inputClassName } from "../FormField";
import { PageHeader } from "../PageHeader";
import { substations } from "@/data/substations";
import { zones } from "@/data/zones";
import {
  dateRanges,
  nextReportId,
  reports as seedReports,
  reportTypes,
  type DateRange,
  type Report,
  type ReportType,
} from "@/data/reports";
import { ReportsTable } from "./ReportsTable";

// Figma: 138:825. Generating is presentational: the new report lands in the
// table as `generating`, then settles to `completed`. No file is produced and
// nothing persists, per CLAUDE.md.

const GENERATE_MS = 1400;

export function ReportsScreen() {
  const [items, setItems] = useState<Report[]>(seedReports);
  const [type, setType] = useState<ReportType>("Monthly Summary");
  const [range, setRange] = useState<DateRange>("Last 30 Days");
  const [scope, setScope] = useState("All Stations");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Pending timers are cleared on unmount so nothing sets state afterwards.
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const scopeOptions = [
    "All Stations",
    ...zones.map((zone) => zone.name),
    ...substations.map((substation) => substation.name),
  ];

  const generate = () => {
    if (busy) return;

    const id = nextReportId(items);
    const draft: Report = {
      id,
      name: `${type} · ${range}${scope === "All Stations" ? "" : ` · ${scope}`}`,
      type,
      scope,
      generatedAt: new Date().toISOString().slice(0, 10),
      status: "generating",
    };

    setItems((current) => [draft, ...current]);
    setBusy(true);
    setToast(null);

    timers.current.push(
      setTimeout(() => {
        setItems((current) =>
          current.map((report) =>
            report.id === id ? { ...report, status: "completed" } : report
          )
        );
        setBusy(false);
        setToast(`${id} generated and ready to download.`);
      }, GENERATE_MS)
    );
  };

  return (
    <>
      <PageHeader title="Reports" breadcrumb={["Reports"]} />

      <div className="flex flex-col gap-6">
        <Card className="flex flex-col gap-4">
          <h2 className="text-[16px] font-semibold text-ink">
            Generate New Report
          </h2>

          <div className="flex items-end gap-4">
            <Field label="Report Type" className="flex-1">
              <select
                value={type}
                onChange={(event) => setType(event.target.value as ReportType)}
                className={inputClassName}
              >
                {reportTypes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Date Range" className="flex-1">
              <select
                value={range}
                onChange={(event) => setRange(event.target.value as DateRange)}
                className={inputClassName}
              >
                {dateRanges.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Zone / Substation" className="flex-1">
              <select
                value={scope}
                onChange={(event) => setScope(event.target.value)}
                className={inputClassName}
              >
                {scopeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Button variant="primary" onClick={generate} disabled={busy}>
              {busy ? "Generating…" : "Generate"}
            </Button>
          </div>

          {toast && (
            <p role="status" className="text-[13px] text-success">
              {toast}
            </p>
          )}
        </Card>

        <ReportsTable reports={items} />
      </div>
    </>
  );
}
