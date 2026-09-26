import type { HairStyle } from "../components/FaceAvatar";
import type { Style } from "../types/domain";

/**
 * PLACEHOLDER — swap point for a real image-generation API (Product Spec
 * §11). Today this just maps a style's category/name to one of the abstract
 * FaceAvatar renders so the "Preview This Look" screen has something
 * consistent to show. A real implementation would call an image model with
 * the customer's scan + style reference and return a generated image URL.
 */
export function styleToAvatarProps(style: Style): { hairColor: string; style: HairStyle } {
  const colorByCategory: Record<string, string> = {
    "Hair Color": "#8B4A2B",
    Haircut: "#2A2521",
    Hairstyle: "#3A2E24",
  };

  const nameToStyle: Record<string, HairStyle> = {
    "Textured Pixie": "buzz",
    "Classic Bob": "crop",
    "Shoulder-Length Layers": "crop",
    "Soft Curtain Bangs": "wave",
    "Wolf Cut": "wave",
    "Long Layers": "long",
    "Golden Balayage": "long",
    "Ash Blonde": "crop",
    "Copper Red": "crop",
    "Dark Chocolate Brown": "long",
    "Smooth & Sleek Finish": "crop",
  };

  return {
    hairColor: colorByCategory[style.category] ?? "#3A2E24",
    style: nameToStyle[style.name] ?? "crop",
  };
}
