'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../auth/auth-context';
import LoadingScreen from '@/components/ui/LoadingScreen';

// Create a client component that uses useSearchParams
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  
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
      <div className="my-18 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-6 shadow-xl rounded-2xl border border-transparent md:border-[var(--sage-green)]">
          <LoginForm redirectUrl={redirectUrl} />
        </div>
    </div>
  );
} 

// Export the main page component with Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <LoginContent />
    </Suspense>
  );
} 