import { notFound } from "next/navigation";
import { FeederDetailScreen } from "@/components/feeder/FeederDetailScreen";
import { feeders } from "@/data/feeders";

/** Pre-render a page for every feeder in the mock data set. */
export function generateStaticParams() {
  return feeders.map((feeder) => ({ id: feeder.id }));
}

export default async function FeederDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const feeder = feeders.find((f) => f.id === id);

  if (!feeder) notFound();

  return <FeederDetailScreen feeder={feeder} />;
}
