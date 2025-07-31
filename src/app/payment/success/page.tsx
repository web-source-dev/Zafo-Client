'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '../../../i18n/language-context';
import { useAuth } from '../../../auth/auth-context';
import Button from '../../../components/ui/Button';
import api from '../../../api/api';
import LoadingScreen from '@/components/ui/LoadingScreen';

function PaymentSuccessContent() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [paidAt, setPaidAt] = useState<string | null>(null);
  
  const sessionId = searchParams.get('session_id');
  const eventId = searchParams.get('event_id');
  
  // Verify payment status on component mount
  useEffect(() => {
    const verifyPayment = async () => {
      if (!eventId) {
        setError(t('payment.missingEventId'));
        setIsLoading(false);
        return;
      }
      
      // If user is not loaded yet, wait and retry
      if (!user && retryCount < 5) {
        const timer = setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 1000);
        return () => clearTimeout(timer);
      }
      
      try {
        setIsLoading(true);
        // Pass the session ID as a query parameter if available
        const endpoint = sessionId 
          ? `/payments/verify/${eventId}?sessionId=${sessionId}`
          : `/payments/verify/${eventId}`;
          
        const response = await api.get(endpoint);
        
        if (response.success && response.data?.isPaid) {
          if (response.data.paidAt && typeof response.data.paidAt === 'string') {
            setPaidAt(new Date(response.data.paidAt).toLocaleString());
          }
        } else {
          console.error('Payment verification failed:', response);
          
          // If the verification failed, we'll try to check the event status directly
          try {
            const eventResponse = await api.get(`/events/${eventId}`);
            if (eventResponse.success && eventResponse.data?.isPaid) {
              // Event is marked as paid, so we can consider the payment successful
              console.log('Event is marked as paid:', eventResponse.data);
              if (eventResponse.data.paidAt && typeof eventResponse.data.paidAt === 'string') {
                setPaidAt(new Date(eventResponse.data.paidAt).toLocaleString());
              }
            } else {
              setError(t('payment.verificationFailed'));
            }
          } catch (eventErr) {
            console.error('Failed to fetch event:', eventErr);
            setError(t('payment.verificationFailed'));
          }
        }
      } catch (err: unknown) {
        console.error('Payment verification error:', err);
        const error = err instanceof Error ? err : new Error(String(err));
        
        // If it's an authentication error, we'll try to check the event status directly
        try {
          const eventResponse = await api.get(`/events/${eventId}`);
          if (eventResponse.success && eventResponse.data?.isPaid) {
            // Event is marked as paid, so we can consider the payment successful
            console.log('Event is marked as paid:', eventResponse.data);
            if (eventResponse.data.paidAt && typeof eventResponse.data.paidAt === 'string') {
              setPaidAt(new Date(eventResponse.data.paidAt).toLocaleString());
            }
          } else {
            setError(error.message || t('payment.verificationFailed'));
          }
        } catch (eventErr) {
          console.error('Failed to fetch event:', eventErr);
          setError(error.message || t('payment.verificationFailed'));
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyPayment();
  }, [eventId, t, user, retryCount, sessionId]);
  
  // Handle back to events
  const handleBackToEvents = () => {
    router.push('/organizer/events');
  };
  
  // Handle view event
  const handleViewEvent = () => {
    if (eventId) {
      router.push(`/organizer/events/edit/${eventId}`);
    }
  };
  
  // Handle retry verification
  const handleRetryVerification = () => {
    setIsLoading(true);
    setError(null);
    setRetryCount(0);
  };
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
          <p className="mt-2 text-sm">
            {t('payment.verificationFailedHelp')}
          </p>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-6 rounded-lg mb-6 text-center">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-2xl font-bold mb-2">{t('payment.success.title')}</h2>
          <p className="mb-4">{t('payment.success.message')}</p>
          {paidAt && (
            <p className="text-sm mt-2">{t('payment.processedAt')}: {paidAt}</p>
          )}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
        <Button 
          variant="outline" 
          onClick={handleBackToEvents}
        >
          {t('events.backToEvents')}
        </Button>
        {error ? (
          <Button onClick={handleRetryVerification}>
            {t('payment.retryVerification')}
          </Button>
        ) : eventId && (
          <Button onClick={handleViewEvent}>
            {t('events.viewEvent')}
          </Button>
        )}
      </div>
    </div>
  );
} 

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}