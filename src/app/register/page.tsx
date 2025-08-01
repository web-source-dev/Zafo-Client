'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RegisterForm from '../../components/auth/RegisterForm';
import { useAuth } from '../../auth/auth-context';
import LoadingScreen from '@/components/ui/LoadingScreen';

// Create a client component that uses useSearchParams
function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  
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
    <div className="m-18 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-6 shadow-xl rounded-2xl border border-[var(--sage-green)]">
          <RegisterForm redirectUrl={redirectUrl} />
        </div>
    </div>
  );
}

// Export the main page component with Suspense
export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RegisterContent />
    </Suspense>
  );
} 