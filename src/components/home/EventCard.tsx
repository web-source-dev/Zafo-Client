'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, MapPin, Star } from 'lucide-react';
import { useLanguage } from '../../i18n/language-context';
import { Event } from '../../services/event-service';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { t, currentLanguage } = useLanguage();
  
 
  // Format time directly instead of using the utility if there are import issues
  const formatTimeFallback = (date: Date): string => {
    return new Intl.DateTimeFormat(currentLanguage === 'de' ? 'de-DE' : 'en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: currentLanguage !== 'de' // Use 24-hour format for German
    }).format(date);
  };

  // Get day of month and month
  const getFormattedDay = (date: Date): string => {
    return new Intl.DateTimeFormat(currentLanguage === 'de' ? 'de-DE' : 'en-US', {
      day: 'numeric',
    }).format(date);
  };

  const getFormattedMonth = (date: Date): string => {
    return new Intl.DateTimeFormat(currentLanguage === 'de' ? 'de-DE' : 'en-US', {
      month: 'short',
    }).format(date);
  };

  const eventDate = new Date(event.startDate);
  const day = getFormattedDay(eventDate);
  const month = getFormattedMonth(eventDate);
  
  return (
    <Link href={`/events/${event.slug}`} className="block group h-full">
      <div className="bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform group-hover:-translate-y-1 border border-[var(--taupe)] h-full flex flex-col">
        <div className="relative">
          {/* Date tag */}
          <div className="absolute top-4 left-4 bg-white rounded-md shadow-md z-10 overflow-hidden">
            <div className="flex flex-col items-center w-18">
              <div className="bg-[var(--sage-green)] text-white w-full py-1.5 text-center text-xs font-semibold uppercase">
                {month}
              </div>
              <div className="text-[var(--sage-green)] text-xl font-bold py-1.5">
                {day}
              </div>
            </div>
          </div>
          
          {/* Favorite button */}
          <button 
            className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow-md hover:bg-[var(--sage)] transition-colors duration-200"
            aria-label={t('events.addToFavorites')}
          >
            <Star size={18} className="text-[var(--sage-green)] hover:text-[var(--sage-green)]" />
          </button>
          
          {/* Cover image */}
          <div 
            className="h-64 md:h-72 bg-[var(--taupe)] relative overflow-hidden"
            style={{ 
              backgroundImage: event.coverImage ? `url(${event.coverImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {!event.coverImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[var(--sage-green)]">
                  {t('events.noImage')}
                </span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/70"></div>
            
            <div className="absolute bottom-0 left-0 w-full p-4">
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs font-medium px-2.5 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white">
                  {t(`events.categories.${event.category.replace('-', '')}`) || event.category}
                </span>
                {event.location.online && (
                  <span className="text-xs font-medium px-2.5 py-1.5 rounded-full bg-[var(--sage)]/90 text-[var(--sage-green)]">
                    {t('events.online')}
                  </span>
                )}
                {event.price.isFree && (
                  <span className="text-xs font-medium px-2.5 py-1.5 rounded-full bg-[var(--sage-green)]/90 text-white">
                    {t('events.free')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-semibold text-xl mb-4 text-[var(--sage-green)] group-hover:text-[var(--sage-green)] transition-colors line-clamp-2">
            {event.title}
          </h3>
          
          <div className="space-y-3 mb-5">
            <div className="flex items-center text-sm text-[var(--black)]">
              <Clock size={18} className="mr-3 flex-shrink-0 text-[var(--sage-green)]" />
              <span className="font-medium">{formatTimeFallback(new Date(event.startDate))}</span>
            </div>
            
            <div className="flex items-start text-sm text-[var(--black)]">
              <MapPin size={18} className="mr-3 flex-shrink-0 mt-0.5 text-[var(--sage-green)]" />
              <span className="line-clamp-1 font-medium">
                {event.location.online 
                  ? t('events.online') 
                  : `${event.location.name}, ${event.location.address.city}`
                }
              </span>
            </div>
          </div>
          
          <div className="text-sm text-[var(--black)]/80 mb-5 line-clamp-2 flex-grow">
            {event.smallDescription}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-[var(--taupe)] mt-auto">
            {!event.price.isFree && (
              <span className="font-semibold text-lg text-[var(--sage-green)]">
                {event.price.amount} {event.price.currency}
              </span>
            )}
            {event.price.isFree && (
              <span className="font-semibold text-lg text-[var(--sage-green)]">
                {t('events.free')}
              </span>
            )}
            <span className="text-xs bg-[var(--taupe)] text-[var(--sage-green)] px-3 py-1.5 rounded-full font-medium">
              {event.capacity <= 10
                ? t('events.spotsLeft', { spots: String(event.capacity) })
                : t('events.spotsAvailable', { spots: String(event.capacity) })
              }
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard; 