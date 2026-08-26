// Node placement for the Dhaka grid schematic (Figma 101:343).
// Percentages of the canvas so the diagram holds at any panel width.
// Presentation geometry only — deliberately kept out of the entity files.

export interface SchematicNode {
  id: string;
  xPct: number;
  yPct: number;
}

/** Substations. Mirpur sits at the hub, matching the design's centre node. */
export const substationNodes: SchematicNode[] = [
  { id: "SUB-MIRPUR", xPct: 54, yPct: 45 },
  { id: "SUB-GULSHAN", xPct: 87, yPct: 25 },
  { id: "SUB-UTTARA", xPct: 74, yPct: 72 },
  { id: "SUB-BANANI", xPct: 21, yPct: 62 },
];

/** Transformer nodes, placed near their parent substation. */
export const transformerNodes: SchematicNode[] = [
  { id: "TR-07", xPct: 44, yPct: 34 },
  { id: "TR-08", xPct: 46, yPct: 57 },
  { id: "TR-12", xPct: 77, yPct: 16 },
  { id: "TR-13", xPct: 80, yPct: 35 },
  { id: "TR-21", xPct: 65, yPct: 82 },
  { id: "TR-22", xPct: 85, yPct: 82 },
  { id: "TR-31", xPct: 13, yPct: 51 },
];

/** Feeder tap points along the distribution lines. */
export const feederNodes: SchematicNode[] = [
  { id: "F-12", xPct: 36, yPct: 46 },
  { id: "F-03", xPct: 68, yPct: 35 },
  { id: "F-19", xPct: 64, yPct: 58 },
  { id: "F-05", xPct: 33, yPct: 55 },
  { id: "F-27", xPct: 90, yPct: 48 },
  { id: "F-14", xPct: 47, yPct: 71 },
];

/** Transmission links between substations. */
export const substationLinks: [string, string][] = [
  ["SUB-MIRPUR", "SUB-GULSHAN"],
  ["SUB-MIRPUR", "SUB-UTTARA"],
  ["SUB-MIRPUR", "SUB-BANANI"],
  ["SUB-GULSHAN", "SUB-UTTARA"],
];

/** Which substation each transformer hangs off, for the feeder spurs. */
export const transformerParents: Record<string, string> = {
  "TR-07": "SUB-MIRPUR",
  "TR-08": "SUB-MIRPUR",
  "TR-12": "SUB-GULSHAN",
  "TR-13": "SUB-GULSHAN",
  "TR-21": "SUB-UTTARA",
  "TR-22": "SUB-UTTARA",
  "TR-31": "SUB-BANANI",
};
