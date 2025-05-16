'use client';

import { useLanguage } from '@/i18n/language-context';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AboutValues() {
  const { t } = useLanguage();

  const valueCards = [
    {
      id: 'innovation',
      icon: '💡',
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    {
      id: 'community',
      icon: '🤝',
      imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    {
      id: 'accessibility',
      icon: '🌍',
      imageUrl: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    {
      id: 'experience',
      icon: '✨',
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
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
    <section className="py-20 bg-[var(--taupe)]">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--sage-green)] mb-6">
            {t('about.values.title')}
          </h2>
          <div className="w-20 h-1 bg-[var(--sage)] mx-auto mb-8"></div>
          <p className="text-lg max-w-3xl mx-auto text-gray-700">
            {t('about.values.description')}
          </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto"
        >
          {valueCards.map((card) => (
            <motion.div
              key={card.id}
              variants={itemVariants}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all hover-lift"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={card.imageUrl}
                  alt={t(`about.values.${card.id}.imageAlt`)}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
                />
              </div>
              <div className="p-6">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="text-xl font-semibold text-[var(--sage-green)] mb-3">
                  {t(`about.values.${card.id}.title`)}
                </h3>
                <p className="text-gray-700">
                  {t(`about.values.${card.id}.description`)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 bg-white rounded-xl p-8 md:p-12 shadow-lg max-w-4xl mx-auto"
        >
          <h3 className="text-2xl font-semibold text-[var(--sage-green)] mb-6 text-center">
            {t('about.values.commitment.title')}
          </h3>
          <p className="text-lg text-gray-700 mb-6">
            {t('about.values.commitment.description1')}
          </p>
          <p className="text-lg text-gray-700">
            {t('about.values.commitment.description2')}
          </p>
        </motion.div>
      </div>
    </section>
  );
} 