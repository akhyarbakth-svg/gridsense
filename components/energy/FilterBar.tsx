"use client";

import type { Timeframe } from "@/data/demandCurve";

// Figma: 135:425 — inline filter strip. The selections genuinely narrow the
// scope of the demand curve rather than reshuffling values: picking a feeder
// scales the curve to that feeder's share of system load.

export interface FilterState {
  zoneId: string;
  substationId: string;
  feederId: string;
  timeframe: Timeframe;
}

export interface Option {
  value: string;
  label: string;
}

function Field({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 px-3">
      <span className="text-[11px] font-medium uppercase tracking-[0.66px] text-slate">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="cursor-pointer appearance-none bg-transparent pr-4 text-[14px] text-ink outline-none focus-visible:underline"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'><path d='M2 4l3 3 3-3' fill='none' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round'/></svg>\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right center",
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-surface">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const Divider = () => (
  <span className="h-6 w-px shrink-0 self-center bg-hairline" aria-hidden />
);

export function FilterBar({
  value,
  zones,
  substations,
  feeders,
  onChange,
}: {
  value: FilterState;
  zones: Option[];
  substations: Option[];
  feeders: Option[];
  onChange: (next: FilterState) => void;
}) {
  const set = <K extends keyof FilterState>(key: K, next: FilterState[K]) =>
    onChange({ ...value, [key]: next });

  return (
    <div className="flex items-center gap-3 rounded-lg border border-hairline bg-surface p-3">
      <Field
        label="Zone"
        value={value.zoneId}
        options={zones}
        // Narrowing the zone invalidates the finer selections.
        onChange={(zoneId) =>
          onChange({ ...value, zoneId, substationId: "all", feederId: "all" })
        }
      />
      <Divider />
      <Field
        label="Substation"
        value={value.substationId}
        options={substations}
        onChange={(substationId) =>
          onChange({ ...value, substationId, feederId: "all" })
        }
      />
      <Divider />
      <Field
        label="Feeder"
        value={value.feederId}
        options={feeders}
        onChange={(feederId) => set("feederId", feederId)}
      />
      <Divider />
      <Field
        label="Timeframe"
        value={value.timeframe}
        options={[
          { value: "today", label: "Today, 24 Hours" },
          { value: "7-day", label: "Last 7 days" },
          { value: "30-day", label: "Last 30 days" },
        ]}
        onChange={(timeframe) => set("timeframe", timeframe as Timeframe)}
      />
    </div>
  );
}
