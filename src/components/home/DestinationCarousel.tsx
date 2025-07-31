'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react';
import { useLanguage } from '../../i18n/language-context';
import Link from 'next/link';
import Image from 'next/image';

interface Destination {
  id: string;
  name: string;
  image: string;
  eventCount?: string;
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
      const scrollAmount = Math.min(clientWidth * 0.8, 400); // Increased scroll amount
      
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
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--black)] mb-4">
            {title}
          </h2>
          <p className="text-lg text-[var(--black)]/80 max-w-2xl mx-auto">
            {t('destinations.exploreEventsPopularDestinations')}
          </p>
        </div>
        
        <div className="relative">
          {/* Left arrow */}
          {destinations.length > 0 && (
            <button 
              className={`absolute -left-4 sm:-left-6 top-1/2 transform -translate-y-1/2 z-10 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-white shadow-lg border border-[var(--sage)] ${
                canScrollLeft ? 'text-[var(--black)] hover:bg-[var(--sage)] hover:shadow-xl' : 'text-[var(--black)]/30 cursor-not-allowed'
              } transition-all duration-200`}
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
              className={`absolute -right-4 sm:-right-6 top-1/2 transform -translate-y-1/2 z-10 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-white shadow-lg border border-[var(--sage)] ${
                canScrollRight ? 'text-[var(--black)] hover:bg-[var(--sage)] hover:shadow-xl' : 'text-[var(--black)]/30 cursor-not-allowed'
              } transition-all duration-200`}
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
            className="flex overflow-x-auto scrollbar-hide gap-6 sm:gap-8 py-4 px-2"
            onScroll={handleScroll}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {destinations.map((destination) => (
              <Link
                key={destination.id}
                href={`/events?location=${encodeURIComponent(destination.name)}`}
                className="flex-shrink-0 w-72 sm:w-80 md:w-96 group"
              >
                <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden rounded-2xl shadow-lg transform group-hover:scale-105 transition-all duration-300">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                    width={384}
                    height={256}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70"></div>
                  
                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={16} className="text-[var(--sage-green)]" />
                        <h3 className="text-lg sm:text-xl font-bold text-[var(--black)]">
                          {destination.name}
                        </h3>
                      </div>
                      {destination.eventCount && (
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-[var(--black)]/50" />
                          <span className="text-sm text-[var(--black)]/70 font-medium">
                            {destination.eventCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--sage-green)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
            ))}
            
            {/* Show empty state if no destinations */}
            {destinations.length === 0 && (
              <div className="flex-shrink-0 w-full text-center py-16">
                <div className="bg-[var(--taupe)] rounded-2xl border-2 border-dashed border-[var(--sage)] py-12">
                  <MapPin size={48} className="text-[var(--black)]/40 mx-auto mb-4" />
                  <p className="text-[var(--black)]/60 text-lg">{t('destinations.noDestinations')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Progress indicator */}
        {destinations.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="h-2 w-64 bg-[var(--sage)] rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-[var(--sage-green)] rounded-full transition-all duration-300 ease-out"
                style={{ 
                  width: progressWidth,
                  marginLeft: progressOffset
                }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Call to action */}
        <div className="text-center mt-12">
          <Link 
            href="/events" 
            className="inline-flex items-center bg-[var(--sage-green)] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[var(--cognac)] transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {t('destinations.exploreAllDestinations')}
            <ChevronRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DestinationCarousel; 