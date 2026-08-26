import type { Outage } from "./types";

// Outage set for the Outage Management screen (Figma 133:360). Feeders match
// the real feeder ids so an incident always resolves to a feeder that exists.

export const outages: Outage[] = [
  {
    id: "OUT-5501",
    status: "active",
    feederId: "F-12",
    location: "Zone A · Mirpur Sector 6",
    startedAt: "2026-08-26T12:18:00Z",
    customersAffected: 1840,
    probableCause: "Transformer overheat fault",
    crew: "Emergency Response Team 4",
    estimatedRestoration: "2026-08-26T15:30:00Z",
    timeline: [
      { timestamp: "2026-08-26T12:18:00Z", event: "Fault detected", state: "done" },
      { timestamp: "2026-08-26T12:25:00Z", event: "Crew dispatched", state: "done" },
      { timestamp: "2026-08-26T12:44:00Z", event: "Location identified", state: "done" },
      { timestamp: "2026-08-26T13:10:00Z", event: "Repair work started", state: "current" },
      { timestamp: "2026-08-26T15:30:00Z", event: "Estimated restoration", state: "pending" },
    ],
  },
  {
    id: "OUT-5502",
    status: "active",
    feederId: "F-19",
    location: "Zone B · Uttara Sector 11",
    startedAt: "2026-08-26T11:02:00Z",
    customersAffected: 1215,
    probableCause: "Feeder conductor fault",
    crew: "Crew Bravo-1",
    estimatedRestoration: "2026-08-26T16:15:00Z",
    timeline: [
      { timestamp: "2026-08-26T11:02:00Z", event: "Fault detected", state: "done" },
      { timestamp: "2026-08-26T11:10:00Z", event: "Crew dispatched", state: "done" },
      { timestamp: "2026-08-26T12:05:00Z", event: "Location identified", state: "current" },
      { timestamp: "2026-08-26T13:30:00Z", event: "Repair work started", state: "pending" },
      { timestamp: "2026-08-26T16:15:00Z", event: "Estimated restoration", state: "pending" },
    ],
  },
  {
    id: "OUT-5503",
    status: "restoring",
    feederId: "F-14",
    location: "Zone C · Mohakhali Express",
    startedAt: "2026-08-26T09:40:00Z",
    customersAffected: 620,
    probableCause: "Insulator flashover",
    crew: "Crew Charlie-2",
    estimatedRestoration: "2026-08-26T14:00:00Z",
    timeline: [
      { timestamp: "2026-08-26T09:40:00Z", event: "Fault detected", state: "done" },
      { timestamp: "2026-08-26T09:52:00Z", event: "Crew dispatched", state: "done" },
      { timestamp: "2026-08-26T10:21:00Z", event: "Location identified", state: "done" },
      { timestamp: "2026-08-26T11:05:00Z", event: "Repair work started", state: "done" },
      { timestamp: "2026-08-26T14:00:00Z", event: "Estimated restoration", state: "current" },
    ],
  },
  {
    id: "OUT-5504",
    status: "resolved",
    feederId: "F-27",
    location: "Zone A · Banani Central",
    startedAt: "2026-08-26T06:12:00Z",
    customersAffected: 340,
    probableCause: "Scheduled maintenance overrun",
    crew: "Crew Delta-5",
    estimatedRestoration: "2026-08-26T08:45:00Z",
    timeline: [
      { timestamp: "2026-08-26T06:12:00Z", event: "Fault detected", state: "done" },
      { timestamp: "2026-08-26T06:20:00Z", event: "Crew dispatched", state: "done" },
      { timestamp: "2026-08-26T06:48:00Z", event: "Location identified", state: "done" },
      { timestamp: "2026-08-26T07:15:00Z", event: "Repair work started", state: "done" },
      { timestamp: "2026-08-26T08:45:00Z", event: "Supply restored", state: "done" },
    ],
  },
];

/**
 * Customers on the distribution network. Needed as the denominator for the
 * reliability indices; static.
 */
export const TOTAL_CUSTOMERS_SERVED = 128_000;

/**
 * SAIDI / SAIFI are YEAR-TO-DATE reliability indices covering every outage of
 * the year, not just the handful held here. They cannot be derived from this
 * set — computing them from four same-day incidents would report a fraction of
 * the true figure. Stored as static reliability metrics instead.
 *
 * If a full year of outages is ever mocked, replace these with:
 *   SAIFI = total customers interrupted / TOTAL_CUSTOMERS_SERVED
 *   SAIDI = total customer-interruption-hours / TOTAL_CUSTOMERS_SERVED
 */
export const reliabilityIndices = {
  saidiHoursYtd: 2.31,
  saifiEventsYtd: 1.14,
};

/** Outages still drawing crew attention. */
export function unresolvedOutages(): Outage[] {
  return outages.filter((outage) => outage.status !== "resolved");
}

/** Hours between fault and restoration (estimated while still open). */
export function restorationHours(outage: Outage): number {
  const start = new Date(outage.startedAt).getTime();
  const end = new Date(outage.estimatedRestoration).getTime();
  return (end - start) / 3_600_000;
}
