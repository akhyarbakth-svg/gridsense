export default async function AssetHealthPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div>Asset Health — {id}</div>;
}
