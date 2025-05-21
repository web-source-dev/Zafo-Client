'use client';

import React from 'react';
import { useLanguage } from '../../../../i18n/language-context';
import EventForm from '../../../../components/events/EventForm';

export default function CreateEventPage() {
  const { t } = useLanguage();
  
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <EventForm />
    </div>
  );
} 