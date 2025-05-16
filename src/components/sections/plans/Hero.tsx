'use client';

import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import { FaMoneyBillWave } from 'react-icons/fa';

export default function PlansHero() {
  const { t, setLanguage, currentLanguage } = useLanguage();
  
  return (
    <section className="relative bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)] text-white py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="pricing-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pricing-grid)" />
        </svg>
      </div>
      
      {/* Language switcher */}
      <div className="absolute top-4 right-6 z-10">
        <div className="flex space-x-2 bg-white/10 rounded-full p-1">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              currentLanguage === 'en'
                ? 'bg-white text-[var(--sage-green)]'
                : 'text-white hover:bg-white/20'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('de')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              currentLanguage === 'de'
                ? 'bg-white text-[var(--sage-green)]'
                : 'text-white hover:bg-white/20'
            }`}
          >
            DE
          </button>
        </div>
      </div>

      <div className="container relative mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 rounded-full p-4">
              <FaMoneyBillWave className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('plans.hero.title')}
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-white/90 mb-8">
            {t('plans.hero.description')}
          </p>
        </motion.div>
      </div>
      
      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="white">
          <path d="M0,96L60,80C120,64,240,32,360,26.7C480,21,600,43,720,48C840,53,960,43,1080,48C1200,53,1320,75,1380,85.3L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
} 