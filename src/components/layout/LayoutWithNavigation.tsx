'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

interface LayoutWithNavigationProps {
  children: React.ReactNode;
}

const LayoutWithNavigation: React.FC<LayoutWithNavigationProps> = ({ children }) => {
  const pathname = usePathname();
  const hideHeaderFooter = pathname?.startsWith('/organizer') || 
                          pathname?.startsWith('/dashboard') || 
                          pathname?.startsWith('/admin');

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {!hideHeaderFooter && <Footer />}
    </>
  );
};

export default LayoutWithNavigation; 