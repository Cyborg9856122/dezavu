import type {
  ConsultationPreferences,
  FaceAnalysis,
  MatchLevel,
  Service,
  Style,
} from "../types/domain";

export interface EngineRecommendation {
  styleId: string;
  serviceIds: string[];
  reasons: string[];
  matchLevel: MatchLevel;
  score: number;
}

const LOOKING_FOR_TO_CATEGORY: Record<string, string[]> = {
  haircut: ["Haircut"],
  color: ["Hair Color"],
  hairstyle: ["Hairstyle"],
  styling: ["Hairstyle"],
  complete_look: ["Haircut", "Hair Color", "Hairstyle"],
  treatment: [],
  not_sure: [],
};

const CHANGE_LABEL = ["a small change", "a moderate change", "a bigger change"];

/**
 * The recommendation engine — deliberately kept independent of both the UI
 * and the (placeholder) AI analysis step, per Product Spec §32:
 *
 *   Customer Data → Image Analysis → Preferences → Service Catalog →
 *   Recommendation Engine → Recommended Styles/Services → Stylist Review
 *
 * Real scoring logic today; only analyzeFace() upstream is a stub. Swapping
 * in a real vision model later does not require changing anything here.
 */
export function generateRecommendations(input: {
  analysis: FaceAnalysis | null;
  preferences: ConsultationPreferences;
  styles: Style[];
  services: Service[];
  limit?: number;
}): EngineRecommendation[] {
  const { analysis, preferences, styles, services, limit = 3 } = input;
  const categoryMatches = LOOKING_FOR_TO_CATEGORY;
  const wantedCategories = new Set(preferences.lookingFor.flatMap((v) => categoryMatches[v] ?? []));

  const activeServiceIds = new Set(services.filter((s) => s.active).map((s) => s.id));

  const scored = styles
    .filter((style) => style.aiEligible && style.requiredServiceIds.every((id) => activeServiceIds.has(id)))
    .map((style) => {
      let score = 0;
      const reasons: string[] = [];

      if (analysis && style.suitableFaceShapes.includes(analysis.faceShape)) {
        score += 0.3;
        reasons.push("Complements your estimated face proportions");
      }

      if (analysis && style.suitableHairLength.includes(analysis.estimatedHairLength)) {
        score += 0.15;
        reasons.push("Compatible with the characteristics detected in your scan");
      }

      if (preferences.stylePreference && style.keywords.includes(preferences.stylePreference)) {
        score += 0.25;
        reasons.push("Matches your selected style preference");
      }

      if (wantedCategories.size > 0 && wantedCategories.has(style.category)) {
        score += 0.15;
        reasons.push(`Fits what you're looking for today`);
      }

      // Maintenance alignment with styling time / amount of change.
      const wantsLowMaintenance =
        preferences.stylingTime === "very_little" || preferences.stylingTime === "5_10";
      if (wantsLowMaintenance && style.maintenance === "low") {
        score += 0.15;
        reasons.push("Relatively easy to maintain, matching your styling routine");
      } else if (!wantsLowMaintenance) {
        score += 0.05;
      }

      score += 0.1 - Math.abs(preferences.amountOfChange - 1) * 0.02; // mild neutrality bonus
      reasons.push(`Fits your requested maintenance level and ${CHANGE_LABEL[preferences.amountOfChange]}`);

      return { style, score: Math.min(1, score), reasons: reasons.slice(0, 3) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(({ style, score, reasons }) => ({
    styleId: style.id,
    serviceIds: style.requiredServiceIds,
    reasons,
    matchLevel: matchLevelFor(score),
    score,
  }));
}

function matchLevelFor(score: number): MatchLevel {
  if (score >= 0.65) return "strong";
  if (score >= 0.4) return "good";
  return "consider";
}

export const MATCH_LEVEL_LABEL: Record<MatchLevel, string> = {
  strong: "Strong Match",
  good: "Good Match",
  consider: "Worth Considering",
};
