'use client';

import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  DollarSign, 
  CreditCard, 
} from 'lucide-react';

export default function PricingPlans() {
  const { t } = useLanguage();
  
  const plans = [
    {
      title: 'pricing.plans.shortEvent.title',
      description: 'pricing.plans.shortEvent.description',
      price: '350',
      currency: 'CHF',
      duration: 'pricing.plans.shortEvent.duration',
      icon: Clock,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'pricing.plans.longEvent.title',
      description: 'pricing.plans.longEvent.description',
      price: '675',
      currency: 'CHF',
      duration: 'pricing.plans.longEvent.duration',
      icon: Calendar,
      color: 'from-green-500 to-green-600'
    }
  ];
  
  const additionalFees = [
    {
      icon: DollarSign,
      title: 'pricing.additionalFees.ticketFee.title',
      description: 'pricing.additionalFees.ticketFee.description',
      amount: '10%',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: CreditCard,
      title: 'pricing.additionalFees.refundFee.title',
      description: 'pricing.additionalFees.refundFee.description',
      amount: '2.5 CHF',
      color: 'from-orange-500 to-orange-600'
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
              {t('pricing.plans.title')}
            </h2>
            <p className="text-xl text-[var(--black)]/70 max-w-3xl mx-auto">
              {t('pricing.plans.description')}
            </p>
          </motion.div>
          
          {/* Platform Fee Plans */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-[var(--black)] mb-4">
                {t('pricing.plans.platformFees.title')}
              </h3>
              <p className="text-lg text-[var(--black)]/70">
                {t('pricing.plans.platformFees.description')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="bg-gradient-to-br from-[var(--taupe)] to-[var(--sage)] rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--sage)]/20">
                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <div className="flex justify-center mb-4">
                        <div className={`p-4 bg-gradient-to-r ${plan.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                          <plan.icon size={32} className="text-white" />
                        </div>
                      </div>
                      <h4 className="text-2xl font-bold text-[var(--black)] mb-2">
                        {t(plan.title)}
                      </h4>
                      <p className="text-[var(--black)]/70 mb-4">
                        {t(plan.description)}
                      </p>
                      <div className="text-4xl font-bold text-[var(--black)] mb-2">
                        {plan.price} {plan.currency}
                      </div>
                      <div className="text-sm text-[var(--black)]/60">
                        {t(plan.duration)}
                      </div>
                    </div>
                    

                    

                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Additional Fees */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-[var(--black)] mb-4">
                {t('pricing.additionalFees.title')}
              </h3>
              <p className="text-lg text-[var(--black)]/70">
                {t('pricing.additionalFees.description')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {additionalFees.map((fee, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--sage)]/20"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 bg-gradient-to-r ${fee.color} rounded-xl`}>
                      <fee.icon size={24} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-[var(--black)]">
                        {t(fee.title)}
                      </h4>
                      <div className="text-2xl font-bold text-[var(--sage-green)]">
                        {fee.amount}
                      </div>
                    </div>
                  </div>
                  <p className="text-[var(--black)]/70 leading-relaxed">
                    {t(fee.description)}
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