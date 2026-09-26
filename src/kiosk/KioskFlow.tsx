import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { KioskHome } from "./KioskHome";
import { ExistingCustomerSearch } from "./ExistingCustomerSearch";
import { ReturningWelcome } from "./ReturningWelcome";
import { CustomerInfoStep, POLICY_VERSION, type CustomerInfoDraft } from "./steps/CustomerInfoStep";
import { PreferencesStep } from "./steps/PreferencesStep";
import { FaceScanStep } from "./steps/FaceScanStep";
import { AnalyzingStep } from "./steps/AnalyzingStep";
import { ResultsStep } from "./steps/ResultsStep";
import { PreviewStep } from "./steps/PreviewStep";
import { SummaryStep } from "./steps/SummaryStep";
import { customerRepo, consultationRepo, id } from "../data/repositories";
import { BUSINESS_ID } from "../data/seed";
import type { Customer, ConsultationPreferences, FaceAnalysis } from "../types/domain";
import type { EngineRecommendation } from "../ai/recommendationEngine";

type Step =
  | "home"
  | "search"
  | "returningWelcome"
  | "customerInfo"
  | "preferences"
  | "scan"
  | "analyzing"
  | "results"
  | "preview"
  | "summary";

const DEFAULT_PREFS: ConsultationPreferences = {
  lookingFor: ["not_sure"],
  stylePreference: "natural",
  amountOfChange: 1,
  stylingTime: "10_20",
};

export function KioskFlow() {
  const [step, setStep] = useState<Step>("home");
  const [origin, setOrigin] = useState<"new" | "returning">("new");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [preferences, setPreferences] = useState<ConsultationPreferences | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [capturedWithCamera, setCapturedWithCamera] = useState(false);
  const [analysis, setAnalysis] = useState<FaceAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<EngineRecommendation[]>([]);
  const [previewRec, setPreviewRec] = useState<EngineRecommendation | null>(null);

  function resetSession() {
    setCustomer(null);
    setPreferences(null);
    setImageDataUrl(null);
    setCapturedWithCamera(false);
    setAnalysis(null);
    setRecommendations([]);
    setPreviewRec(null);
    setStep("home");
  }

  function openExisting(existing: Customer) {
    setCustomer(existing);
    setOrigin("returning");
    setStep("returningWelcome");
  }

  function continuePrevious() {
    if (!customer) return;
    const consultations = consultationRepo
      .getAll()
      .filter((c) => c.customerId === customer.id)
      .sort((a, b) => b.date.localeCompare(a.date));
    setPreferences(consultations[0]?.preferences ?? DEFAULT_PREFS);
    setStep("scan");
  }

  return (
    <AppShell mode="dark" showHeader={step === "home"}>
      {step === "home" && (
        <KioskHome onNewCustomer={() => { setOrigin("new"); setStep("customerInfo"); }} onExistingCustomer={() => setStep("search")} />
      )}

      {step === "search" && (
        <ExistingCustomerSearch onBack={() => setStep("home")} onSelect={openExisting} />
      )}

      {step === "returningWelcome" && customer && (
        <ReturningWelcome
          customer={customer}
          onBack={() => setStep(origin === "new" ? "customerInfo" : "search")}
          onContinuePrevious={continuePrevious}
          onStartNew={() => setStep("preferences")}
        />
      )}

      {step === "customerInfo" && (
        <CustomerInfoStep
          onBack={() => setStep("home")}
          onOpenExisting={openExisting}
          onContinue={(draft: CustomerInfoDraft) => {
            const created: Customer = {
              id: id(),
              businessId: BUSINESS_ID,
              name: draft.name,
              phone: draft.phone,
              email: draft.email || undefined,
              ageRange: draft.ageRange || undefined,
              preferredLanguage: draft.preferredLanguage,
              notes: draft.notes || undefined,
              consent: { status: "granted", timestamp: new Date().toISOString(), policyVersion: POLICY_VERSION },
              preferences: { preferredStyles: [], maintenancePreference: "unspecified", favoriteServiceIds: [], colorPreferences: [] },
              createdAt: new Date().toISOString(),
              lastVisit: null,
              consultationCount: 0,
            };
            customerRepo.create(created);
            setCustomer(created);
            setStep("preferences");
          }}
        />
      )}

      {step === "preferences" && (
        <PreferencesStep
          initial={preferences ?? undefined}
          onBack={() => setStep(origin === "new" ? "customerInfo" : "returningWelcome")}
          onContinue={(prefs) => {
            setPreferences(prefs);
            setStep("scan");
          }}
        />
      )}

      {step === "scan" && (
        <FaceScanStep
          onBack={() => setStep("preferences")}
          onCaptured={(dataUrl, withCamera) => {
            setImageDataUrl(dataUrl);
            setCapturedWithCamera(withCamera);
            setStep("analyzing");
          }}
        />
      )}

      {step === "analyzing" && preferences && (
        <AnalyzingStep
          imageDataUrl={imageDataUrl}
          preferences={preferences}
          onDone={(a, recs) => {
            setAnalysis(a);
            setRecommendations(recs);
            setStep("results");
          }}
          onError={() => setStep("scan")}
        />
      )}

      {step === "results" && (
        <ResultsStep
          recommendations={recommendations}
          onBack={() => setStep("scan")}
          onPreview={(rec) => {
            setPreviewRec(rec);
            setStep("preview");
          }}
          onContinue={() => setStep("summary")}
        />
      )}

      {step === "preview" && previewRec && (
        <PreviewStep
          recommendation={previewRec}
          beforeImageDataUrl={imageDataUrl}
          onBack={() => setStep("results")}
        />
      )}

      {step === "summary" && customer && analysis && (
        <SummaryStep
          customer={customer}
          preferences={preferences ?? DEFAULT_PREFS}
          imageDataUrl={imageDataUrl}
          capturedWithCamera={capturedWithCamera}
          analysis={analysis}
          recommendations={recommendations}
          onDone={resetSession}
        />
      )}
    </AppShell>
  );
}
