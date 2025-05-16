'use client';

import Image from 'next/image';
import { useLanguage } from '@/i18n/language-context';

export default function AboutHero() {
  const { t } = useLanguage();
  
  return (
    <section className="bg-[var(--taupe)] py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--sage-green)] mb-6">
            {t('about.hero.title')}
          </h1>
          <div className="w-20 h-1 bg-[var(--sage)] mb-8"></div>
          <p className="text-lg md:text-xl max-w-3xl text-gray-700 mb-10">
            {t('about.hero.description')}
          </p>
        </div>
        <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-xl">
          <Image
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt={t('about.hero.imageAlt')}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
            className="object-cover"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
          />
        </div>
      </div>
    </section>
  );
} 