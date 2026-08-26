import Link from "next/link";
import { Button } from "../Button";
import { PulseMark } from "../PulseMark";
import { LiveClock } from "../LiveClock";
import type { Substation, Status } from "@/data/types";

// Figma: 114:397 — name and status inline, live timestamp plus Export Data /
// Run Health Check on the right. A back link to the map is added so the screen
// is reachable in both directions (the frame has no breadcrumb enabled).

const connectionLabel: Record<Status, string> = {
  normal: "Online",
  warning: "Degraded",
  critical: "Critical",
};

const badgeBed: Record<Status, string> = {
  normal: "bg-badge-success text-success",
  warning: "bg-badge-warning text-warning",
  critical: "bg-badge-critical text-critical",
};

export function SubstationHeader({ substation }: { substation: Substation }) {
  return (
    <header className="mb-8 flex flex-col gap-3 border-b border-hairline pb-5">
      <Link
        href="/live-grid"
        className="flex w-fit items-center gap-1.5 text-[13px] font-medium text-slate transition-[color] hover:text-ink"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-3"
          aria-hidden
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to grid map
      </Link>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-[22px] font-semibold leading-tight text-ink">
            {substation.name}
          </h1>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${badgeBed[substation.status]}`}
          >
            <PulseMark status={substation.status} size={12} />
            <span className="text-[11px] font-medium uppercase tracking-[0.66px]">
              {connectionLabel[substation.status]}
            </span>
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <LiveClock />
          <Button variant="secondary">Export Data</Button>
          <Button variant="primary">Run Health Check</Button>
        </div>
      </div>
    </header>
  );
}
