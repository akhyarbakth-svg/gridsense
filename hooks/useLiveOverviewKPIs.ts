"use client";

import { useEffect, useState } from "react";
import { jitter } from "@/data/jitter";
import { overviewKPIs } from "@/data/overview";
import type { OverviewKPIs } from "@/data/types";

const JITTER_PCT = 0.03;
// Overview reads as a live console, so the load figure and its timestamp
// re-jitter every second. Only the two fields CLAUDE.md marks LIVE move.
const INTERVAL_MS = 1000;

export function useLiveOverviewKPIs(): OverviewKPIs {
  const [live, setLive] = useState<OverviewKPIs>(overviewKPIs);

  useEffect(() => {
    const tick = () => {
      setLive((prev) => ({
        ...prev,
        currentLoadMW: jitter(overviewKPIs.currentLoadMW, JITTER_PCT),
        lastUpdated: new Date().toISOString(),
      }));
    };

    tick();
    const id = setInterval(tick, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return live;
}
