import PricingHero from '@/components/sections/pricing/Hero';
import PricingPlans from '@/components/sections/pricing/Plans';
import PricingFAQ from '@/components/sections/pricing/FAQ';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | Zafo - Transparent Event Platform Fees',
  description: 'Clear and transparent pricing for Zafo event platform. Platform fees: 350 CHF for events under 24 hours, 675 CHF for events over 24 hours. 10% ticket fee and 2.5 CHF refund processing fee.',
  keywords: 'pricing, platform fees, event fees, ticket fees, refund policy, transparent pricing, event platform costs',
  openGraph: {
    title: 'Pricing | Zafo - Transparent Event Platform Fees',
    description: 'Clear and transparent pricing for Zafo event platform. Platform fees: 350 CHF for events under 24 hours, 675 CHF for events over 24 hours. 10% ticket fee and 2.5 CHF refund processing fee.',
    type: 'website',
  },
};

export default function PricingPage() {
  return (
    <main className="animate-fadeIn">
      <PricingHero />
      <PricingPlans />
      <PricingFAQ />
    </main>
  );
} 