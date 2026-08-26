"use client";

import { Card, CardHeader } from "../Card";
import { StatusPill } from "../StatusPill";
import { TableHeader, type TableHeaderColumn } from "../TableHeader";
import { TableRow } from "../TableRow";
import type { Tone } from "../status";
import { feederLoadMW } from "@/data/feeders";
import type { Feeder, Status } from "@/data/types";
import { formatMW, formatPct } from "@/lib/format";

// Figma: 114:602 — connected output feeders for this substation.

const NAME_WIDTH = 220;

const columns: TableHeaderColumn[] = [
  { key: "load", label: "Load (MW)", width: 150, align: "right" },
  { key: "loss", label: "Loss %", width: 150, align: "right" },
  { key: "status", label: "Status" },
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

const valueTone: Record<Status, string> = {
  normal: "",
  warning: "text-warning",
  critical: "text-critical",
};

export function FeedersTable({ feeders }: { feeders: Feeder[] }) {
  return (
    <Card padding="p-0" className="overflow-hidden">
      <CardHeader
        title="Connected Output Feeders"
        action={
          <span className="text-[14px] text-slate">
            {feeders.length} Active Line Feeders
          </span>
        }
        className="p-5"
      />
      <TableHeader
        nameLabel="Feeder ID"
        columns={columns}
        nameWidth={NAME_WIDTH}
      />
      {feeders.length === 0 ? (
        <p className="px-5 py-6 text-[14px] text-slate">
          No feeders are connected to this substation.
        </p>
      ) : (
        feeders.map((feeder) => {
          const flagged = feeder.status === "normal" ? undefined : feeder.status;
          const tint = valueTone[feeder.status];

          return (
            <TableRow
              key={feeder.id}
              name={feeder.name}
              nameWidth={NAME_WIDTH}
              emphasis={flagged}
              columns={[
                {
                  key: "load",
                  value: (
                    <span className={tint}>{formatMW(feederLoadMW(feeder))}</span>
                  ),
                  width: 150,
                  align: "right",
                  mono: true,
                },
                {
                  key: "loss",
                  value: formatPct(feeder.lossPct),
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
                    />
                  ),
                },
              ]}
              href={`/feeders/${feeder.id}`}
            />
          );
        })
      )}
    </Card>
  );
}
