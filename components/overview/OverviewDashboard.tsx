"use client";

import { useCallback, useState } from "react";
import { Button } from "../Button";
import { Drawer, type DrawerTarget } from "../Drawer";
import { PageHeader } from "../PageHeader";
import { useLiveOverviewKPIs } from "@/hooks/useLiveOverviewKPIs";
import { AlertsPanel } from "./AlertsPanel";
import { FeederTable } from "./FeederTable";
import { KpiStrip } from "./KpiStrip";
import { LoadTrendCard } from "./LoadTrendCard";
import { NetworkMap } from "./NetworkMap";
import { PowerFlowCard } from "./PowerFlowCard";

// Figma: 49:1711. Owns the contextual drawer state for the whole screen —
// map markers, feeder rows and alert cards all open the same drawer.

export function OverviewDashboard() {
  // `target` is kept after closing so the drawer slides out with its content
  // intact and swaps in place (never remounts) when a new entity is picked.
  const [target, setTarget] = useState<DrawerTarget | null>(null);
  const [open, setOpen] = useState(false);

  const select = useCallback((next: DrawerTarget) => {
    setTarget(next);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const kpis = useLiveOverviewKPIs();

  return (
    <>
      <PageHeader
        title="Overview"
        breadcrumb={["Monitor", "Overview"]}
        actions={
          <>
            <Button variant="secondary">Export</Button>
            <Button variant="primary">Run diagnostic</Button>
          </>
        }
      />

      <div className="flex flex-col gap-6">
        <KpiStrip kpis={kpis} />

        <div className="flex gap-4">
          <NetworkMap onSelect={select} />
          <AlertsPanel onSelect={select} />
        </div>

        <FeederTable onSelect={select} />

        <div className="flex gap-4">
          <LoadTrendCard kpis={kpis} />
          <PowerFlowCard kpis={kpis} />
        </div>
      </div>

      <Drawer target={target} open={open} onClose={close} />
    </>
  );
}
