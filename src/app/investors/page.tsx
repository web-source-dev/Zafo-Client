import { Metadata } from 'next';
import InvestorsHero from '@/components/sections/investors/Hero';
import InvestorsFinancialHighlights from '@/components/sections/investors/FinancialHighlights';
import InvestorsStrategy from '@/components/sections/investors/Strategy';
import InvestorsContact from '@/components/sections/investors/Contact';

export const metadata: Metadata = {
  title: 'Investor Relations | Zafo',
  description: 'Information for Zafo investors and potential investors, including financial performance, growth metrics, and investment opportunities.',
  openGraph: {
    title: 'Investor Relations | Zafo',
    description: 'Learn about Zafo\'s financial performance and growth opportunities for investors.',
    type: 'website'
  },
};

export default function InvestorsPage() {
  return (
    <main className="min-h-screen animate-fadeIn">
      <InvestorsHero />
      <InvestorsFinancialHighlights />
      <InvestorsStrategy />
      <InvestorsContact />
    </main>
  );
} 