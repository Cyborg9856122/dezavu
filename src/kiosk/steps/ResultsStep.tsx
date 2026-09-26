import { useState } from "react";
import { BackLink } from "../../components/BackLink";
import { Button } from "../../components/Button";
import { MatchBadge } from "../../components/Badge";
import { useRepositoryAll } from "../../data/useRepository";
import { serviceRepo, styleRepo } from "../../data/repositories";
import type { EngineRecommendation } from "../../ai/recommendationEngine";
import { useI18n } from "../../i18n/I18nContext";

interface ResultsStepProps {
  recommendations: EngineRecommendation[];
  onBack: () => void;
  onPreview: (rec: EngineRecommendation) => void;
  onContinue: () => void;
}

export function ResultsStep({ recommendations, onBack, onPreview, onContinue }: ResultsStepProps) {
  const { t } = useI18n();
  const styles = useRepositoryAll(styleRepo);
  const services = useRepositoryAll(serviceRepo);
  const [expanded, setExpanded] = useState<string | null>(recommendations[0]?.styleId ?? null);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-6 pt-5">
      <BackLink onClick={onBack} />
      <h1 className="mt-4 text-[22px] font-normal text-cream">{t("results.title")}</h1>

      <div className="mt-4 space-y-3">
        {recommendations.map((rec, i) => {
          const style = styles.find((s) => s.id === rec.styleId);
          if (!style) return null;
          const isOpen = expanded === style.id;
          const requiredServices = services.filter((s) => rec.serviceIds.includes(s.id));

          return (
            <div key={rec.styleId} className="rounded-2xl border border-white/10 p-4">
              <button
                onClick={() => setExpanded(isOpen ? null : style.id)}
                className="flex w-full items-start justify-between text-left"
              >
                <div>
                  <p className="text-[11px] text-cream/40">#{i + 1}</p>
                  <p className="text-[16px] font-medium text-cream">{style.name}</p>
                </div>
                <MatchBadge level={rec.matchLevel} />
              </button>

              {isOpen && (
                <div className="mt-3 space-y-3 border-t border-white/10 pt-3">
                  <div>
                    <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-cream/40">
                      {t("results.why")}
                    </p>
                    <ul className="mt-1 space-y-1">
                      {rec.reasons.map((r, idx) => (
                        <li key={idx} className="text-[13px] text-cream/70">
                          • {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-[13px] text-cream/70">
                    {t("results.maintenance")}: <span className="capitalize text-cream">{style.maintenance}</span>
                  </p>
                  {requiredServices.length > 0 && (
                    <p className="text-[13px] text-cream/70">
                      {t("results.recommendedService")}: {requiredServices.map((s) => s.name).join(", ")}
                    </p>
                  )}
                  <Button tone="dark" variant="secondary" onClick={() => onPreview(rec)}>
                    {t("results.preview")}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5">
        <Button tone="dark" onClick={onContinue}>
          {t("common.continue")}
        </Button>
      </div>
    </div>
  );
}
