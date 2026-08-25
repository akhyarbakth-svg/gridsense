"use client";

import { useEffect, useState } from "react";
import { jitter } from "@/data/jitter";
import type { Alert } from "@/data/types";

const JITTER_PCT = 0.03;
const INTERVAL_MS = 5000;

export function useLiveAlertDuration(base: Alert): Alert {
  const [live, setLive] = useState<Alert>(base);

  useEffect(() => {
    const tick = () => {
      setLive((prev) => ({
        ...prev,
        durationMinutes: jitter(base.durationMinutes, JITTER_PCT),
      }));
    };

    tick();
    const id = setInterval(tick, INTERVAL_MS);
    return () => clearInterval(id);
  }, [base]);

  return live;
}
