'use client';

import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function InvestorsContact() {
  const { t } = useLanguage();

  const contactOptions = [
    { id: 'meetings', icon: '📅' },
    { id: 'reports', icon: '📊' },
    { id: 'newsletter', icon: '📧' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--sage-green)] mb-6">
              {t('investors.contact.title')}
            </h2>
            <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
              {t('investors.contact.description')}
            </p>
          </motion.div>

          <div className="space-y-10">
            {contactOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-[var(--taupe)] rounded-xl p-8 flex flex-col md:flex-row items-start md:items-center gap-6"
              >
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow-md flex-shrink-0">
                  {option.icon}
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-[var(--sage-green)] mb-2">
                    {t(`investors.contact.${option.id}.title`)}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {t(`investors.contact.${option.id}.description`)}
                  </p>
                </div>
                <div className="flex-shrink-0 w-full md:w-auto">
                  <Button variant="primary">
                    {t(`investors.contact.${option.id}.button`)}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16"
          >
            <h3 className="text-xl font-semibold text-[var(--sage-green)] mb-4">{t('investors.contact.inquiries.title')}</h3>
            <p className="text-gray-700 mb-6">
              {t('investors.contact.inquiries.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder={t('investors.contact.inquiries.placeholder')}
                className="flex-grow px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--sage-green)]"
              />
              <Button variant="primary">
                {t('investors.contact.inquiries.button')}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 