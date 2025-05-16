import { Metadata } from 'next';
import ImpactHero from '@/components/sections/impact/Hero';
import ImpactInitiatives from '@/components/sections/impact/Initiatives';
import ImpactStories from '@/components/sections/impact/Stories';
import ImpactGoals from '@/components/sections/impact/Goals';

export const metadata: Metadata = {
  title: 'Our Impact | Zafo',
  description: 'Discover how Zafo is making a positive difference in communities around the world through our sustainability initiatives and community programs.',
  openGraph: {
    title: 'Our Impact | Zafo',
    description: 'Discover how Zafo is making a positive difference in communities around the world.',
    type: 'website'
  },
};

export default function ImpactPage() {
  return (
    <main className="min-h-screen">
      <ImpactHero />
      <ImpactInitiatives />
      <ImpactStories />
      <ImpactGoals />
    </main>
  );
} 