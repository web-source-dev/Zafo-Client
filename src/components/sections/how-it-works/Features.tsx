'use client';

import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import { 
  Shield, 
  CreditCard, 
  Smartphone, 
  BarChart3, 
  MessageSquare, 
  Users,
  Settings,
  Zap,
  Globe,
  Headphones,
  Search
} from 'lucide-react';

export default function HowItWorksFeatures() {
  const { t } = useLanguage();
  
  const organizerFeatures = [
    {
      icon: Settings,
      title: 'howItWorks.features.organizer.feature1.title',
      description: 'howItWorks.features.organizer.feature1.description',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: BarChart3,
      title: 'howItWorks.features.organizer.feature2.title',
      description: 'howItWorks.features.organizer.feature2.description',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: CreditCard,
      title: 'howItWorks.features.organizer.feature3.title',
      description: 'howItWorks.features.organizer.feature3.description',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: MessageSquare,
      title: 'howItWorks.features.organizer.feature4.title',
      description: 'howItWorks.features.organizer.feature4.description',
      color: 'from-orange-500 to-orange-600'
    }
  ];
  
  const attendeeFeatures = [
    {
      icon: Search,
      title: 'howItWorks.features.attendee.feature1.title',
      description: 'howItWorks.features.attendee.feature1.description',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: Smartphone,
      title: 'howItWorks.features.attendee.feature2.title',
      description: 'howItWorks.features.attendee.feature2.description',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Shield,
      title: 'howItWorks.features.attendee.feature3.title',
      description: 'howItWorks.features.attendee.feature3.description',
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: Users,
      title: 'howItWorks.features.attendee.feature4.title',
      description: 'howItWorks.features.attendee.feature4.description',
      color: 'from-emerald-500 to-emerald-600'
    }
  ];
  
  const platformFeatures = [
    {
      icon: Zap,
      title: 'howItWorks.features.platform.feature1.title',
      description: 'howItWorks.features.platform.feature1.description'
    },
    {
      icon: Globe,
      title: 'howItWorks.features.platform.feature2.title',
      description: 'howItWorks.features.platform.feature2.description'
    },
    {
      icon: Headphones,
      title: 'howItWorks.features.platform.feature3.title',
      description: 'howItWorks.features.platform.feature3.description'
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
              {t('howItWorks.features.title')}
            </h2>
            <p className="text-xl text-[var(--black)]/70 max-w-3xl mx-auto">
              {t('howItWorks.features.description')}
            </p>
          </motion.div>
          
          {/* Platform Features */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-[var(--black)] mb-4">
                {t('howItWorks.features.platform.title')}
              </h3>
              <p className="text-lg text-[var(--black)]/70">
                {t('howItWorks.features.platform.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {platformFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--sage)]/20"
                >
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)] rounded-xl">
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
            </div>
          </motion.div>
          
          {/* Organizer Features */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-[var(--black)] mb-4">
                {t('howItWorks.features.organizer.title')}
              </h3>
              <p className="text-lg text-[var(--black)]/70">
                {t('howItWorks.features.organizer.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {organizerFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--sage)]/20"
                >
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 bg-gradient-to-r ${feature.color} rounded-xl`}>
                      <feature.icon size={24} className="text-white" />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-[var(--black)] mb-3 text-center">
                    {t(feature.title)}
                  </h4>
                  <p className="text-[var(--black)]/70 text-center text-sm leading-relaxed">
                    {t(feature.description)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Attendee Features */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-[var(--black)] mb-4">
                {t('howItWorks.features.attendee.title')}
              </h3>
              <p className="text-lg text-[var(--black)]/70">
                {t('howItWorks.features.attendee.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {attendeeFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--sage)]/20"
                >
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 bg-gradient-to-r ${feature.color} rounded-xl`}>
                      <feature.icon size={24} className="text-white" />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-[var(--black)] mb-3 text-center">
                    {t(feature.title)}
                  </h4>
                  <p className="text-[var(--black)]/70 text-center text-sm leading-relaxed">
                    {t(feature.description)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 