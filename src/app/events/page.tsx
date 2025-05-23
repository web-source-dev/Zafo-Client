'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Tag, 
  Users, 
  Search, 
  Filter,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  ListFilter,
  RefreshCw,
  Globe,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardTitle, CardDescription, CardHeader, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import eventService, { Event, EventFilters } from '@/services/event-service';
import Image from 'next/image';

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
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    dates: true,
    sorting: true
  });
  
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

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Reset all filters
  const resetAllFilters = () => {
    setFilters(initialFilters);
    setSearchQuery('');
  };

  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.sort && filters.sort !== initialFilters.sort) count++;
    return count;
  };

  // Format category name for display
  const formatCategoryName = (category: string) => {
    if (!category) return '';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-[var(--sage-green)] to-[var(--sage)] py-8 px-4 mb-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-6 text-center">
            <h1 className="text-4xl font-bold text-white mb-3">Discover Amazing Events</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Find and join the best events from around the world
            </p>
          </div>

          {/* Search Bar - Refined and Smaller */}
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex w-full overflow-hidden rounded-lg shadow-lg">
                <Input
                  type="text"
                  placeholder="Search for events by name, description, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                  className="rounded-none py-3 pl-12 pr-4 text-md border-0 bg-white/95 focus:ring-2 focus:ring-[var(--sage-green)] focus:bg-white"
                />
                <Button 
                  type="submit" 
                  className="px-6 rounded-none bg-[var(--sage-green)] hover:bg-[var(--sage-green)]/90" 
                  size="md"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 pb-16">
        {/* Mobile Filter Toggle - Redesigned */}
        <div className="md:hidden mb-6">
          <Button 
            variant="outline" 
            fullWidth 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center justify-center border border-gray-300 bg-white shadow-sm py-2.5"
          >
            <Filter className="h-4 w-4 mr-2 text-[var(--sage-green)]" />
            <span className="font-medium">Filters</span>
            {countActiveFilters() > 0 && (
              <span className="ml-2 bg-[var(--sage-green)] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {countActiveFilters()}
              </span>
            )}
            {showMobileFilters ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </Button>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar - Narrower */}
          <aside className={`md:w-56 lg:w-60 flex-shrink-0 transition-all duration-300 ease-in-out ${showMobileFilters ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'} md:max-h-none md:opacity-100 md:overflow-visible`}>
            <Card className="sticky top-6 border border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-[#f9fafb] border-b border-gray-200 py-3 px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ListFilter className="h-4 w-4 mr-2 text-[var(--sage-green)]" />
                    <h2 className="text-base font-bold text-gray-800">Filters</h2>
                  </div>
                  {countActiveFilters() > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={resetAllFilters}
                      className="text-xs text-red-500 border-red-200 hover:bg-red-50 bg-white p-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {/* Categories Section */}
                  <div className="p-3">
                    <button 
                      className="flex w-full items-center justify-between text-left mb-2"
                      onClick={() => toggleSection('categories')}
                    >
                      <h3 className="font-semibold text-sm text-gray-800">Categories</h3>
                      {expandedSections.categories ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                    
                    {expandedSections.categories && (
                      <div className="mt-2">
                        <Select
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
                          className="border-gray-300 focus:border-[var(--sage-green)] rounded-md text-sm"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Date Section */}
                  <div className="p-3">
                    <button 
                      className="flex w-full items-center justify-between text-left mb-2"
                      onClick={() => toggleSection('dates')}
                    >
                      <h3 className="font-semibold text-sm text-gray-800">Date Range</h3>
                      {expandedSections.dates ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                    
                    {expandedSections.dates && (
                      <div className="space-y-3 mt-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
                          <Input
                            type="date"
                            value={filters.startDate as string}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            fullWidth
                            className="border-gray-300 focus:border-[var(--sage-green)] rounded-md text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
                          <Input
                            type="date"
                            value={filters.endDate as string}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            fullWidth
                            className="border-gray-300 focus:border-[var(--sage-green)] rounded-md text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Sort Section */}
                  <div className="p-3">
                    <button 
                      className="flex w-full items-center justify-between text-left mb-2"
                      onClick={() => toggleSection('sorting')}
                    >
                      <h3 className="font-semibold text-sm text-gray-800">Sort By</h3>
                      {expandedSections.sorting ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                    
                    {expandedSections.sorting && (
                      <div className="mt-2">
                        <Select
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
                          className="border-gray-300 focus:border-[var(--sage-green)] rounded-md text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>

              {countActiveFilters() > 0 && (
                <CardFooter className="bg-[#f9fafb] border-t border-gray-200 p-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetAllFilters}
                    className="text-xs text-gray-600 border-gray-300 w-full"
                  >
                    Clear all filters ({countActiveFilters()})
                  </Button>
                </CardFooter>
              )}
            </Card>
          </aside>

          {/* Main Events Content - Wider */}
          <div className="flex-1">
            {/* Active Filters Display */}
            {countActiveFilters() > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-4">
                <div className="flex flex-wrap gap-2">
                  {filters.category && (
                    <div className="bg-[var(--sage-green-light)] text-[var(--sage-green)] rounded-full px-3 py-1 text-sm flex items-center">
                      <Tag className="h-3 w-3 mr-1.5" />
                      <span className="mr-1.5 font-medium">{formatCategoryName(filters.category)}</span>
                      <button 
                        onClick={() => handleFilterChange('category', '')}
                        className="text-[var(--sage-green)] hover:text-[var(--sage)] rounded-full hover:bg-[var(--sage-green-light)]/80 p-0.5"
                        aria-label="Remove category filter"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                  
                  {filters.startDate && (
                    <div className="bg-[var(--sage-green-light)] text-[var(--sage-green)] rounded-full px-3 py-1 text-sm flex items-center">
                      <Calendar className="h-3 w-3 mr-1.5" />
                      <span className="mr-1.5 font-medium">From: {filters.startDate}</span>
                      <button 
                        onClick={() => handleFilterChange('startDate', '')}
                        className="text-[var(--sage-green)] hover:text-[var(--sage)] rounded-full hover:bg-[var(--sage-green-light)]/80 p-0.5"
                        aria-label="Remove start date filter"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                  
                  {filters.endDate && (
                    <div className="bg-[var(--sage-green-light)] text-[var(--sage-green)] rounded-full px-3 py-1 text-sm flex items-center">
                      <Calendar className="h-3 w-3 mr-1.5" />
                      <span className="mr-1.5 font-medium">To: {filters.endDate}</span>
                      <button 
                        onClick={() => handleFilterChange('endDate', '')}
                        className="text-[var(--sage-green)] hover:text-[var(--sage)] rounded-full hover:bg-[var(--sage-green-light)]/80 p-0.5"
                        aria-label="Remove end date filter"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                  
                  {filters.sort !== initialFilters.sort && (
                    <div className="bg-[var(--sage-green-light)] text-[var(--sage-green)] rounded-full px-3 py-1 text-sm flex items-center">
                      <SlidersHorizontal className="h-3 w-3 mr-1.5" />
                      <span className="mr-1.5 font-medium">
                        {
                          filters.sort === '-createdAt' ? 'Newest First' :
                          filters.sort === 'createdAt' ? 'Oldest First' :
                          filters.sort === 'startDate' ? 'Start Date (Asc)' :
                          filters.sort === '-startDate' ? 'Start Date (Desc)' :
                          filters.sort === 'title' ? 'Title (A-Z)' :
                          filters.sort === '-title' ? 'Title (Z-A)' : filters.sort
                        }
                      </span>
                      <button 
                        onClick={() => handleFilterChange('sort', initialFilters.sort)}
                        className="text-[var(--sage-green)] hover:text-[var(--sage)] rounded-full hover:bg-[var(--sage-green-light)]/80 p-0.5"
                        aria-label="Remove sort filter"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          
            {/* Results Summary */}
            {!loading && !error && events.length > 0 && (
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600 text-sm">
                  Showing <span className="text-gray-900 font-medium">{events.length}</span> of <span className="text-gray-900 font-medium">{pagination.total}</span> events
                </p>
                <div className="text-xs text-gray-500">
                  Page {pagination.page} of {pagination.pages}
                </div>
              </div>
            )}

            {/* Events Grid - Wider Cards */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--sage-green-light)] border-t-[var(--sage-green)]"></div>
                <p className="mt-4 text-gray-600">Loading events...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-3">
                  <X className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Error Loading Events</h3>
                <p className="text-red-500 mb-4 max-w-md mx-auto">{error}</p>
                <Button 
                  variant="primary"
                  onClick={() => setFilters(initialFilters)}
                  className="bg-[var(--sage-green)] hover:bg-[var(--sage-green)]/90"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[var(--sage-green-light)] mb-3">
                  <Filter className="h-6 w-6 text-[var(--sage-green)]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Events Found</h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  We couldn&apos;t find any events matching your current filters. Try adjusting your search criteria.
                </p>
                <Button 
                  variant="primary"
                  onClick={resetAllFilters}
                  className="bg-[var(--sage-green)] hover:bg-[var(--sage-green)]/90"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                  {events.map((event) => (
                    <Link href={`/events/${event.slug}`} key={event._id} className="group">
                      <Card className="h-full overflow-hidden border border-gray-200 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md group-hover:border-[var(--sage-green-light)]">
                        {event.coverImage ? (
                          <div className="h-44 overflow-hidden">
                            <Image
                              src={event.coverImage}
                              alt={event.title}
                              width={500}
                              height={500}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="h-44 bg-gradient-to-r from-[var(--sage-green)] to-[var(--sage)] flex items-center justify-center">
                            <p className="text-lg font-bold text-white">{event.title}</p>
                          </div>
                        )}
                        
                        <CardContent className="p-4">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {/* Category */}
                            <span className="inline-block bg-[var(--sage-green-light)] text-[var(--sage-green)] text-xs font-semibold px-2 py-0.5 rounded-full capitalize">
                              {event.category}
                            </span>
                            
                            {/* Price */}
                            {event.price.isFree ? (
                              <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                                Free
                              </span>
                            ) : (
                              <span className="inline-block bg-[var(--cognac)] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                                {event.price.amount} {event.price.currency}
                              </span>
                            )}
                          </div>
                          
                          <CardTitle className="font-bold mb-1.5 text-lg text-gray-900 group-hover:text-[var(--sage-green)] line-clamp-1">
                            {event.title}
                          </CardTitle>
                          
                          <CardDescription className="line-clamp-2 mb-3 text-sm text-gray-600">
                            {event.smallDescription}
                          </CardDescription>
                          
                          <hr className="my-3 border-gray-200" />
                          
                          <div className="text-xs text-gray-600 space-y-1.5">
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1.5 text-[var(--sage-green)]" />
                              <span className="font-medium">
                                {format(new Date(event.startDate), 'EEE, MMM d, yyyy')}
                              </span>
                            </div>
                            
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1.5 text-[var(--sage-green)]" />
                              <span>
                                {format(new Date(event.startDate), 'h:mm a')}
                              </span>
                            </div>
                            
                            <div className="flex items-start">
                              {event.location.online ? (
                                <>
                                  <Globe className="h-3.5 w-3.5 mr-1.5 text-[var(--sage-green)] mt-0.5" />
                                  <span>Online Event</span>
                                </>
                              ) : (
                                <>
                                  <MapPin className="h-3.5 w-3.5 mr-1.5 text-[var(--sage-green)] mt-0.5" />
                                  <span className="line-clamp-1">
                                    {event.location.name}, {event.location.address.city}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                          <div className="w-full flex justify-between items-center">
                            <div className="flex items-center text-xs">
                              <Users className="h-3.5 w-3.5 mr-1 text-gray-500" />
                              <span className="text-gray-700">{event.capacity} attendees</span>
                            </div>
                            <span className="text-[var(--sage-green)] text-xs font-medium group-hover:underline flex items-center">
                              View Details
                              <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                            </span>
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Pagination - Improved */}
                {pagination.pages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="inline-flex rounded-md shadow-sm bg-white">
                      <Button
                        variant="outline"
                        onClick={() => handleFilterChange('page', Math.max(1, pagination.page - 1))}
                        disabled={pagination.page === 1}
                        className="rounded-r-none border-r-0 flex items-center text-sm py-1.5"
                      >
                        <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                        Prev
                      </Button>
                      
                      <div className="hidden sm:flex">
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
                                  <button className="w-8 h-8 flex items-center justify-center border-t border-b border-gray-300 text-gray-500 cursor-default text-xs">
                                    ...
                                  </button>
                                  <button
                                    key={page}
                                    onClick={() => handleFilterChange('page', page)}
                                    className={`w-8 h-8 flex items-center justify-center border-t border-b border-gray-300 text-sm ${
                                      page === pagination.page 
                                        ? 'bg-[var(--sage-green-light)] text-[var(--sage-green)] font-medium' 
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                  >
                                    {page}
                                  </button>
                                </React.Fragment>
                              );
                            }
                            return (
                              <button
                                key={page}
                                onClick={() => handleFilterChange('page', page)}
                                className={`w-8 h-8 flex items-center justify-center border-t border-b border-gray-300 text-sm ${
                                  page === pagination.page 
                                    ? 'bg-[var(--sage-green-light)] text-[var(--sage-green)] font-medium' 
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          })}
                      </div>
                      
                      <div className="sm:hidden border-t border-b border-gray-300 flex items-center px-2">
                        <span className="text-xs font-medium">
                          {pagination.page} / {pagination.pages}
                        </span>
                      </div>
                      
                      <Button
                        variant="outline"
                        onClick={() => handleFilterChange('page', Math.min(pagination.pages, pagination.page + 1))}
                        disabled={pagination.page === pagination.pages}
                        className="rounded-l-none border-l-0 flex items-center text-sm py-1.5"
                      >
                        Next
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 