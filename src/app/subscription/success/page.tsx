'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/auth/auth-context';
import subscriptionService from '@/services/subscription-service';
import Button from '@/components/ui/Button';
import { FaCheckCircle, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const SubscriptionSuccessPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshSubscription } = useAuth();

  useEffect(() => {
    const handleSubscriptionSuccess = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setIsError(true);
        setIsLoading(false);
        toast.error('No session ID found in URL');
        return;
      }
      
      try {
        const response = await subscriptionService.handleCheckoutSuccess({
          sessionId
        });
        
        if (response.success) {
          // Refresh auth context to update subscription status
          await refreshSubscription();
          toast.success('Subscription activated successfully');
        } else {
          setIsError(true);
          toast.error(response.message || 'Failed to process subscription');
        }
      } catch (error) {
        console.error('Error processing subscription:', error);
        setIsError(true);
        toast.error('Error processing subscription');
      } finally {
        setIsLoading(false);
      }
    };
    
    handleSubscriptionSuccess();
  }, [searchParams, refreshSubscription]);
  
  const goToDashboard = () => {
    router.push('/dashboard');
  };
  
  const goToPlans = () => {
    router.push('/plans');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <FaSpinner className="mx-auto h-12 w-12 text-[var(--sage-green)] animate-spin" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Processing your subscription
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we activate your subscription...
          </p>
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <FaExclamationTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Something went wrong
          </h2>
          <p className="mt-2 text-base text-gray-600">
            We couldn&apos;t process your subscription. Please try again or contact support.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button onClick={goToPlans}>
              Back to Plans
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <FaCheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Subscription Activated!
        </h2>
        <p className="mt-2 text-xl text-gray-600">
          Thank you for subscribing to Zafo.
        </p>
        <div className="mt-4 text-base text-gray-500">
          <p>Your subscription has been successfully activated.</p>
          <p className="mt-1">You now have access to all the features of your plan.</p>
        </div>
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={goToDashboard}
            variant="primary"
            size="lg"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccessPage; 