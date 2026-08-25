import { PageHeader } from "@/components/PageHeader";

export default async function SubstationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PageHeader
      title="Substation Details"
      breadcrumb={["Assets", "Substations", id]}
    />
  );
}
