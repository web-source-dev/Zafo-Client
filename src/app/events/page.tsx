'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import eventService, { Event, EventFilters } from '@/services/event-service';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/utils/dateUtils';
import { useLanguage } from '@/i18n/language-context';

export default function EventsPage() {
  const { t } = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventFilters>({
    page: 1,
    limit: 12,
    status: 'published',
    isPublic: true
  });
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  // Fetch events when component mounts or filters change
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await eventService.getEvents(filters);
        if (response.success && response.data) {
          setEvents(response.data.events);
          setTotalPages(response.data.pagination.pages);
        } else {
          setError(response.message || t('events.listing.error'));
        }
      } catch (err) {
        setError(t('events.listing.error'));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [filters, t]);

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle event card click
  const handleEventClick = (slug: string) => {
    router.push(`/events/${slug}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('events.listing.title')}</h1>
        <p className="text-gray-600">{t('events.listing.description')}</p>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && events.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">{t('events.listing.noEventsFound')}</h2>
          <p className="text-gray-600 mb-6">{t('events.listing.noEventsFoundDescription')}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event._id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
            <div onClick={() => handleEventClick(event.slug)}>
              <div className="relative h-48">
                {event.coverImage ? (
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">{t('events.noImage')}</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={event.price.isFree ? 'success' : 'default'}>
                    {event.price.isFree ? t('events.free') : `${event.price.amount} ${event.price.currency}`}
                  </Badge>
                  <Badge variant="outline">{event.category}</Badge>
                </div>
                <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{formatDate(new Date(event.startDate))}</p>
                <p className="text-sm mb-4 line-clamp-2">{event.smallDescription}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{event.location.online ? t('events.online') : event.location.name}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(filters.page! - 1)}
              disabled={filters.page === 1}
            >
              {t('events.listing.previous')}
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === filters.page ? 'primary' : 'outline'}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => handlePageChange(filters.page! + 1)}
              disabled={filters.page === totalPages}
            >
              {t('events.listing.next')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 