import { PageHeader } from "@/components/PageHeader";

export default async function FeederDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PageHeader title="Feeder Details" breadcrumb={["Assets", "Feeders", id]} />
  );
}
