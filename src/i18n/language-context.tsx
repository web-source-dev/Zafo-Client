'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Available languages
export type Language = 'en' | 'de' | 'fr' | 'it';

// Language context interface
interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

// Create language context with default values
export const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

// Language provider props interface
interface LanguageProviderProps {
  children: ReactNode;
}

// Available languages
const LANGUAGES: Language[] = ['en', 'de', 'fr', 'it'];

// Default language
const DEFAULT_LANGUAGE: Language = 'en';

// Language provider component
export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Get initial language from localStorage or use browser language or default
  const getInitialLanguage = (): Language => {
    if (typeof window !== 'undefined') {
      // Check localStorage first
      const storedLang = localStorage.getItem('language') as Language;
      if (storedLang && LANGUAGES.includes(storedLang)) {
        return storedLang;
      }
      
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0] as Language;
      if (LANGUAGES.includes(browserLang)) {
        return browserLang;
      }
    }
    
    // Fallback to default
    return DEFAULT_LANGUAGE;
  };

  const [currentLanguage, setCurrentLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load translations for the current language
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setIsLoading(true);
        // Dynamic import of translation file
        const translationModule = await import(`./translations/${currentLanguage}.json`);
        setTranslations(translationModule.default);
      } catch (error) {
        console.error(`Failed to load translations for ${currentLanguage}:`, error);
        // Fallback to empty translations
        setTranslations({});
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [currentLanguage]);

  // Initialize language on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentLanguage(getInitialLanguage());
    }
  }, []);

  // Set language and save to localStorage
  const setLanguage = (lang: Language) => {
    if (LANGUAGES.includes(lang)) {
      setCurrentLanguage(lang);
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', lang);
      }
    }
  };

  // Translation function
  const t = (key: string, params?: Record<string, string>): string => {
    if (isLoading) return key; // Return key while loading
    
    let translation = translations[key] || key;
    
    // Replace parameters if provided
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(`{{${paramKey}}}`, paramValue);
      });
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext; 