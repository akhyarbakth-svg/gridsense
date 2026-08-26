import { MaintenanceScreen } from "@/components/maintenance/MaintenanceScreen";

export default async function MaintenancePage({
  searchParams,
}: {
  searchParams: Promise<{ asset?: string }>;
}) {
  // Read the incoming asset on the server rather than with useSearchParams:
  // that hook forces the whole subtree to render client-side only, leaving the
  // page blank until hydration.
  const { asset } = await searchParams;

  return <MaintenanceScreen presetAssetId={asset} />;
}
