'use client';

import React from 'react';
import { useLanguage } from '@/i18n/language-context';
import FAQSection from '@/components/sections/faq/FAQSection';
import { FaQuestion } from 'react-icons/fa';
const FAQPage: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  
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
                <FaQuestion className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('faq.title')}</h1>
            <p className="text-xl max-w-3xl mx-auto text-white/90 mb-8">
              {t('faq.description')}
            </p>
          </div>
          
          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="white">
              <path d="M0,96L60,80C120,64,240,32,360,26.7C480,21,600,43,720,48C840,53,960,43,1080,48C1200,53,1320,75,1380,85.3L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
            </svg>
          </div>
        </div>
        
        <FAQSection />
        
        {/* Additional Helpful Resources Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              {currentLanguage === 'en' ? 'Helpful Resources' : 'Hilfreiche Ressourcen'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Help Center Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[var(--sage-green)] text-white mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  {currentLanguage === 'en' ? 'Help Center' : 'Hilfezentrum'}
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  {currentLanguage === 'en' 
                    ? 'Detailed guides and tutorials to help you get the most out of Zafo.' 
                    : 'Ausführliche Anleitungen und Tutorials, die Ihnen helfen, das Beste aus Zafo herauszuholen.'}
                </p>
                <div className="text-center">
                  <a href="/help" className="text-[var(--sage-green)] font-medium hover:underline">
                    {currentLanguage === 'en' ? 'Visit Help Center' : 'Zum Hilfezentrum'}
                  </a>
                </div>
              </div>
              
              {/* Video Tutorials Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[var(--sage-green)] text-white mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  {currentLanguage === 'en' ? 'Video Tutorials' : 'Video-Tutorials'}
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  {currentLanguage === 'en' 
                    ? 'Watch step-by-step video guides for common tasks and features.' 
                    : 'Schauen Sie sich Schritt-für-Schritt-Videoanleitungen für häufige Aufgaben und Funktionen an.'}
                </p>
                <div className="text-center">
                  <a href="/tutorials" className="text-[var(--sage-green)] font-medium hover:underline">
                    {currentLanguage === 'en' ? 'Watch Tutorials' : 'Tutorials ansehen'}
                  </a>
                </div>
              </div>
              
              {/* Community Forum Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[var(--sage-green)] text-white mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  {currentLanguage === 'en' ? 'Community Forum' : 'Community-Forum'}
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  {currentLanguage === 'en' 
                    ? 'Connect with other users, share tips, and get help from the Zafo community.' 
                    : 'Verbinden Sie sich mit anderen Benutzern, teilen Sie Tipps und erhalten Sie Hilfe von der Zafo-Community.'}
                </p>
                <div className="text-center">
                  <a href="/community" className="text-[var(--sage-green)] font-medium hover:underline">
                    {currentLanguage === 'en' ? 'Join the Discussion' : 'An der Diskussion teilnehmen'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQPage; 