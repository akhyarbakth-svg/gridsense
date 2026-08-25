export default async function FeederDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div>Feeder Details — {id}</div>;
}
