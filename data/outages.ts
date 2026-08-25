import type { Outage } from "./types";

export const outages: Outage[] = [
  {
    id: "OUT-5501",
    feederId: "F-12",
    location: "Mirpur Sector 6",
    startedAt: "2026-08-26T02:14:00Z",
    customersAffected: 4200,
    probableCause: "Transformer overload trip",
    crew: "Crew Alpha-3",
    estimatedRestoration: "2026-08-26T06:30:00Z",
    timeline: [
      { timestamp: "2026-08-26T02:14:00Z", event: "Outage detected" },
      { timestamp: "2026-08-26T02:20:00Z", event: "Crew dispatched" },
      { timestamp: "2026-08-26T03:05:00Z", event: "Crew on site, diagnostics started" },
    ],
  },
  {
    id: "OUT-5502",
    feederId: "F-19",
    location: "Uttara Sector 11",
    startedAt: "2026-08-26T01:02:00Z",
    customersAffected: 1850,
    probableCause: "Feeder fault",
    crew: "Crew Bravo-1",
    estimatedRestoration: "2026-08-26T04:15:00Z",
    timeline: [
      { timestamp: "2026-08-26T01:02:00Z", event: "Outage detected" },
      { timestamp: "2026-08-26T01:10:00Z", event: "Crew dispatched" },
    ],
  },
];
