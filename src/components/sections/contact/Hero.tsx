'use client';

import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ContactHero() {
  const { t } = useLanguage();
  
  return (
    <section className="bg-[var(--taupe)] py-24 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[var(--sage-green)]"></div>
        <div className="absolute bottom-10 -left-20 w-80 h-80 rounded-full bg-[var(--sage)]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col text-left md:w-1/2"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--sage-green)] mb-6">
              {t('contact.hero.title')}
            </h1>
            <div className="w-20 h-1 bg-[var(--sage)] mb-8"></div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-lg md:text-xl text-gray-700"
            >
              {t('contact.hero.description')}
            </motion.p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:w-1/2 relative h-[300px] md:h-[400px] w-full"
          >
            <Image
              src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=1470&auto=format&fit=crop"
              alt={t('contact.hero.title')}
              fill
              className="object-cover rounded-lg shadow-xl"
              sizes="(max-width: 768px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 