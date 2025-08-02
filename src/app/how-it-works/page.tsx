import HowItWorksHero from '@/components/sections/how-it-works/Hero';
import HowItWorksProcess from '@/components/sections/how-it-works/Process';
import HowItWorksFeatures from '@/components/sections/how-it-works/Features';
import HowItWorksTestimonials from '@/components/sections/how-it-works/Testimonials';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works | Zafo - Event Creation & Ticket Platform',
  description: 'Learn how Zafo works for both event organizers and attendees. Discover the simple process of creating events, selling tickets, and joining exciting experiences.',
  keywords: 'how it works, event platform, create events, buy tickets, organizer guide, attendee guide, event management',
  openGraph: {
    title: 'How It Works | Zafo - Event Creation & Ticket Platform',
    description: 'Learn how Zafo works for both event organizers and attendees. Discover the simple process of creating events, selling tickets, and joining exciting experiences.',
    type: 'website',
  },
};

export default function HowItWorksPage() {
  return (
    <main className="animate-fadeIn">
      <HowItWorksHero />
      <HowItWorksProcess />
      <HowItWorksFeatures />
      <HowItWorksTestimonials />
    </main>
  );
} 