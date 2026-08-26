"use client";

import { useCallback, useState } from "react";
import { Drawer, type DrawerTarget } from "../Drawer";
import { PageHeader } from "../PageHeader";
import { substations } from "@/data/substations";
import { useLiveSubstationDetail } from "@/hooks/useLiveSubstationDetail";
import { GridSchematic } from "./GridSchematic";
import { NetworkTree } from "./NetworkTree";
import { SelectedAssetPanel } from "./SelectedAssetPanel";
import { TelemetryBar } from "./TelemetryBar";

// Figma: 101:216. Holds the one piece of state the whole screen shares — which
// substation is selected — so the tree, the map highlight, the side panel and
// the telemetry strip all move together. The contextual drawer from the
// Overview screen is reused as-is for entity detail.

const DEFAULT_SUBSTATION = "SUB-MIRPUR";

export function LiveGridScreen() {
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_SUBSTATION);
  const [target, setTarget] = useState<DrawerTarget | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const open = useCallback((next: DrawerTarget) => {
    setTarget(next);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const selected =
    substations.find((s) => s.id === selectedId) ?? substations[0];

  // One live snapshot feeds both the side panel and the telemetry strip so the
  // same field never shows two different numbers.
  const live = useLiveSubstationDetail(selected);

  return (
    <>
      <PageHeader title="Live Grid Map" breadcrumb={["Monitor", "Live Grid"]} />

      <div className="flex flex-col gap-4">
        <div className="flex h-[620px] overflow-hidden rounded-lg border border-hairline bg-surface">
          <NetworkTree selectedId={selectedId} onSelect={setSelectedId} />
          <GridSchematic
            selectedId={selectedId}
            onSelect={setSelectedId}
            onOpen={open}
          />
          <SelectedAssetPanel substation={live} />
        </div>

        <TelemetryBar substation={live} />
      </div>

      <Drawer target={target} open={drawerOpen} onClose={closeDrawer} />
    </>
  );
}
