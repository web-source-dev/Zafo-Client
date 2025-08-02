'use client';

import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Users, 
  BarChart3, 
  Shield, 
  Globe, 
  CreditCard,
} from 'lucide-react';

export default function BecomeOrganizerBenefits() {
  const { t } = useLanguage();
  
  const benefits = [
    {
      icon: Zap,
      title: 'becomeOrganizer.benefits.easySetup.title',
      description: 'becomeOrganizer.benefits.easySetup.description',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'becomeOrganizer.benefits.reach.title',
      description: 'becomeOrganizer.benefits.reach.description',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: BarChart3,
      title: 'becomeOrganizer.benefits.analytics.title',
      description: 'becomeOrganizer.benefits.analytics.description',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Shield,
      title: 'becomeOrganizer.benefits.secure.title',
      description: 'becomeOrganizer.benefits.secure.description',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Globe,
      title: 'becomeOrganizer.benefits.global.title',
      description: 'becomeOrganizer.benefits.global.description',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: CreditCard,
      title: 'becomeOrganizer.benefits.payments.title',
      description: 'becomeOrganizer.benefits.payments.description',
      color: 'from-teal-500 to-teal-600'
    }
  ];
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--black)] mb-6">
              {t('becomeOrganizer.benefits.title')}
            </h2>
            <p className="text-xl text-[var(--black)]/70 max-w-3xl mx-auto">
              {t('becomeOrganizer.benefits.description')}
            </p>
          </motion.div>
          
          {/* Benefits Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[var(--taupe)] to-[var(--sage)] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--sage)]/20"
              >
                <div className="flex justify-center mb-6">
                  <div className={`p-4 bg-gradient-to-r ${benefit.color} rounded-xl`}>
                    <benefit.icon size={32} className="text-white" />
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-[var(--black)] mb-4 text-center">
                  {t(benefit.title)}
                </h4>
                <p className="text-[var(--black)]/70 text-center leading-relaxed">
                  {t(benefit.description)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
} 