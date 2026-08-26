/**
 * NEW ENTITY — Report (Figma 138:825).
 *
 * Generated report artefacts. None of the existing entities describes one, so
 * add to CLAUDE.md as entity 10 (8 is Loss Breakdown, 9 is Demand Curve):
 *
 *   10. Report — id, name, type, scope, generatedAt, status
 *
 * Static, no jitter. Reports generated in-session are appended in component
 * state and are not persisted, per CLAUDE.md.
 */

export const reportTypes = [
  "Monthly Summary",
  "Loss Analysis",
  "Outage Report",
  "Asset Health",
  "Energy Analytics",
  "Compliance Audit",
] as const;

export type ReportType = (typeof reportTypes)[number];

/** `generating` is the transient state a freshly requested report passes through. */
export type ReportStatus = "completed" | "generating" | "failed";

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  /** Zone, substation, or "All Stations". */
  scope: string;
  /** ISO date the report covers up to. */
  generatedAt: string;
  status: ReportStatus;
}

export const dateRanges = [
  "Last 7 Days",
  "Last 30 Days",
  "Last Quarter",
  "Year to Date",
] as const;

export type DateRange = (typeof dateRanges)[number];

export const reports: Report[] = [
  {
    id: "RPT-2091",
    name: "July 2026 Monthly Summary",
    type: "Monthly Summary",
    scope: "All Stations",
    generatedAt: "2026-07-31",
    status: "completed",
  },
  {
    id: "RPT-2090",
    name: "Q2 Distribution Loss Analysis",
    type: "Loss Analysis",
    scope: "All Stations",
    generatedAt: "2026-07-04",
    status: "completed",
  },
  {
    id: "RPT-2089",
    name: "Uttara Substation Asset Health Review",
    type: "Asset Health",
    scope: "Uttara Substation",
    generatedAt: "2026-06-28",
    status: "completed",
  },
  {
    id: "RPT-2088",
    name: "June 2026 Outage Register",
    type: "Outage Report",
    scope: "All Stations",
    generatedAt: "2026-06-30",
    status: "completed",
  },
  {
    id: "RPT-2087",
    name: "Mirpur Zone Energy Analytics",
    type: "Energy Analytics",
    scope: "Mirpur zone",
    generatedAt: "2026-06-15",
    status: "completed",
  },
  {
    id: "RPT-2086",
    name: "H1 2026 Regulatory Compliance Audit",
    type: "Compliance Audit",
    scope: "All Stations",
    generatedAt: "2026-06-01",
    status: "failed",
  },
  {
    id: "RPT-2085",
    name: "Gulshan Substation Asset Health Review",
    type: "Asset Health",
    scope: "Gulshan Substation",
    generatedAt: "2026-05-22",
    status: "completed",
  },
  {
    id: "RPT-2084",
    name: "May 2026 Monthly Summary",
    type: "Monthly Summary",
    scope: "All Stations",
    generatedAt: "2026-05-31",
    status: "completed",
  },
  {
    id: "RPT-2083",
    name: "Feeder Loss Deep Dive — F-19",
    type: "Loss Analysis",
    scope: "Uttara Substation",
    generatedAt: "2026-05-09",
    status: "completed",
  },
  {
    id: "RPT-2082",
    name: "April 2026 Outage Register",
    type: "Outage Report",
    scope: "All Stations",
    generatedAt: "2026-04-30",
    status: "completed",
  },
];

/** Continues the RPT-#### sequence already in the data. */
export function nextReportId(existing: Report[]): string {
  const highest = existing.reduce((max, report) => {
    const n = Number(report.id.replace(/\D/g, ""));
    return Number.isFinite(n) && n > max ? n : max;
  }, 0);
  return `RPT-${highest + 1}`;
}
