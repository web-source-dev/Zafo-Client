'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Calendar, Users, X } from 'lucide-react';
import { useLanguage } from '../../i18n/language-context';

interface FilterOption {
  id: string;
  name: string;
  translationKey: string;
  icon?: React.ReactNode;
}

const EventSearch = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [location, setLocation] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filterOptions: FilterOption[] = [
    { id: 'all', name: 'All', translationKey: 'home.filterAll', icon: null },
    { id: 'for-you', name: 'For you', translationKey: 'home.filterForYou', icon: <Users size={16} /> },
    { id: 'online', name: 'Online', translationKey: 'home.filterOnline', icon: null },
    { id: 'today', name: 'Today', translationKey: 'home.filterToday', icon: <Calendar size={16} /> },
    { id: 'weekend', name: 'This weekend', translationKey: 'home.filterWeekend', icon: null },
    { id: 'mental-health', name: 'Mental Health Awareness Month', translationKey: 'home.filterMentalHealth', icon: null },
    { id: 'free', name: 'Free', translationKey: 'home.filterFree', icon: null },
    { id: 'music', name: 'Music', translationKey: 'events.categories.music', icon: null },
    { id: 'nightlife', name: 'Nightlife', translationKey: 'events.categories.nightlife', icon: null },
    { id: 'performing-arts', name: 'Performing & Visual Arts', translationKey: 'events.categories.performingArts', icon: null },
    { id: 'holidays', name: 'Holidays', translationKey: 'events.categories.holidays', icon: null },
    { id: 'food-drink', name: 'Food & Drink', translationKey: 'events.categories.foodDrink', icon: null },
    { id: 'business', name: 'Business', translationKey: 'events.categories.business', icon: null },
  ];

  const handleFilterClick = (filterId: string) => {
    if (filterId === 'all') {
      setActiveFilters([]);
    } else if (activeFilters.includes(filterId)) {
      setActiveFilters(activeFilters.filter(id => id !== filterId));
    } else {
      setActiveFilters([...activeFilters, filterId]);
    }
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setLocation('');
  };

  const handleSearch = () => {
    // Build query parameters using URLSearchParams
    const params = new URLSearchParams();
    
    if (location) {
      params.append('location', location);
    }
    
    if (activeFilters.length > 0) {
      params.append('filters', activeFilters.join(','));
    }
    
    // Convert to string and navigate
    router.push(`/events?${params.toString()}`);
  };

  return (
    <section className="py-6 bg-[var(--taupe)]">
      <div className="container mx-auto px-4">
        {/* Location search bar */}
        <div className="relative max-w-2xl mx-auto">
          {location && (
            <div className="absolute top-0 left-0 transform -translate-y-6 text-sm text-gray-500 flex items-center gap-1">
              <MapPin size={14} />
              <span>{t('home.browsingEventsIn')}</span>
            </div>
          )}
          
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-gray-400" size={20} />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t('home.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {location && (
              <button 
                onClick={() => setLocation('')}
                className="absolute right-20 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
            <button
              onClick={handleSearch}
              className="absolute right-3 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-blue-700 transition duration-150"
            >
              {t('home.search')}
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="mt-6 mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">{t('home.filterEvents')}</h3>
            {activeFilters.length > 0 && (
              <button 
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {t('home.clearFilters')}
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleFilterClick(filter.id)}
                className={`
                  flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium 
                  ${filter.id === 'all' && activeFilters.length === 0 
                    ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                    : activeFilters.includes(filter.id) 
                      ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }
                  transition-colors duration-150
                `}
              >
                {filter.icon && <span className="mr-1">{filter.icon}</span>}
                {t(filter.translationKey)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventSearch; 