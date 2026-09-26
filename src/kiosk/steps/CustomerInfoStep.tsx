import { useMemo, useState, type ReactNode } from "react";
import { BackLink } from "../../components/BackLink";
import { Button } from "../../components/Button";
import { useRepositoryAll } from "../../data/useRepository";
import { customerRepo } from "../../data/repositories";
import type { Customer } from "../../types/domain";
import { useI18n } from "../../i18n/I18nContext";

export interface CustomerInfoDraft {
  name: string;
  phone: string;
  email: string;
  ageRange: string;
  preferredLanguage: "en" | "ar" | "ku";
  notes: string;
  consent: boolean;
}

interface CustomerInfoStepProps {
  onBack: () => void;
  onContinue: (draft: CustomerInfoDraft) => void;
  onOpenExisting: (customer: Customer) => void;
}

const POLICY_VERSION = "1.0";
export { POLICY_VERSION };

export function CustomerInfoStep({ onBack, onContinue, onOpenExisting }: CustomerInfoStepProps) {
  const { t } = useI18n();
  const customers = useRepositoryAll(customerRepo);
  const [draft, setDraft] = useState<CustomerInfoDraft>({
    name: "",
    phone: "",
    email: "",
    ageRange: "",
    preferredLanguage: "en",
    notes: "",
    consent: false,
  });
  const [dismissedMatch, setDismissedMatch] = useState(false);

  const match = useMemo(() => {
    if (dismissedMatch || draft.phone.trim().length < 6) return undefined;
    return customers.find((c) => c.phone.replace(/\s/g, "") === draft.phone.replace(/\s/g, ""));
  }, [customers, draft.phone, dismissedMatch]);

  const canContinue = draft.name.trim().length > 0 && draft.phone.trim().length > 0 && draft.consent;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-6 pt-5">
      <BackLink onClick={onBack} />
      <h1 className="mt-4 text-[22px] font-normal text-cream">{t("customerInfo.title")}</h1>

      <div className="mt-5 space-y-3">
        <Field label={t("customerInfo.name")} required>
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[14px] text-cream outline-none focus:border-sage-light/60"
          />
        </Field>

        <Field label={t("customerInfo.phone")} required>
          <input
            value={draft.phone}
            onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[14px] text-cream outline-none focus:border-sage-light/60"
          />
        </Field>

        {match && (
          <div className="rounded-xl border border-sage-light/40 bg-sage-light/10 p-4">
            <p className="text-[13px] text-cream">{t("customerInfo.existingMatch")}</p>
            <div className="mt-3 flex gap-2">
              <Button tone="dark" variant="primary" fullWidth={false} onClick={() => onOpenExisting(match)}>
                {t("customerInfo.openExisting")}
              </Button>
              <Button tone="dark" variant="secondary" fullWidth={false} onClick={() => setDismissedMatch(true)}>
                {t("customerInfo.createAnyway")}
              </Button>
            </div>
          </div>
        )}

        <Field label={`${t("customerInfo.email")} (${t("common.optional")})`}>
          <input
            value={draft.email}
            onChange={(e) => setDraft({ ...draft, email: e.target.value })}
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[14px] text-cream outline-none focus:border-sage-light/60"
          />
        </Field>

        <Field label={`${t("customerInfo.notes")} (${t("common.optional")})`}>
          <textarea
            value={draft.notes}
            onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            rows={2}
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[14px] text-cream outline-none focus:border-sage-light/60"
          />
        </Field>

        <label className="flex items-start gap-3 rounded-xl border border-white/10 p-4">
          <input
            type="checkbox"
            checked={draft.consent}
            onChange={(e) => setDraft({ ...draft, consent: e.target.checked })}
            className="mt-0.5 h-4 w-4 accent-[#9DB07F]"
          />
          <span className="text-[13px] leading-relaxed text-cream/70">{t("consent.body")}</span>
        </label>
      </div>

      <div className="mt-6">
        <Button tone="dark" disabled={!canContinue} onClick={() => onContinue(draft)}>
          {t("common.continue")}
        </Button>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-cream/50">
        {label}
        {required && <span className="text-sage-light"> *</span>}
      </span>
      {children}
    </label>
  );
}
