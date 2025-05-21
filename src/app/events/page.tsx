'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Tag, Users } from 'lucide-react';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import eventService, { Event, EventFilters } from '@/services/event-service';

const initialFilters: EventFilters = {
  category: '',
  sort: '-createdAt',
  page: 1,
  limit: 12,
};

export default function EventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // States
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [filters, setFilters] = useState<EventFilters>({
    ...initialFilters,
    category: searchParams.get('category') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
  });
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  
  // Load events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Only include search in API filters when it's implemented on backend
        const apiFilters = { ...filters };
        
        const response = await eventService.getEvents(apiFilters);
        
        if (response.success) {
          // If search is provided and backend doesn't support it, filter client-side
          let filteredEvents = response.data?.events || [];
          if (searchQuery) {
            filteredEvents = filteredEvents.filter(event => 
              event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              event.smallDescription.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }
          
          setEvents(filteredEvents);
          setPagination(response.data?.pagination || { total: 0, page: 1, pages: 1 });
        } else {
          setError(response.message || 'Failed to load events');
        }
      } catch (err) {
        setError('An error occurred while loading events');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filters, searchQuery]);

  // Update URL with filters
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.category) params.set('category', filters.category);
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);
    if (searchQuery) params.set('search', searchQuery);
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.page && filters.page > 1) params.set('page', String(filters.page));
    
    const queryString = params.toString();
    router.push(`/events${queryString ? `?${queryString}` : ''}`);
  }, [filters, searchQuery, router]);

  // Handle filter changes
  const handleFilterChange = (
    name: keyof EventFilters,
    value: string | number | boolean | undefined
  ) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      // Reset to page 1 when filters change
      page: name === 'page' ? (typeof value === 'number' ? value : 1) : 1,
    }));
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger filters update to refresh events
    setFilters({ ...filters, page: 1 });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--sage-green)] mb-2">Discover Events</h1>
        <p className="text-lg text-black">Find and join amazing events from around the world</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <h2 className="text-xl font-semibold text-[var(--sage-green)] mb-4">Filter Events</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="col-span-1 md:col-span-3">
            <div className="flex">
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                className="rounded-r-none"
              />
              <Button type="submit" className="rounded-l-none">
                Search
              </Button>
            </div>
          </form>
          
          {/* Category Filter */}
          <Select
            label="Category"
            options={[
              { value: '', label: 'All Categories' },
              { value: 'conference', label: 'Conference' },
              { value: 'workshop', label: 'Workshop' },
              { value: 'seminar', label: 'Seminar' },
              { value: 'networking', label: 'Networking' },
              { value: 'social', label: 'Social' },
              { value: 'other', label: 'Other' },
            ]}
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            fullWidth
          />
          
          {/* Date Filters */}
          <Input
            type="date"
            label="Start Date"
            value={filters.startDate as string}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            fullWidth
          />
          
          <Input
            type="date"
            label="End Date"
            value={filters.endDate as string}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            fullWidth
          />
          
          {/* Sort Filter */}
          <Select
            label="Sort By"
            options={[
              { value: '-createdAt', label: 'Newest First' },
              { value: 'createdAt', label: 'Oldest First' },
              { value: 'startDate', label: 'Start Date (Ascending)' },
              { value: '-startDate', label: 'Start Date (Descending)' },
              { value: 'title', label: 'Title (A-Z)' },
              { value: '-title', label: 'Title (Z-A)' },
            ]}
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            fullWidth
          />
          
          {/* Reset Filters Button */}
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setFilters(initialFilters);
                setSearchQuery('');
              }}
              fullWidth
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--sage-green)]"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <Button 
            variant="primary"
            className="mt-4" 
            onClick={() => setFilters(initialFilters)}
          >
            Try Again
          </Button>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">No events found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters to find more events</p>
          <Button 
            variant="primary"
            onClick={() => {
              setFilters(initialFilters);
              setSearchQuery('');
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link href={`/events/${event.slug}`} key={event._id}>
                <Card className="h-full hover-lift transition-standard cursor-pointer">
                  {event.coverImage ? (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={event.coverImage} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-[var(--sage)] flex items-center justify-center">
                      <p className="text-xl font-semibold text-white">{event.title}</p>
                    </div>
                  )}
                  
                  <CardContent>
                    <div className="mb-2">
                      <span className="inline-block bg-[var(--sage-green)] text-white text-xs font-semibold px-2 py-1 rounded-full capitalize">
                        {event.category}
                      </span>
                      {event.price.isFree ? (
                        <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full ml-2">
                          Free
                        </span>
                      ) : (
                        <span className="inline-block bg-[var(--cognac)] text-black text-xs font-semibold px-2 py-1 rounded-full ml-2">
                          {event.price.amount} {event.price.currency}
                        </span>
                      )}
                    </div>
                    
                    <CardTitle className="mt-2 mb-1">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mb-4">
                      {event.smallDescription}
                    </CardDescription>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-[var(--sage-green)]" />
                        <span>
                          {format(new Date(event.startDate), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-[var(--sage-green)]" />
                        <span>
                          {format(new Date(event.startDate), 'h:mm a')}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 text-[var(--sage-green)] mt-0.5" />
                        <span>
                          {event.location.online ? 'Online' : `${event.location.name}, ${event.location.address.city}`}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleFilterChange('page', Math.max(1, pagination.page - 1))}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                
                {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === pagination.pages || 
                    Math.abs(page - pagination.page) <= 1
                  )
                  .map((page, index, array) => {
                    // Add ellipsis
                    if (index > 0 && page - array[index - 1] > 1) {
                      return (
                        <React.Fragment key={`ellipsis-${page}`}>
                          <span className="flex items-center justify-center w-10 h-10 text-gray-500">...</span>
                          <Button
                            variant={page === pagination.page ? 'primary' : 'outline'}
                            onClick={() => handleFilterChange('page', page)}
                            className="w-10 h-10 p-0"
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                      );
                    }
                    return (
                      <Button
                        key={page}
                        variant={page === pagination.page ? 'primary' : 'outline'}
                        onClick={() => handleFilterChange('page', page)}
                        className="w-10 h-10 p-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
                
                <Button
                  variant="outline"
                  onClick={() => handleFilterChange('page', Math.min(pagination.pages, pagination.page + 1))}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 