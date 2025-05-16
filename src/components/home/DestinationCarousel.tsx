'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../i18n/language-context';
import Link from 'next/link';
import Image from 'next/image';
interface Destination {
  id: string;
  name: string;
  image: string;
}

interface DestinationCarouselProps {
  title: string;
  destinations: Destination[];
}

const DestinationCarousel: React.FC<DestinationCarouselProps> = ({ title, destinations }) => {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [clientWidth, setClientWidth] = useState(0);
  
  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (scrollRef.current) {
        setClientWidth(scrollRef.current.clientWidth);
        setMaxScroll(scrollRef.current.scrollWidth - scrollRef.current.clientWidth);
      }
    };
    
    // Initial update
    updateDimensions();
    
    // Add resize listener
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = Math.min(clientWidth * 0.8, 300); // Limit max scroll amount
      
      const scrollTo = direction === 'left' 
        ? Math.max(0, scrollLeft - scrollAmount)
        : Math.min(maxScroll, scrollLeft + scrollAmount);
        
      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };
  
  const handleScroll = () => {
    if (scrollRef.current) {
      setScrollPosition(scrollRef.current.scrollLeft);
      
      // Update max scroll value in case content changed
      setMaxScroll(scrollRef.current.scrollWidth - scrollRef.current.clientWidth);
    }
  };
  
  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = scrollPosition < maxScroll - 10; // Small buffer for rounding errors
  
  // Calculate progress indicator position and width
  const progressWidth = clientWidth > 0 && scrollRef.current 
    ? `${Math.min(100, (clientWidth / scrollRef.current.scrollWidth) * 100)}%` 
    : '25%';
    
  const progressOffset = maxScroll > 0 
    ? `${Math.min(100 - parseFloat(progressWidth), (scrollPosition / maxScroll) * (100 - parseFloat(progressWidth)))}%` 
    : '0%';
  
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <h2 className="text-3xl font-semibold mb-8 text-[#36243A]">
          {title}
        </h2>
        
        <div className="relative">
          {/* Left arrow */}
          {destinations.length > 0 && (
            <button 
              className={`absolute -left-2 sm:-left-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white shadow-md ${
                canScrollLeft ? 'text-gray-800 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'
              }`}
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label={t('accessibility.scrollLeft')}
            >
              <ChevronLeft size={24} />
            </button>
          )}
          
          {/* Right arrow */}
          {destinations.length > 0 && (
            <button 
              className={`absolute -right-2 sm:-right-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white shadow-md ${
                canScrollRight ? 'text-gray-800 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'
              }`}
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label={t('accessibility.scrollRight')}
            >
              <ChevronRight size={24} />
            </button>
          )}
          
          {/* Scrollable container */}
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide gap-4 sm:gap-6 py-4 px-1"
            onScroll={handleScroll}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {destinations.map((destination) => (
              <Link
                key={destination.id}
                href={`/events?location=${encodeURIComponent(destination.name)}`}
                className="flex-shrink-0 w-60 sm:w-72 md:w-80 group"
              >
                <div className="relative h-40 sm:h-48 md:h-60 overflow-hidden rounded-lg shadow-md">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    width={320}
                    height={240}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"></div>
                  <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6">
                    <div className="relative rounded-b-lg px-3 py-2 bg-red-500">
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        {destination.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            
            {/* Show empty state if no destinations */}
            {destinations.length === 0 && (
              <div className="flex-shrink-0 w-full text-center py-12">
                <p className="text-gray-500">{t('home.noDestinations')}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Progress indicator */}
        {destinations.length > 0 && (
          <div className="flex justify-center mt-4">
            <div className="h-1.5 w-48 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gray-800 rounded-full"
                style={{ 
                  width: progressWidth,
                  marginLeft: progressOffset
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationCarousel; 