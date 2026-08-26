"use client";

import { Card, CardHeader } from "../Card";
import { StatusPill } from "../StatusPill";
import { TableHeader, type TableHeaderColumn } from "../TableHeader";
import { TableRow } from "../TableRow";
import type { Tone } from "../status";
import type { Status, Transformer } from "@/data/types";
import { formatPct, formatTempC } from "@/lib/format";

// Figma: 114:491 — transformer asset details. Flagged rows get the tinted bed
// and coloured values from the frame. Rows route to Asset Health.

const NAME_WIDTH = 96;

const columns: TableHeaderColumn[] = [
  { key: "load", label: "Load %", width: 70, align: "right" },
  { key: "temp", label: "Temp", width: 80, align: "right" },
  { key: "health", label: "Health", width: 70, align: "right" },
  { key: "status", label: "Status", width: 100 },
  { key: "maint", label: "Last Maint." },
];

const statusTone: Record<Status, Tone> = {
  normal: "success",
  warning: "warning",
  critical: "critical",
};

const statusLabel: Record<Status, string> = {
  normal: "Online",
  warning: "Warning",
  critical: "Critical",
};

/** Flagged rows colour their numeric values, matching the frame. */
const valueTone: Record<Status, string> = {
  normal: "",
  warning: "text-warning",
  critical: "text-critical",
};

export function TransformersTable({
  transformers,
}: {
  transformers: Transformer[];
}) {
  return (
    <Card padding="p-0" className="flex flex-1 flex-col overflow-hidden">
      <CardHeader
        title="Transformer Asset Details"
        action={
          <span className="text-[14px] text-slate">
            {transformers.length} Total Transformers
          </span>
        }
        className="p-5"
      />
      <TableHeader
        nameLabel="Asset ID"
        columns={columns}
        nameWidth={NAME_WIDTH}
      />
      {transformers.map((transformer) => {
        const flagged =
          transformer.status === "normal" ? undefined : transformer.status;
        const tint = valueTone[transformer.status];

        return (
          <TableRow
            key={transformer.id}
            name={transformer.id}
            nameWidth={NAME_WIDTH}
            emphasis={flagged}
            columns={[
              {
                key: "load",
                value: (
                  <span className={tint}>
                    {formatPct(transformer.loadPct, 0)}
                  </span>
                ),
                width: 70,
                align: "right",
                mono: true,
              },
              {
                key: "temp",
                value: (
                  <span className={tint}>
                    {formatTempC(transformer.temperatureC)}
                  </span>
                ),
                width: 80,
                align: "right",
                mono: true,
              },
              {
                key: "health",
                value: (
                  <span className={tint}>{transformer.healthScore}</span>
                ),
                width: 70,
                align: "right",
                mono: true,
              },
              {
                key: "status",
                value: (
                  <StatusPill
                    label={statusLabel[transformer.status]}
                    tone={statusTone[transformer.status]}
                  />
                ),
                width: 100,
              },
              {
                key: "maint",
                value: (
                  <span className={tint || "text-slate"}>
                    {transformer.lastMaintenance}
                  </span>
                ),
              },
            ]}
            href={`/assets/${transformer.id}`}
          />
        );
      })}
    </Card>
  );
}
