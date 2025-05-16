'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/i18n/language-context';
import { motion, AnimatePresence } from 'framer-motion';

type Story = {
  id: string;
  imageUrl: string;
};

export default function ImpactStories() {
  const { t } = useLanguage();
  const [activeStory, setActiveStory] = useState(0);
  
  const stories: Story[] = [
    {
      id: 'maria',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'david',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'aisha',
      imageUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    }
  ];
  
  const nextStory = () => {
    setActiveStory((prev) => (prev + 1) % stories.length);
  };
  
  const prevStory = () => {
    setActiveStory((prev) => (prev - 1 + stories.length) % stories.length);
  };
  
  return (
    <section className="py-20 bg-[var(--taupe)]">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center text-[var(--sage-green)] mb-16"
        >
          {t('impact.stories.title')}
        </motion.h2>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-2/5 relative">
                <div className="h-64 md:h-full w-full relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStory}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={stories[activeStory].imageUrl}
                        alt={t(`impact.stories.${stories[activeStory].id}.name`)}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              
              <div className="md:w-3/5 p-8 md:p-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStory}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col h-full justify-between"
                  >
                    <div>
                      <blockquote className="text-gray-700 italic mb-6">
                        &quot;{t(`impact.stories.${stories[activeStory].id}.testimonial`)}&quot;
                      </blockquote>
                      <div className="mb-8">
                        <h4 className="text-xl font-semibold text-[var(--sage-green)]">
                          {t(`impact.stories.${stories[activeStory].id}.name`)}
                        </h4>
                        <p className="text-[var(--cognac)] font-medium">
                          {t(`impact.stories.${stories[activeStory].id}.role`)}, {t(`impact.stories.${stories[activeStory].id}.organization`)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-1">
                    {stories.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveStory(idx)}
                        className={`w-3 h-3 rounded-full ${
                          idx === activeStory 
                            ? 'bg-[var(--sage-green)]' 
                            : 'bg-[var(--sage)] opacity-50'
                        }`}
                        aria-label={t('impact.stories.controls.goToStory', { number: String(idx + 1) })}
                      />
                    ))}
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={prevStory}
                      className="p-2 rounded-full bg-[var(--taupe)] hover:bg-[var(--sage)] transition-colors"
                      aria-label={t('impact.stories.controls.previous')}
                    >
                      <svg className="w-5 h-5 text-[var(--sage-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextStory}
                      className="p-2 rounded-full bg-[var(--taupe)] hover:bg-[var(--sage)] transition-colors"
                      aria-label={t('impact.stories.controls.next')}
                    >
                      <svg className="w-5 h-5 text-[var(--sage-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 