import type { ReactNode } from "react";
import { LiveClock } from "./LiveClock";

// Top header for every screen: breadcrumb + page title on the left,
// live timestamp and a per-screen actions slot on the right.
export function PageHeader({
  title,
  breadcrumb,
  actions,
}: {
  title: string;
  breadcrumb?: string[];
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 flex items-start justify-between gap-4 border-b border-hairline pb-5">
      <div>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.66px] text-slate">
            {breadcrumb.join("  /  ")}
          </nav>
        )}
        <h1 className="text-[22px] font-semibold leading-tight text-ink">
          {title}
        </h1>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <LiveClock />
        {actions}
      </div>
    </header>
  );
}
