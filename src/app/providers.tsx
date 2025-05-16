'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '../auth/auth-context';
import { LanguageProvider } from '../i18n/language-context';
interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </AuthProvider>
  );
} 