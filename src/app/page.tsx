'use client';

import React from 'react';
import { useLanguage } from '../i18n/language-context';
import HeroSlider from '../components/home/HeroSlider';
import CategoryCircles from '../components/home/CategoryCircles';
import EventSearch from '../components/home/EventSearch';
import EventsSection from '../components/home/EventsSection';
import DestinationCarousel from '../components/home/DestinationCarousel';
import PopularCities from '../components/home/PopularCities';

export default function Home() {
  const { t } = useLanguage();

  // Sample data for hero slider
  const heroImages = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1770&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1770&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1770&auto=format&fit=crop'
  ];

  // Sample data for categories with improved naming to match translation keys
  const categories = [
    { id: 'music', name: t('events.categories.music'), icon: '/icons/music.svg', color: 'sage-green', eventCount: 24 },
    { id: 'nightlife', name: t('events.categories.nightlife'), icon: '/icons/disco-ball.svg', color: 'cognac', eventCount: 18 },
    { id: 'performingArts', name: t('events.categories.performingArts'), icon: '/icons/theatre.svg', color: 'sage', eventCount: 12 },
    { id: 'holidays', name: t('events.categories.holidays'), icon: '/icons/calendar-heart.svg', color: 'taupe', eventCount: 8 },
    { id: 'dating', name: t('events.categories.dating'), icon: '/icons/chat.svg', color: 'cognac', eventCount: 15 },
    { id: 'hobbies', name: t('events.categories.hobbies'), icon: '/icons/controller.svg', color: 'sage', eventCount: 20 },
    { id: 'business', name: t('events.categories.business'), icon: '/icons/presentation.svg', color: 'sage-green', eventCount: 9 },
    { id: 'foodDrink', name: t('events.categories.foodDrink'), icon: '/icons/food.svg', color: 'cognac', eventCount: 16 },
  ];

  // Sample data for destinations
  const topDestinations = [
    { id: '1', name: 'New York', image: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=1770&auto=format&fit=crop' },
    { id: '2', name: 'Los Angeles', image: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?q=80&w=1770&auto=format&fit=crop' },
    { id: '3', name: 'Chicago', image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?q=80&w=1770&auto=format&fit=crop' },
    { id: '4', name: 'Washington', image: 'https://images.unsplash.com/photo-1501466044931-62695aada8e9?q=80&w=1787&auto=format&fit=crop' },
    { id: '5', name: 'San Francisco', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1932&auto=format&fit=crop' },
    { id: '6', name: 'Seattle', image: 'https://images.unsplash.com/photo-1438401171849-74ac270044ee?q=80&w=1892&auto=format&fit=crop' },
  ];

  // Sample data for popular cities
  const popularCities = [
    { name: 'Austin', path: '/events?location=Austin' },
    { name: 'Abilene', path: '/events?location=Abilene' },
    { name: 'Denver', path: '/events?location=Denver' },
    { name: 'Phoenix', path: '/events?location=Phoenix' },
    { name: 'Seattle', path: '/events?location=Seattle' },
    { name: 'Anaheim', path: '/events?location=Anaheim' },
    { name: 'Albuquerque', path: '/events?location=Albuquerque' },
    { name: 'Baltimore', path: '/events?location=Baltimore' },
    { name: 'Raleigh', path: '/events?location=Raleigh' },
    { name: 'Nashville', path: '/events?location=Nashville' },
    { name: 'Detroit', path: '/events?location=Detroit' },
    { name: 'Indianapolis', path: '/events?location=Indianapolis' },
    { name: 'Wichita', path: '/events?location=Wichita' },
    { name: 'San Antonio', path: '/events?location=San Antonio' },
  ];
  
  return (
    <main className="min-h-screen bg-white overflow-hidden">
      {/* Hero Slider */}
      <section className="w-full">
        <HeroSlider images={heroImages} />
      </section>
      
      {/* Categories */}
      <section className="border-b border-[var(--taupe)]">
        <CategoryCircles categories={categories} />
      </section>
      
      {/* Event Search and Filters */}
      <section className="bg-[var(--taupe)] py-6 border-b border-[var(--taupe)]">
        <div className="container mx-auto px-4">
          <EventSearch />
        </div>
      </section>
      
      {/* Events Section */}
      <section>
        <EventsSection />
      </section>
      
      {/* Top Destinations */}
      <section className="bg-[var(--taupe)] py-16 border-t border-[var(--taupe)]">
        <div className="container mx-auto px-4">
          <DestinationCarousel 
            title={t('home.topDestinations')}
            destinations={topDestinations}
          />
        </div>
      </section>
      
      {/* Popular Cities */}
      <section className="bg-[var(--taupe)] py-16">
        <div className="container mx-auto px-4">
          <PopularCities 
            title={t('home.popularCities')}
            cities={popularCities}
          />
        </div>
      </section>
    </main>
  );
}
