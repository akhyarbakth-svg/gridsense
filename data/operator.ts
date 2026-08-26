/**
 * The signed-in operator. Extracted from the Sidebar so the profile shown in
 * the nav and the profile edited in Settings cannot drift apart.
 *
 * Not one of the CLAUDE.md entities — there is no auth in this app, this is
 * just the display identity for the UI shell.
 */
export interface Operator {
  initials: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  company: string;
}

export const operator: Operator = {
  initials: "AB",
  name: "A. Bakth",
  role: "Senior Energy Infrastructure Administrator",
  email: "a.bakth@gridsense.io",
  phone: "+880 1711 452 908",
  company: "Dhaka Power Distribution Company",
};
