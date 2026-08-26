import { notFound } from "next/navigation";
import { AssetHealthScreen } from "@/components/asset/AssetHealthScreen";
import { substations } from "@/data/substations";

const transformers = substations.flatMap((s) => s.transformers);

/** Pre-render a page for every transformer in the mock data set. */
export function generateStaticParams() {
  return transformers.map((transformer) => ({ id: transformer.id }));
}

export default async function AssetHealthPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const transformer = transformers.find((t) => t.id === id);

  if (!transformer) notFound();

  return <AssetHealthScreen transformer={transformer} />;
}
