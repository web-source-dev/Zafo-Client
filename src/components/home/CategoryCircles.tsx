'use client';

import React from 'react';
import { useLanguage } from '../../i18n/language-context';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  eventCount?: number;
}

// Helper function to always return sage background
const getColorClass = () => {
  // Always return sage background
  return 'bg-[var(--sage)]';
};

const getTextColorClass = (color: string) => {
  if (color === 'sage-green') return 'text-white';
  if (color.includes('blue') || color.includes('green')) return 'text-[var(--sage-green)]';
  if (color.includes('yellow') || color.includes('orange') || color.includes('red')) return 'text-[var(--sage-green)]';
  if (color.includes('purple') || color.includes('pink') || color.includes('indigo')) return 'text-[var(--sage-green)]';
  return 'text-[var(--black)]';
};

const CategoryCircles = ({ categories }: { categories: Category[] }) => {
  const { t, currentLanguage } = useLanguage();

  if (!categories || categories.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">{t('home.noEventsFound')}</p>
      </div>
    );
  }

  return (
    <section className="py-12 bg-[var(--taupe)]">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold mb-10 text-center text-[var(--sage-green)]">
          {t('home.eventCategories')}
        </h2>
        <div className="flex flex-wrap justify-center gap-8 md:gap-10 lg:gap-12">
          {categories.map((category) => {
            const colorClass = getColorClass();
            const textColorClass = getTextColorClass(category.color);
            
            // Get translation key based on category ID, convert hyphens for proper translation key lookup
            const translationKey = `events.categories.${category.id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())}`;
            // Fallback to provided name if translation is not available
            const categoryName = t(translationKey) || category.name;
            
            return (
              <Link 
                href={`/events?category=${category.id}`} 
                key={category.id}
                className="group flex flex-col items-center text-center w-[85px] sm:w-[110px]"
              >
                <div className={`relative mb-4 w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center rounded-full ${colorClass} ${textColorClass} transition-all duration-300 group-hover:shadow-lg transform group-hover:-translate-y-1`}>
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                    <Image 
                      src={category.icon} 
                      alt={categoryName} 
                      width={32} 
                      height={32} 
                      className={`transition-transform duration-300 group-hover:scale-110`}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium line-clamp-2 text-[var(--black)] group-hover:text-[var(--sage-green)] transition-colors duration-200">
                  {categoryName}
                </span>
                {category.eventCount && (
                  <span className="text-xs text-[var(--sage-green)] mt-1 font-medium">
                    {category.eventCount} {category.eventCount === 1 
                      ? t(currentLanguage === 'de' ? 'events.event_singular_de' : 'events.event_singular')
                      : t(currentLanguage === 'de' ? 'events.event_plural_de' : 'events.event_plural')}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryCircles; 