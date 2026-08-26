"use client";

import { useState } from "react";
import { Button } from "../Button";
import { FieldLabel, inputClassName } from "../FormField";
import { feeders } from "@/data/feeders";
import { substations } from "@/data/substations";
import type { WorkOrder, WorkOrderPriority } from "@/data/types";

// Figma: 137:647 — a create panel that lives beside the queue rather than in a
// modal. Submitting prepends to the in-memory list; nothing is persisted.

const priorities: { value: WorkOrderPriority; label: string }[] = [
  { value: "urgent", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

/** Assets a work order can be raised against, grouped by kind. */
const assetGroups = [
  {
    label: "Transformers",
    options: substations.flatMap((s) =>
      s.transformers.map((t) => ({
        value: t.id,
        label: `${t.id} · ${s.name}`,
      }))
    ),
  },
  {
    label: "Substations",
    options: substations.map((s) => ({ value: s.id, label: s.name })),
  },
  {
    label: "Feeders",
    options: feeders.map((f) => ({ value: f.id, label: f.name })),
  },
];

export function CreateWorkOrderPanel({
  teams,
  nextId,
  presetAssetId,
  onCreate,
}: {
  teams: string[];
  nextId: string;
  /** Asset carried in from Asset Health via ?asset=. */
  presetAssetId?: string;
  onCreate: (order: WorkOrder) => void;
}) {
  const today = "2026-08-26";

  const [assetId, setAssetId] = useState(presetAssetId ?? "");
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState<WorkOrderPriority>("high");
  const [team, setTeam] = useState(teams[0] ?? "");
  const [dueDate, setDueDate] = useState("2026-08-30");
  const [description, setDescription] = useState("");
  const [created, setCreated] = useState<string | null>(null);

  // The asset arrives through the state initializer above. The screen remounts
  // this panel when ?asset= changes, so no effect is needed to resync it.

  const reset = () => {
    setAssetId("");
    setIssue("");
    setPriority("high");
    setTeam(teams[0] ?? "");
    setDueDate("2026-08-30");
    setDescription("");
    setCreated(null);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!assetId || !issue.trim()) return;

    onCreate({
      id: nextId,
      assetId,
      issue: issue.trim(),
      priority,
      assignedTeam: team,
      dueDate: dueDate || today,
      description: description.trim(),
      status: "open",
    });

    setCreated(nextId);
    setIssue("");
    setDescription("");
  };

  return (
    <form
      onSubmit={submit}
      className="flex w-100 shrink-0 flex-col overflow-hidden rounded-lg border border-hairline bg-surface"
    >
      <div className="flex items-center gap-2.5 border-b border-hairline p-5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="size-4.5 text-primary"
          aria-hidden
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8M8 12h8" strokeLinecap="round" />
        </svg>
        <h2 className="text-[16px] font-semibold text-ink">
          Create Dispatch Order
        </h2>
      </div>

      <div className="flex flex-col gap-4 p-5">
        <label className="flex flex-col gap-1.5">
          <FieldLabel>Asset ID / Location Target</FieldLabel>
          <select
            autoFocus={Boolean(presetAssetId)}
            value={assetId}
            onChange={(event) => setAssetId(event.target.value)}
            required
            className={inputClassName}
          >
            <option value="">Select electrical asset…</option>
            {assetGroups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <FieldLabel>Primary Fault / System Issue</FieldLabel>
          <input
            value={issue}
            onChange={(event) => setIssue(event.target.value)}
            required
            placeholder="E.g. SF6 leakage detected…"
            className={inputClassName}
          />
        </label>

        <div className="flex gap-3">
          <label className="flex flex-1 flex-col gap-1.5">
            <FieldLabel>Priority Tier</FieldLabel>
            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as WorkOrderPriority)
              }
              className={inputClassName}
            >
              {priorities.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-1 flex-col gap-1.5">
            <FieldLabel>Assigned Ops Team</FieldLabel>
            <select
              value={team}
              onChange={(event) => setTeam(event.target.value)}
              className={inputClassName}
            >
              {teams.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <FieldLabel>Target Clearance Date</FieldLabel>
          <input
            type="date"
            value={dueDate}
            min={today}
            onChange={(event) => setDueDate(event.target.value)}
            className={inputClassName}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <FieldLabel>Operator Remarks &amp; Directives</FieldLabel>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            placeholder="Specify telemetry context, safety boundaries and high voltage precautions…"
            className={`${inputClassName} resize-none`}
          />
        </label>

        {created && (
          <p role="status" className="text-[13px] text-success">
            {created} dispatched and added to the queue.
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-hairline bg-surface-sunken p-5">
        <button
          type="button"
          onClick={reset}
          className="rounded-sm px-4 py-2 text-[14px] text-slate hover:text-ink"
        >
          Reset Form
        </button>
        <Button variant="primary" type="submit">
          Dispatch Crew ({nextId})
        </Button>
      </div>
    </form>
  );
}
