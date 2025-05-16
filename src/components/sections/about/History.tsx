'use client';

import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
import { InView } from 'react-intersection-observer';

export default function AboutHistory() {
  const { t } = useLanguage();
  
  // Wrap timelineYears in its own useMemo hook
  const timelineYears = useMemo(() => [
    { year: "2018", title: t("about.history.title2018"), description: t("about.history.description2018") },
    { year: "2019", title: t("about.history.title2019"), description: t("about.history.description2019") },
    { year: "2020", title: t("about.history.title2020"), description: t("about.history.description2020") },
    { year: "2021", title: t("about.history.title2021"), description: t("about.history.description2021") },
    { year: t("about.history.yearToday"), title: t("about.history.titleToday"), description: t("about.history.descriptionToday") }
  ], [t]);

  return (
    <section className="py-16 bg-warm-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-deep-brown">
            {t("about.history.title")}
          </h2>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {timelineYears.map((item, index) => (
            <InView key={item.year} threshold={0.3} triggerOnce>
              {({ inView, ref }) => (
                <motion.div
                  ref={ref}
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`relative pb-12 ${index === timelineYears.length - 1 ? '' : 'before:absolute before:content-[""] before:left-8 before:top-10 before:w-0.5 before:h-full before:bg-sage-green/20'}`}
                >
                  <div className="flex flex-col md:flex-row items-start">
                    <div className="md:w-1/3 mb-4 md:mb-0 flex items-center relative">
                      <span className="text-2xl font-bold text-[var(--sage)] relative z-10">{item.year}</span>
                      <div className="absolute left-0 md:right-0 md:left-auto md:-mr-5 ml-24 md:ml-0 w-5 h-5 rounded-full bg-[var(--sage-green)] border-4 border-[var(--taupe)] z-10"></div>
                    </div>
                    <div className="md:w-2/3 pl-8 md:pl-12">
                      <h3 className="text-xl font-semibold text-[var(--sage-green)] mb-3">{item.title}</h3>
                      <p className="text-gray-700 mb-4">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
} 