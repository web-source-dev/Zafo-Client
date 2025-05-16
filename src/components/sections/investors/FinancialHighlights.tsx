'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';

type FinancialData = {
  year: string;
  revenue: string;
  growth: string;
  userBase: string;
  events: string;
};

export default function InvestorsFinancialHighlights() {
  const { t } = useLanguage();
  const [activeYear, setActiveYear] = useState('2023');
  
  const financialData: FinancialData[] = [
    {
      year: '2023',
      revenue: '$45.7M',
      growth: '+78%',
      userBase: '7.2M',
      events: '320K'
    },
    {
      year: '2022',
      revenue: '$25.6M',
      growth: '+102%',
      userBase: '4.3M',
      events: '210K'
    },
    {
      year: '2021',
      revenue: '$12.7M',
      growth: '+145%',
      userBase: '2.1M',
      events: '105K'
    },
    {
      year: '2020',
      revenue: '$5.2M',
      growth: '+86%',
      userBase: '890K',
      events: '42K'
    }
  ];
  
  const activeData = financialData.find(data => data.year === activeYear) || financialData[0];
  
  const cardVariants = {
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
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center text-[var(--sage-green)] mb-6"
          >
            {t('investors.financials.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-gray-700 mb-12 max-w-3xl mx-auto"
          >
            {t('investors.financials.description')}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center mb-12 space-x-2"
          >
            {financialData.map(data => (
              <Button
                key={data.year}
                variant={activeYear === data.year ? 'primary' : 'outline'}
                onClick={() => setActiveYear(data.year)}
                className="min-w-[80px]"
              >
                {data.year}
              </Button>
            ))}
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div 
              custom={0}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-[var(--taupe)] p-6 rounded-lg text-center"
            >
              <h3 className="text-gray-600 text-sm font-medium mb-2">{t('investors.financials.revenue')}</h3>
              <p className="text-3xl font-bold text-[var(--sage-green)]">{activeData.revenue}</p>
            </motion.div>
            
            <motion.div
              custom={1}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-[var(--taupe)] p-6 rounded-lg text-center"
            >
              <h3 className="text-gray-600 text-sm font-medium mb-2">{t('investors.financials.growth')}</h3>
              <p className="text-3xl font-bold text-green-600">{activeData.growth}</p>
            </motion.div>
            
            <motion.div
              custom={2}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-[var(--taupe)] p-6 rounded-lg text-center"
            >
              <h3 className="text-gray-600 text-sm font-medium mb-2">{t('investors.financials.userBase')}</h3>
              <p className="text-3xl font-bold text-[var(--sage-green)]">{activeData.userBase}</p>
            </motion.div>
            
            <motion.div
              custom={3}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-[var(--taupe)] p-6 rounded-lg text-center"
            >
              <h3 className="text-gray-600 text-sm font-medium mb-2">{t('investors.financials.events')}</h3>
              <p className="text-3xl font-bold text-[var(--sage-green)]">{activeData.events}</p>
            </motion.div>
          </div>
          
          <div className="mt-12 flex justify-center">
            <a 
              href="#financial-reports" 
              className="inline-flex items-center text-[var(--sage-green)] font-semibold hover:underline"
            >
              View detailed financial reports
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 