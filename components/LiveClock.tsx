"use client";

import { useEffect, useState } from "react";
import { PulseMark } from "./PulseMark";

// Live timestamp shown in the page header. Renders a placeholder on the server
// to avoid hydration mismatch, then ticks every second on the client.
export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Set state only from callbacks (rAF for the first paint, interval thereafter)
    // so the server render stays a hydration-safe placeholder.
    const raf = requestAnimationFrame(() => setNow(new Date()));
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  const time = now ? now.toLocaleTimeString("en-US", { hour12: false }) : "--:--:--";

  return (
    <div className="flex items-center gap-2 text-[13px] font-mono text-slate">
      <PulseMark status="success" />
      <span>Live · {time}</span>
    </div>
  );
}
