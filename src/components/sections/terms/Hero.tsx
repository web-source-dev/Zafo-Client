'use client';

import { useLanguage } from '@/i18n/language-context';

export default function TermsHero() {
  const { t } = useLanguage();

  return (
    <section className="bg-[var(--taupe)] py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--sage-green)] mb-6">
            {t('terms.hero.title')}
          </h1>
          <div className="w-20 h-1 bg-[var(--sage)] mb-8"></div>
          <p className="text-lg md:text-xl max-w-3xl text-gray-700">
            {t('terms.hero.lastUpdated')}
          </p>
        </div>
      </div>
    </section>
  );
} 