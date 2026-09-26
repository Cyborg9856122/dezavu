import type { ReactNode } from "react";

interface ChipProps {
  children: ReactNode;
  tone?: "dark" | "light";
  accent?: boolean;
  className?: string;
}

export function Chip({ children, tone = "dark", accent = false, className = "" }: ChipProps) {
  const base = "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em]";

  const palette = accent
    ? tone === "dark"
      ? "bg-sage-light text-ink"
      : "bg-sage text-cream"
    : tone === "dark"
      ? "bg-white/10 text-cream/80"
      : "bg-line text-clay";

  return <span className={`${base} ${palette} ${className}`}>{children}</span>;
}
