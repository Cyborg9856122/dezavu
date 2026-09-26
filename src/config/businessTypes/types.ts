// A business-type config is what keeps "Salon" from being hard-coded through
// the app (Product Spec §1, §33, §50). Every question, category, and label
// the consultation flow shows comes from here — a future Barber or Clinic
// vertical is a new file in this folder, not a rewrite of the screens.

export interface ConsultationQuestionOption {
  value: string;
  label: string;
}

export interface BusinessTypeConfig {
  id: string;
  label: string;
  tagline: string;
  serviceCategories: string[];
  styleCategories: string[];
  lookingForOptions: ConsultationQuestionOption[];
  stylePreferenceOptions: ConsultationQuestionOption[];
  stylingTimeOptions: ConsultationQuestionOption[];
  analysisParameters: { key: string; label: string }[];
}
