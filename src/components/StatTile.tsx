interface StatTileProps {
  label: string;
  value: string | number;
  hint?: string;
}

export function StatTile({ label, value, hint }: StatTileProps) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-clay">{label}</p>
      <p className="mt-2 text-[28px] font-light text-ink">{value}</p>
      {hint && <p className="mt-1 text-[12px] text-clay">{hint}</p>}
    </div>
  );
}
