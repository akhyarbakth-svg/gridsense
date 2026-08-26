"use client";

import { useState } from "react";
import { AlertCard } from "../AlertCard";
import { Button } from "../Button";
import { CardHeader } from "../Card";
import { KPICard } from "../KPICard";
import { PageHeader } from "../PageHeader";
import {
  outages,
  reliabilityIndices,
  restorationHours,
  unresolvedOutages,
} from "@/data/outages";
import { formatDuration } from "@/lib/format";
import { IncidentPanel } from "./IncidentPanel";
import { OutageMap } from "./OutageMap";

// Figma: 133:360. Selecting an outage — from a map marker or the queue —
// drives the inline incident panel below the map.

const unresolved = unresolvedOutages();
const activeCount = outages.filter((o) => o.status === "active").length;
const customersAffected = unresolved.reduce(
  (sum, outage) => sum + outage.customersAffected,
  0
);
const avgRestorationHours =
  outages.reduce((sum, outage) => sum + restorationHours(outage), 0) /
  outages.length;

const severity = { active: "critical", restoring: "warning", resolved: "info" } as const;

export function OutageManagementScreen() {
  const [selectedId, setSelectedId] = useState<string>(outages[0].id);
  const selected = outages.find((o) => o.id === selectedId) ?? outages[0];

  return (
    <>
      <PageHeader
        title="Outage Management"
        breadcrumb={["Monitor", "Outage Management"]}
        actions={
          <>
            <Button variant="secondary">Export log</Button>
            <Button variant="primary">Dispatch crew</Button>
          </>
        }
      />

      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          <KPICard
            label="Active Outages"
            value={`${unresolved.length} Zones`}
            status={`${activeCount} critical unresolved`}
            statusTone={activeCount > 0 ? "critical" : "success"}
            pulse
            pulseStatus={activeCount > 0 ? "critical" : "success"}
            className="flex-1"
          />
          <KPICard
            label="Customers Affected"
            value={customersAffected.toLocaleString("en-US")}
            status="Across unresolved incidents"
            statusTone="warning"
            className="flex-1"
          />
          <KPICard
            label="Avg Restoration Time"
            value={`${avgRestorationHours.toFixed(1)} Hours`}
            status="Fault to supply restored"
            statusTone="success"
            className="flex-1"
          />
          <KPICard
            label="SAIDI (YTD)"
            value={`${reliabilityIndices.saidiHoursYtd.toFixed(2)} Hours`}
            status="Within yearly SLA"
            className="flex-1"
          />
          <KPICard
            label="SAIFI (YTD)"
            value={`${reliabilityIndices.saifiEventsYtd.toFixed(2)} Events`}
            status="Optimal grid health"
            className="flex-1"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <OutageMap selectedId={selectedId} onSelect={setSelectedId} />
            <IncidentPanel outage={selected} />
          </div>

          <div className="flex w-105 shrink-0 flex-col gap-3">
            <CardHeader
              title="Active outage queue"
              action={
                <span className="text-[14px] text-slate">
                  {outages.length} total
                </span>
              }
            />
            <div className="flex flex-col gap-2">
              {outages.map((outage) => {
                const minutes =
                  (Date.parse(outage.estimatedRestoration) -
                    Date.parse(outage.startedAt)) /
                  60000;
                return (
                  <AlertCard
                    key={outage.id}
                    severity={severity[outage.status]}
                    title={`${outage.id} · ${outage.location}`}
                    context={`${outage.customersAffected.toLocaleString("en-US")} customers · ${formatDuration(minutes)} restoration window`}
                    onViewDetails={() => setSelectedId(outage.id)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
