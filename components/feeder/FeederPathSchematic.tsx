import { Card } from "../Card";
import type { Status, Substation, Transformer } from "@/data/types";

// Figma: 132:358 — vertical run from the origin substation down through each
// transformer the feeder carries.

const dot: Record<Status, string> = {
  normal: "bg-success-dot",
  warning: "bg-warning-dot",
  critical: "bg-critical-dot",
};

export function FeederPathSchematic({
  origin,
  assets,
}: {
  origin?: Substation;
  assets: Transformer[];
}) {
  return (
    <Card padding="p-4" className="flex w-75 shrink-0 flex-col gap-4">
      <h2 className="text-[16px] font-semibold text-ink">
        Feeder Path Schematic
      </h2>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-3 pl-3">
          <span className="size-3.5 shrink-0 rounded-[3px] bg-primary" aria-hidden />
          <span className="text-[13px] text-ink">
            {origin ? origin.name : "Unassigned origin"}
          </span>
        </div>

        {assets.length === 0 ? (
          <p className="pl-3 pt-4 text-[13px] text-slate">
            No assets on this run.
          </p>
        ) : (
          assets.map((asset) => (
            <div key={asset.id} className="flex flex-col">
              {/* Riser from the node above */}
              <span
                className="ml-[9px] h-7 w-px bg-hairline"
                aria-hidden
              />
              <div className="flex items-center gap-3 pl-1">
                <span
                  className={`size-4 shrink-0 rounded-full ${dot[asset.status]}`}
                  aria-hidden
                />
                <span className="text-[13px] text-ink">{asset.id}</span>
                <span className="ml-auto font-mono text-[12px] text-slate">
                  {asset.loadPct}%
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-[2px] bg-primary" aria-hidden />
          <span className="text-[11px] uppercase tracking-[0.66px] text-slate">
            Substation origin
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-success-dot" aria-hidden />
          <span className="text-[11px] uppercase tracking-[0.66px] text-slate">
            TR operational
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-warning-dot" aria-hidden />
          <span className="text-[11px] uppercase tracking-[0.66px] text-slate">
            Warning / deviating
          </span>
        </span>
      </div>
    </Card>
  );
}
