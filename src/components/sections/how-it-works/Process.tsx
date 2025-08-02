'use client';

import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Calendar, 
  Settings, 
  CreditCard, 
  Users, 
  CheckCircle,
  Search,
  Ticket,
  DollarSign
} from 'lucide-react';

export default function HowItWorksProcess() {
  const { t } = useLanguage();
  
  const organizerSteps = [
    {
      icon: UserPlus,
      title: 'howItWorks.process.organizer.step1.title',
      description: 'howItWorks.process.organizer.step1.description',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Calendar,
      title: 'howItWorks.process.organizer.step2.title',
      description: 'howItWorks.process.organizer.step2.description',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Settings,
      title: 'howItWorks.process.organizer.step3.title',
      description: 'howItWorks.process.organizer.step3.description',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: CreditCard,
      title: 'howItWorks.process.organizer.step4.title',
      description: 'howItWorks.process.organizer.step4.description',
      color: 'from-orange-500 to-orange-600'
    }
  ];
  
  const attendeeSteps = [
    {
      icon: Search,
      title: 'howItWorks.process.attendee.step1.title',
      description: 'howItWorks.process.attendee.step1.description',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: Ticket,
      title: 'howItWorks.process.attendee.step2.title',
      description: 'howItWorks.process.attendee.step2.description',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: CreditCard,
      title: 'howItWorks.process.attendee.step3.title',
      description: 'howItWorks.process.attendee.step3.description',
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: CheckCircle,
      title: 'howItWorks.process.attendee.step4.title',
      description: 'howItWorks.process.attendee.step4.description',
      color: 'from-emerald-500 to-emerald-600'
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
              {t('howItWorks.process.title')}
            </h2>
            <p className="text-xl text-[var(--black)]/70 max-w-3xl mx-auto">
              {t('howItWorks.process.description')}
            </p>
          </motion.div>
          
          {/* Organizer Process */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)] text-white px-6 py-3 rounded-full mb-6">
                <Users size={24} />
                <h3 className="text-xl font-semibold">
                  {t('howItWorks.process.organizer.title')}
                </h3>
              </div>
              <p className="text-lg text-[var(--black)]/70">
                {t('howItWorks.process.organizer.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {organizerSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)] rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                    {index + 1}
                  </div>
                  
                  {/* Step Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--sage)]/20 h-full">
                    <div className="flex justify-center mb-4">
                      <div className={`p-4 bg-gradient-to-r ${step.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <step.icon size={28} className="text-white" />
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-[var(--black)] mb-3 text-center">
                      {t(step.title)}
                    </h4>
                    <p className="text-[var(--black)]/70 text-center text-sm leading-relaxed">
                      {t(step.description)}
                    </p>
                  </div>
                  
                  {/* Connector Line */}
                  {index < organizerSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)] transform -translate-y-1/2 z-0"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Attendee Process */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[var(--cognac)] to-[var(--sage-green)] text-white px-6 py-3 rounded-full mb-6">
                <Ticket size={24} />
                <h3 className="text-xl font-semibold">
                  {t('howItWorks.process.attendee.title')}
                </h3>
              </div>
              <p className="text-lg text-[var(--black)]/70">
                {t('howItWorks.process.attendee.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {attendeeSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-[var(--cognac)] to-[var(--sage-green)] rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                    {index + 1}
                  </div>
                  
                  {/* Step Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--sage)]/20 h-full">
                    <div className="flex justify-center mb-4">
                      <div className={`p-4 bg-gradient-to-r ${step.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <step.icon size={28} className="text-white" />
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-[var(--black)] mb-3 text-center">
                      {t(step.title)}
                    </h4>
                    <p className="text-[var(--black)]/70 text-center text-sm leading-relaxed">
                      {t(step.description)}
                    </p>
                  </div>
                  
                  {/* Connector Line */}
                  {index < attendeeSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[var(--cognac)] to-[var(--sage-green)] transform -translate-y-1/2 z-0"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Pricing Information */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[var(--cognac)] to-[var(--sage-green)] text-white px-6 py-3 rounded-full mb-6">
                <DollarSign size={24} />
                <h3 className="text-xl font-semibold">
                  {t('howItWorks.pricing.title')}
                </h3>
              </div>
              <p className="text-lg text-[var(--black)]/70">
                {t('howItWorks.pricing.description')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Platform Fee */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[var(--taupe)] to-[var(--sage)] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--sage)]/20"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)] rounded-xl">
                    <DollarSign size={32} className="text-white" />
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-[var(--black)] mb-4 text-center">
                  {t('howItWorks.pricing.platformFee.title')}
                </h4>
                <div className="space-y-3 text-center">
                  <p className="text-[var(--black)]/80 font-medium">
                    {t('howItWorks.pricing.platformFee.under24h')}
                  </p>
                  <p className="text-[var(--black)]/80 font-medium">
                    {t('howItWorks.pricing.platformFee.over24h')}
                  </p>
                </div>
              </motion.div>
              
              {/* Ticket Fee */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[var(--taupe)] to-[var(--sage)] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--sage)]/20"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-[var(--cognac)] to-[var(--sage-green)] rounded-xl">
                    <Ticket size={32} className="text-white" />
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-[var(--black)] mb-4 text-center">
                  {t('howItWorks.pricing.ticketFee.title')}
                </h4>
                <p className="text-[var(--black)]/80 text-center leading-relaxed">
                  {t('howItWorks.pricing.ticketFee.description')}
                </p>
              </motion.div>
              
              {/* Refund Policy */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[var(--taupe)] to-[var(--sage)] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--sage)]/20"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)] rounded-xl">
                    <CreditCard size={32} className="text-white" />
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-[var(--black)] mb-4 text-center">
                  {t('howItWorks.pricing.refund.title')}
                </h4>
                <p className="text-[var(--black)]/80 text-center leading-relaxed">
                  {t('howItWorks.pricing.refund.description')}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 