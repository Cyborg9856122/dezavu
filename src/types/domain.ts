// Core domain model — Product Spec §42. Every business-scoped entity carries
// a businessId so the data layer is multi-tenant-ready even though the
// current repository implementation (src/data) is a single-tenant, local-only
// store. Swapping the repository implementation for a real multi-tenant
// backend later should not require changing these types or any screen.

export type StaffRole = "owner" | "manager" | "stylist" | "receptionist";

export type ThemeMode = "light" | "dark";

export interface Business {
  id: string;
  name: string;
  businessType: string; // e.g. "salon" — see src/config/businessTypes
  logoInitial: string;
  primaryColor: string;
  contact: { phone: string; address: string; hours: string };
  aiSettings: {
    previewGenerationEnabled: boolean;
    disclaimer: string;
  };
  privacy: {
    dataRetentionDays: number;
  };
  /** Optional so businesses saved before this setting existed still load; see useAppearance. */
  appearance?: {
    kioskTheme: ThemeMode;
    adminTheme: ThemeMode;
  };
  subscription: {
    plan: "starter" | "professional" | "business" | "enterprise";
    aiScanLimit: number;
    aiScansUsed: number;
    staffLimit: number;
    locationLimit: number;
  };
}

export interface StaffUser {
  id: string;
  businessId: string;
  name: string;
  email: string;
  role: StaffRole;
  status: "active" | "inactive";
}

export type ConsentStatus = "granted" | "declined" | "not_asked";

export interface ConsentRecord {
  status: ConsentStatus;
  timestamp: string | null;
  policyVersion: string;
}

export interface ConsultationPreferences {
  lookingFor: string[]; // "haircut" | "color" | "treatment" | "hairstyle" | "styling" | "complete_look" | "not_sure"
  stylePreference: string; // "natural" | "classic" | "modern" | "bold" | "elegant" | "low_maintenance" | "unsure"
  amountOfChange: 0 | 1 | 2; // small / moderate / big
  stylingTime: "very_little" | "5_10" | "10_20" | "20_plus";
}

export interface CustomerPreferences {
  preferredStyles: string[];
  maintenancePreference: "low" | "medium" | "high" | "unspecified";
  favoriteServiceIds: string[];
  colorPreferences: string[];
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email?: string;
  ageRange?: string;
  preferredLanguage?: "en" | "ar" | "ku";
  notes?: string;
  consent: ConsentRecord;
  preferences: CustomerPreferences;
  createdAt: string;
  lastVisit: string | null;
  consultationCount: number;
}

export interface FaceAnalysis {
  // Placeholder AI output — see src/ai/analyzeFace.ts. Shape mirrors what a
  // real vision model would return so swapping the implementation later is a
  // one-file change.
  faceShape: "oval" | "round" | "square" | "heart" | "long";
  estimatedHairLength: "very_short" | "short" | "medium" | "long" | "very_long";
  hairTexture: "straight" | "wavy" | "curly" | "coily";
  visibleVolume: "low" | "medium" | "high";
  visibleColor: string;
  stylingConsiderations: string[];
  aiModel: string;
  aiModelVersion: string;
  analyzedAt: string;
}

export interface Scan {
  id: string;
  customerId: string;
  businessId: string;
  imageDataUrl: string | null;
  capturedWithCamera: boolean;
  date: string;
  analysis: FaceAnalysis | null;
  consentRef: ConsentStatus;
}

export type MatchLevel = "strong" | "good" | "consider";
export type StylistDecision = "pending" | "accepted" | "modified" | "rejected";

export interface Recommendation {
  id: string;
  consultationId: string;
  styleId: string;
  serviceIds: string[];
  reasons: string[];
  matchLevel: MatchLevel;
  score: number; // internal ranking only — never shown to the customer as a %
  aiModel: string;
  aiModelVersion: string;
  stylistDecision: StylistDecision;
  stylistNote?: string;
}

export interface GeneratedPreview {
  id: string;
  consultationId: string;
  scanId: string;
  styleId: string;
  isPlaceholder: true;
  createdAt: string;
}

export interface Feedback {
  id: string;
  consultationId: string;
  rating: 1 | 2 | 3 | 4 | 5 | null;
  chosenRecommendedStyle: "yes" | "no" | "partially" | null;
  comment?: string;
}

export type ConsultationStatus = "in_progress" | "saved" | "shared";

export interface Consultation {
  id: string;
  businessId: string;
  customerId: string;
  scanId: string | null;
  preferences: ConsultationPreferences;
  recommendationIds: string[];
  stylistNotes: string;
  selectedServiceIds: string[];
  status: ConsultationStatus;
  date: string;
  shareToken: string | null;
  shareRevoked: boolean;
}

export interface Service {
  id: string;
  businessId: string;
  category: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  active: boolean;
  suitableCharacteristics: string[];
  recommendedMaintenance: "low" | "medium" | "high";
  aiRecommendationEligible: boolean;
}

export interface Style {
  id: string;
  businessId: string;
  name: string;
  category: string;
  description: string;
  maintenance: "low" | "medium" | "high";
  suitableFaceShapes: FaceAnalysis["faceShape"][];
  suitableHairLength: FaceAnalysis["estimatedHairLength"][];
  keywords: string[]; // matched against stylePreference / lookingFor
  requiredServiceIds: string[];
  aiEligible: boolean;
}
