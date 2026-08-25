import Link from "next/link";
import type { ReactNode } from "react";

// Figma: 49:1749 (primary), 49:1748 (secondary). 36px tall, 24px side padding,
// 8px radius, 14px Outfit Medium. Ghost is the derived third variant — same metrics,
// no chrome until hover — for low-emphasis actions like "Dismiss".

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "sm";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary/90",
  secondary: "bg-surface border border-hairline text-ink hover:border-slate/60",
  ghost: "text-slate hover:bg-white/5 hover:text-ink",
};

const sizes: Record<ButtonSize, string> = {
  md: "h-9 px-6 text-[14px]",
  sm: "h-8 px-4 text-[13px]",
};

interface BaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Optional leading icon (16px box recommended). */
  icon?: ReactNode;
  className?: string;
}

interface ButtonAsButton extends BaseProps {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

interface ButtonAsLink extends BaseProps {
  href: string;
}

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { children, variant = "primary", size = "md", icon, className = "" } = props;

  const classes = [
    "inline-flex items-center justify-center gap-2 rounded-sm font-medium whitespace-nowrap",
    "transition-[color,border-color,opacity] disabled:opacity-50 disabled:pointer-events-none",
    sizes[size],
    variants[variant],
    className,
  ].join(" ");

  if ("href" in props && props.href !== undefined) {
    return (
      <Link href={props.href} className={classes}>
        {icon}
        {children}
      </Link>
    );
  }

  const { onClick, type = "button", disabled } = props as ButtonAsButton;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {icon}
      {children}
    </button>
  );
}
