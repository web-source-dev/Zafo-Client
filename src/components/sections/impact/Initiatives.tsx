'use client';

import Image from 'next/image';
import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';

type Initiative = {
  id: string;
  imageUrl: string;
};

export default function ImpactInitiatives() {
  const { t } = useLanguage();

  const initiatives: Initiative[] = [
    {
      id: 'community',
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    {
      id: 'green',
      imageUrl: 'https://images.unsplash.com/photo-1606967365396-f6b8a0a8c31e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    {
      id: 'diversity',
      imageUrl: 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3'
    }
  ];

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
          {t('impact.initiatives.title')}
        </motion.h2>
        
        <div className="space-y-24">
          {initiatives.map((initiative, index) => (
            <motion.div 
              key={initiative.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`flex flex-col ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } gap-12 items-center`}
            >
              <div className="md:w-1/2">
                <div className="relative h-[350px] w-full rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={initiative.imageUrl}
                    alt={t(`impact.initiatives.${initiative.id}.imageAlt`)}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
                  />
                </div>
              </div>
              
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold text-[var(--sage-green)] mb-4">
                  {t(`impact.initiatives.${initiative.id}.title`)}
                </h3>
                <p className="text-gray-700 mb-8">
                  {t(`impact.initiatives.${initiative.id}.description`)}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[0, 1, 2].map((statIndex) => (
                    <div key={statIndex} className="bg-[var(--taupe)] p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-[var(--sage-green)]">
                        {t(`impact.initiatives.${initiative.id}.stats.${statIndex}.value`)}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {t(`impact.initiatives.${initiative.id}.stats.${statIndex}.label`)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 