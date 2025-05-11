'use client';

import React from 'react';
import { useLanguage, Language } from '../../i18n/language-context';

interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal' | 'dropdown';
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  variant = 'default',
  className = ''
}) => {
  const { currentLanguage, setLanguage, t } = useLanguage();

  if (variant === 'minimal') {
    return (
      <div className={`inline-flex ${className}`}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`px-2 py-1 text-sm ${
              currentLanguage === lang.code 
                ? 'font-bold text-[var(--sage-green)]' 
                : 'text-black hover:text-[var(--sage-green)]'
            }`}
            aria-label={`Switch to ${lang.name}`}
          >
            {lang.flag}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative inline-block text-left ${className}`}>
        <select
          value={currentLanguage}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="block w-full pl-3 pr-10 py-2 text-base border-[var(--cognac)] focus:outline-none focus:ring-[var(--sage-green)] focus:border-[var(--sage-green)] sm:text-sm rounded-md"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`inline-flex rounded-md shadow-sm ${className}`}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`
            relative inline-flex items-center px-4 py-2 text-sm font-medium 
            ${languages.indexOf(lang) === 0 ? 'rounded-l-md' : ''} 
            ${languages.indexOf(lang) === languages.length - 1 ? 'rounded-r-md' : ''} 
            ${currentLanguage === lang.code 
              ? 'bg-[var(--sage-green)] text-white z-10' 
              : 'bg-white text-black hover:bg-[var(--taupe)] hover:text-[var(--sage-green)]'
            } 
            border border-[var(--cognac)]
            focus:z-10 focus:outline-none focus:ring-1 focus:ring-[var(--sage-green)] focus:border-[var(--sage-green)]
          `}
          aria-label={`Switch to ${lang.name}`}
        >
          <span className="mr-2">{lang.flag}</span>
          {lang.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher; 