'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/ui/Button';
import { useAuth } from '../../auth/auth-context';
import { useLanguage } from '../../i18n/language-context';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  
  const goBack = () => {
    router.back();
  };

  const goToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[var(--taupe)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <svg className="h-20 w-20 text-[var(--sage-green)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--sage-green)]">
          {t('unauthorized.accessDenied')}
        </h2>
        <p className="mt-2 text-center text-sm text-black">
          {isAuthenticated ? (
            <>
              {t('unauthorized.noPermission')}
              {user && (
                <span className="block mt-2">
                  {t('unauthorized.currentRole', { role: user.role })}
                </span>
              )}
            </>
          ) : (
            <>
              {t('unauthorized.notLoggedIn')}
            </>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            {!isAuthenticated && (
              <Button 
                variant="primary" 
                fullWidth 
                onClick={() => router.push('/login')}
              >
                {t('common.signIn')}
              </Button>
            )}
            
            <Button
              variant="secondary"
              fullWidth
              onClick={goBack}
            >
              {t('unauthorized.goBack')}
            </Button>
            
            <Button
              variant="outline"
              fullWidth
              onClick={goToHome}
            >
              {t('unauthorized.goHome')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 