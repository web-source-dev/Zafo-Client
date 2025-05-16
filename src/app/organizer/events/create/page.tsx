'use client';

import React from 'react';
import { useLanguage } from '../../../../i18n/language-context';
import ProtectedRoute from '../../../../auth/protected-route';
import EventForm from '../../../../components/events/EventForm';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import { DashboardIcon, EventsIcon, RolesIcon } from '../../../../components/layout/DashboardIcons';

// Type for the translation function
type TranslationFunction = (key: string, params?: Record<string, string>) => string;

export default function CreateEventPage() {
  const { t } = useLanguage();
  
  // Get navigation with translated items
  const getDashboardNavigation = (t: TranslationFunction) => [
    { name: t('common.dashboard'), href: '/organizer', icon: DashboardIcon },
    { name: t('organizer.createEvent'), href: '/organizer/events/create', icon: EventsIcon },
    { name: t('common.profile'), href: '/profile', icon: RolesIcon },
  ];
  
  const navigation = getDashboardNavigation(t);
  
  return (
    <ProtectedRoute organizerOnly>
      <DashboardLayout title={t('events.create')} navigation={navigation}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <EventForm />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 