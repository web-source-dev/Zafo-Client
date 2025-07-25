'use client';

import React from 'react';
import { useLanguage } from '@/i18n/language-context';
import HelpSection from '@/components/sections/help/HelpSection';
import { FaLifeRing } from 'react-icons/fa';
const HelpPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <>      
      <div className="bg-white">
        {/* Hero Section with Gradient Background */}
        <div className="relative bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)] text-white py-16 sm:py-24">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="small-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#small-grid)" />
            </svg>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 rounded-full p-4">
                <FaLifeRing className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('help.title')}</h1>
            <p className="text-xl max-w-3xl mx-auto text-white/90 mb-8">
              {t('help.description')}
            </p>
          </div>
          
          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="white">
              <path d="M0,96L60,80C120,64,240,32,360,26.7C480,21,600,43,720,48C840,53,960,43,1080,48C1200,53,1320,75,1380,85.3L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
            </svg>
          </div>
        </div>
        
        <HelpSection />
      </div>
    </>
  );
};

export default HelpPage; 