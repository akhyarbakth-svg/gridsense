"use client";

import { useEffect, useState } from "react";
import { jitter } from "@/data/jitter";
import type { Substation } from "@/data/types";

const JITTER_PCT = 0.03;
const INTERVAL_MS = 5000;

/**
 * One live snapshot of a substation for a whole screen, so every panel reading
 * the same field shows the same number. Calling useLiveSubstation and
 * useLiveTransformer separately per panel gives each its own random draw, which
 * makes the load in one panel disagree with the load in another.
 *
 * Jitters exactly the fields CLAUDE.md marks LIVE:
 *   - Substation.loadMW / utilizationPct
 *   - Transformer.loadPct / temperatureC, on flagged transformers only
 */
export function useLiveSubstationDetail(base: Substation): Substation {
  const [live, setLive] = useState<Substation>(base);

  useEffect(() => {
    const tick = () => {
      setLive({
        ...base,
        loadMW: jitter(base.loadMW, JITTER_PCT),
        utilizationPct: jitter(base.utilizationPct, JITTER_PCT),
        transformers: base.transformers.map((transformer) =>
          transformer.status === "normal"
            ? transformer
            : {
                ...transformer,
                loadPct: jitter(transformer.loadPct, JITTER_PCT),
                temperatureC: jitter(transformer.temperatureC, JITTER_PCT),
              }
        ),
      });
    };

    tick();
    const id = setInterval(tick, INTERVAL_MS);
    return () => clearInterval(id);
  }, [base]);

  // Until the effect re-runs for a newly selected substation, `live` still holds
  // the previous one — fall back to the static base so no stale figures flash.
  return live.id === base.id ? live : base;
}
