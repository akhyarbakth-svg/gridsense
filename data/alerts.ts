import type { Alert } from "./types";

export const alerts: Alert[] = [
  {
    id: "ALT-2048",
    severity: "critical",
    title: "Transformer overload — TR-07",
    metric: "loadPct",
    durationMinutes: 34,
    expectedImpact: "Risk of automatic trip, ~4,200 customers on Mirpur Substation",
    status: "active",
    asset: { kind: "transformer", id: "TR-07" },
  },
  {
    id: "ALT-2049",
    severity: "warning",
    title: "Feeder loss above threshold — F-12",
    metric: "lossPct",
    durationMinutes: 118,
    expectedImpact: "Minor efficiency degradation, no customer impact expected",
    status: "acknowledged",
    asset: { kind: "feeder", id: "F-12" },
  },
  {
    id: "ALT-2050",
    severity: "critical",
    title: "Substation utilization critical — Uttara",
    metric: "utilizationPct",
    durationMinutes: 12,
    expectedImpact: "Elevated fault risk across 2 transformers",
    status: "active",
    asset: { kind: "substation", id: "SUB-UTTARA" },
  },
  {
    id: "ALT-2051",
    severity: "info",
    title: "Scheduled maintenance window — Banani",
    metric: "status",
    durationMinutes: 240,
    expectedImpact: "No impact, planned maintenance",
    status: "resolved",
    asset: { kind: "substation", id: "SUB-BANANI" },
  },
];
