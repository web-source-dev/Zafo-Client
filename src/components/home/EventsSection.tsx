'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/language-context';
import eventService, { Event } from '../../services/event-service';
import EventCard from './EventCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const EventsSection: React.FC = () => {
  const { t } = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventService.getEvents({
          status: 'published',
          isPublic: true,
          limit: 6,
          sort: '-startDate'
        });
        
        if (response.success && response.data) {
          setEvents(response.data.events);
        } else {
          setError(response.message || t('common.error'));
        }
      } catch (err) {
        setError(t('common.error'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [t]);
  
  if (loading) {
    return (
      <div className="py-16 bg-[var(--taupe)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-semibold text-[var(--sage-green)]">
              {t('home.upcomingEvents')}
            </h2>
          </div>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden border border-[var(--taupe)]">
                <div className="h-64 bg-[var(--taupe)] animate-pulse"></div>
                <div className="p-6 space-y-4">
                  <div className="h-7 bg-[var(--taupe)] rounded animate-pulse"></div>
                  <div className="h-5 bg-[var(--taupe)] rounded animate-pulse"></div>
                  <div className="h-5 bg-[var(--taupe)] rounded animate-pulse w-3/4"></div>
                  <div className="h-5 bg-[var(--taupe)] rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-16 bg-[var(--taupe)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold mb-12 text-[var(--sage-green)]">
            {t('home.upcomingEvents')}
          </h2>
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md">
            {error}
          </div>
        </div>
      </div>
    );
  }
  
  // Split events into rows of 3 each
  const firstRow = events.slice(0, 3);
  const secondRow = events.slice(3, 6);
  
  return (
    <div className="py-16 bg-[var(--taupe)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-semibold text-[var(--sage-green)]">
            {t('home.upcomingEvents')}
          </h2>
          
          <Link href="/events" className="flex items-center text-[var(--sage-green)] font-medium hover:text-[var(--sage-green)]/80 transition-colors">
            {t('common.viewAll')}
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
        
        {firstRow.length > 0 && (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {firstRow.map((event, index) => (
              <div 
                key={event._id}
                className="transition-all duration-500 animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
        
        {secondRow.length > 0 && (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {secondRow.map((event, index) => (
              <div 
                key={event._id}
                className="transition-all duration-500 animate-fadeIn"
                style={{ animationDelay: `${(index + 3) * 100}ms` }}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
        
        {events.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-[var(--taupe)]">
            <p className="text-[var(--sage-green)]">{t('home.noEventsFound')}</p>
            <Link 
              href="/events/create" 
              className="mt-4 inline-block px-6 py-2 bg-[var(--sage-green)] text-white rounded-md hover:bg-[var(--sage-green)]/90 transition-colors"
            >
              {t('organizer.createEvent')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsSection; 