import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  /** Which screen this button sits on — decides which sage the guide calls for (2.5). */
  tone?: "dark" | "light";
  fullWidth?: boolean;
}

/**
 * Sage is the accent for "this is the after" (2.5). Dark screens (the device
 * default) use Sage Light for contrast against ink; light screens use Sage.
 */
export function Button({
  children,
  variant = "primary",
  tone = "dark",
  fullWidth = true,
  className = "",
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const width = fullWidth ? "w-full" : "";

  const variants: Record<string, string> = {
    primary:
      tone === "dark"
        ? "bg-sage-light text-ink hover:brightness-105"
        : "bg-sage text-cream hover:brightness-110",
    secondary:
      tone === "dark"
        ? "bg-white/[0.06] text-cream border border-white/15 hover:bg-white/[0.1]"
        : "bg-white text-ink border border-line hover:bg-cream",
    ghost:
      tone === "dark"
        ? "text-cream/70 hover:text-cream"
        : "text-clay hover:text-ink",
  };

  return (
    <button className={`${base} ${width} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
