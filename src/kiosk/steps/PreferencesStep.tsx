import { useState } from "react";
import { BackLink } from "../../components/BackLink";
import { Button } from "../../components/Button";
import { OptionPicker } from "../../components/OptionPicker";
import { ChangeSlider } from "../../components/ChangeSlider";
import { activeBusinessType } from "../../config/activeBusinessType";
import type { ConsultationPreferences } from "../../types/domain";
import { useI18n } from "../../i18n/I18nContext";

interface PreferencesStepProps {
  initial?: ConsultationPreferences;
  onBack: () => void;
  onContinue: (prefs: ConsultationPreferences) => void;
}

const DEFAULT: ConsultationPreferences = {
  lookingFor: [],
  stylePreference: "",
  amountOfChange: 1,
  stylingTime: "10_20",
};

export function PreferencesStep({ initial, onBack, onContinue }: PreferencesStepProps) {
  const { t } = useI18n();
  const [prefs, setPrefs] = useState<ConsultationPreferences>(initial ?? DEFAULT);

  const canContinue = prefs.lookingFor.length > 0 && prefs.stylePreference !== "";

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-6 pt-5">
      <BackLink onClick={onBack} />

      <div className="mt-5 space-y-7">
        <section>
          <p className="mb-3 text-[15px] font-medium text-cream">{t("preferences.lookingFor")}</p>
          <OptionPicker
            options={activeBusinessType.lookingForOptions}
            value={prefs.lookingFor}
            onChange={(v) => setPrefs({ ...prefs, lookingFor: v })}
            multi
          />
        </section>

        <section>
          <p className="mb-3 text-[15px] font-medium text-cream">{t("preferences.stylePreference")}</p>
          <OptionPicker
            options={activeBusinessType.stylePreferenceOptions}
            value={prefs.stylePreference ? [prefs.stylePreference] : []}
            onChange={(v) => setPrefs({ ...prefs, stylePreference: v[0] ?? "" })}
          />
        </section>

        <section>
          <p className="mb-3 text-[15px] font-medium text-cream">{t("preferences.amountOfChange")}</p>
          <ChangeSlider value={prefs.amountOfChange} onChange={(v) => setPrefs({ ...prefs, amountOfChange: v })} />
        </section>

        <section>
          <p className="mb-3 text-[15px] font-medium text-cream">{t("preferences.stylingTime")}</p>
          <OptionPicker
            options={activeBusinessType.stylingTimeOptions}
            value={[prefs.stylingTime]}
            onChange={(v) => setPrefs({ ...prefs, stylingTime: v[0] as ConsultationPreferences["stylingTime"] })}
          />
        </section>
      </div>

      <div className="mt-6">
        <Button tone="dark" disabled={!canContinue} onClick={() => onContinue(prefs)}>
          {t("common.continue")}
        </Button>
      </div>
    </div>
  );
}
