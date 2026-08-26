"use client";

import { substationTelemetry } from "@/data/telemetry";
import type { Substation } from "@/data/types";
import { formatMW, formatTempC } from "@/lib/format";

// Figma: 101:437 — seven-cell telemetry strip for the current selection.
//
// LIVE vs static, per the CLAUDE.md field list:
//   MW LOAD          -> Substation.loadMW        (LIVE)
//   TRANSFORMER TEMP -> Transformer.temperatureC (LIVE, flagged transformers only)
// Both arrive already jittered in the screen's shared live snapshot.
//   voltage / current / frequency / MVAR / power factor have no schema field,
//   so they render static. See the note in data/telemetry.ts.

function Cell({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex flex-1 flex-col items-center justify-center gap-1 px-4 ${
        last ? "" : "border-r border-hairline"
      }`}
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.66px] text-slate">
        {label}
      </span>
      <span className="font-mono text-[14px] text-ink">{value}</span>
    </div>
  );
}

export function TelemetryBar({ substation }: { substation: Substation }) {
  // Hottest transformer represents the substation on the strip.
  const hottest = substation.transformers.reduce((a, b) =>
    b.temperatureC > a.temperatureC ? b : a
  );

  const readings = substationTelemetry[substation.id];

  return (
    <div className="flex h-[70px] items-stretch rounded-lg border border-hairline bg-surface">
      <Cell label="Voltage" value={`${readings.voltageKV.toFixed(1)} kV`} />
      <Cell label="Current" value={`${readings.currentA} A`} />
      <Cell label="Frequency" value={`${readings.frequencyHz.toFixed(2)} Hz`} />
      <Cell label="MW Load" value={formatMW(substation.loadMW)} />
      <Cell label="MVAR Reactive" value={`${readings.mvar.toFixed(1)} MVAR`} />
      <Cell label="Power Factor" value={readings.powerFactor.toFixed(2)} />
      <Cell
        label="Transformer Temp"
        value={formatTempC(hottest.temperatureC)}
        last
      />
    </div>
  );
}
