'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../i18n/language-context';

interface HeroSliderProps {
  images: string[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ images }) => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const goToNext = useCallback(() => {
    if (isAnimating) return; // Prevent clicking during animation
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    
    // Reset animating flag after transition completes
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, images.length]);
  
  const startAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      goToNext();
    }, 5000);
  }, [goToNext]);

  // Auto-advance the slider every 5 seconds
  useEffect(() => {
    startAutoplay();
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoplay]);
  
  // Reset timer on manual navigation
  useEffect(() => {
    startAutoplay();
  }, [currentIndex, startAutoplay]);

  const goToPrevious = () => {
    if (isAnimating) return; // Prevent clicking during animation
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    
    // Reset animating flag after transition completes
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (slideIndex: number) => {
    if (isAnimating || slideIndex === currentIndex) return; // Prevent clicking during animation
    setIsAnimating(true);
    setCurrentIndex(slideIndex);
    
    // Reset animating flag after transition completes
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full overflow-hidden">
      {/* Images */}
      <div 
        className="h-full w-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)`, display: 'flex' }}
      >
        {images.map((image, index) => (
          <div 
            key={index}
            className="h-full w-full flex-shrink-0"
            style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        ))}
      </div>
      
      {/* Left Arrow */}
      <button 
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/70 hover:bg-white rounded-full z-10 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label={t('accessibility.previousSlide')}
        disabled={isAnimating}
      >
        <ChevronLeft size={24} />
      </button>
      
      {/* Right Arrow */}
      <button 
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/70 hover:bg-white rounded-full z-10 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label={t('accessibility.nextSlide')}
        disabled={isAnimating}
      >
        <ChevronRight size={24} />
      </button>
      
      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={t('accessibility.goToSlide', { number: String(index + 1) })}
            disabled={isAnimating}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider; 