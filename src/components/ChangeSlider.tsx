const STEPS = [
  { value: 0 as const, label: "Small change" },
  { value: 1 as const, label: "Moderate change" },
  { value: 2 as const, label: "Big change" },
];

interface ChangeSliderProps {
  value: 0 | 1 | 2;
  onChange: (value: 0 | 1 | 2) => void;
}

export function ChangeSlider({ value, onChange }: ChangeSliderProps) {
  return (
    <div>
      <div className="relative mt-2 h-1.5 rounded-full bg-white/15">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-sage-light transition-all"
          style={{ width: `${(value / 2) * 100}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-between px-0.5">
          {STEPS.map((step) => (
            <button
              key={step.value}
              type="button"
              onClick={() => onChange(step.value)}
              aria-label={step.label}
              className={`h-5 w-5 -translate-y-0 rounded-full border-2 transition-colors ${
                value >= step.value ? "border-sage-light bg-sage-light" : "border-white/30 bg-ink"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="mt-3 flex justify-between text-[12px] text-cream/50">
        {STEPS.map((step) => (
          <span key={step.value} className={value === step.value ? "text-cream" : ""}>
            {step.label}
          </span>
        ))}
      </div>
    </div>
  );
}
