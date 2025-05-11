'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../auth/auth-context';
import { useLanguage } from '../../i18n/language-context';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();
  
  // Get redirect URL from query params or use default
  const redirectUrl = searchParams.get('redirect') || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, isLoading, router, redirectUrl]);

  // Don't render the form if we're already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--taupe)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--sage-green)]">
          {t('auth.signInAccount')}
        </h2>
        <p className="mt-2 text-center text-sm text-black">
          {t('auth.createAccountPrompt')}{' '}
          <a href="/register" className="font-medium text-[var(--sage-green)] hover:text-[#424b3c]">
            {t('common.register')}
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm redirectUrl={redirectUrl} />
        </div>
      </div>
    </div>
  );
} 