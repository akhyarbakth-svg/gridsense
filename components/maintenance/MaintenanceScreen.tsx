"use client";

import { useMemo, useState } from "react";
import { Button } from "../Button";
import { KPICard } from "../KPICard";
import { PageHeader } from "../PageHeader";
import { workOrders as seedOrders } from "@/data/workOrders";
import type { WorkOrder } from "@/data/types";
import { CreateWorkOrderPanel } from "./CreateWorkOrderPanel";
import { WorkOrderTable } from "./WorkOrderTable";

// Figma: 137:351. The queue and the create panel share the in-memory work
// order list — submitting adds to it, per CLAUDE.md's no-persistence rule.

/** Anything due before this counts as overdue. Fixed, not `new Date()`, so
 *  server and client agree. */
const TODAY = "2026-08-26";

/** Next id continues the WO-#### sequence already in the data. */
function nextWorkOrderId(orders: WorkOrder[]): string {
  const highest = orders.reduce((max, order) => {
    const n = Number(order.id.replace(/\D/g, ""));
    return Number.isFinite(n) && n > max ? n : max;
  }, 0);
  return `WO-${highest + 1}`;
}

export function MaintenanceScreen({
  /** Asset Health links here as /maintenance?asset=TR-07. */
  presetAssetId,
}: {
  presetAssetId?: string;
}) {
  const [orders, setOrders] = useState<WorkOrder[]>(seedOrders);

  const teams = useMemo(
    () => [...new Set(seedOrders.map((order) => order.assignedTeam))].sort(),
    []
  );

  const open = orders.filter((o) => o.status !== "completed");
  const overdue = open.filter((o) => o.dueDate < TODAY);
  const completed = orders.filter((o) => o.status === "completed");
  const highPriority = open.filter(
    (o) => o.priority === "urgent" || o.priority === "high"
  );

  const completionRate =
    orders.length === 0 ? 0 : (completed.length / orders.length) * 100;

  const nextId = nextWorkOrderId(orders);

  return (
    <>
      <PageHeader
        title="Maintenance"
        breadcrumb={["Assets", "Maintenance"]}
        actions={
          <>
            <Button variant="secondary">Export Logs</Button>
            <Button
              variant="primary"
              href={`/maintenance?asset=${presetAssetId ?? ""}#create`}
            >
              + Create Work Order
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          <KPICard
            label="Open Work Orders"
            value={String(open.length)}
            status="Active ops"
            pulse
            pulseStatus="primary"
            className="flex-1"
          />
          <KPICard
            label="Overdue Breaches"
            value={String(overdue.length).padStart(2, "0")}
            status={overdue.length > 0 ? "Past due target" : "None overdue"}
            statusTone={overdue.length > 0 ? "critical" : "success"}
            pulse
            pulseStatus={overdue.length > 0 ? "critical" : "success"}
            className="flex-1"
          />
          <KPICard
            label="Completed"
            value={String(completed.length)}
            status={`${completionRate.toFixed(1)}% completion ratio`}
            className="flex-1"
          />
          <KPICard
            label="High Priority Queue"
            value={String(highPriority.length).padStart(2, "0")}
            status="Assigned & dispatched"
            statusTone={highPriority.length > 0 ? "warning" : "success"}
            className="flex-1"
          />
        </div>

        <div className="flex gap-4">
          <WorkOrderTable orders={orders} />
          <div id="create" className="scroll-mt-8">
            <CreateWorkOrderPanel
              // Remount when the incoming asset changes so the form reseeds.
              key={presetAssetId ?? "none"}
              teams={teams}
              nextId={nextId}
              presetAssetId={presetAssetId}
              onCreate={(order) => setOrders((current) => [order, ...current])}
            />
          </div>
        </div>
      </div>
    </>
  );
}
