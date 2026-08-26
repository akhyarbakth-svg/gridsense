import Link from "next/link";
import { Card } from "../Card";
import { StatusPill } from "../StatusPill";
import type { Tone } from "../status";
import type { Status, Transformer } from "@/data/types";
import { formatPct, formatTempC } from "@/lib/format";

// Figma: 132:457 — asset rows as inset cards rather than table rows, with the
// flagged one carrying a coloured outline. Each row routes to Asset Health.

const statusTone: Record<Status, Tone> = {
  normal: "success",
  warning: "warning",
  critical: "critical",
};

const statusLabel: Record<Status, string> = {
  normal: "OK",
  warning: "Warn",
  critical: "Fault",
};

const rowChrome: Record<Status, string> = {
  normal: "border-hairline bg-surface-sunken",
  warning: "border-warning bg-warning-dot/10",
  critical: "border-critical bg-critical-dot/10",
};

export function ConnectedAssets({ assets }: { assets: Transformer[] }) {
  return (
    <Card padding="p-4" className="flex w-80 shrink-0 flex-col gap-4">
      <h2 className="text-[16px] font-semibold text-ink">
        Connected Assets ({assets.length})
      </h2>

      {assets.length === 0 ? (
        <p className="text-[13px] text-slate">No assets on this feeder.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {assets.map((asset) => (
            <Link
              key={asset.id}
              href={`/assets/${asset.id}`}
              className={`flex items-center gap-2 rounded-sm border p-2 ${rowChrome[asset.status]}`}
            >
              <span className="w-16 shrink-0 text-[13px] font-semibold text-ink">
                {asset.id}
              </span>
              <span className="w-16 shrink-0 text-center font-mono text-[12px] text-slate">
                {formatPct(asset.loadPct, 0)}
              </span>
              <span className="w-16 shrink-0 text-center font-mono text-[12px] text-slate">
                {formatTempC(asset.temperatureC)}
              </span>
              <span className="ml-auto">
                <StatusPill
                  label={statusLabel[asset.status]}
                  tone={statusTone[asset.status]}
                  shape="rounded"
                  variant="outline"
                  className="px-1.5 py-0.5 text-[10px]"
                />
              </span>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
