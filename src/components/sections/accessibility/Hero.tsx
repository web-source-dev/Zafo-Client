'use client';

import Image from 'next/image';
import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';

export default function AccessibilityHero() {
  const { t } = useLanguage();
  
  return (
    <section className="bg-[var(--taupe)] py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--sage-green)] mb-6">
            {t('accessibility.hero.title')}
          </h1>
          <div className="w-20 h-1 bg-[var(--sage)] mb-8"></div>
          <p className="text-lg md:text-xl max-w-3xl text-gray-700 mb-10">
            {t('accessibility.hero.description')}
          </p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-xl"
        >
          <Image
            src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3"
            alt={t('accessibility.hero.imageAlt')}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
            className="object-cover"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
          />
        </motion.div>
      </div>
    </section>
  );
} 