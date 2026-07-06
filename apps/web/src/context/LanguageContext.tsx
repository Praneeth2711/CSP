import React, { createContext, useContext, useState } from "react";

type Language = "en" | "hi";

type TranslationKeys = 
  | "app.title"
  | "app.tagline"
  | "nav.jobs"
  | "nav.schemes"
  | "nav.skills"
  | "nav.resume"
  | "nav.prep"
  | "nav.ai"
  | "nav.literacy"
  | "nav.dashboard"
  | "hero.title"
  | "hero.sub"
  | "hero.cta.jobs"
  | "hero.cta.skills"
  | "hero.cta.ready"
  | "footer.rights"
  | "button.login"
  | "button.logout";

const translations: Record<TranslationKeys, Record<Language, string>> = {
  "app.title": { en: "EMPOWERRURAL", hi: "एम्पॉवर रूरल" },
  "app.tagline": {
    en: "Connecting Rural Youth with Skills, Careers, and Opportunities.",
    hi: "ग्रामीण युवाओं को कौशल, करियर और अवसरों से जोड़ना।"
  },
  "nav.jobs": { en: "Jobs Portal", hi: "रोजगार पोर्टल" },
  "nav.schemes": { en: "Govt Schemes", hi: "सरकारी योजनाएं" },
  "nav.skills": { en: "Skill Training", hi: "कौशल विकास" },
  "nav.resume": { en: "Resume Builder", hi: "बायोडाटा निर्माता" },
  "nav.prep": { en: "Interview Prep", hi: "इंटरव्यू तैयारी" },
  "nav.ai": { en: "AI Career Coach", hi: "एआई करियर कोच" },
  "nav.literacy": { en: "Digital Literacy", hi: "डिजिटल साक्षरता" },
  "nav.dashboard": { en: "Dashboard", hi: "डैशबोर्ड" },
  
  "hero.title": {
    en: "Empowering Rural Youth Through Technology",
    hi: "तकनीक के माध्यम से ग्रामीण युवाओं का सशक्तीकरण"
  },
  "hero.sub": {
    en: "Helping every rural student discover jobs, skills, government schemes, and career opportunities.",
    hi: "प्रत्येक ग्रामीण छात्र को नौकरी, कौशल विकास, सरकारी योजनाएं और करियर के अवसर खोजने में मदद करना।"
  },
  "hero.cta.jobs": { en: "Explore Jobs", hi: "नौकरियां खोजें" },
  "hero.cta.skills": { en: "Find Skill Programs", hi: "कौशल कार्यक्रम" },
  "hero.cta.ready": { en: "Become Job Ready", hi: "रोजगार हेतु तैयार बनें" },
  "footer.rights": {
    en: "EmpowerRural. All rights reserved.",
    hi: "एम्पॉवर रूरल। सर्वाधिकार सुरक्षित।"
  },
  "button.login": { en: "Sign In", hi: "लॉग इन" },
  "button.logout": { en: "Sign Out", hi: "लॉग आउट" }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("er_language") as Language) || "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("er_language", lang);
  };

  const t = (key: TranslationKeys): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
