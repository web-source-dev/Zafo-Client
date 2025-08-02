'use client';

import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  MessageSquare, 
  Settings, 
  Globe, 
  Shield,
  Zap,
  Users,
  CreditCard
} from 'lucide-react';

export default function BecomeOrganizerFeatures() {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: BarChart3,
      title: 'becomeOrganizer.features.analytics.title',
      description: 'becomeOrganizer.features.analytics.description',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: MessageSquare,
      title: 'becomeOrganizer.features.communication.title',
      description: 'becomeOrganizer.features.communication.description',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Settings,
      title: 'becomeOrganizer.features.management.title',
      description: 'becomeOrganizer.features.management.description',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Globe,
      title: 'becomeOrganizer.features.marketing.title',
      description: 'becomeOrganizer.features.marketing.description',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Shield,
      title: 'becomeOrganizer.features.security.title',
      description: 'becomeOrganizer.features.security.description',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Zap,
      title: 'becomeOrganizer.features.automation.title',
      description: 'becomeOrganizer.features.automation.description',
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
              {t('becomeOrganizer.features.title')}
            </h2>
            <p className="text-xl text-[var(--black)]/70 max-w-3xl mx-auto">
              {t('becomeOrganizer.features.description')}
            </p>
          </motion.div>
          
          {/* Features Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[var(--taupe)] to-[var(--sage)] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--sage)]/20"
              >
                <div className="flex justify-center mb-6">
                  <div className={`p-4 bg-gradient-to-r ${feature.color} rounded-xl`}>
                    <feature.icon size={32} className="text-white" />
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-[var(--black)] mb-4 text-center">
                  {t(feature.title)}
                </h4>
                <p className="text-[var(--black)]/70 text-center leading-relaxed">
                  {t(feature.description)}
                </p>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Platform Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)] rounded-3xl p-8 md:p-12 text-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-6">
                    {t('becomeOrganizer.features.overview.title')}
                  </h3>
                  <p className="text-lg opacity-90 mb-6">
                    {t('becomeOrganizer.features.overview.description')}
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <Users size={20} className="text-white" />
                      <span>{t('becomeOrganizer.features.overview.benefit1')}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CreditCard size={20} className="text-white" />
                      <span>{t('becomeOrganizer.features.overview.benefit2')}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Shield size={20} className="text-white" />
                      <span>{t('becomeOrganizer.features.overview.benefit3')}</span>
                    </li>
                  </ul>
                </div>
                <div className="text-center">
                  <button className="bg-white text-[var(--sage-green)] px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    {t('becomeOrganizer.features.overview.button')}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 