import { Card } from "../Card";
import type { OverviewKPIs } from "@/data/types";
import { formatMW, formatPct } from "@/lib/format";

// Figma: 49:1901 — Generation → Grid load → Consumers, with a transmission
// loss footer. Every figure derives from the Overview KPIs so the three blocks
// stay consistent with the KPI strip above.

function Block({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 rounded-sm bg-surface-sunken p-3">
      <span className="text-[11px] font-medium uppercase tracking-[0.66px] text-slate">
        {label}
      </span>
      <span
        className={`text-[16px] font-semibold ${highlight ? "text-primary" : "text-ink"}`}
      >
        {value}
      </span>
    </div>
  );
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 16 12"
      fill="none"
      stroke="var(--color-slate)"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-4 shrink-0"
      aria-hidden
    >
      <path d="M5 2l5 4-5 4" />
    </svg>
  );
}

export function PowerFlowCard({ kpis }: { kpis: OverviewKPIs }) {
  const lossFactor = kpis.systemLossPct / 100;
  const consumersMW = kpis.currentLoadMW * (1 - lossFactor);
  const generationMW = kpis.currentLoadMW * (1 + lossFactor);
  const lossMW = kpis.currentLoadMW - consumersMW;

  return (
    <Card className="flex flex-1 flex-col gap-5">
      <h2 className="text-[16px] font-semibold text-ink">Power flow topology</h2>
      <div className="flex items-center gap-3">
        <Block label="Generation" value={formatMW(generationMW)} />
        <Chevron />
        <Block label="Grid Load" value={formatMW(kpis.currentLoadMW)} highlight />
        <Chevron />
        <Block label="Consumers" value={formatMW(consumersMW)} />
      </div>
      <p className="text-[14px] text-slate">
        Transmission loss {formatPct(kpis.systemLossPct)} · {formatMW(lossMW)}
      </p>
    </Card>
  );
}
