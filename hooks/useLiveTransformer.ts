"use client";

import { useEffect, useState } from "react";
import { jitter } from "@/data/jitter";
import type { Transformer } from "@/data/types";

const JITTER_PCT = 0.03;
const INTERVAL_MS = 5000;

/** Only flagged/critical transformers jitter loadPct / temperatureC — not all transformers. */
export function useLiveTransformer(base: Transformer): Transformer {
  const [live, setLive] = useState<Transformer>(base);
  const isFlagged = base.status === "warning" || base.status === "critical";

  useEffect(() => {
    if (!isFlagged) return;

    const tick = () => {
      setLive((prev) => ({
        ...prev,
        loadPct: jitter(base.loadPct, JITTER_PCT),
        temperatureC: jitter(base.temperatureC, JITTER_PCT),
      }));
    };

    tick();
    const id = setInterval(tick, INTERVAL_MS);
    return () => clearInterval(id);
  }, [base, isFlagged]);

  return live;
}
