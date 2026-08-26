"use client";

import { useMemo, useState } from "react";
import { KPICard } from "../KPICard";
import { PageHeader } from "../PageHeader";
import { demandCurve } from "@/data/demandCurve";
import { feeders } from "@/data/feeders";
import { substations } from "@/data/substations";
import { zones } from "@/data/zones";
import { formatMW, formatPct } from "@/lib/format";
import { DemandBreakdown } from "./DemandBreakdown";
import { DemandCurveChart } from "./DemandCurveChart";
import { FilterBar, type FilterState, type Option } from "./FilterBar";
import { ForecastComparison } from "./ForecastComparison";

// Figma: 135:351. Filters cascade — narrowing the zone narrows the substation
// list, and so on — and scale the demand curve to the selected scope.

const ALL: Option = { value: "all", label: "All" };

const totalFeederLoad = feeders.reduce((sum, f) => sum + f.loadPct, 0);

export function EnergyAnalyticsScreen() {
  const [filters, setFilters] = useState<FilterState>({
    zoneId: "all",
    substationId: "all",
    feederId: "all",
    timeframe: "today",
  });

  const zoneOptions: Option[] = [
    ALL,
    ...zones.map((zone) => ({ value: zone.id, label: zone.name })),
  ];

  const scopedSubstations =
    filters.zoneId === "all"
      ? substations
      : substations.filter((substation) =>
          zones
            .find((zone) => zone.id === filters.zoneId)
            ?.substationIds.includes(substation.id)
        );

  const substationOptions: Option[] = [
    ALL,
    ...scopedSubstations.map((s) => ({ value: s.id, label: s.name })),
  ];

  const scopedFeeders = feeders.filter((feeder) => {
    if (filters.substationId !== "all")
      return feeder.substationId === filters.substationId;
    return scopedSubstations.some((s) => s.id === feeder.substationId);
  });

  const feederOptions: Option[] = [
    ALL,
    ...scopedFeeders.map((f) => ({ value: f.id, label: f.name })),
  ];

  // How much of total system demand the current selection represents.
  const scale = useMemo(() => {
    if (filters.feederId !== "all") {
      const feeder = feeders.find((f) => f.id === filters.feederId);
      return feeder ? feeder.loadPct / totalFeederLoad : 1;
    }
    const share = scopedFeeders.reduce((sum, f) => sum + f.loadPct, 0);
    return share === 0 ? 1 : share / totalFeederLoad;
  }, [filters.feederId, scopedFeeders]);

  const curve = useMemo(
    () => demandCurve(filters.timeframe, scale),
    [filters.timeframe, scale]
  );

  const peakLabel =
    filters.timeframe === "today"
      ? `Expected peak at ${curve.expectedPeakHour}`
      : `Expected peak on day ${curve.expectedPeakHour.replace("D", "")}`;

  return (
    <>
      <PageHeader
        title="Energy Analytics"
        breadcrumb={["Analyze", "Energy Analytics"]}
      />

      <div className="flex flex-col gap-6">
        <FilterBar
          value={filters}
          zones={zoneOptions}
          substations={substationOptions}
          feeders={feederOptions}
          onChange={setFilters}
        />

        <DemandCurveChart
          curve={curve}
          timeframe={filters.timeframe}
          onTimeframeChange={(timeframe) =>
            setFilters((current) => ({ ...current, timeframe }))
          }
        />

        <div className="flex gap-4">
          <ForecastComparison curve={curve} />

          <div className="flex w-85 shrink-0 flex-col gap-4">
            <KPICard
              label="Forecast Confidence"
              value={formatPct(curve.forecastConfidencePct)}
              status={
                curve.forecastConfidencePct >= 95
                  ? "Tight deviation profile"
                  : "Optimal deviation profile"
              }
              pulse
              pulseStatus="primary"
            />
            <KPICard
              label="Expected Peak Load"
              value={formatMW(curve.expectedPeakMW)}
              status={peakLabel}
              statusTone="warning"
              pulse
              pulseStatus="warning"
            />
          </div>
        </div>

        <DemandBreakdown />
      </div>
    </>
  );
}
