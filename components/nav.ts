// Sidebar navigation config. Detail screens use example IDs (Mirpur, F-12, TR-07)
// so the nav links resolve to a real entity in the mock data set.
// Note: /login is intentionally NOT a nav item — it is the auth entry, not an app destination.

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  /** When set, the item is active for any route under this prefix (used by [id] screens). */
  matchPrefix?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "Monitor",
    items: [
      { label: "Overview", href: "/overview", icon: "overview" },
      { label: "Live Grid Map", href: "/live-grid", icon: "live-grid" },
      { label: "Outage Management", href: "/outages", icon: "outages" },
    ],
  },
  {
    label: "Analyze",
    items: [
      { label: "Loss Analysis", href: "/analytics/loss", icon: "loss" },
      { label: "Energy Analytics", href: "/analytics/energy", icon: "energy" },
    ],
  },
  {
    label: "Assets",
    items: [
      {
        label: "Substation Details",
        href: "/substations/SUB-MIRPUR",
        icon: "substation",
        matchPrefix: "/substations",
      },
      {
        label: "Feeder Details",
        href: "/feeders/F-12",
        icon: "feeder",
        matchPrefix: "/feeders",
      },
      {
        label: "Asset Health",
        href: "/assets/TR-07",
        icon: "asset",
        matchPrefix: "/assets",
      },
      { label: "Maintenance", href: "/maintenance", icon: "maintenance" },
    ],
  },
  {
    label: "Reports",
    items: [{ label: "Reports", href: "/reports", icon: "reports" }],
  },
];

export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.matchPrefix) return pathname.startsWith(item.matchPrefix);
  return pathname === item.href;
}
