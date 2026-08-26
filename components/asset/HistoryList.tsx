import { Card } from "../Card";
import { PulseMark } from "../PulseMark";
import type { Status } from "@/data/types";

// Figma: 134:627 (maintenance) and 134:659 (fault) — the same dated list,
// a status pulse beside an event and its date.

export interface HistoryEntry {
  id: string;
  event: string;
  date: string;
  outcome: Status;
}

export function HistoryList({
  title,
  entries,
  emptyLabel,
}: {
  title: string;
  entries: HistoryEntry[];
  emptyLabel: string;
}) {
  return (
    <Card padding="p-5" className="flex flex-col gap-4">
      <h2 className="text-[16px] font-semibold text-ink">{title}</h2>

      {entries.length === 0 ? (
        <p className="text-[14px] text-slate">{emptyLabel}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {entries.map((entry) => (
            <li key={entry.id} className="flex items-start gap-3">
              <span className="pt-0.5">
                <PulseMark status={entry.outcome} size={16} />
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="text-[14px] text-ink">{entry.event}</span>
                <span className="font-mono text-[11px] text-slate">
                  {entry.date}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
