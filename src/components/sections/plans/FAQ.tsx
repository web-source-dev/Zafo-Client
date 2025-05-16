'use client';

import { useState } from 'react';
import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import { FaChevronDown, FaQuestionCircle } from 'react-icons/fa';

export default function PlansFAQ() {
  const [openItem, setOpenItem] = useState<number | null>(null);
  const { t } = useLanguage();
  
  const faqItems = [1, 2, 3, 4, 5, 6, 7, 8];
  
  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  return (
    <section className="py-24 bg-[var(--taupe)] relative">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-white to-transparent"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center mb-12"
          >
            <div className="bg-[var(--sage-green)]/10 rounded-full p-3 mb-4">
              <FaQuestionCircle className="h-8 w-8 text-[var(--sage-green)]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--sage-green)] mb-4">
              {t('plans.faq.title')}
            </h2>
            <div className="w-20 h-1 bg-[var(--sage-green)]/30 mb-4"></div>
            <p className="text-lg text-center text-gray-700 max-w-2xl">
              Find answers to the most common questions about our pricing plans, billing, and features.
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {faqItems.map((item, index) => (
              <motion.div 
                key={item}
                variants={itemVariants}
                className={`bg-white rounded-lg shadow-md overflow-hidden border border-transparent transition-all duration-300 ${
                  openItem === index ? 'border-[var(--sage-green)]/30 shadow-lg' : 'hover:shadow-lg'
                }`}
              >
                <button
                  className="w-full text-left p-6 flex justify-between items-center focus:outline-none group"
                  onClick={() => toggleItem(index)}
                  aria-expanded={openItem === index}
                >
                  <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                    openItem === index ? 'text-[var(--sage-green)]' : 'text-gray-800 group-hover:text-[var(--sage-green)]'
                  }`}>
                    {t(`plans.faq.q${item}`)}
                  </h3>
                  <div className={`p-2 rounded-full transition-all duration-300 ${
                    openItem === index ? 'bg-[var(--sage-green)]/10' : 'bg-gray-100 group-hover:bg-[var(--sage-green)]/10'
                  }`}>
                    <FaChevronDown 
                      className={`w-4 h-4 transition-transform duration-300 ${
                        openItem === index ? 'transform rotate-180 text-[var(--sage-green)]' : 'text-gray-500 group-hover:text-[var(--sage-green)]'
                      }`}
                    />
                  </div>
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openItem === index ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-6 pt-0 text-gray-700 border-t border-gray-100 bg-[var(--sage-green)]/5">
                    {t(`plans.faq.a${item}`)}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 text-center bg-white p-8 rounded-xl shadow-md"
          >
            <h3 className="text-2xl font-semibold text-[var(--sage-green)] mb-4">
              {t('plans.faq.stillHaveQuestions')}
            </h3>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              Our support team is ready to help you with any questions you may have about our pricing plans or features.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-[var(--sage-green)] text-white font-medium px-6 py-3 rounded-lg hover:bg-[var(--sage-green)]/90 transition-colors shadow-md hover:shadow-lg"
            >
              {t('plans.faq.contactSupport')}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}