import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Logo } from "../components/Logo";
import { useI18n } from "../i18n/I18nContext";
import { LOCALE_LABEL, type Locale } from "../i18n/strings";
import { useRepositoryAll } from "../data/useRepository";
import { businessRepo } from "../data/repositories";

interface KioskHomeProps {
  onNewCustomer: () => void;
  onExistingCustomer: () => void;
}

export function KioskHome({ onNewCustomer, onExistingCustomer }: KioskHomeProps) {
  const { t, locale, setLocale } = useI18n();
  const businesses = useRepositoryAll(businessRepo);
  const business = businesses[0];

  return (
    <div className="flex flex-1 flex-col items-center justify-between px-8 pb-10 pt-6 text-center">
      <Link to="/admin" className="self-end text-[11px] text-cream/30 hover:text-cream/60">
        ⚙
      </Link>

      <div className="flex flex-1 flex-col items-center justify-center">
        <Logo variant="reversed" className="text-[30px]" />
        {business && <p className="mt-3 text-[14px] text-cream/40">{business.name}</p>}
        <h1 className="mt-8 text-[30px] font-light leading-tight text-cream">{t("home.title")}</h1>
        <p className="mt-2 max-w-xs text-[14px] text-cream/50">{t("app.tagline")}</p>
      </div>

      <div className="flex w-full flex-col gap-3">
        <Button tone="dark" variant="primary" onClick={onNewCustomer}>
          {t("home.newCustomer")}
        </Button>
        <Button tone="dark" variant="secondary" onClick={onExistingCustomer}>
          {t("home.existingCustomer")}
        </Button>

        <div className="mt-2 flex justify-center gap-3">
          {(Object.keys(LOCALE_LABEL) as Locale[]).map((l) => (
            <button
              key={l}
              lang={l}
              onClick={() => setLocale(l)}
              className={`text-[12px] ${locale === l ? "text-cream" : "text-cream/35"}`}
            >
              {LOCALE_LABEL[l]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
