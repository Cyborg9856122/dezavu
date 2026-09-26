import { useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { MatchBadge } from "../../components/Badge";
import { useRepositoryAll } from "../../data/useRepository";
import { customerRepo, id, recommendationRepo, scanRepo, serviceRepo, styleRepo, consultationRepo } from "../../data/repositories";
import { BUSINESS_ID } from "../../data/seed";
import type { Consultation, ConsultationPreferences, Customer, FaceAnalysis, StylistDecision } from "../../types/domain";
import type { EngineRecommendation } from "../../ai/recommendationEngine";
import { useI18n } from "../../i18n/I18nContext";

interface SummaryStepProps {
  customer: Customer;
  preferences: ConsultationPreferences;
  imageDataUrl: string | null;
  capturedWithCamera: boolean;
  analysis: FaceAnalysis;
  recommendations: EngineRecommendation[];
  onDone: () => void;
}

export function SummaryStep({
  customer,
  preferences,
  imageDataUrl,
  capturedWithCamera,
  analysis,
  recommendations,
  onDone,
}: SummaryStepProps) {
  const { t } = useI18n();
  const styles = useRepositoryAll(styleRepo);
  const services = useRepositoryAll(serviceRepo);
  const [decisions, setDecisions] = useState<Record<string, StylistDecision>>(() =>
    Object.fromEntries(recommendations.map((r) => [r.styleId, "accepted" as StylistDecision])),
  );
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState<Consultation | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);

  const selectedServiceIds = useMemo(() => {
    const ids = new Set<string>();
    recommendations.forEach((r) => {
      if (decisions[r.styleId] !== "rejected") r.serviceIds.forEach((sid) => ids.add(sid));
    });
    return [...ids];
  }, [recommendations, decisions]);

  function handleSave() {
    const scan = scanRepo.create({
      id: id(),
      customerId: customer.id,
      businessId: BUSINESS_ID,
      imageDataUrl,
      capturedWithCamera,
      date: new Date().toISOString(),
      analysis,
      consentRef: customer.consent.status,
    });

    const recIds = recommendations.map((r) => {
      const rec = recommendationRepo.create({
        id: id(),
        consultationId: "", // filled after consultation is created
        styleId: r.styleId,
        serviceIds: r.serviceIds,
        reasons: r.reasons,
        matchLevel: r.matchLevel,
        score: r.score,
        aiModel: "placeholder-recommendation-engine",
        aiModelVersion: "0.0.0-mock",
        stylistDecision: decisions[r.styleId] ?? "pending",
      });
      return rec.id;
    });

    const consultation = consultationRepo.create({
      id: id(),
      businessId: BUSINESS_ID,
      customerId: customer.id,
      scanId: scan.id,
      preferences,
      recommendationIds: recIds,
      stylistNotes: notes,
      selectedServiceIds,
      status: "saved",
      date: new Date().toISOString(),
      shareToken: null,
      shareRevoked: false,
    });

    recIds.forEach((recId) => recommendationRepo.update(recId, { consultationId: consultation.id }));

    customerRepo.update(customer.id, {
      lastVisit: consultation.date,
      consultationCount: customer.consultationCount + 1,
    });

    setSaved(consultation);
  }

  function handleShare() {
    if (!saved) return;
    const token = crypto.randomUUID().slice(0, 8);
    consultationRepo.update(saved.id, { shareToken: token, status: "shared" });
    setShareLink(`dezavu.app/s/${token}`);
  }

  if (saved) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-light/20">
          <span className="text-[22px] text-sage-light">✓</span>
        </div>
        <p className="text-[18px] font-medium text-cream">{t("summary.title")}</p>
        <p className="text-[13px] text-cream/50">Saved to {customer.name}'s profile.</p>

        {shareLink ? (
          <div className="mt-2 rounded-xl border border-white/10 px-4 py-3">
            <p className="text-[12px] text-cream/50">Share link (revocable)</p>
            <p className="text-[14px] text-sage-light">{shareLink}</p>
          </div>
        ) : (
          <Button tone="dark" variant="secondary" fullWidth={false} onClick={handleShare}>
            {t("summary.share")}
          </Button>
        )}

        <div className="mt-4 w-full">
          <Button tone="dark" onClick={onDone}>
            {t("summary.startNew")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-6 pt-5">
      <h1 className="text-[22px] font-normal text-cream">{t("summary.title")}</h1>
      <p className="mt-1 text-[13px] text-cream/50">{customer.name}</p>

      <div className="mt-4 space-y-3">
        {recommendations.map((r) => {
          const style = styles.find((s) => s.id === r.styleId);
          if (!style) return null;
          const decision = decisions[r.styleId];
          return (
            <div key={r.styleId} className="rounded-xl border border-white/10 p-3">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-medium text-cream">{style.name}</p>
                <MatchBadge level={r.matchLevel} />
              </div>
              <div className="mt-2 flex gap-2">
                {(["accepted", "modified", "rejected"] as StylistDecision[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDecisions({ ...decisions, [style.id]: d })}
                    className={`rounded-full border px-3 py-1 text-[12px] font-medium capitalize ${
                      decision === d
                        ? "border-sage-light bg-sage-light text-ink"
                        : "border-white/15 text-cream/60"
                    }`}
                  >
                    {d === "accepted" ? t("review.accept") : d === "modified" ? t("review.modify") : t("review.reject")}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <p className="mb-1.5 text-[12px] font-medium text-cream/50">{t("summary.notes")}</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="e.g. Customer wants lower maintenance than the AI suggestion."
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[14px] text-cream outline-none focus:border-sage-light/60"
        />
      </div>

      <div className="mt-4">
        <p className="mb-1.5 text-[12px] font-medium text-cream/50">{t("summary.services")}</p>
        <ul className="space-y-1">
          {services
            .filter((s) => selectedServiceIds.includes(s.id))
            .map((s) => (
              <li key={s.id} className="flex justify-between text-[13px] text-cream/80">
                <span>{s.name}</span>
                <span className="text-cream/40">${s.price}</span>
              </li>
            ))}
        </ul>
      </div>

      <div className="mt-6">
        <Button tone="dark" onClick={handleSave}>
          {t("summary.save")}
        </Button>
      </div>
    </div>
  );
}
