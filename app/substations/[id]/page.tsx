import { notFound } from "next/navigation";
import { SubstationDetailScreen } from "@/components/substation/SubstationDetailScreen";
import { substations } from "@/data/substations";

/** Pre-render a page for every substation in the mock data set. */
export function generateStaticParams() {
  return substations.map((substation) => ({ id: substation.id }));
}

export default async function SubstationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const substation = substations.find((s) => s.id === id);

  if (!substation) notFound();

  return <SubstationDetailScreen substation={substation} />;
}
