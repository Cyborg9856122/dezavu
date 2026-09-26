import type { BusinessTypeConfig } from "./types";

export const salonConfig: BusinessTypeConfig = {
  id: "salon",
  label: "Salon",
  tagline: "Discover the styles and services that suit you.",
  serviceCategories: ["Haircuts", "Hair Color", "Treatments", "Styling"],
  styleCategories: ["Haircut", "Hair Color", "Hairstyle"],
  lookingForOptions: [
    { value: "haircut", label: "New haircut" },
    { value: "color", label: "Hair color" },
    { value: "treatment", label: "Hair treatment" },
    { value: "hairstyle", label: "Hairstyle" },
    { value: "styling", label: "Styling" },
    { value: "complete_look", label: "Complete new look" },
    { value: "not_sure", label: "Not sure — recommend for me" },
  ],
  stylePreferenceOptions: [
    { value: "natural", label: "Natural" },
    { value: "classic", label: "Classic" },
    { value: "modern", label: "Modern" },
    { value: "bold", label: "Bold" },
    { value: "elegant", label: "Elegant" },
    { value: "low_maintenance", label: "Low maintenance" },
    { value: "unsure", label: "I don't know" },
  ],
  stylingTimeOptions: [
    { value: "very_little", label: "Very little" },
    { value: "5_10", label: "5–10 minutes" },
    { value: "10_20", label: "10–20 minutes" },
    { value: "20_plus", label: "20+ minutes" },
  ],
  analysisParameters: [
    { key: "faceShape", label: "Face shape" },
    { key: "estimatedHairLength", label: "Hair length" },
    { key: "hairTexture", label: "Hair texture" },
    { key: "visibleVolume", label: "Volume" },
    { key: "visibleColor", label: "Visible color" },
  ],
};
