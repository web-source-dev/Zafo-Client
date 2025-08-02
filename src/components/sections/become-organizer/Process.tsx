'use client';

import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Calendar, 
  Settings, 
  CreditCard, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function BecomeOrganizerProcess() {
  const { t } = useLanguage();
  
  const steps = [
    {
      icon: UserPlus,
      title: 'becomeOrganizer.process.step1.title',
      description: 'becomeOrganizer.process.step1.description',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Calendar,
      title: 'becomeOrganizer.process.step2.title',
      description: 'becomeOrganizer.process.step2.description',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Settings,
      title: 'becomeOrganizer.process.step3.title',
      description: 'becomeOrganizer.process.step3.description',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: CreditCard,
      title: 'becomeOrganizer.process.step4.title',
      description: 'becomeOrganizer.process.step4.description',
      color: 'from-orange-500 to-orange-600'
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
              {t('becomeOrganizer.process.title')}
            </h2>
            <p className="text-xl text-[var(--black)]/70 max-w-3xl mx-auto">
              {t('becomeOrganizer.process.description')}
            </p>
          </motion.div>
          
          {/* Process Steps */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)] transform -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  {/* Arrow for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                      <ArrowRight size={24} className="text-[var(--sage-green)]" />
                    </div>
                  )}
                  
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--sage)]/20">
                    {/* Step Number */}
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div className={`p-4 bg-gradient-to-r ${step.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                          <step.icon size={32} className="text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-[var(--sage-green)] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="text-xl font-semibold text-[var(--black)] mb-4 text-center">
                      {t(step.title)}
                    </h4>
                    <p className="text-[var(--black)]/70 text-center leading-relaxed">
                      {t(step.description)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 