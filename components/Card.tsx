import type { ReactNode } from "react";

// Surface shell shared by every panel on the dashboard: #111827 on a hairline
// border at the 12px large radius. Padding varies by section, so it's a prop.

export function Card({
  children,
  padding = "p-6",
  className = "",
}: {
  children: ReactNode;
  padding?: string;
  className?: string;
}) {
  return (
    <section
      className={`rounded-lg border border-hairline bg-surface ${padding} ${className}`}
    >
      {children}
    </section>
  );
}

/** Section title + optional trailing link, used in every card header. */
export function CardHeader({
  title,
  action,
  className = "",
}: {
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <h2 className="text-[16px] font-semibold text-ink">{title}</h2>
      {action}
    </div>
  );
}

/** Low-emphasis inline link used for "View all" / "All 48 feeders ›". */
export function CardLink({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[14px] text-primary hover:underline"
    >
      {children}
    </button>
  );
}
