import { PageHeader } from "@/components/PageHeader";

export default async function AssetHealthPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PageHeader title="Asset Health" breadcrumb={["Assets", "Asset Health", id]} />
  );
}
