import { salonConfig } from "./businessTypes/salon";
import type { BusinessTypeConfig, ConsultationQuestionOption } from "./businessTypes/types";
import type { ConsultationPreferences } from "../types/domain";

// The single swap point for which vertical is active (Product Spec §50).
// A future Barber/Clinic/Skincare launch adds a sibling config file and
// changes this one import — no screen or engine code changes.
export const activeBusinessType: BusinessTypeConfig = salonConfig;

const optionLabel = (options: ConsultationQuestionOption[], value: string) =>
  options.find((o) => o.value === value)?.label ?? value;

const CHANGE_LABELS = ["Small", "Moderate", "Big"];

/** Human-readable labels for a consultation's selections, from the active vertical's config. */
export function describePreferences(prefs: ConsultationPreferences) {
  return {
    lookingFor: prefs.lookingFor.map((v) => optionLabel(activeBusinessType.lookingForOptions, v)).join(", ") || "—",
    stylePreference: prefs.stylePreference
      ? optionLabel(activeBusinessType.stylePreferenceOptions, prefs.stylePreference)
      : "—",
    amountOfChange: CHANGE_LABELS[prefs.amountOfChange],
    stylingTime: optionLabel(activeBusinessType.stylingTimeOptions, prefs.stylingTime),
  };
}
