import { useEffect, useState } from "react";
import { analyzeFace } from "../../ai/analyzeFace";
import { generateRecommendations, type EngineRecommendation } from "../../ai/recommendationEngine";
import { useRepositoryAll } from "../../data/useRepository";
import { serviceRepo, styleRepo } from "../../data/repositories";
import type { ConsultationPreferences, FaceAnalysis } from "../../types/domain";
import { useI18n } from "../../i18n/I18nContext";

interface AnalyzingStepProps {
  imageDataUrl: string | null;
  preferences: ConsultationPreferences;
  onDone: (analysis: FaceAnalysis, recommendations: EngineRecommendation[]) => void;
  onError: () => void;
}

export function AnalyzingStep({ imageDataUrl, preferences, onDone, onError }: AnalyzingStepProps) {
  const { t } = useI18n();
  const [stage, setStage] = useState(0);
  const styles = useRepositoryAll(styleRepo);
  const services = useRepositoryAll(serviceRepo);

  useEffect(() => {
    let cancelled = false;
    const stageTimer = window.setTimeout(() => setStage(1), 1100);

    analyzeFace(imageDataUrl)
      .then((analysis) => {
        if (cancelled) return;
        const recs = generateRecommendations({ analysis, preferences, styles, services });
        window.setTimeout(() => !cancelled && onDone(analysis, recs), 900);
      })
      .catch(() => !cancelled && onError());

    return () => {
      cancelled = true;
      window.clearTimeout(stageTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 animate-ping rounded-full bg-sage-light/25" />
        <div className="absolute inset-3 rounded-full bg-sage-light" />
      </div>
      <p className="text-[14px] text-cream/60">{stage === 0 ? t("analyzing.step1") : t("analyzing.step2")}</p>
    </div>
  );
}
