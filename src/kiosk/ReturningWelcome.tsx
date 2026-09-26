import { BackLink } from "../components/BackLink";
import { Button } from "../components/Button";
import { timeAgo } from "../lib/format";
import { useI18n } from "../i18n/I18nContext";
import type { Customer } from "../types/domain";

interface ReturningWelcomeProps {
  customer: Customer;
  onBack: () => void;
  onContinuePrevious: () => void;
  onStartNew: () => void;
}

export function ReturningWelcome({ customer, onBack, onContinuePrevious, onStartNew }: ReturningWelcomeProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-1 flex-col justify-between px-6 pb-8 pt-5">
      <BackLink onClick={onBack} />

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <h1 className="text-[24px] font-light text-cream">
          {t("returning.welcomeBack")}, {customer.name.split(" ")[0]}
        </h1>
        <p className="mt-2 text-[14px] text-cream/50">
          {t("returning.lastVisit")} {timeAgo(customer.lastVisit)}.
        </p>
        {customer.preferences.preferredStyles.length > 0 && (
          <p className="mt-3 text-[13px] text-cream/40">
            Usually goes for: {customer.preferences.preferredStyles.join(", ")}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Button tone="dark" variant="primary" onClick={onContinuePrevious}>
          {t("returning.continuePrevious")}
        </Button>
        <Button tone="dark" variant="secondary" onClick={onStartNew}>
          {t("returning.startNew")}
        </Button>
      </div>
    </div>
  );
}
