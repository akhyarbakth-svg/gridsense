"use client";

import { useEffect, useState } from "react";
import { jitter } from "@/data/jitter";
import type { Substation } from "@/data/types";

const JITTER_PCT = 0.03;
const INTERVAL_MS = 5000;

/** Optional per-substation jitter for loadMW / utilizationPct. Not all substations need this. */
export function useLiveSubstation(base: Substation): Substation {
  const [live, setLive] = useState<Substation>(base);

  useEffect(() => {
    const tick = () => {
      setLive((prev) => ({
        ...prev,
        loadMW: jitter(base.loadMW, JITTER_PCT),
        utilizationPct: jitter(base.utilizationPct, JITTER_PCT),
      }));
    };

    tick();
    const id = setInterval(tick, INTERVAL_MS);
    return () => clearInterval(id);
  }, [base]);

  return live;
}
