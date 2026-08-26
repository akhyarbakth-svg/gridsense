"use client";

import { useCallback, useState } from "react";
import { AlertCard } from "../AlertCard";
import { Card, CardHeader } from "../Card";
import { Drawer, type DrawerTarget } from "../Drawer";
import { KPICard } from "../KPICard";
import type { Tone } from "../status";
import { alerts } from "@/data/alerts";
import { feedersForSubstation } from "@/data/feeders";
import type { Status, Substation } from "@/data/types";
import { formatElapsed, formatMVA, formatMW, formatPct } from "@/lib/format";
import { useLiveSubstationDetail } from "@/hooks/useLiveSubstationDetail";
import { FeedersTable } from "./FeedersTable";
import { SubstationHeader } from "./SubstationHeader";
import { SubstationLoadCard } from "./SubstationLoadCard";
import { SubstationMiniMap } from "./SubstationMiniMap";
import { TransformersTable } from "./TransformersTable";

// Figma: 114:314. A template parameterised by substation, not a Kafrul one-off —
// every section derives from the passed entity, so any substation in the mock
// data renders correctly.

const statusTone: Record<Status, Tone> = {
  normal: "success",
  warning: "warning",
  critical: "critical",
};

const statusLabel: Record<Status, string> = {
  normal: "Operational",
  warning: "Degraded",
  critical: "Critical",
};

export function SubstationDetailScreen({
  substation: base,
}: {
  substation: Substation;
}) {
  // Same shared-snapshot hook the Live Grid screen uses, so the KPI strip, the
  // transformer table and the trend card never disagree on a live field.
  const substation = useLiveSubstationDetail(base);

  const [target, setTarget] = useState<DrawerTarget | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const open = useCallback((next: DrawerTarget) => {
    setTarget(next);
    setDrawerOpen(true);
  }, []);
  const close = useCallback(() => setDrawerOpen(false), []);

  const feeders = feedersForSubstation(substation.id);
  const transformerIds = new Set(substation.transformers.map((t) => t.id));
  const feederIds = new Set(feeders.map((f) => f.id));

  // Alerts naming this substation, or any asset hanging off it.
  const relatedAlerts = alerts.filter((alert) => {
    if (alert.status === "resolved") return false;
    const { kind, id } = alert.asset;
    if (kind === "substation") return id === substation.id;
    if (kind === "transformer") return transformerIds.has(id);
    return feederIds.has(id);
  });

  const online = substation.transformers.filter(
    (t) => t.status === "normal"
  ).length;
  const flagged = substation.transformers.length - online;

  return (
    <>
      <SubstationHeader substation={substation} />

      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          <KPICard
            label="Status"
            value={statusLabel[substation.status]}
            status={
              relatedAlerts.length === 1
                ? "1 active alert"
                : `${relatedAlerts.length} active alerts`
            }
            statusTone={statusTone[substation.status]}
            pulse
            pulseStatus={substation.status}
            className="flex-1"
          />
          <KPICard
            label="Current Load"
            value={formatMW(substation.loadMW)}
            status="Live telemetry"
            pulse
            className="flex-1"
          />
          <KPICard
            label="Capacity"
            value={formatMVA(substation.capacityMVA)}
            status="Nameplate rating"
            className="flex-1"
          />
          <KPICard
            label="Utilization"
            value={formatPct(substation.utilizationPct)}
            status={
              substation.utilizationPct >= 90
                ? "Critical"
                : substation.utilizationPct >= 80
                  ? "Elevated"
                  : "Optimal"
            }
            statusTone={
              substation.utilizationPct >= 90
                ? "critical"
                : substation.utilizationPct >= 80
                  ? "warning"
                  : "success"
            }
            className="flex-1"
          />
          <KPICard
            label="Transformers"
            value={`${online}/${substation.transformers.length}`}
            status={flagged === 0 ? "All normal" : `${flagged} flagged`}
            statusTone={flagged === 0 ? "success" : "warning"}
            className="flex-1"
          />
        </div>

        <div className="flex gap-4">
          <SubstationMiniMap substation={substation} />
          <TransformersTable transformers={substation.transformers} />
          <SubstationLoadCard substation={substation} />
        </div>

        {relatedAlerts.length > 0 && (
          <Card padding="p-4">
            <CardHeader title="Active Triage Alerts" className="mb-4" />
            <div className="flex gap-4">
              {relatedAlerts.map((alert) => (
                <div key={alert.id} className="flex-1">
                  <AlertCard
                    severity={alert.severity}
                    title={alert.title}
                    context={`${alert.expectedImpact.split(",")[0]} · ${formatElapsed(alert.durationMinutes)}`}
                    onViewDetails={() => open(alert.asset)}
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        <FeedersTable feeders={feeders} />
      </div>

      <Drawer target={target} open={drawerOpen} onClose={close} />
    </>
  );
}
