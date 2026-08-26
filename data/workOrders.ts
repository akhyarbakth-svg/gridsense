import type { WorkOrder } from "./types";

export const workOrders: WorkOrder[] = [
  {
    id: "WO-3290",
    assetId: "TR-07",
    issue: "Oil sample analysis",
    priority: "low",
    assignedTeam: "Lab Services",
    dueDate: "2025-06-12",
    description: "Routine dissolved gas analysis. Result: normal.",
    status: "completed",
  },
  {
    id: "WO-3255",
    assetId: "TR-07",
    issue: "Preventive maintenance",
    priority: "medium",
    assignedTeam: "Crew Alpha-3",
    dueDate: "2025-01-08",
    description: "Scheduled service — bushings cleaned, gaskets checked.",
    status: "completed",
  },
  {
    id: "WO-3198",
    assetId: "TR-07",
    issue: "Bushing replacement",
    priority: "high",
    assignedTeam: "Crew Alpha-3",
    dueDate: "2024-07-20",
    description: "HV bushing showing tracking; replaced under outage window.",
    status: "completed",
  },
  {
    id: "WO-3140",
    assetId: "TR-07",
    issue: "DGA test — elevated gases",
    priority: "high",
    assignedTeam: "Lab Services",
    dueDate: "2024-02-15",
    description: "Elevated acetylene detected; retest scheduled.",
    status: "completed",
  },
  {
    id: "WO-3301",
    assetId: "TR-21",
    issue: "Cooling fan replacement",
    priority: "urgent",
    assignedTeam: "Crew Bravo-1",
    dueDate: "2025-07-29",
    description: "Bank 2 cooling fan seized; replaced on site.",
    status: "completed",
  },
  {
    id: "WO-3282",
    assetId: "TR-22",
    issue: "Thermal survey",
    priority: "medium",
    assignedTeam: "Crew Bravo-1",
    dueDate: "2025-04-18",
    description: "Infrared survey of terminations. No hotspots found.",
    status: "completed",
  },
  {
    id: "WO-3270",
    assetId: "TR-31",
    issue: "Commissioning inspection",
    priority: "low",
    assignedTeam: "Crew Delta-5",
    dueDate: "2024-09-30",
    description: "Post-commissioning checks completed and signed off.",
    status: "completed",
  },
  {
    id: "WO-3311",
    assetId: "TR-07",
    issue: "Transformer overload — inspect cooling system",
    priority: "urgent",
    assignedTeam: "Crew Alpha-3",
    dueDate: "2026-08-27",
    description:
      "TR-07 at Mirpur Substation has exceeded 85% load with rising temperature. Inspect cooling fans and oil levels.",
    status: "open",
  },
  {
    id: "WO-3312",
    assetId: "TR-21",
    issue: "Critical health score — schedule replacement assessment",
    priority: "high",
    assignedTeam: "Crew Bravo-1",
    dueDate: "2026-08-29",
    description:
      "TR-21 at Uttara Substation has a health score of 38 and 21 years of age. Assess for replacement.",
    status: "in_progress",
  },
  {
    id: "WO-3313",
    assetId: "F-12",
    issue: "Feeder loss above threshold",
    priority: "medium",
    assignedTeam: "Crew Charlie-2",
    dueDate: "2026-09-02",
    description: "F-12 loss percentage has remained above 4% for over an hour. Inspect line connections.",
    status: "open",
  },
];

/** Work orders raised against a given asset, newest due date first. */
export function workOrdersForAsset(assetId: string): WorkOrder[] {
  return workOrders
    .filter((order) => order.assetId === assetId)
    .sort((a, b) => b.dueDate.localeCompare(a.dueDate));
}
