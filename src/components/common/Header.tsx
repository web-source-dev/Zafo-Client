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
    <header className="sticky top-0 z-50 w-full">
      {showAnnouncement && (
        <div className="bg-[var(--sage-green)] text-white py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-center">
            {t('common.announcement')}
          </div>
        </div>
      )}
      <Navbar />
    </header>
  );
};

export default Header; 