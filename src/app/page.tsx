'use client';

import React from 'react';
import { useLanguage } from '../i18n/language-context';
import HeroSlider from '../components/home/HeroSlider';
import EventsSection from '../components/home/EventsSection';
import DestinationCarousel from '../components/home/DestinationCarousel';
import PopularCities from '../components/home/PopularCities';

export default function Home() {
  const { t } = useLanguage();

  // High-quality hero images for events
  const heroImages = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1770&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1770&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1770&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1769&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1770&auto=format&fit=crop'
  ];

  // Premium destinations with better images
  const topDestinations = [
    { 
      id: '1', 
      name: 'New York', 
      image: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=1770&auto=format&fit=crop',
      eventCount: '2,847 events'
    },
    { 
      id: '2', 
      name: 'Los Angeles', 
      image: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?q=80&w=1770&auto=format&fit=crop',
      eventCount: '1,923 events'
    },
    { 
      id: '3', 
      name: 'Chicago', 
      image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?q=80&w=1770&auto=format&fit=crop',
      eventCount: '1,456 events'
    },
    { 
      id: '4', 
      name: 'Washington DC', 
      image: 'https://images.unsplash.com/photo-1501466044931-62695aada8e9?q=80&w=1787&auto=format&fit=crop',
      eventCount: '1,234 events'
    },
    { 
      id: '5', 
      name: 'San Francisco', 
      image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1932&auto=format&fit=crop',
      eventCount: '1,789 events'
    },
    { 
      id: '6', 
      name: 'Seattle', 
      image: 'https://images.unsplash.com/photo-1438401171849-74ac270044ee?q=80&w=1892&auto=format&fit=crop',
      eventCount: '987 events'
    },
    { 
      id: '7', 
      name: 'Miami', 
      image: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?q=80&w=1770&auto=format&fit=crop',
      eventCount: '1,345 events'
    },
    { 
      id: '8', 
      name: 'Austin', 
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1770&auto=format&fit=crop',
      eventCount: '1,123 events'
    }
  ];

  // Popular cities with better organization
  const popularCities = [
    { name: 'Austin', path: '/events?location=Austin', eventCount: '1,123' },
    { name: 'Denver', path: '/events?location=Denver', eventCount: '987' },
    { name: 'Phoenix', path: '/events?location=Phoenix', eventCount: '756' },
    { name: 'Seattle', path: '/events?location=Seattle', eventCount: '987' },
    { name: 'Anaheim', path: '/events?location=Anaheim', eventCount: '543' },
    { name: 'Albuquerque', path: '/events?location=Albuquerque', eventCount: '432' },
    { name: 'Baltimore', path: '/events?location=Baltimore', eventCount: '654' },
    { name: 'Raleigh', path: '/events?location=Raleigh', eventCount: '789' },
    { name: 'Nashville', path: '/events?location=Nashville', eventCount: '876' },
    { name: 'Detroit', path: '/events?location=Detroit', eventCount: '567' },
    { name: 'Indianapolis', path: '/events?location=Indianapolis', eventCount: '445' },
    { name: 'Wichita', path: '/events?location=Wichita', eventCount: '234' },
    { name: 'San Antonio', path: '/events?location=San Antonio', eventCount: '678' },
    { name: 'Abilene', path: '/events?location=Abilene', eventCount: '123' },
  ];
  
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Full-Width Slider */}
      <section className="relative w-full">
        <HeroSlider images={heroImages} />
      </section>
      {/* Events Section - Enhanced */}
      <section className="bg-white">
        <EventsSection />
      </section>
      
      {/* Top Destinations - Enhanced */}
      <section className="bg-[var(--taupe)] py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <DestinationCarousel 
            title={t('home.topDestinations')}
            destinations={topDestinations}
          />
        </div>
      </section>
      
      {/* Popular Cities - Enhanced */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <PopularCities 
            title={t('home.popularCities')}
            cities={popularCities}
          />
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="bg-[var(--sage-green)] py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('home.readyToCreateEvent')}
          </h2>
          <p className="text-xl text-[var(--sage)] mb-8 max-w-2xl mx-auto">
            {t('home.joinThousandsOrganizers')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[var(--sage-green)] px-8 py-3 rounded-lg font-semibold hover:bg-[var(--sage)] transition-colors duration-200">
              {t('home.startCreating')}
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[var(--sage-green)] transition-colors duration-200">
              {t('home.learnMore')}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
