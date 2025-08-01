'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import { useAuth } from '../../auth/auth-context';
import LoadingScreen from '@/components/ui/LoadingScreen';

// Create a client component
function ForgotPasswordContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Don't render the form if we're already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
      <div className="my-18 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-6 shadow-xl rounded-2xl border border-transparent md:border-[var(--sage-green)]">
          <ForgotPasswordForm />
        </div>
    </div>
  );
}

// Export the main page component with Suspense
export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ForgotPasswordContent />
    </Suspense>
  );
} 