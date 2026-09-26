import { createLocalRepository } from "./localRepository";
import type {
  Business,
  Consultation,
  Customer,
  Feedback,
  GeneratedPreview,
  Recommendation,
  Scan,
  Service,
  StaffUser,
  Style,
} from "../types/domain";

export const businessRepo = createLocalRepository<Business>("businesses");
export const staffRepo = createLocalRepository<StaffUser>("staff");
export const customerRepo = createLocalRepository<Customer>("customers");
export const scanRepo = createLocalRepository<Scan>("scans");
export const consultationRepo = createLocalRepository<Consultation>("consultations");
export const serviceRepo = createLocalRepository<Service>("services");
export const styleRepo = createLocalRepository<Style>("styles");
export const recommendationRepo = createLocalRepository<Recommendation>("recommendations");
export const previewRepo = createLocalRepository<GeneratedPreview>("previews");
export const feedbackRepo = createLocalRepository<Feedback>("feedback");

export const id = () => crypto.randomUUID();
