'use client';

import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function AccessibilityContent() {
  const { t } = useLanguage();

  const features = [
    { id: 'keyboard', icon: '⌨️' },
    { id: 'screenReaders', icon: '🔊' },
    { id: 'altText', icon: '🖼️' },
    { id: 'contrast', icon: '🎨' },
    { id: 'text', icon: '📝' },
    { id: 'navigation', icon: '🧭' },
    { id: 'forms', icon: '📋' },
    { id: 'patterns', icon: '🛑' }
  ];

  const eventInfo = [
    { id: 'wheelchair', icon: '♿' },
    { id: 'restrooms', icon: '🚻' },
    { id: 'interpretation', icon: '👐' },
    { id: 'listening', icon: '🎧' },
    { id: 'sensory', icon: '🧠' },
    { id: 'service', icon: '🐕' },
    { id: 'venue', icon: '🏢' }
  ];

  const improvements = [
    { id: 'audits', icon: '📊' },
    { id: 'testing', icon: '🧪' },
    { id: 'training', icon: '👨‍🏫' },
    { id: 'standards', icon: '📚' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
    <>
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-lg text-gray-700 mb-12"
            >
              {t('accessibility.intro.paragraph')}
            </motion.p>
            
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-[var(--sage-green)] mt-8 mb-6"
            >
              {t('accessibility.features.title')}
            </motion.h2>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {features.map((feature) => (
                <motion.div 
                  key={feature.id}
                  variants={itemVariants}
                  className="bg-[var(--taupe)] p-4 rounded-lg flex items-start hover:shadow-md transition-shadow"
                >
                  <div className="text-2xl mr-3 mt-1">{feature.icon}</div>
                  <div>
                    <h3 className="font-medium text-[var(--sage-green)]">
                      {t(`accessibility.features.${feature.id}.title`)}
                    </h3>
                    <p className="text-sm text-gray-700">
                      {t(`accessibility.features.${feature.id}.description`)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-[var(--taupe)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-center gap-8 mb-12"
            >
              <div className="md:w-1/2">
                <h2 className="text-2xl font-bold text-[var(--sage-green)] mb-4">
                  {t('accessibility.eventInfo.title')}
                </h2>
                <p className="text-gray-700">
                  {t('accessibility.eventInfo.description')}
                </p>
              </div>
              
              <div className="md:w-1/2 relative h-64 w-full rounded-lg overflow-hidden shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1536560035542-1326fab3a507?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
                  alt={t('accessibility.eventInfo.imageAlt')}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 600px"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
                />
              </div>
            </motion.div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {eventInfo.map((info) => (
                <motion.div 
                  key={info.id}
                  variants={itemVariants}
                  className="bg-white p-4 rounded-lg flex items-start hover:shadow-md transition-shadow"
                >
                  <div className="text-2xl mr-3 mt-1">{info.icon}</div>
                  <p className="text-gray-700">
                    {t(`accessibility.eventInfo.${info.id}`)}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-[var(--sage-green)] mb-6"
            >
              {t('accessibility.improvements.title')}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-gray-700 mb-8"
            >
              {t('accessibility.improvements.description')}
            </motion.p>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {improvements.map((item) => (
                <motion.div 
                  key={item.id}
                  variants={itemVariants}
                  className="bg-[var(--taupe)] p-6 rounded-lg flex items-start hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mr-4 mt-1">{item.icon}</div>
                  <div>
                    <h3 className="font-medium text-[var(--sage-green)] text-lg mb-2">
                      {t(`accessibility.improvements.${item.id}.title`)}
                    </h3>
                    <p className="text-gray-700">
                      {t(`accessibility.improvements.${item.id}.description`)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-[var(--taupe)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-[var(--sage-green)] mb-6 text-center">
                {t('accessibility.feedback.title')}
              </h2>
              
              <p className="text-gray-700 mb-6">
                {t('accessibility.feedback.description')}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="text-[var(--sage-green)] mr-3">📧</div>
                  <p className="text-gray-700">
                    <strong>{t('accessibility.feedback.email')}:</strong>{' '}
                    <a href="mailto:accessibility@zafo.com" className="text-[var(--sage-green)] hover:underline">
                      accessibility@zafo.com
                    </a>
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="text-[var(--sage-green)] mr-3">📞</div>
                  <p className="text-gray-700">
                    <strong>{t('accessibility.feedback.phone')}:</strong>{' '}
                    <a href="tel:+18005550123" className="text-[var(--sage-green)] hover:underline">
                      +1 (800) 555-0123
                    </a>
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="text-[var(--sage-green)] mr-3">📝</div>
                  <p className="text-gray-700">
                    <strong>{t('accessibility.feedback.form')}:</strong>{' '}
                    <Link href="/contact" className="text-[var(--sage-green)] hover:underline">
                      {t('accessibility.feedback.contactLink')}
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-12 text-center"
            >
              <p className="text-gray-700 italic">
                {t('accessibility.statement.updated')}: {t('accessibility.statement.date')}
              </p>
              
              <div className="mt-8 flex justify-center">
                <a 
                  href="https://www.w3.org/WAI/WCAG21/quickref/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center text-[var(--sage-green)] font-medium hover:underline"
                >
                  {t('accessibility.statement.learnMore')}
                  <svg className="ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
          </div>
            </motion.div>
        </div>
      </div>
    </section>
    </>
  );
} 