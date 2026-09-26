import { businessRepo } from "./repositories";
import { useRepositoryAll } from "./useRepository";
import type { Business, ThemeMode } from "../types/domain";

type Surface = "kiosk" | "admin";
export type Appearance = NonNullable<Business["appearance"]>;

/** Each surface is designed in one mode; the other mode is produced by inverting the brand tokens. */
const NATIVE_THEME: Record<Surface, ThemeMode> = { kiosk: "dark", admin: "light" };

export const DEFAULT_APPEARANCE: Appearance = { kioskTheme: "dark", adminTheme: "light" };

export function useAppearance(): Appearance {
  const business = useRepositoryAll(businessRepo)[0];
  return { ...DEFAULT_APPEARANCE, ...business?.appearance };
}

/**
 * Classes for a surface's root element. `theme-inverted` swaps the colour
 * tokens (see index.css), so every existing cream/ink/sage utility inside
 * flips without per-component changes.
 */
export function useThemeClass(surface: Surface): string {
  const appearance = useAppearance();
  const theme = surface === "kiosk" ? appearance.kioskTheme : appearance.adminTheme;
  return `${theme === NATIVE_THEME[surface] ? "" : "theme-inverted"} theme-${theme}`;
}
