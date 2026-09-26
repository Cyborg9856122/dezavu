import {
  businessRepo,
  consultationRepo,
  customerRepo,
  id,
  recommendationRepo,
  scanRepo,
  serviceRepo,
  staffRepo,
  styleRepo,
} from "./repositories";
import type {
  Business,
  Consultation,
  Customer,
  Recommendation,
  Scan,
  Service,
  StaffUser,
  Style,
} from "../types/domain";

export const BUSINESS_ID = "biz_demo_salon";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export function seedIfEmpty() {
  if (businessRepo.getAll().length > 0) return;

  const business: Business = {
    id: BUSINESS_ID,
    name: "Aurora Hair Studio",
    businessType: "salon",
    logoInitial: "A",
    primaryColor: "#566349",
    contact: { phone: "+964 750 000 0000", address: "Erbil, Iraq", hours: "10:00 – 20:00" },
    aiSettings: {
      previewGenerationEnabled: true,
      disclaimer: "AI-generated preview — actual results may vary.",
    },
    privacy: { dataRetentionDays: 365 },
    subscription: {
      plan: "professional",
      aiScanLimit: 500,
      aiScansUsed: 0,
      staffLimit: 10,
      locationLimit: 1,
    },
  };
  businessRepo.create(business);

  const staff: StaffUser[] = [
    { id: id(), businessId: BUSINESS_ID, name: "Amira Hassan", email: "amira@aurorahair.com", role: "owner", status: "active" },
    { id: id(), businessId: BUSINESS_ID, name: "Noor Ali", email: "noor@aurorahair.com", role: "stylist", status: "active" },
    { id: id(), businessId: BUSINESS_ID, name: "Lana Saeed", email: "lana@aurorahair.com", role: "receptionist", status: "active" },
  ];
  staff.forEach((s) => staffRepo.create(s));

  const services: Service[] = [
    { id: id(), businessId: BUSINESS_ID, category: "Haircuts", name: "Precision Haircut", description: "A full consultation and cut, finished with a blow-dry.", price: 35, durationMinutes: 45, active: true, suitableCharacteristics: [], recommendedMaintenance: "low", aiRecommendationEligible: true },
    { id: id(), businessId: BUSINESS_ID, category: "Haircuts", name: "Fringe Trim", description: "A quick shape-up between full cuts.", price: 10, durationMinutes: 15, active: true, suitableCharacteristics: [], recommendedMaintenance: "medium", aiRecommendationEligible: true },
    { id: id(), businessId: BUSINESS_ID, category: "Hair Color", name: "Balayage", description: "Hand-painted, low-maintenance dimension.", price: 120, durationMinutes: 150, active: true, suitableCharacteristics: [], recommendedMaintenance: "low", aiRecommendationEligible: true },
    { id: id(), businessId: BUSINESS_ID, category: "Hair Color", name: "Full Foil Highlights", description: "All-over foiled highlights for maximum brightness.", price: 140, durationMinutes: 180, active: true, suitableCharacteristics: [], recommendedMaintenance: "high", aiRecommendationEligible: true },
    { id: id(), businessId: BUSINESS_ID, category: "Hair Color", name: "Root Touch-Up", description: "Single-process colour at the root.", price: 55, durationMinutes: 60, active: true, suitableCharacteristics: [], recommendedMaintenance: "high", aiRecommendationEligible: true },
    { id: id(), businessId: BUSINESS_ID, category: "Hair Color", name: "Gloss Toner", description: "Tone and shine refresh.", price: 40, durationMinutes: 30, active: true, suitableCharacteristics: [], recommendedMaintenance: "medium", aiRecommendationEligible: true },
    { id: id(), businessId: BUSINESS_ID, category: "Treatments", name: "Deep Hydration Treatment", description: "Moisture treatment for dry or damaged hair.", price: 30, durationMinutes: 30, active: true, suitableCharacteristics: [], recommendedMaintenance: "low", aiRecommendationEligible: true },
    { id: id(), businessId: BUSINESS_ID, category: "Treatments", name: "Keratin Smoothing", description: "Reduces frizz and styling time for months.", price: 180, durationMinutes: 150, active: true, suitableCharacteristics: [], recommendedMaintenance: "low", aiRecommendationEligible: true },
    { id: id(), businessId: BUSINESS_ID, category: "Treatments", name: "Scalp Treatment", description: "Exfoliation and scalp health treatment.", price: 25, durationMinutes: 20, active: true, suitableCharacteristics: [], recommendedMaintenance: "medium", aiRecommendationEligible: true },
    { id: id(), businessId: BUSINESS_ID, category: "Styling", name: "Blow-Dry Styling", description: "Wash, blow-dry and finish.", price: 25, durationMinutes: 40, active: true, suitableCharacteristics: [], recommendedMaintenance: "high", aiRecommendationEligible: true },
  ];
  services.forEach((s) => serviceRepo.create(s));
  const svc = (name: string) => services.find((s) => s.name === name)!.id;

  const styles: Style[] = [
    { id: id(), businessId: BUSINESS_ID, name: "Shoulder-Length Layers", category: "Haircut", description: "Soft layers that hit at the shoulder — versatile and easy to style.", maintenance: "medium", suitableFaceShapes: ["oval", "round", "heart"], suitableHairLength: ["medium", "long"], keywords: ["natural", "classic", "modern", "low_maintenance"], requiredServiceIds: [svc("Precision Haircut")], aiEligible: true },
    { id: id(), businessId: BUSINESS_ID, name: "Soft Curtain Bangs", category: "Haircut", description: "Face-framing bangs that part naturally down the middle.", maintenance: "medium", suitableFaceShapes: ["oval", "square", "long"], suitableHairLength: ["medium", "long", "very_long"], keywords: ["modern", "elegant", "natural"], requiredServiceIds: [svc("Fringe Trim")], aiEligible: true },
    { id: id(), businessId: BUSINESS_ID, name: "Classic Bob", category: "Haircut", description: "A clean, chin-length bob with a sharp line.", maintenance: "high", suitableFaceShapes: ["oval", "round", "square"], suitableHairLength: ["short", "medium"], keywords: ["classic", "bold", "modern"], requiredServiceIds: [svc("Precision Haircut")], aiEligible: true },
    { id: id(), businessId: BUSINESS_ID, name: "Textured Pixie", category: "Haircut", description: "A short, low-maintenance cut with movement on top.", maintenance: "low", suitableFaceShapes: ["oval", "heart", "square"], suitableHairLength: ["very_short", "short"], keywords: ["bold", "low_maintenance", "modern"], requiredServiceIds: [svc("Precision Haircut")], aiEligible: true },
    { id: id(), businessId: BUSINESS_ID, name: "Wolf Cut", category: "Haircut", description: "Heavy layers and volume through the crown for a shaggy, lived-in shape.", maintenance: "medium", suitableFaceShapes: ["oval", "round", "long"], suitableHairLength: ["medium", "long"], keywords: ["bold", "modern"], requiredServiceIds: [svc("Precision Haircut")], aiEligible: true },
    { id: id(), businessId: BUSINESS_ID, name: "Long Layers", category: "Haircut", description: "Length is kept, with layers added for movement.", maintenance: "low", suitableFaceShapes: ["oval", "round", "square", "heart", "long"], suitableHairLength: ["long", "very_long"], keywords: ["natural", "low_maintenance", "classic"], requiredServiceIds: [svc("Precision Haircut")], aiEligible: true },
    { id: id(), businessId: BUSINESS_ID, name: "Golden Balayage", category: "Hair Color", description: "Hand-painted warm balayage that grows out softly.", maintenance: "low", suitableFaceShapes: ["oval", "round", "square", "heart", "long"], suitableHairLength: ["medium", "long", "very_long"], keywords: ["natural", "low_maintenance", "elegant"], requiredServiceIds: [svc("Balayage"), svc("Gloss Toner")], aiEligible: true },
    { id: id(), businessId: BUSINESS_ID, name: "Ash Blonde", category: "Hair Color", description: "Cool, all-over blonde with a soft ash tone.", maintenance: "high", suitableFaceShapes: ["oval", "round", "square", "heart", "long"], suitableHairLength: ["short", "medium", "long"], keywords: ["bold", "modern", "elegant"], requiredServiceIds: [svc("Full Foil Highlights"), svc("Gloss Toner")], aiEligible: true },
    { id: id(), businessId: BUSINESS_ID, name: "Copper Red", category: "Hair Color", description: "Rich, warm copper — a statement colour.", maintenance: "high", suitableFaceShapes: ["oval", "round", "square", "heart", "long"], suitableHairLength: ["short", "medium", "long"], keywords: ["bold", "modern"], requiredServiceIds: [svc("Root Touch-Up"), svc("Gloss Toner")], aiEligible: true },
    { id: id(), businessId: BUSINESS_ID, name: "Dark Chocolate Brown", category: "Hair Color", description: "Deep, glossy all-over brunette.", maintenance: "medium", suitableFaceShapes: ["oval", "round", "square", "heart", "long"], suitableHairLength: ["short", "medium", "long", "very_long"], keywords: ["classic", "natural", "elegant"], requiredServiceIds: [svc("Root Touch-Up")], aiEligible: true },
    { id: id(), businessId: BUSINESS_ID, name: "Smooth & Sleek Finish", category: "Hairstyle", description: "Frizz-free, glass-like finish for very low daily styling time.", maintenance: "low", suitableFaceShapes: ["oval", "round", "square", "heart", "long"], suitableHairLength: ["medium", "long", "very_long"], keywords: ["low_maintenance", "elegant", "classic"], requiredServiceIds: [svc("Keratin Smoothing")], aiEligible: true },
  ];
  styles.forEach((s) => styleRepo.create(s));

  seedDemoCustomer({
    name: "Sarah Ahmed",
    phone: "+964 750 111 2233",
    email: "sarah.ahmed@example.com",
    visitsAgo: [56, 14, 2],
    styleNames: ["Long Layers", "Golden Balayage", "Shoulder-Length Layers"],
  });

  seedDemoCustomer({
    name: "Diako Rahim",
    phone: "+964 750 444 5566",
    email: undefined,
    visitsAgo: [30],
    styleNames: ["Textured Pixie"],
  });

  function seedDemoCustomer(opts: {
    name: string;
    phone: string;
    email?: string;
    visitsAgo: number[];
    styleNames: string[];
  }) {
    const customerId = id();
    const consultationIds: string[] = [];

    opts.visitsAgo.forEach((daysBack, i) => {
      const scan: Scan = {
        id: id(),
        customerId,
        businessId: BUSINESS_ID,
        imageDataUrl: null,
        capturedWithCamera: false,
        date: daysAgo(daysBack),
        analysis: {
          faceShape: "oval",
          estimatedHairLength: "medium",
          hairTexture: "wavy",
          visibleVolume: "medium",
          visibleColor: "Dark brown",
          stylingConsiderations: ["Even porosity", "Natural wave pattern"],
          aiModel: "placeholder-vision",
          aiModelVersion: "0.0.0-mock",
          analyzedAt: daysAgo(daysBack),
        },
        consentRef: "granted",
      };
      scanRepo.create(scan);

      const style = styles.find((s) => s.name === opts.styleNames[i])!;
      const consultation: Consultation = {
        id: id(),
        businessId: BUSINESS_ID,
        customerId,
        scanId: scan.id,
        preferences: {
          lookingFor: [style.category === "Hair Color" ? "color" : "haircut"],
          stylePreference: style.keywords[0] ?? "natural",
          amountOfChange: 1,
          stylingTime: "10_20",
        },
        recommendationIds: [],
        stylistNotes: i === opts.visitsAgo.length - 1 ? "Loves how the last colour grew out — keep tone warm." : "",
        selectedServiceIds: style.requiredServiceIds,
        status: "saved",
        date: daysAgo(daysBack),
        shareToken: null,
        shareRevoked: false,
      };

      const rec: Recommendation = {
        id: id(),
        consultationId: consultation.id,
        styleId: style.id,
        serviceIds: style.requiredServiceIds,
        reasons: ["Matches your selected style preference", "Fits your requested maintenance level"],
        matchLevel: "strong",
        score: 0.9,
        aiModel: "placeholder-recommendation-engine",
        aiModelVersion: "0.0.0-mock",
        stylistDecision: "accepted",
      };
      recommendationRepo.create(rec);
      consultation.recommendationIds = [rec.id];
      consultationRepo.create(consultation);
      consultationIds.push(consultation.id);
    });

    const customer: Customer = {
      id: customerId,
      businessId: BUSINESS_ID,
      name: opts.name,
      phone: opts.phone,
      email: opts.email,
      preferredLanguage: "en",
      consent: { status: "granted", timestamp: daysAgo(Math.max(...opts.visitsAgo)), policyVersion: "1.0" },
      preferences: {
        preferredStyles: opts.styleNames,
        maintenancePreference: "medium",
        favoriteServiceIds: [],
        colorPreferences: [],
      },
      createdAt: daysAgo(Math.max(...opts.visitsAgo) + 5),
      lastVisit: daysAgo(Math.min(...opts.visitsAgo)),
      consultationCount: opts.visitsAgo.length,
    };
    customerRepo.create(customer);
  }
}
