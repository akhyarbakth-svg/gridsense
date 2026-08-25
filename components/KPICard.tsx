import type { ReactNode } from "react";
import { PulseMark, type PulseStatus } from "./PulseMark";
import { toneText, toneStroke, type Tone } from "./status";

// Figma: 49:1761 (stat) — 216x146, 12px radius, 24px padding, 12px gap.
//        49:1751 (donut) — 208x160, 20px padding, 64px ring.
// Two visually distinct layouts share one card shell, selected by `variant`.

const shell =
  "flex flex-col rounded-lg border border-hairline bg-surface overflow-hidden";

const labelCls =
  "text-[11px] font-medium uppercase tracking-[0.66px] text-slate";

interface KPICardCommon {
  label: string;
  className?: string;
}

interface KPIStatProps extends KPICardCommon {
  variant?: "stat";
  /** Hero number, pre-formatted with its unit — e.g. "1,284 MW". */
  value: string;
  /** Status/trend line under the hero number. */
  status?: string;
  statusTone?: Tone;
  /** Show the live pulse mark beside the status line. */
  pulse?: boolean;
  pulseStatus?: PulseStatus;
  /** Optional sparkline / trend arrow slot. */
  chart?: ReactNode;
}

interface KPIDonutProps extends KPICardCommon {
  variant: "donut";
  /** 0–100; drives the ring fill. */
  percent: number;
  /** Big value beside the ring — e.g. "99.82%". */
  value: string;
  /** Caption under the value — e.g. "Within SLA". */
  caption?: string;
  captionTone?: Tone;
  ringTone?: Tone;
  /** Footer line — e.g. "Target 99.9% · rolling 30 d". */
  footer?: string;
}

export type KPICardProps = KPIStatProps | KPIDonutProps;

// Ring geometry copied from the Figma donut: 64px box, r=28, 8px stroke.
const RING_SIZE = 64;
const RING_RADIUS = 28;
const RING_STROKE = 8;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function DonutRing({ percent, tone }: { percent: number; tone: Tone }) {
  const clamped = Math.max(0, Math.min(100, percent));
  const filled = (clamped / 100) * CIRCUMFERENCE;

  return (
    <svg
      width={RING_SIZE}
      height={RING_SIZE}
      viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
      className="shrink-0"
      role="img"
      aria-label={`${clamped}%`}
    >
      <circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_RADIUS}
        fill="none"
        stroke="var(--color-hairline)"
        strokeWidth={RING_STROKE}
      />
      <circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_RADIUS}
        fill="none"
        stroke={toneStroke[tone]}
        strokeWidth={RING_STROKE}
        strokeDasharray={`${filled} ${CIRCUMFERENCE - filled}`}
        strokeLinecap="butt"
        transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
      />
    </svg>
  );
}

export function KPICard(props: KPICardProps) {
  if (props.variant === "donut") {
    const {
      label,
      percent,
      value,
      caption,
      captionTone = "success",
      ringTone = "primary",
      footer,
      className = "",
    } = props;

    return (
      <section className={`${shell} gap-3 p-5 ${className}`}>
        <p className={labelCls}>{label}</p>
        <div className="flex items-center gap-4">
          <DonutRing percent={percent} tone={ringTone} />
          <div className="flex flex-col gap-1">
            <p className="text-[22px] font-semibold text-ink">{value}</p>
            {caption && (
              <p className={`text-[14px] ${toneText[captionTone]}`}>{caption}</p>
            )}
          </div>
        </div>
        {footer && <p className="text-[14px] text-slate">{footer}</p>}
      </section>
    );
  }

  const {
    label,
    value,
    status,
    statusTone = "neutral",
    pulse = false,
    pulseStatus = "normal",
    chart,
    className = "",
  } = props;

  return (
    <section className={`${shell} gap-3 p-6 ${className}`}>
      <p className={labelCls}>{label}</p>
      <p className="text-[32px] font-semibold leading-none text-ink">{value}</p>
      {chart}
      {status && (
        <div className="flex items-center gap-2">
          {pulse && <PulseMark status={pulseStatus} size={8} />}
          <p className={`font-mono text-[14px] ${toneText[statusTone]}`}>
            {status}
          </p>
        </div>
      )}
    </section>
  );
}
