'use client';

import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';

export default function InvestorsStrategy() {
  const { t } = useLanguage();

  const strategies = [
    { id: 'expansion', icon: '🌍' },
    { id: 'innovation', icon: '💡' },
    { id: 'partnerships', icon: '🤝' },
    { id: 'sustainability', icon: '🌱' }
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
    <section className="py-20 bg-[var(--taupe)]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--sage-green)] mb-6">
            {t('investors.strategy.title')}
          </h2>
          <div className="w-20 h-1 bg-[var(--sage)] mx-auto mb-8"></div>
          <p className="text-lg max-w-3xl mx-auto text-gray-700">
            {t('investors.strategy.description')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto"
        >
          {strategies.map((strategy) => (
            <motion.div
              key={strategy.id}
              variants={itemVariants}
              className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all hover-lift"
            >
              <div className="text-3xl mb-4">{strategy.icon}</div>
              <h3 className="text-xl font-semibold text-[var(--sage-green)] mb-3">
                {t(`investors.strategy.${strategy.id}.title`)}
              </h3>
              <p className="text-gray-700 mb-4">
                {t(`investors.strategy.${strategy.id}.description`)}
              </p>
              <div className="mt-4 bg-[var(--taupe)] p-3 rounded-lg">
                <p className="text-sm font-medium text-[var(--sage-green)]">
                  {t(`investors.strategy.${strategy.id}.goal`)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 