import type { ReactNode } from "react";

// Shared form primitives. Extracted from the Create Work Order panel so every
// form in the app uses one input treatment instead of redefining it per screen.

export const inputClassName =
  "w-full rounded-sm border border-hairline bg-surface-sunken px-3 py-2 text-[14px] text-ink outline-none placeholder:text-slate focus-visible:border-primary";

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-[11px] font-medium uppercase tracking-[0.66px] text-slate">
      {children}
    </span>
  );
}

/** Label stacked over a control. */
export function Field({
  label,
  children,
  className = "",
}: {
  label: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <FieldLabel>{label}</FieldLabel>
      {children}
    </label>
  );
}

/** Row toggle: title and description on the left, switch on the right. */
export function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-hairline py-3 last:border-b-0">
      <div className="flex flex-col gap-0.5">
        <span className="text-[14px] text-ink">{label}</span>
        {description && (
          <span className="text-[13px] text-slate">{description}</span>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 rounded-full ${
          checked ? "bg-primary" : "bg-badge-neutral"
        }`}
      >
        <span
          className={`absolute top-0.5 size-4 rounded-full bg-white ${
            checked ? "left-4.5" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
