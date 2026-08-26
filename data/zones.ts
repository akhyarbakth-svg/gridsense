import { substations } from "./substations";
import type { Substation } from "./types";

// Location hierarchy for the Live Grid Map tree (Figma 101:306):
// Dhaka Distribution > zone > substations.
//
// The Figma tree names Kafrul SS and Pallabi SS, which don't exist in the mock
// data set. Rather than invent substations, the four real ones are grouped into
// the three zones the design shows, keeping the named entities consistent.

export interface Zone {
  id: string;
  name: string;
  substationIds: string[];
}

export const DISTRIBUTION_NAME = "Dhaka distribution";

export const zones: Zone[] = [
  { id: "ZONE-MIRPUR", name: "Mirpur zone", substationIds: ["SUB-MIRPUR"] },
  {
    id: "ZONE-GULSHAN",
    name: "Gulshan zone",
    substationIds: ["SUB-GULSHAN", "SUB-BANANI"],
  },
  { id: "ZONE-UTTARA", name: "Uttara zone", substationIds: ["SUB-UTTARA"] },
];

export function substationsInZone(zone: Zone): Substation[] {
  return zone.substationIds
    .map((id) => substations.find((s) => s.id === id))
    .filter((s): s is Substation => Boolean(s));
}
