'use client';

import React from 'react';
import { useLanguage } from '../../i18n/language-context';
import Link from 'next/link';
import { ExternalLink, MapPin, Calendar } from 'lucide-react';

interface City {
  name: string;
  path: string;
  eventCount?: string;
}

interface PopularCitiesProps {
  title: string;
  cities: City[];
}

const PopularCities: React.FC<PopularCitiesProps> = ({ title, cities }) => {
  const { t } = useLanguage();
  
  // Create columns that are balanced in height rather than just breaking by rows
  const createBalancedColumns = (items: City[], columns: number): City[][] => {
    const columnsArray: City[][] = Array.from({ length: columns }, () => []);
    
    items.forEach((city, index) => {
      // Column-first order to maintain visual balance
      const columnIndex = index % columns;
      columnsArray[columnIndex].push(city);
    });
    
    return columnsArray;
  };
  
  // Calculate number of columns based on screen size
  // This will be applied via CSS classes, but we pre-calculate the structure
  const columnGroups = createBalancedColumns(cities, 4);
  
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--black)] mb-4">
            {title}
          </h2>
          <p className="text-lg text-[var(--black)]/80 max-w-2xl mx-auto">
            {t('cities.discoverEventsPopularCities')}
          </p>
        </div>
        
        {cities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {columnGroups.flat().map((city) => (
              <Link
                key={city.name}
                href={city.path}
                className="group bg-white rounded-xl p-6 border border-[var(--sage)] hover:border-[var(--sage-green)] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-[var(--sage-green)] flex-shrink-0" />
                    <h3 className="font-semibold text-[var(--black)] group-hover:text-[var(--sage-green)] transition-colors">
                      {city.name}
                    </h3>
                  </div>
                  <ExternalLink size={16} className="text-[var(--black)]/40 group-hover:text-[var(--sage-green)] transition-colors flex-shrink-0" />
                </div>
                
                <div className="flex items-center gap-2 text-sm text-[var(--black)]/70 mb-4">
                  <Calendar size={14} className="text-[var(--black)]/40" />
                  <span>
                    {city.eventCount ? `${city.eventCount} events` : t('home.thingsToDo', { city: city.name })}
                  </span>
                </div>
                
                <div className="text-xs text-[var(--black)]/50 font-medium">
                  {t('cities.clickToExploreEvents')}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-[var(--taupe)] rounded-2xl border-2 border-dashed border-[var(--sage)] py-12">
              <MapPin size={48} className="text-[var(--black)]/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[var(--black)]/60 mb-2">
                {t('cities.noCitiesAvailable')}
              </h3>
              <p className="text-[var(--black)]/50">{t('home.noCities')}</p>
            </div>
          </div>
        )}
        
        {/* Call to action */}
        <div className="text-center mt-12">
          <Link 
            href="/events" 
            className="inline-flex items-center bg-[var(--sage-green)] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[var(--cognac)] transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {t('cities.viewAllCities')}
            <ExternalLink size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PopularCities; 