// Placeholder geometry for the grid network map (Figma 49:1782, "geodata pending").
// Positions are percentages of the map canvas so the layout holds at any card width.
// Kept out of the entity files: these are presentation coordinates, not grid facts.

export interface MapPoint {
  id: string;
  xPct: number;
  yPct: number;
}

/** Substation markers — rendered as circles. */
export const substationPoints: MapPoint[] = [
  { id: "SUB-MIRPUR", xPct: 14, yPct: 24 },
  { id: "SUB-GULSHAN", xPct: 42, yPct: 16 },
  { id: "SUB-UTTARA", xPct: 69, yPct: 30 },
  { id: "SUB-BANANI", xPct: 30, yPct: 62 },
];

/** Transformer markers — rendered as squares, offset near their parent substation. */
export const transformerPoints: MapPoint[] = [
  { id: "TR-07", xPct: 24, yPct: 41 },
  { id: "TR-08", xPct: 8, yPct: 48 },
  { id: "TR-12", xPct: 52, yPct: 34 },
  { id: "TR-13", xPct: 37, yPct: 8 },
  { id: "TR-21", xPct: 80, yPct: 52 },
  { id: "TR-22", xPct: 62, yPct: 12 },
  { id: "TR-31", xPct: 45, yPct: 76 },
];

/** Transmission lines drawn between substations (by id). */
export const mapConnections: [string, string][] = [
  ["SUB-MIRPUR", "SUB-GULSHAN"],
  ["SUB-GULSHAN", "SUB-UTTARA"],
  ["SUB-MIRPUR", "SUB-BANANI"],
  ["SUB-BANANI", "SUB-UTTARA"],
];

/** Fault markers for the Outage Management map (Figma 133:505), by outage id. */
export const outagePoints: MapPoint[] = [
  { id: "OUT-5501", xPct: 37, yPct: 42 },
  { id: "OUT-5502", xPct: 62, yPct: 60 },
  { id: "OUT-5503", xPct: 22, yPct: 68 },
  { id: "OUT-5504", xPct: 78, yPct: 34 },
];
