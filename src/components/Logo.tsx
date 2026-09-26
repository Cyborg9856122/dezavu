type LogoVariant = "primary" | "reversed" | "echo" | "monogram";

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
}

/**
 * The Dezavu wordmark. Flat, single colour, no effects — per Brand Guidelines 2.1/2.2.
 * "echo" adds a faint ghosted duplicate (the name's own idea: seeing it twice)
 * and is reserved for the website header / first slide / box, per 2.2.
 */
export function Logo({ variant = "primary", className = "" }: LogoProps) {
  if (variant === "monogram") {
    return (
      <div
        className={`flex items-center justify-center rounded-[22%] bg-ink text-cream ${className}`}
        aria-label="Dezavu"
      >
        <span className="font-medium" style={{ fontSize: "0.58em" }}>
          D
        </span>
      </div>
    );
  }

  const color = variant === "reversed" ? "text-cream" : "text-ink";

  if (variant === "echo") {
    return (
      <span className={`relative inline-block font-medium uppercase tracking-[0.34em] ${color} ${className}`} aria-label="Dezavu">
        <span aria-hidden className="absolute left-[3px] top-0 -z-10 opacity-20 select-none">
          DEZAVU
        </span>
        <span>DEZAVU</span>
      </span>
    );
  }

  return (
    <span className={`font-medium uppercase tracking-[0.34em] ${color} ${className}`}>
      DEZAVU
    </span>
  );
}
