import type { WorkOrder } from "./types";

export const workOrders: WorkOrder[] = [
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
