import { useState } from "react";
import { BackLink } from "../../components/BackLink";
import { Button } from "../../components/Button";
import { MatchBadge } from "../../components/Badge";
import { FaceAvatar } from "../../components/FaceAvatar";
import { BeforeAfterSlider } from "../../components/BeforeAfterSlider";
import { styleToAvatarProps } from "../../ai/generatePreview";
import { useRepositoryAll } from "../../data/useRepository";
import { businessRepo, serviceRepo, styleRepo } from "../../data/repositories";
import type { EngineRecommendation } from "../../ai/recommendationEngine";
import { useI18n } from "../../i18n/I18nContext";

interface ResultsStepProps {
  recommendations: EngineRecommendation[];
  beforeImageDataUrl: string | null;
  onBack: () => void;
  onContinue: () => void;
}

/**
 * Recommendations and the before/after preview on one screen: the slider
 * shows the selected look, and the recommended looks sit underneath as
 * visual options — tapping one swaps the "after".
 */
export function ResultsStep({ recommendations, beforeImageDataUrl, onBack, onContinue }: ResultsStepProps) {
  const { t } = useI18n();
  const styles = useRepositoryAll(styleRepo);
  const services = useRepositoryAll(serviceRepo);
  const businesses = useRepositoryAll(businessRepo);
  const [selectedId, setSelectedId] = useState<string | null>(recommendations[0]?.styleId ?? null);

  const selected = recommendations.find((r) => r.styleId === selectedId) ?? recommendations[0];
  const style = selected ? styles.find((s) => s.id === selected.styleId) : undefined;
  const requiredServices = selected ? services.filter((s) => selected.serviceIds.includes(s.id)) : [];
  const disclaimer = businesses[0]?.aiSettings.disclaimer ?? t("results.previewDisclaimer");

  const beforeContent = beforeImageDataUrl ? (
    <img src={beforeImageDataUrl} alt="Before" className="h-full w-full object-cover" />
  ) : (
    <FaceAvatar hairColor="#5B4A3A" style="natural" className="h-[60%] w-auto" />
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col px-6 pb-6 pt-5">
      <BackLink onClick={onBack} />
      <h1 className="mt-3 text-[22px] font-normal text-cream">{t("results.title")}</h1>

      {style && (
        <BeforeAfterSlider
          className="mt-3 min-h-[220px] flex-1"
          before={beforeContent}
          after={<FaceAvatar {...styleToAvatarProps(style)} className="h-[60%] w-auto" />}
        />
      )}
      <p className="mt-2 text-center text-[11px] text-cream/40">{disclaimer}</p>

      <div className="mt-3 flex gap-3 overflow-x-auto pb-1" role="radiogroup" aria-label={t("results.title")}>
        {recommendations.map((rec) => {
          const option = styles.find((s) => s.id === rec.styleId);
          if (!option) return null;
          const active = rec.styleId === selected?.styleId;
          return (
            <button
              key={rec.styleId}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelectedId(rec.styleId)}
              className={`w-28 shrink-0 rounded-2xl border p-2 text-center transition-colors ${
                active ? "border-sage-light bg-sage-light/10" : "border-white/10 hover:border-white/25"
              }`}
            >
              <div className="flex h-20 items-center justify-center rounded-xl bg-surround-dark">
                <FaceAvatar {...styleToAvatarProps(option)} className="h-16 w-auto" />
              </div>
              <p className={`mt-1.5 text-[12px] leading-tight ${active ? "text-cream" : "text-cream/60"}`}>
                {option.name}
              </p>
            </button>
          );
        })}
      </div>

      {selected && style && (
        <div className="mt-3 max-h-[28vh] overflow-y-auto rounded-2xl border border-white/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[16px] font-medium text-cream">{style.name}</p>
            <MatchBadge level={selected.matchLevel} />
          </div>
          <ul className="mt-2 space-y-1">
            {selected.reasons.map((r, idx) => (
              <li key={idx} className="text-[13px] text-cream/70">
                • {r}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[13px] text-cream/70">
            {t("results.maintenance")}: <span className="capitalize text-cream">{style.maintenance}</span>
          </p>
          {requiredServices.length > 0 && (
            <p className="text-[13px] text-cream/70">
              {t("results.recommendedService")}: {requiredServices.map((s) => s.name).join(", ")}
            </p>
          )}
        </div>
      )}

      <div className="mt-4">
        <Button tone="dark" onClick={onContinue}>
          {t("common.continue")}
        </Button>
      </div>
    </div>
  );
}
