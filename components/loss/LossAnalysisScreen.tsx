import { Button } from "../Button";
import { KPICard } from "../KPICard";
import { PageHeader } from "../PageHeader";
import { lossBreakdown, weightedLossPct } from "@/data/lossBreakdown";
import { formatMWh, formatPct } from "@/lib/format";
import { LossByFeederTable } from "./LossByFeederTable";
import { LossFunnel } from "./LossFunnel";

// Figma: 136:356. Every percentage on this screen is derived from the MWh
// figures in data/lossBreakdown, which are in turn weighted from the feeder
// table below — so the hero, the funnel and the table cannot disagree.

/** Regulatory loss target the hero card is measured against. */
const LOSS_TARGET_PCT = 6;

export function LossAnalysisScreen() {
  const {
    totalInputMWh,
    transmissionLossMWh,
    distributionLossMWh,
  } = lossBreakdown;

  const transmissionPct = (transmissionLossMWh / totalInputMWh) * 100;
  const distributionPct = (distributionLossMWh / totalInputMWh) * 100;
  const overTarget = weightedLossPct - LOSS_TARGET_PCT;

  return (
    <>
      <PageHeader
        title="Loss Analysis"
        breadcrumb={["Analyze", "Loss Analysis"]}
        actions={
          <>
            <Button variant="secondary">Export PDF</Button>
            <Button variant="primary">Run optimization</Button>
          </>
        }
      />

      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          <KPICard
            variant="donut"
            label="Total Energy Loss"
            percent={weightedLossPct}
            value={formatPct(weightedLossPct)}
            caption={
              overTarget > 0
                ? `Target exceedance (+${formatPct(overTarget)})`
                : `Within target (${formatPct(overTarget)})`
            }
            captionTone={overTarget > 0 ? "critical" : "success"}
            ringTone={overTarget > 0 ? "critical" : "success"}
            footer={`Total Input: ${formatMWh(totalInputMWh)} · rolling 24 h`}
            className="flex-1"
          />

          <KPICard
            label="Transmission Loss"
            value={formatMWh(transmissionLossMWh)}
            chart={
              <p className="text-[16px] font-semibold text-slate">
                {formatPct(transmissionPct)} of total input
              </p>
            }
            status="−0.4% from baseline"
            statusTone="success"
            pulse
            pulseStatus="success"
            className="flex-1"
          />

          <KPICard
            label="Distribution Loss"
            value={formatMWh(distributionLossMWh)}
            chart={
              <p className="text-[16px] font-semibold text-slate">
                {formatPct(distributionPct)} of total input
              </p>
            }
            status="+1.2% high load demand"
            statusTone="critical"
            pulse
            pulseStatus="critical"
            className="flex-1"
          />
        </div>

        <LossFunnel />
        <LossByFeederTable />
      </div>
    </>
  );
}
