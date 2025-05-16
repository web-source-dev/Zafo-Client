'use client';

import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';

type ContentItem = {
  label: string;
  value: string;
  isTranslated?: boolean;
  isAddress?: boolean;
};

type ContactCard = {
  id: string;
  icon: React.ReactNode;
  title: string;
  content: ContentItem[];
};

export default function ContactInfo() {
  const { t, currentLanguage } = useLanguage();

  const contactCards: ContactCard[] = [
    {
      id: 'email',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--sage-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'contact.info.emailUs',
      content: [
        { label: 'contact.info.generalInquiries', value: 'info@zafo.com' },
        { label: 'contact.info.supportInquiries', value: 'support@zafo.com' }
      ]
    },
    {
      id: 'phone',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--sage-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'contact.info.callUs',
      content: [
        { label: 'contact.info.customerService', value: '+1 (800) 555-0123' },
        { label: 'contact.info.businessHours', value: 'contact.info.businessHoursValue', isTranslated: true }
      ]
    },
    {
      id: 'location',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--sage-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'contact.info.visitUs',
      content: [
        { label: 'contact.info.headquarters', value: 'contact.info.address', isTranslated: true, isAddress: true }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center text-[var(--sage-green)] mb-16"
        >
          {currentLanguage === 'en' ? 'Get in Touch' : 'Kontaktieren Sie uns'}
        </motion.h2>
        
        <div className="max-w-6xl mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {contactCards.map((card) => (
              <motion.div 
                key={card.id} 
                variants={itemVariants}
                className="bg-[var(--taupe)] rounded-xl shadow-md p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                whileHover={{ 
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white mb-6 shadow-md">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--sage-green)] mb-6">{t(card.title)}</h3>

                  {card.content.map((item, index) => (
                    <div key={index} className={index !== 0 ? 'mt-6' : ''}>
                      <p className="text-gray-700 font-medium mb-2">{t(item.label)}</p>
                      {item.isAddress ? (
                        <address className="text-gray-600 not-italic">
                          {t(item.value).split('\n').map((line, idx) => (
                            <span key={idx} className="block mb-1">
                              {line}
                            </span>
                          ))}
                        </address>
                      ) : item.isTranslated ? (
                        <p className="text-gray-600 font-medium">
                          {t(item.value)}
                        </p>
                      ) : (
                        <a 
                          href={card.id === 'email' ? `mailto:${item.value}` : card.id === 'phone' ? `tel:${item.value.replace(/[^0-9+]/g, '')}` : '#'} 
                          className="text-[var(--sage-green)] hover:text-[var(--cognac)] hover:underline font-medium transition-colors"
                        >
                          {item.value}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
} 