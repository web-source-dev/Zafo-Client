import ContactHero from '@/components/sections/contact/Hero';
import ContactInfo from '@/components/sections/contact/ContactInfo';
import ContactForm from '@/components/sections/contact/ContactForm';
import ContactMap from '@/components/sections/contact/Map';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Zafo | Get in Touch With Our Team',
  description: 'Have questions or feedback? Contact our team via email, phone, or visit our headquarters. We\'re here to help with all your event-related inquiries.',
  openGraph: {
    title: 'Contact Zafo | Get in Touch With Our Team',
    description: 'Have questions or feedback? Contact our team via email, phone, or visit our headquarters.',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Contact Zafo'
      }
    ]
  }
};

export default function ContactPage() {
  return (
    <main className="animate-fadeIn min-h-screen">
      <ContactHero />
      <ContactInfo />
      <ContactForm />
      <ContactMap />
    </main>
  );
} 