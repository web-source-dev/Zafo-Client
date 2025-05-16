'use client';

import React from 'react';
import { useLanguage } from '../../i18n/language-context';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface City {
  name: string;
  path: string;
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
    <div className="py-12 bg-[var(--taupe)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold mb-8 text-[#36243A]">
          {title}
        </h2>
        
        {cities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 sm:gap-y-6 gap-x-6 sm:gap-x-8">
            {columnGroups.flat().map((city) => (
              <Link
                key={city.name}
                href={city.path}
                className="flex items-center text-black hover:text-[var(--sage-green)] transition-colors focus:outline-none focus:text-[var(--sage-green)]"
              >
                <span className="mr-2 text-sm sm:text-base">
                  {t('home.thingsToDo', { city: city.name })}
                </span>
                <ExternalLink size={16} className="flex-shrink-0" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">{t('home.noCities')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularCities; 