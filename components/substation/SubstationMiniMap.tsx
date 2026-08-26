import { Card } from "../Card";
import { PulseMark } from "../PulseMark";
import { substations } from "@/data/substations";
import { substationLinks } from "@/data/schematic";
import type { Status, Substation } from "@/data/types";

// Figma: 114:451 — a small locality map centred on this substation, showing its
// immediate neighbours and its own transformers.

const fill: Record<Status, string> = {
  normal: "bg-success-dot",
  warning: "bg-warning-dot",
  critical: "bg-critical-dot",
};

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={swatch} aria-hidden />
      <span className="text-[11px] text-slate">{label}</span>
    </span>
  );
}

/** Neighbours are whatever this substation shares a transmission link with. */
function neighboursOf(id: string): Substation[] {
  const ids = substationLinks
    .filter(([a, b]) => a === id || b === id)
    .map(([a, b]) => (a === id ? b : a));
  return ids
    .map((n) => substations.find((s) => s.id === n))
    .filter((s): s is Substation => Boolean(s));
}

// Fixed spokes around the centre, so any substation renders a sensible diagram.
const spokes = [
  { x: 22, y: 28 },
  { x: 80, y: 30 },
  { x: 24, y: 76 },
];

export function SubstationMiniMap({ substation }: { substation: Substation }) {
  const neighbours = neighboursOf(substation.id).slice(0, spokes.length);
  const transformerSpots = substation.transformers.slice(0, 3);

  return (
    <Card padding="p-5" className="flex w-60 shrink-0 flex-col gap-4">
      <h2 className="text-[16px] font-semibold text-ink">Local topology</h2>

      <div className="relative h-60 w-full overflow-hidden rounded-sm bg-surface-sunken">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {[25, 50, 75].map((x) => (
            <line key={`v${x}`} x1={x} y1={0} x2={x} y2={100}
              stroke="var(--color-hairline)" strokeWidth={0.2} opacity={0.4} />
          ))}
          {[25, 50, 75].map((y) => (
            <line key={`h${y}`} x1={0} y1={y} x2={100} y2={y}
              stroke="var(--color-hairline)" strokeWidth={0.2} opacity={0.4} />
          ))}
          {neighbours.map((_, i) => (
            <line key={`link${i}`} x1={50} y1={50} x2={spokes[i].x} y2={spokes[i].y}
              stroke="var(--color-slate)" strokeWidth={0.5} opacity={0.4} />
          ))}
          {transformerSpots.map((_, i) => (
            <line key={`spur${i}`} x1={50} y1={50} x2={62 + i * 12} y2={70 + i * 6}
              stroke="var(--color-slate)" strokeWidth={0.35} opacity={0.3} />
          ))}
        </svg>

        {/* This substation, ringed at the centre */}
        <span className="absolute left-1/2 top-1/2 grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center">
          <span className="absolute inset-0 rounded-full border-2 border-primary" />
          <span className={`size-3 rounded-full ${fill[substation.status]}`} />
        </span>
        <span className="absolute left-1/2 top-[calc(50%+18px)] -translate-x-1/2 whitespace-nowrap text-[11px] font-medium text-ink">
          {substation.name.replace(" Substation", " (SS)")}
        </span>

        {neighbours.map((neighbour, i) => (
          <span key={neighbour.id}>
            <span
              className={`absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ${fill[neighbour.status]}`}
              style={{ left: `${spokes[i].x}%`, top: `${spokes[i].y}%` }}
            />
            <span
              className="absolute -translate-x-1/2 whitespace-nowrap text-[10px] text-slate"
              style={{ left: `${spokes[i].x}%`, top: `calc(${spokes[i].y}% - 18px)` }}
            >
              {neighbour.name.replace(" Substation", " SS")}
            </span>
          </span>
        ))}

        {transformerSpots.map((transformer, i) => (
          <span
            key={transformer.id}
            className={`absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-[2px] ${fill[transformer.status]}`}
            style={{ left: `${62 + i * 12}%`, top: `${70 + i * 6}%` }}
            title={transformer.id}
          />
        ))}

        <span className="absolute right-3 top-3">
          <PulseMark status={substation.status} size={16} animate />
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <Legend swatch="size-2 rounded-full ring-2 ring-primary" label="Current SS" />
          <Legend swatch="size-2 rounded-[2px] bg-success-dot" label="Normal" />
        </div>
        <div className="flex items-center gap-4">
          <Legend swatch="size-2 rounded-[2px] bg-warning-dot" label="Warning" />
          <Legend swatch="size-2 rounded-[2px] bg-critical-dot" label="Critical" />
        </div>
      </div>
    </Card>
  );
}
