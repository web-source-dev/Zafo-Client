'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '../../../i18n/language-context';
import Button from '../../../components/ui/Button';

function PaymentCancelContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const eventId = searchParams.get('event_id');
  
  // Handle back to events
  const handleBackToEvents = () => {
    router.push('/organizer/events');
  };
  
  // Handle retry payment
  const handleRetryPayment = () => {
    if (eventId) {
      router.push(`/payment/event/${eventId}`);
    } else {
      router.push('/organizer/events');
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-6 rounded-lg mb-6 text-center">
        <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-2xl font-bold mb-2">{t('payment.cancel.title')}</h2>
        <p className="mb-4">{t('payment.cancel.message')}</p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
        <Button 
          variant="outline" 
          onClick={handleBackToEvents}
        >
          {t('events.backToEvents')}
        </Button>
        {eventId && (
          <Button onClick={handleRetryPayment}>
            {t('payment.tryAgain')}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--sage-green)]"></div>
        </div>
      </div>
    }>
      <PaymentCancelContent />
    </Suspense>
  );
} 