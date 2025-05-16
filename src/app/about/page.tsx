import AboutHero from '@/components/sections/about/Hero';
import AboutMission from '@/components/sections/about/Mission';
import AboutValues from '@/components/sections/about/Values';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Zafo | Our Mission & Values',
  description: 'Learn about Zafo, our mission to connect people through events, and the core values that guide our platform.'
};

export default function AboutPage() {
  return (
    <main className="animate-fadeIn">
      <AboutHero />
      <AboutMission />
      <AboutValues />
    </main>
  );
} 