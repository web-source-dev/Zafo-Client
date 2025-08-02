'use client';

import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function PricingFAQ() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const faqs = [
    {
      question: 'pricing.faq.question1',
      answer: 'pricing.faq.answer1'
    },
    {
      question: 'pricing.faq.question2',
      answer: 'pricing.faq.answer2'
    },
    {
      question: 'pricing.faq.question3',
      answer: 'pricing.faq.answer3'
    },
    {
      question: 'pricing.faq.question4',
      answer: 'pricing.faq.answer4'
    },
    {
      question: 'pricing.faq.question5',
      answer: 'pricing.faq.answer5'
    },
    {
      question: 'pricing.faq.question6',
      answer: 'pricing.faq.answer6'
    }
  ];
  
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--black)] mb-6">
              {t('pricing.faq.title')}
            </h2>
            <p className="text-xl text-[var(--black)]/70 max-w-3xl mx-auto">
              {t('pricing.faq.description')}
            </p>
          </motion.div>
          
          {/* FAQ Items */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl border border-[var(--sage)]/20 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-[var(--taupe)]/5 transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold text-[var(--black)] pr-4">
                    {t(faq.question)}
                  </h3>
                  <div className="flex-shrink-0">
                    {openFaq === index ? (
                      <ChevronUp size={24} className="text-[var(--sage-green)]" />
                    ) : (
                      <ChevronDown size={24} className="text-[var(--sage-green)]" />
                    )}
                  </div>
                </button>
                
                {openFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-8 pb-6"
                  >
                    <p className="text-[var(--black)]/70 leading-relaxed">
                      {t(faq.answer)}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
          

        </div>
      </div>
    </section>
  );
} 