import Link from "next/link";
import { StatusPill } from "../StatusPill";
import type { Tone } from "../status";
import type { Feeder, Status, Substation } from "@/data/types";

// Figma: 132:316 — origin link above a 32px title with an outlined status pill.
// The origin link doubles as the back affordance: it returns to the substation
// this feeder runs from. The frame shows no action buttons.

const statusTone: Record<Status, Tone> = {
  normal: "success",
  warning: "warning",
  critical: "critical",
};

const statusLabel: Record<Status, string> = {
  normal: "Active",
  warning: "Deviating",
  critical: "Fault",
};

export function FeederHeader({
  feeder,
  origin,
}: {
  feeder: Feeder;
  origin?: Substation;
}) {
  return (
    <header className="mb-8 flex flex-col gap-2 border-b border-hairline pb-5">
      <div className="flex items-center gap-1 text-[12px]">
        <span className="text-slate">Origin:</span>
        {origin ? (
          <Link
            href={`/substations/${origin.id}`}
            className="font-medium text-primary underline hover:no-underline"
          >
            {origin.name}
          </Link>
        ) : (
          <span className="text-slate">Unassigned</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <h1 className="text-[32px] font-semibold leading-tight text-ink">
          {feeder.id}
        </h1>
        <StatusPill
          label={statusLabel[feeder.status]}
          tone={statusTone[feeder.status]}
          variant="outline"
        />
      </div>
    </header>
  );
}
