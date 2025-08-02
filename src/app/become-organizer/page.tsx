import BecomeOrganizerHero from '@/components/sections/become-organizer/Hero';
import BecomeOrganizerBenefits from '@/components/sections/become-organizer/Benefits';
import BecomeOrganizerProcess from '@/components/sections/become-organizer/Process';
import BecomeOrganizerFeatures from '@/components/sections/become-organizer/Features';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Become an Organizer | Zafo - Start Creating Amazing Events',
  description: 'Join thousands of successful event organizers on Zafo. Create, manage, and promote your events with our powerful platform. Start your journey as an organizer today.',
  keywords: 'become organizer, event organizer, create events, event management, organizer benefits, start organizing events',
  openGraph: {
    title: 'Become an Organizer | Zafo - Start Creating Amazing Events',
    description: 'Join thousands of successful event organizers on Zafo. Create, manage, and promote your events with our powerful platform. Start your journey as an organizer today.',
    type: 'website',
  },
};

export default function BecomeOrganizerPage() {
  return (
    <main className="animate-fadeIn">
      <BecomeOrganizerHero />
      <BecomeOrganizerBenefits />
      <BecomeOrganizerProcess />
      <BecomeOrganizerFeatures />
    </main>
  );
} 