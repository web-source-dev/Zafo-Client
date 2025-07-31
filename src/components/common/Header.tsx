'use client';

import React from 'react';
import Navbar from './Navbar';
import { useLanguage } from '../../i18n/language-context';

interface HeaderProps {
  showAnnouncement?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showAnnouncement = true }) => {
  const { t } = useLanguage();
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[var(--sage)]/20 shadow-sm">
      {showAnnouncement && (
        <div className="bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)] text-white py-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-center relative z-10">
            <div className="flex items-center justify-center gap-2">
              <span className="animate-pulse">🎉</span>
              <span className="font-medium">{t('common.announcement')}</span>
              <span className="animate-pulse">🎉</span>
            </div>
          </div>
        </div>
      )}
      <Navbar />
    </header>
  );
};

export default Header; 