import type { Feeder } from "./types";

export const feeders: Feeder[] = [
  { id: "F-12", name: "Feeder F-12", loadPct: 82, lossPct: 4.6, status: "warning" },
  { id: "F-03", name: "Feeder F-03", loadPct: 55, lossPct: 2.1, status: "normal" },
  { id: "F-19", name: "Feeder F-19", loadPct: 96, lossPct: 7.8, status: "critical" },
  { id: "F-05", name: "Feeder F-05", loadPct: 48, lossPct: 1.9, status: "normal" },
  { id: "F-27", name: "Feeder F-27", loadPct: 63, lossPct: 3.2, status: "normal" },
  { id: "F-14", name: "Feeder F-14", loadPct: 71, lossPct: 3.9, status: "warning" },
];
