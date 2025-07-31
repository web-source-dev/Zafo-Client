'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLanguage } from '../../../../../i18n/language-context';
import EventForm from '../../../../../components/events/EventForm';
import eventService, { Event } from '../../../../../services/event-service';
import LoadingScreen from '@/components/ui/LoadingScreen';

export default function EditEventPage() {
  const { t } = useLanguage();
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch event data on component mount
  useEffect(() => {
    const fetchEvent = async () => {
      if (!params.id) return;
      
      try {
        setIsLoading(true);
        const response = await eventService.getEvent(params.id as string);
        
        if (response.success && response.data) {
          setEvent(response.data);
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
  }, [params.id, t]);
  
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {isLoading ? (
        <LoadingScreen />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : event ? (
        <EventForm event={event} isEdit={true} />
      ) : (
        <div className="text-center text-gray-500">
          {t('events.notFound')}
        </div>
      )}
    </div>
  );
} 