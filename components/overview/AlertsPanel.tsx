"use client";

import { AlertCard } from "../AlertCard";
import { CardHeader, CardLink } from "../Card";
import type { DrawerTarget } from "../Drawer";
import { alerts } from "@/data/alerts";
import { formatElapsed } from "@/lib/format";

// Figma: 49:1819 — 420px panel beside the map. Per the drawer pattern in
// CLAUDE.md, alert cards open the same contextual drawer on the affected
// asset rather than routing into a separate incident flow.

const visibleAlerts = alerts.filter((a) => a.status !== "resolved").slice(0, 3);

export function AlertsPanel({
  onSelect,
}: {
  onSelect: (target: DrawerTarget) => void;
}) {
  return (
    <div className="flex w-105 shrink-0 flex-col gap-3">
      <CardHeader title="Live alerts" action={<CardLink>View all</CardLink>} />
      <div className="flex flex-col gap-2">
        {visibleAlerts.map((alert) => (
          <AlertCard
            key={alert.id}
            severity={alert.severity}
            title={alert.title}
            context={`${alert.expectedImpact.split(",")[0]} · ${formatElapsed(alert.durationMinutes)}`}
            onViewDetails={() => onSelect(alert.asset)}
            className="transition-transform duration-200 ease-out hover:-translate-y-0.5"
          />
        ))}
      </div>
    </div>
  );
}
