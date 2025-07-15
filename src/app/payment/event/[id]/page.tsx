'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '../../../../i18n/language-context';
import { useAuth } from '../../../../auth/auth-context';
import Button from '../../../../components/ui/Button';
import eventService, { Event } from '../../../../services/event-service';
import api from '../../../../api/api';

// Extended interfaces to include payment status and platform fee
interface ExtendedEventPrice {
  amount: number;
  currency: string;
  isFree: boolean;
  platformFee?: number;
}

interface EventWithPayment extends Omit<Event, 'status' | 'price'> {
  isPaid?: boolean;
  status: 'draft' | 'published' | 'canceled' | 'completed' | 'pending_payment';
  price: ExtendedEventPrice;
}

export default function EventPaymentPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventWithPayment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  // Fetch event data on component mount
  useEffect(() => {
    const fetchEvent = async () => {
      if (!params.id) return;
      
      try {
        setIsLoading(true);
        const response = await eventService.getEvent(params.id as string);
        
        if (response.success && response.data) {
          setEvent(response.data as unknown as EventWithPayment);
          
          // Verify that this event belongs to the current user
          const eventOrganizerId = typeof response.data.organizer === 'string' 
            ? response.data.organizer 
            : response.data.organizer._id;
            
          if (user?._id !== eventOrganizerId && user?.role !== 'admin') {
            setError(t('payment.unauthorized'));
          }
          
          // Check if the event is already paid
          if ((response.data as unknown as EventWithPayment).isPaid) {
            setSuccess(true);
          }
          
          // Check if the event is free (shouldn't be on this page)
          if (response.data.price.isFree) {
            router.push('/organizer/events');
          }
        } else {
          setError(response.message || t('events.notFound'));
        }
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error.message || t('common.error'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [params.id, t, user, router]);
  
  // Calculate platform fee based on event duration
  const calculatePlatformFee = (): number => {
    if (!event) return 0;
    
    // If event already has a platform fee set, use that
    if (event.price.platformFee) {
      return event.price.platformFee;
    }
    
    // Calculate duration in milliseconds and convert to hours
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const durationMs = endDate.getTime() - startDate.getTime();
    const durationHours = Math.max(0, durationMs / (1000 * 60 * 60));
    
    // For events up to 1 day (24h): 350 CHF
    // For events of 1 day or more: 675 CHF
    return durationHours <= 24 ? 350 : 675;
  };
  
  // Format duration for display
  const formatDuration = (): string => {
    if (!event) return '';
    
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const durationMs = endDate.getTime() - startDate.getTime();
    const durationHours = Math.max(0, durationMs / (1000 * 60 * 60));
    
    const days = Math.floor(durationHours / 24);
    const remainingHours = Math.round(durationHours % 24);
    
    if (days > 0) {
      return `${days} ${days === 1 ? t('events.day') : t('events.days')} ${remainingHours > 0 ? `${remainingHours} ${remainingHours === 1 ? t('events.hour') : t('events.hours')}` : ''}`;
    }
    
    return `${remainingHours} ${remainingHours === 1 ? t('events.hour') : t('events.hours')}`;
  };
  
  // Handle payment initiation
  const handlePayment = async () => {
    if (!event) return;
    
    try {
      setIsProcessing(true);
      setError(null);
      
      // Create a payment session with Stripe
      const response = await api.post('/payments/create-session', {
        eventId: event._id,
        amount: calculatePlatformFee(),
        currency: 'CHF',
        eventTitle: event.title
      });
      
      if (response.success && response.data?.sessionUrl) {
        // Redirect to Stripe checkout
        window.location.href = response.data.sessionUrl as string;
      } else {
        setError(response.message || t('payment.failed'));
      }
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message || t('payment.failed'));
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle back to events
  const handleBackToEvents = () => {
    router.push('/organizer/events');
  };
  
  // Handle edit event
  const handleEditEvent = () => {
    if (event) {
      router.push(`/organizer/events/edit/${event._id}`);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--sage-green)]"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <Button onClick={handleBackToEvents}>
          {t('events.backToEvents')}
        </Button>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {t('payment.alreadyPaid')}
        </div>
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          <Button onClick={handleBackToEvents}>
            {t('events.backToEvents')}
          </Button>
          <Button onClick={handleEditEvent} variant="outline">
            {t('events.editEvent')}
          </Button>
        </div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {t('events.notFound')}
        </div>
        <Button onClick={handleBackToEvents}>
          {t('events.backToEvents')}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[var(--sage-green)] mb-6">
        {t('payment.title')}
      </h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">{event.title}</h2>
          
          {event.status === 'pending_payment' && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-6">
              {t('payment.pendingMessage')}
            </div>
          )}
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">{t('events.eventDuration')}:</span>
              <span className="font-medium">{formatDuration()}</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">{t('events.platformFeeAmount')}:</span>
              <span className="font-medium">
                {new Intl.NumberFormat('en-CH', {
                  style: 'currency',
                  currency: 'CHF'
                }).format(calculatePlatformFee())}
              </span>
            </div>
          </div>
          
          <div className="bg-[rgba(83,94,75,0.05)] p-4 rounded-lg mb-6">
            <p className="text-sm">{t('payment.explanation')}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <Button 
              variant="outline" 
              onClick={handleBackToEvents}
              disabled={isProcessing}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  {t('payment.processing')}
                </div>
              ) : (
                t('payment.payNow')
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 