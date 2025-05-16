'use client';

import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';

export default function AboutMission() {
  const { t } = useLanguage();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2 * index,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const missionValues = [
    { icon: '🌱', title: 'about.mission.value1.title', desc: 'about.mission.value1.description' },
    { icon: '🤝', title: 'about.mission.value2.title', desc: 'about.mission.value2.description' },
    { icon: '🌍', title: 'about.mission.value3.title', desc: 'about.mission.value3.description' },
    { icon: '💡', title: 'about.mission.value4.title', desc: 'about.mission.value4.description' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center text-[var(--sage-green)] mb-12"
          >
            {t('about.mission.title')}
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-semibold text-[var(--sage-green)] mb-4">{t('about.mission.subtitle')}</h3>
            <p className="text-lg text-gray-700 mb-6">
              {t('about.mission.paragraph1')}
            </p>
            <p className="text-lg text-gray-700">
              {t('about.mission.paragraph2')}
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-10">
            {missionValues.map((value, index) => (
              <motion.div 
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                key={index}
                className="bg-[var(--taupe)] p-8 rounded-lg shadow-md hover:shadow-lg transition-all hover-lift"
              >
                <div className="text-3xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-[var(--sage-green)] mb-4">{t(value.title)}</h3>
                <p className="text-gray-700">
                  {t(value.desc)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 