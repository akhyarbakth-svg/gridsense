export type Status = "normal" | "warning" | "critical";

export interface OverviewKPIs {
  currentLoadMW: number;
  peakDemandMW: number;
  gridAvailabilityPct: number;
  activeOutages: number;
  systemLossPct: number;
  criticalAlerts: number;
  lastUpdated: string;
}

export interface Transformer {
  id: string;
  substationId: string;
  loadPct: number;
  temperatureC: number;
  status: Status;
  healthScore: number;
  ageYears: number;
  operatingHours: number;
  /**
   * SCHEMA ADDITION: the Substation Details table (Figma 114:495) has a
   * "Last Maint." column with no field behind it in the CLAUDE.md entity list.
   * ISO date.
   */
  lastMaintenance: string;
}

export interface Substation {
  id: string;
  name: string;
  status: Status;
  loadMW: number;
  capacityMVA: number;
  utilizationPct: number;
  transformers: Transformer[];
}

export interface Feeder {
  id: string;
  /**
   * SCHEMA ADDITION: feeders had no link to their substation, so the
   * "Connected Output Feeders" table (Figma 114:602) could not be filtered.
   */
  substationId: string;
  name: string;
  loadPct: number;
  lossPct: number;
  status: Status;
}

export type AlertSeverity = "critical" | "warning" | "info";
export type AlertStatus = "active" | "acknowledged" | "resolved";

/** Points at the asset an interaction should reveal — drives the contextual drawer. */
export type AssetRef =
  | { kind: "substation"; id: string }
  | { kind: "feeder"; id: string }
  | { kind: "transformer"; id: string };

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  metric: string;
  durationMinutes: number;
  expectedImpact: string;
  status: AlertStatus;
  /** The affected asset. Alert cards open the drawer on this, per the drawer pattern. */
  asset: AssetRef;
}

export interface OutageTimelineEntry {
  timestamp: string;
  event: string;
}

export interface Outage {
  id: string;
  feederId: string;
  location: string;
  startedAt: string;
  customersAffected: number;
  probableCause: string;
  crew: string;
  estimatedRestoration: string;
  timeline: OutageTimelineEntry[];
}

export type WorkOrderPriority = "low" | "medium" | "high" | "urgent";
export type WorkOrderStatus = "open" | "in_progress" | "completed";

export interface WorkOrder {
  id: string;
  assetId: string;
  issue: string;
  priority: WorkOrderPriority;
  assignedTeam: string;
  dueDate: string;
  description: string;
  status: WorkOrderStatus;
}
