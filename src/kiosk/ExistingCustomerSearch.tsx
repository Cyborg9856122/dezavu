import { useMemo, useState } from "react";
import { BackLink } from "../components/BackLink";
import { useRepositoryAll } from "../data/useRepository";
import { customerRepo } from "../data/repositories";
import { timeAgo } from "../lib/format";
import { useI18n } from "../i18n/I18nContext";
import type { Customer } from "../types/domain";

interface ExistingCustomerSearchProps {
  onBack: () => void;
  onSelect: (customer: Customer) => void;
}

export function ExistingCustomerSearch({ onBack, onSelect }: ExistingCustomerSearchProps) {
  const { t } = useI18n();
  const customers = useRepositoryAll(customerRepo);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const sorted = [...customers].sort((a, b) => (b.lastVisit ?? "").localeCompare(a.lastVisit ?? ""));
    const q = query.trim().toLowerCase();
    if (!q) return sorted.slice(0, 8);
    return sorted.filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.id.includes(q));
  }, [customers, query]);

  return (
    <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
      <BackLink onClick={onBack} />
      <h1 className="mt-4 text-[22px] font-normal text-cream">{t("search.title")}</h1>

      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("search.placeholder")}
        className="mt-4 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[14px] text-cream outline-none focus:border-sage-light/60"
      />

      <div className="mt-4 flex-1 space-y-2.5 overflow-y-auto">
        {results.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            className="flex w-full items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-left hover:border-white/25"
          >
            <div>
              <p className="text-[14px] font-medium text-cream">{c.name}</p>
              <p className="text-[12px] text-cream/40">{c.phone}</p>
            </div>
            <div className="text-right">
              <p className="text-[12px] text-cream/40">
                {t("search.lastConsultation")} {timeAgo(c.lastVisit)}
              </p>
              <p className="text-[12px] text-cream/40">
                {c.consultationCount} {t("search.consultations")}
              </p>
            </div>
          </button>
        ))}
        {results.length === 0 && <p className="mt-6 text-center text-[13px] text-cream/40">No customers found.</p>}
      </div>
    </div>
  );
}
