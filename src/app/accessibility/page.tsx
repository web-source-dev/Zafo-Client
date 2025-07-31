import { Metadata } from 'next';
import AccessibilityHero from '@/components/sections/accessibility/Hero';
import AccessibilityContent from '@/components/sections/accessibility/Content';

export const metadata: Metadata = {
  title: 'Accessibility | Zafo - Making Events Accessible to Everyone',
  description: 'Learn about Zafo\'s commitment to accessibility and how we make events accessible to everyone, regardless of ability. Discover our WCAG 2.1 compliance and inclusive features.',
  keywords: 'accessibility, WCAG 2.1, inclusive events, disability support, accessible platform, universal design',
  openGraph: {
    title: 'Accessibility | Zafo - Making Events Accessible to Everyone',
    description: 'Learn about Zafo\'s commitment to accessibility and how we make events accessible to everyone, regardless of ability. Discover our WCAG 2.1 compliance and inclusive features.',
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