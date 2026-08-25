# CLAUDE.md — GridSense

Project conventions for Claude Code. Read this before every build task. Check `/components` before creating anything new — never duplicate an existing component.

---

## What this is

**GridSense** — a modern enterprise SCADA-adjacent grid monitoring dashboard for utility operators / power distribution companies. Portfolio piece, not a production app: static mock data with lightweight fake randomization to simulate a live feel. No backend, no persistence, no auth beyond a UI shell.

Figma source: `Main-Design_GridSense` (file key `v6g4TlC0xgelXXsopB9osk`).

---

## Stack

- Framework: **Next.js (App Router)**
- Language: **TypeScript**
- Styling: **Tailwind CSS**
- Charts/sparklines: **Recharts**
- Hosting: **Vercel**
- Version control: GitHub, committed incrementally per component/screen

---

## Layout rules

- **Desktop-only.** 1440px canvas. No responsive/mobile breakpoints — don't add them even if asked implicitly by a component library default.
- **Sidebar:** fixed left, 240px.
- **Page margins:** 32px on all sides of main content.
- Dense, readable data tables over decorative whitespace.

---

## Design tokens

**Confirmed dark theme, verified directly against the live Figma file (Overview Dashboard, node 49:1711) — not the original light-theme spec.**

| Token | Value | Usage |
|---|---|---|
| Canvas | `#0b0f1a` / `#0b0f14` | App background |
| Sidebar background | `#101425` | Left nav panel |
| Surface | `#111827` | Cards, table sections, panels |
| Ink (primary text) | `#f8fafc` | Headlines, hero numbers, primary labels |
| Slate (secondary text) | `#94a3b8` | Secondary labels, captions, muted values |
| Hairline / border | `#334155` | 1px card and divider borders |
| Primary | `#4b4fe0` (indigo) | Active nav state, primary buttons, key data points |
| Success | `#1e8e5a` (dot) / `#34d399` (text) | Normal/active status |
| Warning | `#c67c0b` (dot) / `#f59e0b` (text) | Warning status, elevated values |
| Critical | `#c6402e` (dot) / `#ef4444` (text) | Critical status, faults, overloads |

- Radius: `--sm` = 8px (buttons, table rows), `--lg` = 12px (cards, panels)
- Shadows: minimal — this is not a glassmorphism/3D-illustration product
- Typography: **Outfit** (SemiBold for hero numbers/headlines, Medium for labels, Regular for body) at 11px (uppercase labels, 0.66px tracking) / 14px (body) / 16px (card headings) / 22px (page title) / 32px (hero KPI numbers); **IBM Plex Mono** (Medium) for dense tabular telemetry data
- Aesthetic reference: SolarPulse, selectively — icon chips, circular progress rings, rounded status pills, inline sparklines, soft sidebar active states. Explicitly **exclude**: photo backgrounds, 3D illustrations, glassmorphism, decorative copy.
- The original spec described a light theme with dark mode as an optional secondary — that has flipped. **Dark is the primary and only theme currently designed.** Don't build a light mode unless explicitly asked.

---

## Signature component

**Pulse mark** — a dot with a soft outer ring, used as the live-status indicator throughout the app. This is GridSense's visual signature; use it consistently for anything representing a "live" state.

---

## Component build order (already established in Figma — mirror it in code)

1. Pulse mark
2. Alert card
3. Sidebar nav item
4. Buttons (primary / secondary / ghost)
5. KPI card (icon chip, hero number, sparkline, trend arrow + directional color logic, status dot)
6. Table row (dense, mono, inline sparkline slot, status pill)

Build components in this order. Don't jump ahead to a screen that needs component 5 before components 1–4 exist.

---

## Mock data convention: STATIC vs LIVE

Every entity field is either static (fixed at load) or LIVE (jitters to simulate real-time feel). **Only these fields are LIVE** — everything else stays static:

- `currentLoadMW` (Overview KPIs)
- `lastUpdated` (Overview KPIs, and anywhere timestamps are shown)
- `loadMW` / `utilizationPct` (Substation — optional, not all substations need to jitter)
- `loadPct` / `temperatureC` (Transformer — **only on flagged/critical transformers**, not all)
- `durationMinutes` (Alert)

Implementation: a simple utility fired on mount, optionally re-fired on an interval.

```ts
function jitter(base: number, pct: number): number {
  const delta = base * pct * (Math.random() * 2 - 1);
  return base + delta;
}
```

No backend. No persistence. Component-local state only (`useState` + optional `setInterval`, cleared on unmount).

---

## Mock data entities (7 types)

1. **Overview KPIs** — currentLoadMW, peakDemandMW, gridAvailabilityPct, activeOutages, systemLossPct, criticalAlerts, lastUpdated
2. **Substation** — id, name, status, loadMW, capacityMVA, utilizationPct, transformers[]
3. **Transformer** — id, substationId, loadPct, temperatureC, status, healthScore, ageYears, operatingHours
4. **Feeder** — id, name, loadPct, lossPct, status
5. **Alert** — id, severity, title, metric, durationMinutes, expectedImpact, status
6. **Outage** — id, feederId, location, startedAt, customersAffected, probableCause, crew, estimatedRestoration, timeline[]
7. **Work Order** — id, assetId, issue, priority, assignedTeam, dueDate, description, status

Keep field names consistent across every screen that references the same entity — don't rename `loadMW` to `load` on one screen and `loadMw` on another.

---

## Named entities — use these consistently everywhere

- **Mirpur Substation** — primary example substation across screens
- **TR-07** — primary example transformer (asset health, alerts, work orders)
- **F-12** — primary example feeder (alerts, outages)
- **ALT-2048** — example alert/incident ID
- **WO-3311** — example work order ID

Reuse these specific names/IDs across Overview, Live Grid, Substation Details, Asset Health, Outages, and Maintenance screens rather than inventing new ones per screen — this is what makes the mock data feel like a coherent system rather than disconnected placeholders.

---

## Contextual drawer pattern

- Right-side overlay, **not a route/page**.
- Opens on: substation marker click (map) or feeder table row click.
- Content swaps in place when a different entity is clicked — don't unmount/remount the whole drawer.
- Closes via: X button, click-outside, or Escape key.
- Contains a single **"View details →"** CTA that routes to the full detail screen for that entity.
- Alert-panel cards: **open this same drawer**, showing the affected asset (substation/transformer/feeder) with its "View details →" CTA leading to the relevant detail screen. Alerts do not route directly into a separate incident/work-order flow — that flow is reached from the detail screen instead, via a "Create Work Order" action. One interaction pattern for the whole app is simpler to build and easier to demo consistently.

---

## Screen → route map

| Screen | Figma node | Route |
|---|---|---|
| Login | `170:933` | `/login` |
| Overview Dashboard | `49:1711` | `/overview` |
| Contextual Drawer | `70:198` | (overlay, not a route) |
| Live Grid Map | `101:216` | `/live-grid` |
| Substation Details | `114:314` | `/substations/[id]` |
| Feeder Details | `132:270` | `/feeders/[id]` |
| Loss Analysis | `136:356` | `/analytics/loss` |
| Outage Management | `133:360` | `/outages` |
| Energy Analytics | `135:351` | `/analytics/energy` |
| Asset Health | `134:360` | `/assets/[id]` |
| Maintenance | `137:351` | `/maintenance` |
| Settings | `139:351` | `/settings` |
| Reports | `138:825` | `/reports` |

Substation Details and Asset Health are named after specific Figma instances (Kafrul, TR-07) but should be built as **templates parameterized by ID**, not one-offs — so the same detail screen renders correctly for any substation/transformer in the mock data set.

---

## General rules

- Reuse over rebuild — always check existing components first.
- Don't add responsive breakpoints.
- Don't add real backend calls, auth, or persistence.
- Keep mock data changes centralized in the data files — never hardcode entity values inline in a component.
- Commit after each component and each screen, with conventional commit messages (`feat(components): ...`, `feat(screens): ...`).
