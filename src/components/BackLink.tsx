interface BackLinkProps {
  onClick: () => void;
  tone?: "dark" | "light";
  label?: string;
}

export function BackLink({ onClick, tone = "dark", label = "Back" }: BackLinkProps) {
  const color = tone === "dark" ? "text-cream/50 hover:text-cream/80" : "text-clay hover:text-ink";
  return (
    <button onClick={onClick} className={`flex items-center gap-1 text-[13px] transition-colors ${color}`}>
      <span aria-hidden>‹</span>
      {label}
    </button>
  );
}
