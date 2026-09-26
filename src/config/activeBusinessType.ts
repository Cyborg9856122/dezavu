import { salonConfig } from "./businessTypes/salon";
import type { BusinessTypeConfig } from "./businessTypes/types";

// The single swap point for which vertical is active (Product Spec §50).
// A future Barber/Clinic/Skincare launch adds a sibling config file and
// changes this one import — no screen or engine code changes.
export const activeBusinessType: BusinessTypeConfig = salonConfig;
