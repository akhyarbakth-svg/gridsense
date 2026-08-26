import type { Tone } from "../status";
import type { Transformer } from "@/data/types";

// Figma: 134:606 — risk block with a severity accent down the left edge.
// The assessment is stored mock content, not real inference.

function riskBand(pct: number): { label: string; tone: Tone } {
  if (pct >= 60) return { label: "High Failure Risk", tone: "critical" };
  if (pct >= 25) return { label: "Elevated Failure Risk", tone: "warning" };
  return { label: "Low Failure Risk", tone: "success" };
}

const accent: Record<Tone, string> = {
  critical: "bg-critical",
  warning: "bg-warning",
  success: "bg-success",
  primary: "bg-primary",
  neutral: "bg-slate",
};

const text: Record<Tone, string> = {
  critical: "text-critical",
  warning: "text-warning",
  success: "text-success",
  primary: "text-primary",
  neutral: "text-slate",
};

function Sparkles({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" />
      <path d="M18 15l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z" />
    </svg>
  );
}

export function RiskCard({ transformer }: { transformer: Transformer }) {
  const band = riskBand(transformer.riskPct);

  return (
    <article className="flex items-stretch overflow-hidden rounded-lg border border-hairline">
      <div className={`w-1 shrink-0 ${accent[band.tone]}`} aria-hidden />
      <div className="flex flex-1 flex-col gap-4 bg-surface p-5">
        <div className="flex flex-col gap-1">
          <span className={`flex items-center gap-1.5 ${text[band.tone]}`}>
            <Sparkles className="size-3.5" />
            <span className="text-[11px] font-medium uppercase tracking-[0.66px]">
              AI Risk Assessment
            </span>
          </span>
          <h2 className="text-[22px] font-semibold text-ink">{band.label}</h2>
          <p className={`text-[18px] font-semibold ${text[band.tone]}`}>
            {transformer.riskPct}% probability within{" "}
            {transformer.riskWindowDays} days
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[14px] text-slate">Contributing factors:</p>
          <ul className="flex flex-col gap-2">
            {transformer.riskFactors.map((factor) => (
              <li key={factor} className="flex items-center gap-2">
                <span
                  className={`size-1 shrink-0 rounded-full ${accent[band.tone]}`}
                  aria-hidden
                />
                <span className="text-[14px] text-ink">{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className={`text-[14px] ${text[band.tone]}`}>
          → {transformer.recommendedAction}
        </p>
      </div>
    </article>
  );
}
