'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';
import { useLanguage } from '../../i18n/language-context';
import Link from 'next/link';

interface HeroSliderProps {
  images: string[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ images }) => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Hero content for each slide
  const heroContent = [
    {
      title: t('home.hero.discoverAmazingEvents'),
      subtitle: t('home.hero.findAndBookEvents'),
      cta: t('home.hero.exploreEvents'),
      stats: t('home.hero.eventsCount')
    },
    {
      title: t('home.hero.createUnforgettableMoments'),
      subtitle: t('home.hero.hostEventPlatform'),
      cta: t('home.hero.startCreating'),
      stats: t('home.hero.organizersCount')
    },
    {
      title: t('home.hero.connectThroughEvents'),
      subtitle: t('home.hero.buildCommunities'),
      cta: t('home.hero.startCreating'),
      stats: t('home.hero.attendeesCount')
    },
    {
      title: t('home.hero.premiumEventExperiences'),
      subtitle: t('home.hero.concertsToWorkshops'),
      cta: t('home.hero.browseCategories'),
      stats: t('home.hero.categoriesCount')
    },
    {
      title: t('home.hero.seamlessEventManagement'),
      subtitle: t('home.hero.organizeSuccessfulEvents'),
      cta: t('home.hero.learnMore'),
      stats: t('home.hero.uptimeCount')
    }
  ];
  
  const goToNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, images.length]);
  
  const startAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      goToNext();
    }, 6000); // Increased to 6 seconds
  }, [goToNext]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoplay]);
  
  useEffect(() => {
    startAutoplay();
  }, [currentIndex, startAutoplay]);

  const goToPrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (slideIndex: number) => {
    if (isAnimating || slideIndex === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(slideIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="relative h-[500px] sm:h-[600px] md:h-[700px] w-full overflow-hidden">
      {/* Images */}
      <div 
        className="h-full w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)`, display: 'flex' }}
      >
        {images.map((image, index) => (
          <div 
            key={index}
            className="h-full w-full flex-shrink-0 relative"
            style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-[var(--black)]/40"></div>
            
            {/* Content overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <div className="mb-6">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
                    {heroContent[index]?.title || t('home.hero.discoverAmazingEvents')}
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl text-[var(--sage)] mb-8 max-w-2xl mx-auto">
                    {heroContent[index]?.subtitle || t('home.hero.findAndBookEvents')}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  <Link
                    href="/events"
                    className="bg-white text-[var(--black)] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[var(--sage)] transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    {heroContent[index]?.cta || t('home.hero.exploreEvents')}
                  </Link>
               
                </div>
                
                <div className="flex items-center justify-center gap-6 text-sm sm:text-base">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{heroContent[index]?.stats || t('home.hero.eventsCount')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{t('home.hero.citiesCount')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Left Arrow */}
      <button 
        onClick={goToPrevious}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full z-10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
        aria-label={t('accessibility.previousSlide')}
        disabled={isAnimating}
      >
        <ChevronLeft size={24} className="text-white" />
      </button>
      
      {/* Right Arrow */}
      <button 
        onClick={goToNext}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full z-10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
        aria-label={t('accessibility.nextSlide')}
        disabled={isAnimating}
      >
        <ChevronRight size={24} className="text-white" />
      </button>
      
      {/* Dots */}
      <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 flex justify-center gap-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/70 hover:scale-110'
            }`}
            aria-label={t('accessibility.goToSlide', { number: String(index + 1) })}
            disabled={isAnimating}
          />
        ))}
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className="h-full bg-white transition-all duration-300 ease-out"
          style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default HeroSlider; 