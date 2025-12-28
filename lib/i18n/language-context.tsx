"use client"

import * as React from "react"
import { type Language, translations, type Translations } from "./translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<Language>("id")
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem("payflow-language") as Language | null
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage)
    }
    setIsHydrated(true)
  }, [])

  const setLanguage = React.useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("payflow-language", lang)
    // Update document direction for RTL languages
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
  }, [])

  const t = React.useMemo(() => translations[language], [language])

  // Update direction on language change
  React.useEffect(() => {
    if (isHydrated) {
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    }
  }, [language, isHydrated])

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = React.useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
