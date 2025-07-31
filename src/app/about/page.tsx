import AboutHero from '@/components/sections/about/Hero';
import AboutMission from '@/components/sections/about/Mission';
import AboutValues from '@/components/sections/about/Values';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Zafo | Our Mission, Values & Team',
  description: 'Discover Zafo\'s mission to connect people through events, our core values that guide our platform, and meet the team behind the scenes.',
  keywords: 'about zafo, event platform, mission, values, team, community, innovation',
  openGraph: {
    title: 'About Zafo | Our Mission, Values & Team',
    description: 'Discover Zafo\'s mission to connect people through events, our core values that guide our platform, and meet the team behind the scenes.',
    type: 'website',
  },
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