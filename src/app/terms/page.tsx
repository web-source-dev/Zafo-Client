import TermsHero from '@/components/sections/terms/Hero';
import TermsContent from '@/components/sections/terms/Content';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Zafo',
  description: 'Read the terms and conditions governing the use of Zafo\'s event discovery and management platform.'
};

export default function TermsPage() {
  return (
    <main className="animate-fadeIn">
      <TermsHero />
      <TermsContent />
    </main>
  );
} 