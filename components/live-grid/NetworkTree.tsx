"use client";

import { useState } from "react";
import { PulseMark } from "../PulseMark";
import { zones, substationsInZone, DISTRIBUTION_NAME } from "@/data/zones";

// Figma: 101:300 — location hierarchy. Zones collapse and expand; picking a
// substation raises the shared selection that also highlights its map marker.

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`size-3 shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
      aria-hidden
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function Globe() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      className="size-3.5 shrink-0 text-slate"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
    </svg>
  );
}

export function NetworkTree({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (substationId: string) => void;
}) {
  // Mirpur is open by default — the primary example zone.
  const [openZones, setOpenZones] = useState<string[]>(["ZONE-MIRPUR"]);

  const toggle = (zoneId: string) =>
    setOpenZones((current) =>
      current.includes(zoneId)
        ? current.filter((id) => id !== zoneId)
        : [...current, zoneId]
    );

  return (
    <div className="flex w-50 shrink-0 flex-col gap-4 overflow-y-auto border-r border-hairline px-4 py-5">
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-medium uppercase tracking-[0.66px] text-slate">
          Location hierarchy
        </span>
        <div className="flex items-center gap-1.5 py-1">
          <Globe />
          <span className="text-[16px] font-semibold text-ink">
            {DISTRIBUTION_NAME}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {zones.map((zone) => {
          const isOpen = openZones.includes(zone.id);
          return (
            <div key={zone.id} className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => toggle(zone.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-1.5 py-1 text-slate transition-[color] hover:text-ink"
              >
                <Chevron open={isOpen} />
                <span className="text-[11px] font-medium uppercase tracking-[0.66px]">
                  {zone.name}
                </span>
              </button>

              {isOpen &&
                substationsInZone(zone).map((substation) => {
                  const selected = substation.id === selectedId;
                  return (
                    <button
                      key={substation.id}
                      type="button"
                      onClick={() => onSelect(substation.id)}
                      aria-current={selected ? "true" : undefined}
                      className={`flex w-full items-center gap-2 rounded-sm py-1.5 pl-4.5 pr-2 text-left text-[14px] transition-[color] ${
                        selected
                          ? "bg-badge-neutral font-medium text-primary"
                          : "text-ink hover:bg-white/5"
                      }`}
                    >
                      <PulseMark status={substation.status} size={8} />
                      <span className="truncate">{substation.name}</span>
                    </button>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
