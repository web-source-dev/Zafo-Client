'use client';

import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';

export default function ImpactGoals() {
  const { t } = useLanguage();
  
  const goalCategories = ['environmental', 'accessibility', 'community', 'education'];
  
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
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--sage-green)] mb-6">
              {t('impact.goals.title')}
            </h2>
            
            <p className="text-lg text-gray-700 mb-12 text-center">
              {t('impact.goals.description')}
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-10"
          >
            {goalCategories.map((category, index) => (
              <motion.div 
                key={category}
                variants={itemVariants}
                className="bg-[var(--taupe)] p-8 rounded-xl shadow-md"
              >
                <h3 className="text-xl font-bold text-[var(--sage-green)] mb-4 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 bg-[var(--sage-green)] text-white rounded-full mr-3 text-sm">{index + 1}</span>
                  {t(`impact.goals.${category}.title`)}
                </h3>
                <ul className="space-y-3 text-gray-700 ml-11">
                  {[0, 1, 2].map((goalIndex) => (
                    <li key={goalIndex} className="flex items-start">
                      <svg className="h-5 w-5 text-[var(--sage-green)] mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{t(`impact.goals.${category}.goals.${goalIndex}`)}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 text-center"
          >
            <a 
              href="/about" 
              className="inline-flex items-center text-[var(--sage-green)] font-semibold hover:underline"
            >
              {t('impact.goals.learnMore')}
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 