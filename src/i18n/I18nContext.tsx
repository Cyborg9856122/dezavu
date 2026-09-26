import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { LOCALE_DIR, dictionaries, type Locale } from "./strings";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "dezavu:locale";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "ar" || stored === "ku" || stored === "en" ? stored : "en";
  });

  const setLocale = (next: Locale) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    setLocaleState(next);
  };

  const dir = LOCALE_DIR[locale];

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [dir, locale]);

  const t = useMemo(() => {
    const dict = dictionaries[locale];
    const fallback = dictionaries.en;
    return (key: string) => dict[key] ?? fallback[key] ?? key;
  }, [locale]);

  return <I18nContext.Provider value={{ locale, setLocale, t, dir }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
