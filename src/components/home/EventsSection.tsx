'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/language-context';
import eventService, { Event } from '../../services/event-service';
import EventCard from './EventCard';
import Link from 'next/link';
import { ArrowRight, Calendar, TrendingUp, Sparkles } from 'lucide-react';

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
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles size={24} className="text-[var(--sage-green)]" />
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--black)]">
                {t('home.upcomingEvents')}
              </h2>
            </div>
            <p className="text-lg text-[var(--black)]/80 max-w-2xl mx-auto">
              {t('events.discoverEventsNearYou')}
            </p>
          </div>
          
          {/* Loading skeleton */}
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-[var(--sage)] animate-pulse">
                <div className="h-64 bg-[var(--sage)]"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-[var(--sage)] rounded"></div>
                  <div className="h-4 bg-[var(--sage)] rounded w-3/4"></div>
                  <div className="h-4 bg-[var(--sage)] rounded w-1/2"></div>
                  <div className="h-4 bg-[var(--sage)] rounded w-2/3"></div>
                  <div className="flex justify-between items-center pt-4">
                    <div className="h-6 bg-[var(--sage)] rounded w-1/3"></div>
                    <div className="h-6 bg-[var(--sage)] rounded w-1/4"></div>
                  </div>
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
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--black)] mb-4">
              {t('home.upcomingEvents')}
            </h2>
            <p className="text-lg text-[var(--black)]/80 max-w-2xl mx-auto">
              {t('events.discoverEventsNearYou')}
            </p>
          </div>
          <div className="bg-[var(--sage)] border border-[var(--sage-green)] text-[var(--black)] px-6 py-4 rounded-lg text-center">
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
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles size={24} className="text-[var(--sage-green)]" />
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--black)]">
              {t('home.upcomingEvents')}
            </h2>
          </div>
          <p className="text-lg text-[var(--black)]/80 max-w-2xl mx-auto mb-8">
            {t('events.discoverEventsNearYou')}
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-8 text-sm text-[var(--black)]/70 mb-8">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[var(--sage-green)]" />
              <span>{t('events.updatedDaily')}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[var(--cognac)]" />
              <span>{t('events.trendingNow')}</span>
            </div>
          </div>
          
          <Link 
            href="/events" 
            className="inline-flex items-center text-[var(--sage-green)] font-semibold hover:text-[var(--cognac)] transition-colors group"
          >
            {t('common.viewAll')}
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {/* First row of events */}
        {firstRow.length > 0 && (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {firstRow.map((event, index) => (
              <div 
                key={event._id}
                className="transition-all duration-700 animate-fadeIn"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
        
        {/* Second row of events */}
        {secondRow.length > 0 && (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {secondRow.map((event, index) => (
              <div 
                key={event._id}
                className="transition-all duration-700 animate-fadeIn"
                style={{ animationDelay: `${(index + 3) * 150}ms` }}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
        
        {/* Empty state */}
        {events.length === 0 && (
          <div className="text-center py-16 bg-[var(--taupe)] rounded-2xl border-2 border-dashed border-[var(--sage)]">
            <Calendar size={48} className="text-[var(--black)]/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[var(--black)]/60 mb-2">
              {t('events.noEventsFound')}
            </h3>
            <p className="text-[var(--black)]/50 mb-6">
              {t('events.checkBackSoon')}
            </p>
            <Link 
              href="/events" 
              className="inline-flex items-center bg-[var(--sage-green)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--cognac)] transition-colors"
            >
              {t('events.browseAllEvents')}
            </Link>
          </div>
        )}
        
        {/* Call to action */}
        {events.length > 0 && (
          <div className="text-center mt-16 pt-16 border-t border-[var(--sage)]">
            <h3 className="text-2xl font-bold text-[var(--black)] mb-4">
              {t('events.cantFindWhatLookingFor')}
            </h3>
            <p className="text-[var(--black)]/70 mb-8 max-w-2xl mx-auto">
              {t('events.exploreFullCatalog')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/events" 
                className="bg-[var(--sage-green)] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[var(--cognac)] transition-colors"
              >
                {t('events.browseAllEvents')}
              </Link>
              <Link 
                href="/organizer/events/create" 
                className="border-2 border-[var(--sage-green)] text-[var(--sage-green)] px-8 py-3 rounded-lg font-semibold hover:bg-[var(--sage-green)] hover:text-white transition-colors"
              >
                {t('events.createEvent')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsSection; 