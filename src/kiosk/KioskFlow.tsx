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
import { SummaryStep } from "./steps/SummaryStep";
import { customerRepo, consultationRepo, id } from "../data/repositories";
import { BUSINESS_ID } from "../data/seed";
import type { Consultation, Customer, ConsultationPreferences, FaceAnalysis } from "../types/domain";
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
  const [consultationId, setConsultationId] = useState<string | null>(null);

  /**
   * Records the visit on the customer's profile the moment their selections
   * are made, so the visit date and choices are kept even if the session is
   * abandoned before the summary is saved. Later calls in the same session
   * just update the selections.
   */
  function recordVisit(prefs: ConsultationPreferences) {
    if (!customer) return;
    if (consultationId) {
      consultationRepo.update(consultationId, { preferences: prefs });
      return;
    }
    const now = new Date().toISOString();
    const created = consultationRepo.create({
      id: id(),
      businessId: BUSINESS_ID,
      customerId: customer.id,
      scanId: null,
      preferences: prefs,
      recommendationIds: [],
      stylistNotes: "",
      selectedServiceIds: [],
      status: "in_progress",
      date: now,
      shareToken: null,
      shareRevoked: false,
    });
    const latest = customerRepo.getById(customer.id) ?? customer;
    const updated = customerRepo.update(customer.id, {
      lastVisit: now,
      consultationCount: latest.consultationCount + 1,
    });
    if (updated) setCustomer(updated);
    setConsultationId(created.id);
  }

  function resetSession() {
    setConsultationId(null);
    setCustomer(null);
    setPreferences(null);
    setImageDataUrl(null);
    setCapturedWithCamera(false);
    setAnalysis(null);
    setRecommendations([]);
    setStep("home");
  }

  function openExisting(existing: Customer) {
    setCustomer(existing);
    setConsultationId(null);
    setOrigin("returning");
    setStep("returningWelcome");
  }

  /** Starts a new session (the source session is left untouched) reusing a past session's preferences. */
  function continuePrevious(source: Consultation) {
    if (!customer) return;
    const prefs = source.preferences ?? DEFAULT_PREFS;
    setPreferences(prefs);
    recordVisit(prefs);
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
            setConsultationId(null);
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
            recordVisit(prefs);
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
          beforeImageDataUrl={imageDataUrl}
          onBack={() => setStep("scan")}
          onContinue={() => setStep("summary")}
        />
      )}

      {step === "summary" && customer && analysis && (
        <SummaryStep
          customer={customer}
          consultationId={consultationId}
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
