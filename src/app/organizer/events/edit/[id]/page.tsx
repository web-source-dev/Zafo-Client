'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLanguage } from '../../../../../i18n/language-context';
import ProtectedRoute from '../../../../../auth/protected-route';
import EventForm from '../../../../../components/events/EventForm';
import DashboardLayout from '../../../../../components/layout/DashboardLayout';
import eventService, { Event } from '../../../../../services/event-service';
import { DashboardIcon, EventsIcon, RolesIcon } from '../../../../../components/layout/DashboardIcons';

export default function EditEventPage() {
  const { t } = useLanguage();
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get navigation with translated items
  const getDashboardNavigation = (t: any) => [
    { name: t('common.dashboard'), href: '/organizer', icon: DashboardIcon },
    { name: t('organizer.createEvent'), href: '/organizer/events/create', icon: EventsIcon },
    { name: t('common.profile'), href: '/profile', icon: RolesIcon },
  ];
  
  const navigation = getDashboardNavigation(t);
  
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
      } catch (err: any) {
        setError(err.message || t('common.error'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [params.id, t]);
  
  return (
    <ProtectedRoute organizerOnly>
      <DashboardLayout title={t('events.edit')} navigation={navigation}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--sage-green)]"></div>
            </div>
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
      </DashboardLayout>
    </ProtectedRoute>
  );
} 