import { KPICard } from "../KPICard";
import type { OverviewKPIs } from "@/data/types";
import { formatClock, formatMW, formatPct } from "@/lib/format";

// Figma: 49:1750 — availability donut (208px) followed by four 216px stat cards.

export function KpiStrip({ kpis }: { kpis: OverviewKPIs }) {
  return (
    <div className="flex gap-4">
      <KPICard
        variant="donut"
        label="Grid Availability"
        percent={kpis.gridAvailabilityPct}
        value={formatPct(kpis.gridAvailabilityPct, 2)}
        caption={kpis.gridAvailabilityPct >= 99.9 ? "Within SLA" : "Below SLA"}
        captionTone={kpis.gridAvailabilityPct >= 99.9 ? "success" : "warning"}
        footer="Target 99.9% · rolling 30 d"
        className="w-52 shrink-0"
      />
      <KPICard
        label="Current Load"
        value={formatMW(kpis.currentLoadMW)}
        status={`Updated ${formatClock(kpis.lastUpdated)}`}
        pulse
        className="flex-1"
      />
      <KPICard
        label="Peak Demand"
        value={formatMW(kpis.peakDemandMW)}
        status="Today · 19:00"
        className="flex-1"
      />
      <KPICard
        label="System Loss"
        value={formatPct(kpis.systemLossPct)}
        status={kpis.systemLossPct > 3.5 ? "Above target" : "Within target"}
        statusTone={kpis.systemLossPct > 3.5 ? "warning" : "success"}
        className="flex-1"
      />
      <KPICard
        label="Active Outages"
        value={String(kpis.activeOutages)}
        status={`${kpis.criticalAlerts} critical alerts`}
        statusTone={kpis.activeOutages > 0 ? "critical" : "success"}
        className="flex-1"
      />
    </div>
  );
}
