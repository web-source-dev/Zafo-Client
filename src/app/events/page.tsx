'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import eventService, { Event, EventFilters, EventStats } from '@/services/event-service';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { formatDate } from '@/utils/dateUtils';
import { useLanguage } from '@/i18n/language-context';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

export default function EventsPage() {
  const { t } = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);
  const [eventStats, setEventStats] = useState<{ [key: string]: EventStats }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventFilters>({
    page: 1,
    limit: 12,
    status: 'published',
    isPublic: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (value: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setSearchTerm(value);
        }, 500);
      };
    })(),
    []
  );

  // Update filters when search, price, or location changes
  useEffect(() => {
    const updatedFilters: EventFilters = {
      ...filters,
      page: 1, // Reset to first page when filters change
      search: searchTerm || undefined,
      priceRange: priceRange || undefined,
      location: locationFilter || undefined
    };
    setFilters(updatedFilters);
  }, [searchTerm, priceRange, locationFilter]);

  // Fetch events when component mounts or filters change
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await eventService.getEvents(filters);
        if (response.success && response.data) {
          setEvents(response.data.events);
          setTotalPages(response.data.pagination.pages);
          
          // Fetch statistics for each event
          const statsPromises = response.data.events.map(async (event) => {
            try {
              const statsResponse = await eventService.getEventStats(event._id);
              if (statsResponse.success && statsResponse.data) {
                return { eventId: event._id, stats: statsResponse.data };
              }
            } catch (err) {
              console.error(`Error fetching stats for event ${event._id}:`, err);
            }
            return null;
          });
          
          const statsResults = await Promise.all(statsPromises);
          const statsMap: { [key: string]: EventStats } = {};
          statsResults.forEach(result => {
            if (result) {
              statsMap[result.eventId] = result.stats;
            }
          });
          setEventStats(statsMap);
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

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSearchInputValue('');
    setPriceRange('');
    setLocationFilter('');
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('events.listing.title')}</h1>
        <p className="text-gray-600">{t('events.listing.description')}</p>
      </div>

      {/* Filters Section */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">{t('events.filters.title') || 'Filters'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('events.filters.search') || 'Search Events'}
            </label>
            <Input
              type="text"
              placeholder={t('events.filters.searchPlaceholder') || 'Search by title, description...'}
              value={searchInputValue}
              onChange={(e) => {
                setSearchInputValue(e.target.value);
                debouncedSearch(e.target.value);
              }}
              className="w-full"
            />
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('events.filters.priceRange') || 'Price Range'}
            </label>
            <Select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              options={[
                { value: '', label: t('events.filters.allPrices') || 'All Prices' },
                { value: '0-20', label: t('events.filters.under20') || 'Under $20' },
                { value: '20-50', label: t('events.filters.20to50') || '$20 - $50' },
                { value: '50-100', label: t('events.filters.50to100') || '$50 - $100' },
                { value: '100-150', label: t('events.filters.100to150') || '$100 - $150' },
                { value: '150-200', label: t('events.filters.150to200') || '$150 - $200' },
                { value: '200+', label: t('events.filters.over200') || 'Over $200' },
                { value: 'free', label: t('events.filters.free') || 'Free' }
              ]}
              fullWidth
            />
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('events.filters.location') || 'Location'}
            </label>
            <Input
              type="text"
              placeholder={t('events.filters.locationPlaceholder') || 'Enter city or location...'}
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {(searchTerm || priceRange || locationFilter) && (
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="text-sm"
            >
              {t('events.filters.clear') || 'Clear All Filters'}
            </Button>
          </div>
        )}
      </div>

      {isLoading && <LoadingScreen />}

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
        {events.map((event) => {
          const stats = eventStats[event._id];
          const soldTickets = stats?.soldTickets || 0;
          const remainingCapacity = stats?.remainingCapacity || event.capacity;
          const isSoldOut = stats?.isSoldOut || false;
          
          return (
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
                  {isSoldOut && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="danger">{t('events.soldOut')}</Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={event.price.isFree ? 'success' : 'default'}>
                        {event.price.isFree ? t('events.free') : `${event.price.amount} ${event.price.currency}`} {t('events.detail.perTicket')}
                    </Badge>
                    <Badge variant="outline">{event.category}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{formatDate(new Date(event.startDate))}</p>
                  <p className="text-sm mb-4 line-clamp-2">{event.smallDescription}</p>
                  
                  {/* Ticket Statistics */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{t('events.sold')}: {soldTickets}</span>
                      <span>{t('events.remaining')}: {remainingCapacity}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[var(--sage-green)] h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${event.capacity > 0 ? (soldTickets / event.capacity) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
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
          );
        })}
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