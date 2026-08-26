"use client";

import { Card, CardHeader, CardLink } from "../Card";
import { TableHeader, type TableHeaderColumn } from "../TableHeader";
import { TableRow } from "../TableRow";
import type { DrawerTarget } from "../Drawer";
import type { Tone } from "../status";
import { feeders, feederLoadMW } from "@/data/feeders";
import type { Status } from "@/data/types";
import { formatMW, formatMWh, formatPct } from "@/lib/format";

// Figma: 49:1826 — feeder performance table. Rows open the contextual drawer.

const columns: TableHeaderColumn[] = [
  { key: "zone", label: "Zone", width: 120 },
  { key: "load", label: "Current Load", width: 130, align: "right" },
  { key: "energy", label: "Energy Today", width: 140, align: "right" },
  { key: "efficiency", label: "Efficiency", width: 120, align: "right" },
];

const statusTone: Record<Status, Tone> = {
  normal: "success",
  warning: "warning",
  critical: "critical",
};

const statusLabel: Record<Status, string> = {
  normal: "Active",
  warning: "Strained",
  critical: "Offline",
};

/** Zone is a presentation grouping, derived from the feeder id so it stays stable. */
function zoneFor(id: string): string {
  const n = Number(id.replace(/\D/g, ""));
  return `Zone ${String.fromCharCode(65 + (n % 3))}`;
}



export function FeederTable({
  onSelect,
}: {
  onSelect: (target: DrawerTarget) => void;
}) {
  return (
    <Card padding="p-0" className="overflow-hidden">
      <CardHeader
        title="Feeder performance"
        action={<CardLink>{`All ${feeders.length} feeders ›`}</CardLink>}
        className="p-5"
      />
      <TableHeader
        nameLabel="Feeder Name"
        columns={columns}
        trailingLabel="Status"
      />
      {feeders.map((feeder) => {
        const loadMW = feederLoadMW(feeder);
        return (
          <TableRow
            key={feeder.id}
            status={feeder.status}
            name={feeder.name}
            columns={[
              { key: "zone", value: zoneFor(feeder.id), width: 120, muted: true },
              {
                key: "load",
                value: formatMW(loadMW),
                width: 130,
                align: "right",
                mono: true,
              },
              {
                key: "energy",
                value: formatMWh(loadMW * 24),
                width: 140,
                align: "right",
                mono: true,
              },
              {
                key: "efficiency",
                value: formatPct(100 - feeder.lossPct),
                width: 120,
                align: "right",
                mono: true,
              },
            ]}
            badge={{
              label: statusLabel[feeder.status],
              tone: statusTone[feeder.status],
            }}
            onClick={() => onSelect({ kind: "feeder", id: feeder.id })}
          />
        );
      })}
    </Card>
  );
}
