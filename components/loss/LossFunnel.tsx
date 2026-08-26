import { Card, CardHeader } from "../Card";
import { lossBreakdown } from "@/data/lossBreakdown";
import { formatMWh, formatPct } from "@/lib/format";

// Figma: 136:466 — staged energy funnel. Three nodes with the loss between
// each pair called out on the connecting arrow.

function Stage({
  label,
  value,
  caption,
  captionTone = "text-success",
  valueTone = "text-ink",
}: {
  label: string;
  value: string;
  caption: string;
  captionTone?: string;
  valueTone?: string;
}) {
  return (
    <div className="flex w-45 shrink-0 flex-col items-center gap-1.5 rounded-sm border border-hairline bg-surface-sunken p-4">
      <span className="text-[11px] font-medium uppercase tracking-[0.66px] text-slate">
        {label}
      </span>
      <span className={`text-[22px] font-semibold ${valueTone}`}>{value}</span>
      <span className={`text-[14px] ${captionTone}`}>{caption}</span>
    </div>
  );
}

function LossArrow({ lossMWh, label }: { lossMWh: number; label: string }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-1">
      <span className="font-mono text-[14px] text-critical">
        −{formatMWh(lossMWh)}
      </span>
      <span className="text-[14px] text-critical">{label}</span>
      <svg
        viewBox="0 0 44 8"
        fill="none"
        className="h-2 w-11 text-slate"
        aria-hidden
      >
        <path
          d="M0 4h32M36 1l4 3-4 3"
          stroke="currentColor"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function LossFunnel() {
  const {
    totalInputMWh,
    transmissionLossMWh,
    distributionLossMWh,
    deliveredMWh,
  } = lossBreakdown;

  const substationStepMWh = totalInputMWh - transmissionLossMWh;
  const cumulativeLossMWh = transmissionLossMWh + distributionLossMWh;
  const cumulativeLossPct = (cumulativeLossMWh / totalInputMWh) * 100;
  const efficiencyPct = 100 - cumulativeLossPct;

  return (
    <Card className="flex flex-col gap-5">
      <CardHeader
        title="System loss funnel topology"
        action={
          <span className="text-[14px] text-slate">
            Total Generation Grid Input: {formatMWh(totalInputMWh)}
          </span>
        }
      />

      <div className="flex items-center justify-center gap-3 py-4">
        <Stage
          label="Total Input"
          value={formatMWh(totalInputMWh)}
          caption="Source Node"
        />
        <LossArrow lossMWh={transmissionLossMWh} label="Transmission loss" />
        <Stage
          label="Substation Step"
          value={formatMWh(substationStepMWh)}
          valueTone="text-primary"
          caption="Primary HV Bus"
          captionTone="text-slate"
        />
        <LossArrow lossMWh={distributionLossMWh} label="Distribution loss" />
        <Stage
          label="Delivered"
          value={formatMWh(deliveredMWh)}
          caption="Active consumers"
        />
      </div>

      <p className="text-[14px] text-slate">
        Overall Grid Efficiency: {formatPct(efficiencyPct)} · Cumulative System
        Loss: {formatMWh(cumulativeLossMWh)} ({formatPct(cumulativeLossPct)})
      </p>
    </Card>
  );
}
