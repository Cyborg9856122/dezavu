// Translation dictionary (Product Spec §25). English is the complete,
// authoritative set — every UI string must have a key here rather than being
// hard-coded in a component. Arabic and Kurdish (Sorani) cover the core
// customer-facing surface as a working proof of the architecture; the
// remaining keys fall back to English until a full professional translation
// pass is done. Arabic renders right-to-left automatically (see
// I18nContext).

export type Locale = "en" | "ar" | "ku";

export const LOCALE_LABEL: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  ku: "کوردی",
};

export const LOCALE_DIR: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
  ku: "rtl",
};

type Dict = Record<string, string>;

const en: Dict = {
  "app.tagline": "Discover the styles and services that suit you.",
  "home.title": "AI Beauty Consultation",
  "home.newCustomer": "New Customer",
  "home.existingCustomer": "Existing Customer",

  "common.back": "Back",
  "common.continue": "Continue",
  "common.skip": "Skip",
  "common.save": "Save",
  "common.retake": "Retake",
  "common.cancel": "Cancel",
  "common.optional": "Optional",

  "consent.title": "Before we start",
  "consent.body": "I agree to the salon taking and processing my photo for this consultation.",

  "customerInfo.title": "Let's get started",
  "customerInfo.name": "Full name",
  "customerInfo.phone": "Phone number",
  "customerInfo.email": "Email",
  "customerInfo.ageRange": "Date of birth / age range",
  "customerInfo.language": "Preferred language",
  "customerInfo.notes": "Notes",
  "customerInfo.existingMatch": "An existing customer may match this phone number.",
  "customerInfo.openExisting": "Open Existing Profile",
  "customerInfo.createAnyway": "Create New Profile Anyway",

  "preferences.lookingFor": "What are you looking for today?",
  "preferences.stylePreference": "What is your preferred style?",
  "preferences.amountOfChange": "How much change are you comfortable with?",
  "preferences.changeSmall": "Small change",
  "preferences.changeModerate": "Moderate change",
  "preferences.changeBig": "Big change",
  "preferences.stylingTime": "How much time do you usually spend styling your hair?",

  "scan.title": "Let's scan your face",
  "scan.tip.direct": "Face the camera directly",
  "scan.tip.remove": "Remove anything covering the face",
  "scan.tip.lighting": "Use normal lighting",
  "scan.tip.neutral": "Keep a neutral expression",
  "scan.tip.guide": "Keep your head inside the guide",
  "scan.start": "Start Scan",
  "scan.cameraUnavailable": "Camera access is unavailable. Check camera permissions.",
  "scan.usePlaceholder": "Continue without camera",

  "analyzing.step1": "Analyzing your features…",
  "analyzing.step2": "Finding styles that match your preferences…",

  "results.title": "Your Recommendations",
  "results.viewDetails": "View Details",
  "results.maintenance": "Maintenance",
  "results.recommendedService": "Recommended service",
  "results.why": "Why it may suit you",
  "results.preview": "Preview This Look",
  "results.previewDisclaimer": "AI-generated preview — actual results may vary.",

  "review.accept": "Accept",
  "review.modify": "Modify",
  "review.reject": "Reject",
  "review.stylistNote": "Stylist note",

  "summary.title": "Consultation Summary",
  "summary.services": "Recommended Services",
  "summary.looks": "Recommended Looks",
  "summary.notes": "Stylist Notes",
  "summary.save": "Save Consultation",
  "summary.startNew": "Start New Consultation",
  "summary.share": "Share Results",

  "search.title": "Search Customer",
  "search.placeholder": "Search by name, phone, or customer ID",
  "search.openProfile": "Open Profile",
  "search.lastConsultation": "Last consultation",
  "search.consultations": "Consultations",

  "returning.welcomeBack": "Welcome back",
  "returning.lastVisit": "Your last consultation was",
  "returning.continuePrevious": "Continue Previous Preferences",
  "returning.startNew": "Start New Consultation",
  "returning.continueSelected": "Continue This Session's Preferences",
  "returning.sessionHistory": "Session history",
  "returning.noPrevious": "No previous session on file yet.",

  "session.status.in_progress": "Not finished",
  "session.status.saved": "Completed",
  "session.status.shared": "Completed · shared",

  "session.lookingFor": "Looking for",
  "session.stylePreference": "Style",
  "session.amountOfChange": "Amount of change",
  "session.stylingTime": "Styling time",
  "session.services": "Services",

  "error.aiUnavailable": "AI analysis is temporarily unavailable. Your customer information has been saved. Try the analysis again.",
  "error.poorImage": "We couldn't get a clear scan. Please try again with better lighting.",
};

const ar: Dict = {
  "app.tagline": "اكتشفي التسريحات والخدمات التي تناسبك.",
  "home.title": "استشارة تجميل بالذكاء الاصطناعي",
  "home.newCustomer": "زبونة جديدة",
  "home.existingCustomer": "زبونة سابقة",

  "common.back": "رجوع",
  "common.continue": "متابعة",
  "common.skip": "تخطي",
  "common.save": "حفظ",
  "common.retake": "إعادة التصوير",
  "common.cancel": "إلغاء",
  "common.optional": "اختياري",

  "consent.title": "قبل أن نبدأ",
  "consent.body": "أوافق على قيام الصالون بالتقاط ومعالجة صورتي لهذه الاستشارة.",

  "customerInfo.title": "لنبدأ",
  "customerInfo.name": "الاسم الكامل",
  "customerInfo.phone": "رقم الهاتف",
  "customerInfo.email": "البريد الإلكتروني",

  "scan.title": "لنقم بمسح وجهك",
  "scan.start": "بدء المسح",

  "results.title": "توصياتك",
  "results.viewDetails": "عرض التفاصيل",

  "summary.title": "ملخص الاستشارة",
  "summary.save": "حفظ الاستشارة",
  "summary.share": "مشاركة النتائج",
};

const ku: Dict = {
  "app.tagline": "ئەو ستایل و خزمەتگوزاریانە بدۆزەرەوە کە لەگەڵت دەگونجێت.",
  "home.title": "ڕاوێژکاری جوانی بە زیرەکی دەستکرد",
  "home.newCustomer": "کڕیاری نوێ",
  "home.existingCustomer": "کڕیاری پێشوو",

  "common.back": "گەڕانەوە",
  "common.continue": "بەردەوامبوون",
  "common.skip": "پەڕاندن",
  "common.save": "پاشەکەوتکردن",
  "common.retake": "دووبارە وێنەگرتن",
  "common.cancel": "هەڵوەشاندنەوە",
  "common.optional": "ئارەزوومەندانە",

  "consent.title": "پێش دەستپێکردن",
  "consent.body": "ڕازیم کە سالۆن وێنەکەم بگرێت و بۆ ئەم ڕاوێژکارییە بەکاری بهێنێت.",

  "scan.title": "با ڕووت هەڵبسەنگێنین",
  "scan.start": "دەستپێکردنی هەڵسەنگاندن",

  "results.title": "پێشنیارەکانت",
  "results.viewDetails": "بینینی وردەکاری",

  "summary.title": "کورتەی ڕاوێژکاری",
  "summary.save": "پاشەکەوتکردنی ڕاوێژکاری",
  "summary.share": "هاوبەشکردنی ئەنجام",
};

export const dictionaries: Record<Locale, Dict> = { en, ar, ku };
