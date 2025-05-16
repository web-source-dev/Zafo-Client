'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RegisterForm from '../../components/auth/RegisterForm';
import { useAuth } from '../../auth/auth-context';
import { useLanguage } from '../../i18n/language-context';

// Create a client component that uses useSearchParams
function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();
  
  // Get redirect URL from query params or use default to login
  const redirectUrl = searchParams.get('redirect') || '/login';

  // Debugging: Log authentication state
  useEffect(() => {
    console.log('isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
    if (isAuthenticated && !isLoading) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Don't render the form if we're already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--taupe)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--sage-green)]">
          {t('auth.createAccount')}
        </h2>
        <p className="mt-2 text-center text-sm text-black">
          {t('auth.signInPrompt')}{' '}
          <a href="/login" className="font-medium text-[var(--sage-green)] hover:text-[#424b3c]">
            {t('common.signIn')}
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm redirectUrl={redirectUrl} />
        </div>
      </div>
    </div>
  );
}

// Export the main page component with Suspense
export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--taupe)] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--sage-green)]"></div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
} 