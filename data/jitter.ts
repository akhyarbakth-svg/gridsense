export function jitter(base: number, pct: number): number {
  const delta = base * pct * (Math.random() * 2 - 1);
  return base + delta;
}
