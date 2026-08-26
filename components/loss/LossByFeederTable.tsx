import { Card, CardHeader, CardLink } from "../Card";
import { PulseMark } from "../PulseMark";
import { StatusPill } from "../StatusPill";
import { TableHeader, type TableHeaderColumn } from "../TableHeader";
import { TableRow } from "../TableRow";
import type { Tone } from "../status";
import { feeders, feederZone } from "@/data/feeders";
import { feederLossMWh } from "@/data/lossBreakdown";
import type { Status } from "@/data/types";
import { formatMWh, formatPct } from "@/lib/format";

// Figma: 136:496 — loss by feeder. Sorted worst-first: this is an
// investigative screen, so the feeders bleeding the most energy lead.
// Rows route to Feeder Details, which is the "click to investigate" workflow.

const NAME_WIDTH = 176;

const columns: TableHeaderColumn[] = [
  { key: "zone", label: "Zone", width: 160 },
  { key: "lossMWh", label: "Loss (MWh)", width: 150, align: "right" },
  { key: "lossPct", label: "Loss %", width: 150, align: "right" },
  { key: "status", label: "Status", width: 180 },
];

const statusTone: Record<Status, Tone> = {
  normal: "success",
  warning: "warning",
  critical: "critical",
};

const statusLabel: Record<Status, string> = {
  normal: "Normal",
  warning: "Warning",
  critical: "Critical",
};

function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 text-slate"
      aria-hidden
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function LossByFeederTable() {
  // Worst-first — highest loss percentage leads.
  const ranked = [...feeders].sort((a, b) => b.lossPct - a.lossPct);

  return (
    <Card padding="p-0" className="overflow-hidden">
      <CardHeader
        title="Loss by feeder"
        action={<CardLink>{`All ${feeders.length} feeders ›`}</CardLink>}
        className="p-5"
      />
      <TableHeader
        nameLabel="Feeder ID"
        columns={columns}
        trailingLabel="Action"
        nameWidth={NAME_WIDTH}
      />
      {ranked.map((feeder) => {
        const flagged = feeder.status === "normal" ? undefined : feeder.status;
        const tint =
          feeder.status === "critical"
            ? "text-critical"
            : feeder.status === "warning"
              ? "text-warning"
              : "";

        return (
          <TableRow
            key={feeder.id}
            name={feeder.name}
            nameWidth={NAME_WIDTH}
            emphasis={flagged}
            columns={[
              { key: "zone", value: feederZone(feeder), width: 160, muted: true },
              {
                key: "lossMWh",
                value: formatMWh(feederLossMWh(feeder.lossPct, feeder.loadPct)),
                width: 150,
                align: "right",
                mono: true,
              },
              {
                key: "lossPct",
                value: (
                  <span className={tint}>{formatPct(feeder.lossPct)}</span>
                ),
                width: 150,
                align: "right",
                mono: true,
              },
              {
                key: "status",
                value: (
                  <StatusPill
                    label={statusLabel[feeder.status]}
                    tone={statusTone[feeder.status]}
                    icon={<PulseMark status={feeder.status} size={12} />}
                  />
                ),
                width: 180,
              },
            ]}
            chart={<Chevron />}
            href={`/feeders/${feeder.id}`}
          />
        );
      })}
    </Card>
  );
}
