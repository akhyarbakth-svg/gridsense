"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { alerts } from "@/data/alerts";
import { operator } from "@/data/operator";
import { Icon } from "./Icon";
import { PulseMark } from "./PulseMark";
import { navGroups, isNavItemActive } from "./nav";

const activeAlertCount = alerts.filter(
  (a) => a.severity === "critical" && a.status === "active"
).length;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-60 flex-col border-r border-hairline bg-sidebar">
      {/* Logo row */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15">
          <PulseMark status="primary" />
        </span>
        <span className="text-[16px] font-semibold tracking-tight text-ink">
          GridSense
        </span>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <div className="px-2 pb-2 text-[11px] font-medium uppercase tracking-[0.66px] text-slate">
              {group.label}
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isNavItemActive(item, pathname);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`group flex items-center gap-3 rounded-sm px-2 py-2 text-[14px] transition-[color] ${
                        active
                          ? "bg-primary/15 font-medium text-ink"
                          : "text-slate hover:bg-white/5 hover:text-ink"
                      }`}
                    >
                      <Icon
                        name={item.icon}
                        className={`h-[18px] w-[18px] ${
                          active ? "text-primary" : "text-slate group-hover:text-ink"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Alert bar — opens the alert drawer (not yet built) */}
      <div className="px-3 pb-2">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-sm border border-hairline bg-surface px-3 py-2.5 text-left hover:border-critical/50"
        >
          <PulseMark status="critical" />
          <span className="flex-1 text-[13px] font-medium text-ink">
            Active Alerts
          </span>
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-critical px-1.5 text-[11px] font-semibold text-white">
            {activeAlertCount}
          </span>
        </button>
      </div>

      {/* Profile footer + settings */}
      <div className="flex items-center gap-3 border-t border-hairline px-4 py-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-[13px] font-semibold text-white">
          {operator.initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-medium text-ink">
            {operator.name}
          </div>
          <div className="truncate text-[11px] text-slate">Grid Operator</div>
        </div>
        <Link
          href="/settings"
          aria-label="Settings"
          className={`rounded-sm p-1.5 transition-[color] hover:bg-white/5 ${
            pathname === "/settings" ? "text-primary" : "text-slate hover:text-ink"
          }`}
        >
          <Icon name="settings" className="h-[18px] w-[18px]" />
        </Link>
      </div>
    </aside>
  );
}
