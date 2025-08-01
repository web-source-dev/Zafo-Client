'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, MapPin, Users, Heart } from 'lucide-react';
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
      <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl transform group-hover:-translate-y-2 border border-[var(--sage)] h-full flex flex-col hover:border-[var(--sage-green)]">
        <div className="relative">
          {/* Date tag */}
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
            <div className="flex flex-col items-center w-16">
              <div className="bg-[var(--sage-green)] text-white w-full py-2 text-center text-xs font-bold uppercase tracking-wide">
                {month}
              </div>
              <div className="text-[var(--black)] text-xl font-bold py-2">
                {day}
              </div>
            </div>
          </div>
          
          {/* Favorite button */}
          <button 
            className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white transition-all duration-200 group/fav"
            aria-label={t('events.addToFavorites')}
          >
            <Heart size={18} className="text-[var(--black)]/40 group-hover/fav:text-[var(--sage-green)] transition-colors" />
          </button>
          
          {/* Cover image */}
          <div 
            className="h-64 md:h-72 bg-[var(--sage)] relative overflow-hidden"
            style={{ 
              backgroundImage: event.coverImage ? `url(${event.coverImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {!event.coverImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[var(--black)]/40">
                  {t('events.noImage')}
                </span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60"></div>
            
            <div className="absolute bottom-0 left-0 w-full p-4">
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[var(--black)] shadow-sm">
                  {t(`events.categories.${event.category.replace('-', '')}`) || event.category}
                </span>
                {event.location.online && (
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[var(--sage-green)]/90 text-white shadow-sm">
                    {t('events.online')}
                  </span>
                )}
                {event.price.isFree && (
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[var(--cognac)]/90 text-white shadow-sm">
                    {t('events.free')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-bold text-xl mb-4 text-[var(--black)] group-hover:text-[var(--sage-green)] transition-colors line-clamp-2 leading-tight">
            {event.title}
          </h3>
          
          <div className="space-y-3 mb-5">
            <div className="flex items-center text-sm text-[var(--black)]/70">
              <Clock size={16} className="mr-3 flex-shrink-0 text-[var(--sage-green)]" />
              <span className="font-medium">{formatTimeFallback(new Date(event.startDate))}</span>
            </div>
            
            <div className="flex items-start text-sm text-[var(--black)]/70">
              <MapPin size={16} className="mr-3 flex-shrink-0 mt-0.5 text-[var(--sage-green)]" />
              <span className="line-clamp-1 font-medium">
                {event.location.online 
                  ? t('events.online') 
                  : `${event.location.name}, ${event.location.address.city}`
                }
              </span>
            </div>
          </div>
          
          <div className="text-sm text-[var(--black)]/60 mb-5 line-clamp-2 flex-grow leading-relaxed">
            {event.smallDescription}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-[var(--sage)] mt-auto">
            <div className="flex items-center gap-4">
              {!event.price.isFree && (
                <span className="font-bold text-lg text-[var(--black)]">
                  {event.price.amount} {event.price.currency}
                </span>
              )}
              {event.price.isFree && (
                <span className="font-bold text-lg text-[var(--cognac)]">
                  {t('events.free')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} className="text-[var(--black)]/40" />
              <span className="text-xs text-[var(--black)]/50 font-medium">
                {event.capacity <= 10
                  ? t('events.spotsLeft', { spots: String(event.capacity) })
                  : t('events.spotsAvailable', { spots: String(event.capacity) })
                }
              </span>
            </div>
          </div>
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--sage-green)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </Link>
  );
};

export default EventCard; 