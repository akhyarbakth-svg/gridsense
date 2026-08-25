export default async function SubstationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div>Substation Details — {id}</div>;
}
