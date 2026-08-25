"use client";

import { useEffect, useState } from "react";
import { jitter } from "@/data/jitter";
import { overviewKPIs } from "@/data/overview";
import type { OverviewKPIs } from "@/data/types";

const JITTER_PCT = 0.03;
const INTERVAL_MS = 5000;

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
