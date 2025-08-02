'use client';

import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Users, 
  BarChart3, 
  MessageSquare, 
  Globe,
  CreditCard,
  Headphones
} from 'lucide-react';

export default function PricingFeatures() {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: Shield,
      title: 'pricing.features.security.title',
      description: 'pricing.features.security.description',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Zap,
      title: 'pricing.features.performance.title',
      description: 'pricing.features.performance.description',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Users,
      title: 'pricing.features.support.title',
      description: 'pricing.features.support.description',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: BarChart3,
      title: 'pricing.features.analytics.title',
      description: 'pricing.features.analytics.description',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: MessageSquare,
      title: 'pricing.features.communication.title',
      description: 'pricing.features.communication.description',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Globe,
      title: 'pricing.features.global.title',
      description: 'pricing.features.global.description',
      color: 'from-teal-500 to-teal-600'
    }
  ];
  
  return (
    <section className="py-20 bg-gradient-to-br from-[var(--taupe)] to-[var(--sage)]">
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
              {t('pricing.features.title')}
            </h2>
            <p className="text-xl text-[var(--black)]/70 max-w-3xl mx-auto">
              {t('pricing.features.description')}
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
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--sage)]/20"
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
          
          {/* Value Proposition */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl max-w-4xl mx-auto border border-[var(--sage)]/20">
              <h3 className="text-2xl md:text-3xl font-bold text-[var(--black)] mb-6">
                {t('pricing.features.valueTitle')}
              </h3>
              <p className="text-[var(--black)]/80 text-lg leading-relaxed mb-8">
                {t('pricing.features.valueDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  {t('pricing.features.getStarted')}
                </button>
                <button className="bg-white border-2 border-[var(--sage-green)] text-[var(--sage-green)] px-8 py-4 rounded-xl font-semibold hover:bg-[var(--sage-green)] hover:text-white transition-all duration-300 transform hover:scale-105">
                  {t('pricing.features.contactSales')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 