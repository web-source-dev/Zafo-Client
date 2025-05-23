'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '../auth/auth-context';
import { LanguageProvider } from '../i18n/language-context';
import { Toaster } from 'react-hot-toast';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Toaster
          position="bottom-left"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#000',
              zIndex: 9999,
              color: '#333',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
            },
            success: {
              style: {
                border: '1px solid rgba(var(--sage-green-rgb), 0.2)',
                backgroundColor: '#000',
                color: '#fff',
              },
              iconTheme: {
                primary: 'var(--sage-green)',
                secondary: '#fff',
              },
            },
            error: {
              style: {
                border: '1px solid rgba(255, 99, 99, 0.2)',
                backgroundColor: '#000',
                color: '#fff',
              },
            },
          }}
        />
        {children}
      </LanguageProvider>
    </AuthProvider>
  );
} 