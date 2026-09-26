import { BackLink } from "../../components/BackLink";
import { Button } from "../../components/Button";
import { FaceAvatar } from "../../components/FaceAvatar";
import { BeforeAfterSlider } from "../../components/BeforeAfterSlider";
import { styleToAvatarProps } from "../../ai/generatePreview";
import { useRepositoryAll } from "../../data/useRepository";
import { businessRepo, styleRepo } from "../../data/repositories";
import type { EngineRecommendation } from "../../ai/recommendationEngine";
import { useI18n } from "../../i18n/I18nContext";

interface PreviewStepProps {
  recommendation: EngineRecommendation;
  beforeImageDataUrl: string | null;
  onBack: () => void;
}

export function PreviewStep({ recommendation, beforeImageDataUrl, onBack }: PreviewStepProps) {
  const { t } = useI18n();
  const styles = useRepositoryAll(styleRepo);
  const businesses = useRepositoryAll(businessRepo);
  const style = styles.find((s) => s.id === recommendation.styleId);
  const disclaimer = businesses[0]?.aiSettings.disclaimer ?? t("results.previewDisclaimer");

  if (!style) return null;
  const avatar = styleToAvatarProps(style);

  const beforeContent = beforeImageDataUrl ? (
    <img src={beforeImageDataUrl} alt="Before" className="h-full w-full object-cover" />
  ) : (
    <FaceAvatar hairColor="#5B4A3A" style="natural" className="h-[60%] w-auto" />
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col px-6 pb-6 pt-5">
      <BackLink onClick={onBack} />

      <BeforeAfterSlider
        className="mt-4 min-h-0 flex-1"
        before={beforeContent}
        after={<FaceAvatar {...avatar} className="h-[60%] w-auto" />}
      />

      <p className="mt-4 text-center text-[16px] font-medium text-cream">{style.name}</p>
      <p className="mt-1 text-center text-[12px] text-cream/40">{disclaimer}</p>

      <div className="mt-4">
        <Button tone="dark" onClick={onBack}>
          {t("common.back")}
        </Button>
      </div>
    </div>
  );
}
