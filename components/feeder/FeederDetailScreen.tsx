"use client";

import { useCallback, useState } from "react";
import { AlertCard } from "../AlertCard";
import { Drawer, type DrawerTarget } from "../Drawer";
import { KPICard } from "../KPICard";
import type { Tone } from "../status";
import { alerts } from "@/data/alerts";
import { assetsForFeeder, feederLoadMW } from "@/data/feeders";
import { outages } from "@/data/outages";
import { substations } from "@/data/substations";
import { substationTelemetry } from "@/data/telemetry";
import type { Feeder } from "@/data/types";
import { formatElapsed, formatMW, formatPct } from "@/lib/format";
import { ConnectedAssets } from "./ConnectedAssets";
import { FeederHeader } from "./FeederHeader";
import { FeederPathSchematic } from "./FeederPathSchematic";
import { LoadLossChart } from "./LoadLossChart";

// Figma: 132:270. Parameterised by feeder, matching the Substation Details
// approach — every section derives from the resolved entity.

function loadBand(pct: number): { label: string; tone: Tone } {
  if (pct >= 90) return { label: "Overloaded", tone: "critical" };
  if (pct >= 75) return { label: "Peak Approach", tone: "warning" };
  return { label: "Normal Range", tone: "success" };
}

function lossBand(pct: number): { label: string; tone: Tone } {
  if (pct >= 5) return { label: "Above threshold", tone: "critical" };
  if (pct >= 3) return { label: "Elevated", tone: "warning" };
  return { label: "Within target", tone: "success" };
}

export function FeederDetailScreen({ feeder }: { feeder: Feeder }) {
  const [target, setTarget] = useState<DrawerTarget | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const open = useCallback((next: DrawerTarget) => {
    setTarget(next);
    setDrawerOpen(true);
  }, []);
  const close = useCallback(() => setDrawerOpen(false), []);

  const origin = substations.find((s) => s.id === feeder.substationId);
  const assets = assetsForFeeder(feeder.id);
  const flagged = assets.filter((a) => a.status !== "normal").length;

  // Power factor and frequency come from the origin substation's readings —
  // the same static set the Live Grid telemetry strip uses.
  const readings = origin ? substationTelemetry[origin.id] : undefined;

  const load = loadBand(feeder.loadPct);
  const loss = lossBand(feeder.lossPct);

  const feederAlerts = alerts.filter(
    (alert) =>
      alert.status !== "resolved" &&
      alert.asset.kind === "feeder" &&
      alert.asset.id === feeder.id
  );
  const feederOutages = outages.filter((outage) => outage.feederId === feeder.id);
  const hasEvents = feederAlerts.length + feederOutages.length > 0;

  return (
    <>
      <FeederHeader feeder={feeder} origin={origin} />

      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          <KPICard
            label="Current Load"
            value={formatMW(feederLoadMW(feeder))}
            status={load.label}
            statusTone={load.tone}
            pulse
            pulseStatus={feeder.status}
            className="flex-1"
          />
          <KPICard
            label="Loss Percentage"
            value={formatPct(feeder.lossPct)}
            status={loss.label}
            statusTone={loss.tone}
            className="flex-1"
          />
          <KPICard
            label="Capacity Utilization"
            value={formatPct(feeder.loadPct, 0)}
            status={load.label}
            statusTone={load.tone}
            className="flex-1"
          />
          <KPICard
            label="Connected Transformers"
            value={`${assets.length} Units`}
            status={flagged === 0 ? "All nominal" : `${flagged} warning state`}
            statusTone={flagged === 0 ? "success" : "warning"}
            className="flex-1"
          />
          <KPICard
            label="Power Factor"
            value={readings ? readings.powerFactor.toFixed(2) : "—"}
            status={
              readings && readings.powerFactor >= 0.95 ? "Optimal" : "Correctable"
            }
            statusTone={
              readings && readings.powerFactor >= 0.95 ? "success" : "warning"
            }
            className="flex-1"
          />
          <KPICard
            label="Grid Frequency"
            value={readings ? `${readings.frequencyHz.toFixed(2)} Hz` : "—"}
            status="Stable"
            statusTone="success"
            className="flex-1"
          />
        </div>

        <div className="flex gap-4">
          <FeederPathSchematic origin={origin} assets={assets} />
          <LoadLossChart feeder={feeder} />
          <ConnectedAssets assets={assets} />
        </div>

        {hasEvents && (
          <section className="flex flex-col gap-4">
            <h2 className="text-[22px] font-semibold text-ink">
              Recent Events &amp; Anomalies
            </h2>
            <div className="flex gap-4">
              {feederAlerts.map((alert) => (
                <div key={alert.id} className="w-86">
                  <AlertCard
                    severity={alert.severity}
                    title={alert.title}
                    context={`${alert.expectedImpact.split(",")[0]} · ${formatElapsed(alert.durationMinutes)}`}
                    onViewDetails={() => open(alert.asset)}
                  />
                </div>
              ))}
              {feederOutages.map((outage) => (
                <div key={outage.id} className="w-86">
                  <AlertCard
                    severity="critical"
                    title={`Outage ${outage.id} — ${outage.location}`}
                    context={`${outage.customersAffected.toLocaleString("en-US")} customers · ${outage.probableCause}`}
                    onViewDetails={() =>
                      open({ kind: "feeder", id: outage.feederId })
                    }
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <Drawer target={target} open={drawerOpen} onClose={close} />
    </>
  );
}
