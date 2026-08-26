"use client";

import { useState } from "react";
import { Button } from "../Button";
import { Card } from "../Card";
import { Field, Toggle, inputClassName } from "../FormField";
import { PageHeader } from "../PageHeader";
import { operator } from "@/data/operator";
import { workOrders } from "@/data/workOrders";

// Figma: 139:351. The frame wraps this screen in its own top bar and settings
// sub-nav; the persistent app sidebar from CLAUDE.md is kept instead, and the
// sub-nav becomes a column inside the content area.
//
// Only the Account panel is designed in the frame. The other four are named in
// the sub-nav, so they are built lightly rather than left as dead links.

type Panel =
  | "account"
  | "notifications"
  | "team"
  | "system"
  | "appearance";

const panels: { id: Panel; label: string }[] = [
  { id: "account", label: "Account" },
  { id: "notifications", label: "Notifications" },
  { id: "team", label: "Team Management" },
  { id: "system", label: "System Preferences" },
  { id: "appearance", label: "Appearance" },
];

const initialProfile = {
  name: operator.name,
  email: operator.email,
  phone: operator.phone,
  company: operator.company,
};

const initialAlerts = {
  criticalPush: true,
  outageEmail: true,
  maintenanceDigest: false,
  lossThreshold: true,
};

const initialSystem = {
  units: "metric",
  refreshSeconds: "5",
  timezone: "utc",
};

function GridIcon({ active }: { active: boolean }) {
  const fill = active ? "bg-ink" : "bg-slate";
  return (
    <span className="relative size-4 shrink-0" aria-hidden>
      {[
        "left-0 top-0",
        "right-0 top-0",
        "bottom-0 left-0",
        "bottom-0 right-0",
      ].map((pos) => (
        <span
          key={pos}
          className={`absolute size-[6.5px] rounded-[1.5px] ${fill} ${pos}`}
        />
      ))}
    </span>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <h2 className="text-[16px] font-semibold text-ink">{title}</h2>
      <p className="text-[14px] text-slate">{description}</p>
    </div>
  );
}

export function SettingsScreen() {
  const [panel, setPanel] = useState<Panel>("account");

  const [profile, setProfile] = useState(initialProfile);
  const [alertPrefs, setAlertPrefs] = useState(initialAlerts);
  const [system, setSystem] = useState(initialSystem);
  const [density, setDensity] = useState("comfortable");
  const [saved, setSaved] = useState(false);

  const teams = [...new Set(workOrders.map((order) => order.assignedTeam))].sort();

  const set = <K extends keyof typeof profile>(key: K, value: string) => {
    setProfile((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const cancel = () => {
    setProfile(initialProfile);
    setAlertPrefs(initialAlerts);
    setSystem(initialSystem);
    setDensity("comfortable");
    setSaved(false);
  };

  return (
    <>
      <PageHeader title="Settings" breadcrumb={["Settings"]} />

      <div className="flex gap-6">
        <nav className="flex w-55 shrink-0 flex-col gap-2 self-start rounded-lg border border-hairline bg-surface-sunken p-4">
          {panels.map((item) => {
            const active = item.id === panel;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPanel(item.id)}
                aria-current={active ? "true" : undefined}
                className={`relative flex h-9 items-center gap-2 overflow-hidden rounded-sm px-3 text-left text-[14px] ${
                  active
                    ? "bg-badge-neutral font-semibold text-ink"
                    : "text-slate hover:text-ink"
                }`}
              >
                {active && (
                  <span
                    className="absolute inset-y-0 left-0 w-0.5 bg-primary"
                    aria-hidden
                  />
                )}
                <GridIcon active={active} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {panel === "account" && (
            <>
              <SectionHeading
                title="Account Settings"
                description="Manage your enterprise profile credentials, authentication options, and operational workspace."
              />

              <Card padding="p-6" className="flex items-center gap-4">
                <span className="grid size-16 shrink-0 place-items-center rounded-full bg-primary/15 text-[20px] font-semibold text-primary">
                  {operator.initials}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <span className="text-[16px] font-semibold text-ink">
                    {profile.name}
                  </span>
                  <span className="text-[14px] text-slate">{operator.role}</span>
                </div>
                <Button variant="secondary">Upload Photo</Button>
              </Card>

              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <Field label="Full Name" className="flex-1">
                    <input
                      value={profile.name}
                      onChange={(e) => set("name", e.target.value)}
                      className={inputClassName}
                    />
                  </Field>
                  <Field label="Email Address" className="flex-1">
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => set("email", e.target.value)}
                      className={inputClassName}
                    />
                  </Field>
                </div>
                <div className="flex gap-4">
                  <Field label="Phone Number" className="flex-1">
                    <input
                      value={profile.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      className={inputClassName}
                    />
                  </Field>
                  <Field label="Company Name" className="flex-1">
                    <input
                      value={profile.company}
                      onChange={(e) => set("company", e.target.value)}
                      className={inputClassName}
                    />
                  </Field>
                </div>
              </div>

              <div className="h-px w-full bg-hairline" />

              <SectionHeading
                title="Change Password"
                description="Keep your account secure by rotating your authentication credentials regularly."
              />
              <div className="flex gap-4">
                <Field label="Current Password" className="flex-1">
                  <input
                    type="password"
                    autoComplete="off"
                    placeholder="••••••••••••"
                    className={inputClassName}
                  />
                </Field>
                <Field label="New Password" className="flex-1">
                  <input
                    type="password"
                    autoComplete="off"
                    placeholder="Min. 12 characters"
                    className={inputClassName}
                  />
                </Field>
              </div>
            </>
          )}

          {panel === "notifications" && (
            <>
              <SectionHeading
                title="Notifications"
                description="Choose which grid events reach you, and how."
              />
              <Card padding="px-6 py-2">
                <Toggle
                  label="Critical alerts"
                  description="Push a notification the moment an asset trips or overloads."
                  checked={alertPrefs.criticalPush}
                  onChange={(v) => {
                    setAlertPrefs((c) => ({ ...c, criticalPush: v }));
                    setSaved(false);
                  }}
                />
                <Toggle
                  label="Outage email"
                  description="Email the on-call operator when an outage is raised."
                  checked={alertPrefs.outageEmail}
                  onChange={(v) => {
                    setAlertPrefs((c) => ({ ...c, outageEmail: v }));
                    setSaved(false);
                  }}
                />
                <Toggle
                  label="Maintenance digest"
                  description="A daily summary of open and overdue work orders."
                  checked={alertPrefs.maintenanceDigest}
                  onChange={(v) => {
                    setAlertPrefs((c) => ({ ...c, maintenanceDigest: v }));
                    setSaved(false);
                  }}
                />
                <Toggle
                  label="Loss threshold breach"
                  description="Notify when a feeder exceeds its loss target."
                  checked={alertPrefs.lossThreshold}
                  onChange={(v) => {
                    setAlertPrefs((c) => ({ ...c, lossThreshold: v }));
                    setSaved(false);
                  }}
                />
              </Card>
            </>
          )}

          {panel === "team" && (
            <>
              <SectionHeading
                title="Team Management"
                description="Crews available for work order dispatch."
              />
              <Card padding="p-0" className="overflow-hidden">
                {teams.map((team) => {
                  const assigned = workOrders.filter(
                    (o) => o.assignedTeam === team && o.status !== "completed"
                  ).length;
                  return (
                    <div
                      key={team}
                      className="flex items-center justify-between border-b border-hairline px-6 py-3 last:border-b-0"
                    >
                      <span className="text-[14px] text-ink">{team}</span>
                      <span className="font-mono text-[13px] text-slate">
                        {assigned} open
                      </span>
                    </div>
                  );
                })}
              </Card>
            </>
          )}

          {panel === "system" && (
            <>
              <SectionHeading
                title="System Preferences"
                description="How telemetry is measured and refreshed across the console."
              />
              <div className="flex gap-4">
                <Field label="Units" className="flex-1">
                  <select
                    value={system.units}
                    onChange={(e) => {
                      setSystem((c) => ({ ...c, units: e.target.value }));
                      setSaved(false);
                    }}
                    className={inputClassName}
                  >
                    <option value="metric">Metric (MW, °C)</option>
                    <option value="imperial">Imperial (MW, °F)</option>
                  </select>
                </Field>
                <Field label="Telemetry Refresh" className="flex-1">
                  <select
                    value={system.refreshSeconds}
                    onChange={(e) => {
                      setSystem((c) => ({ ...c, refreshSeconds: e.target.value }));
                      setSaved(false);
                    }}
                    className={inputClassName}
                  >
                    <option value="5">Every 5 seconds</option>
                    <option value="15">Every 15 seconds</option>
                    <option value="60">Every minute</option>
                  </select>
                </Field>
                <Field label="Timezone" className="flex-1">
                  <select
                    value={system.timezone}
                    onChange={(e) => {
                      setSystem((c) => ({ ...c, timezone: e.target.value }));
                      setSaved(false);
                    }}
                    className={inputClassName}
                  >
                    <option value="utc">UTC</option>
                    <option value="dhaka">Asia/Dhaka (UTC+6)</option>
                  </select>
                </Field>
              </div>
            </>
          )}

          {panel === "appearance" && (
            <>
              <SectionHeading
                title="Appearance"
                description="GridSense ships a single dark console theme, tuned for control-room lighting."
              />
              <div className="flex gap-4">
                <Field label="Theme" className="flex-1">
                  <select value="dark" disabled className={inputClassName}>
                    <option value="dark">Dark (only theme)</option>
                  </select>
                </Field>
                <Field label="Table Density" className="flex-1">
                  <select
                    value={density}
                    onChange={(e) => {
                      setDensity(e.target.value);
                      setSaved(false);
                    }}
                    className={inputClassName}
                  >
                    <option value="comfortable">Comfortable</option>
                    <option value="compact">Compact</option>
                  </select>
                </Field>
              </div>
            </>
          )}

          <div className="h-px w-full bg-hairline" />

          <div className="flex items-center justify-end gap-3">
            {saved && (
              <span role="status" className="mr-auto text-[13px] text-success">
                Preferences updated for this session.
              </span>
            )}
            <button
              type="button"
              onClick={cancel}
              className="rounded-sm px-6 py-2 text-[14px] text-slate hover:text-ink"
            >
              Cancel
            </button>
            <Button variant="primary" onClick={() => setSaved(true)}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
