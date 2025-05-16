import { Metadata } from 'next';
import AccessibilityHero from '@/components/sections/accessibility/Hero';
import AccessibilityContent from '@/components/sections/accessibility/Content';

export const metadata: Metadata = {
  title: 'Accessibility | Zafo',
  description: 'Learn about Zafo\'s commitment to accessibility and how we make events accessible to everyone, regardless of ability.',
  openGraph: {
    title: 'Accessibility | Zafo',
    description: 'Learn about Zafo\'s commitment to accessibility and how we make events accessible to everyone, regardless of ability.',
    type: 'website'
  }
};

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen animate-fadeIn">
      <AccessibilityHero />
      <AccessibilityContent />
    </main>
  );
} 