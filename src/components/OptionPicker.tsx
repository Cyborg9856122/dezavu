interface Option {
  value: string;
  label: string;
}

interface OptionPickerProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  multi?: boolean;
  tone?: "dark" | "light";
}

export function OptionPicker({ options, value, onChange, multi = false, tone = "dark" }: OptionPickerProps) {
  function toggle(v: string) {
    if (multi) {
      onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
    } else {
      onChange([v]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value.includes(opt.value);
        const base = "rounded-full border px-4 py-2.5 text-[14px] font-medium transition-colors";
        const activeCls =
          tone === "dark"
            ? "border-sage-light bg-sage-light text-ink"
            : "border-sage bg-sage text-cream";
        const inactiveCls =
          tone === "dark"
            ? "border-white/15 text-cream/70 hover:border-white/30"
            : "border-line text-clay hover:border-clay/40";

        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={`${base} ${active ? activeCls : inactiveCls}`}
            aria-pressed={active}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
