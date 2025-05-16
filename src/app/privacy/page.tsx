import PrivacyHero from '@/components/sections/privacy/Hero';
import PrivacyContent from '@/components/sections/privacy/Content';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Zafo',
  description: 'Learn how Zafo collects, uses, and protects your personal information when you use our event discovery and management platform.'
};

export default function PrivacyPage() {
  return (
    <main className="animate-fadeIn">
      <PrivacyHero />
      <PrivacyContent />
    </main>
  );
} 