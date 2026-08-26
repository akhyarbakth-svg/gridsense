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

  /**
   * SCHEMA ADDITIONS for the Asset Health screen (Figma 134:606). The AI risk
   * block is simulated, not real inference — these are stored mock values,
   * consistent with the rest of the app's simulated-live approach.
   */
  riskPct: number;
  riskWindowDays: number;
  riskFactors: string[];
  recommendedAction: string;

  /**
   * SCHEMA ADDITION: past faults for the Fault History panel (Figma 134:659).
   * Maintenance history comes from Work Orders; faults have no other source.
   */
  faultHistory: AssetEvent[];
}

/** A dated event against an asset — a fault, a test, a service visit. */
export interface AssetEvent {
  date: string;
  event: string;
  outcome: Status;
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

/** Restoration progress states (Figma 133:598): done, in flight, not yet reached. */
export type TimelineState = "done" | "current" | "pending";

export interface OutageTimelineEntry {
  timestamp: string;
  event: string;
  /**
   * SCHEMA ADDITION: the restoration timeline renders completed, active and
   * pending steps differently. Stored rather than inferred from the clock so
   * the server and client always render the same thing.
   */
  state: TimelineState;
}

/**
 * SCHEMA ADDITION: Outage had no status field, but the map legend and incident
 * panel both key off one (Figma 133:545).
 */
export type OutageStatus = "active" | "restoring" | "resolved";

export interface Outage {
  id: string;
  status: OutageStatus;
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
