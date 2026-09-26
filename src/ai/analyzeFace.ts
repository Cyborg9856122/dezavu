import type { FaceAnalysis } from "../types/domain";

/**
 * PLACEHOLDER — swap point for a real vision-model API call.
 *
 * Returns a plausible-looking FaceAnalysis after a short delay, so the rest
 * of the product (recommendation engine, consultation record, dashboard)
 * can be built and tested against a stable shape. Replace the body of this
 * function with a real API call; nothing else in the app needs to change,
 * since every caller only depends on the FaceAnalysis type.
 */
export async function analyzeFace(_imageDataUrl: string | null): Promise<FaceAnalysis> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const faceShapes: FaceAnalysis["faceShape"][] = ["oval", "round", "square", "heart", "long"];
  const hairLengths: FaceAnalysis["estimatedHairLength"][] = ["very_short", "short", "medium", "long", "very_long"];
  const textures: FaceAnalysis["hairTexture"][] = ["straight", "wavy", "curly", "coily"];
  const volumes: FaceAnalysis["visibleVolume"][] = ["low", "medium", "high"];
  const colors = ["Dark brown", "Black", "Medium brown", "Light brown", "Blonde", "Auburn"];

  const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

  return {
    faceShape: pick(faceShapes),
    estimatedHairLength: pick(hairLengths),
    hairTexture: pick(textures),
    visibleVolume: pick(volumes),
    visibleColor: pick(colors),
    stylingConsiderations: ["Even porosity", "Natural parting detected"],
    aiModel: "placeholder-vision",
    aiModelVersion: "0.0.0-mock",
    analyzedAt: new Date().toISOString(),
  };
}
