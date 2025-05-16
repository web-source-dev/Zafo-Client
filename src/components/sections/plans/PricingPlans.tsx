'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import { FaCheck, FaLightbulb, FaStar, FaTrophy } from 'react-icons/fa';

type Plan = {
  id: string;
  price: {
    monthly: number;
    annually: number;
  };
  popular?: boolean;
  features: number[];
  icon: React.ReactNode;
};

export default function PricingPlans() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const { t } = useLanguage();
  
  const plans: Plan[] = [
    {
      id: 'free',
      price: {
        monthly: 0,
        annually: 0,
      },
      features: [1, 2, 3, 4, 5],
      icon: <FaLightbulb className="h-6 w-6" />
    },
    {
      id: 'pro',
      price: {
        monthly: 12.99,
        annually: 129.99,
      },
      popular: true,
      features: [1, 2, 3, 4, 5, 6],
      icon: <FaStar className="h-6 w-6" />
    },
    {
      id: 'organizer',
      price: {
        monthly: 29.99,
        annually: 299.99,
      },
      features: [1, 2, 3, 4, 5, 6, 7],
      icon: <FaTrophy className="h-6 w-6" />
    },
  ];
  
  const toggleBillingCycle = () => {
    setBillingCycle(billingCycle === 'monthly' ? 'annually' : 'monthly');
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };
  
  return (
    <section className="py-20 bg-white relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-b from-[var(--sage-green)]/5 to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-7xl mx-auto">
          {/* Billing toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-12">
            <div className="bg-[var(--taupe)] p-1 rounded-lg inline-flex items-center shadow-md">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-[var(--sage-green)] shadow-sm'
                    : 'text-gray-600 hover:text-[var(--sage-green)] hover:bg-white/20'
                }`}
              >
                {t('plans.pricing.monthly')}
              </button>
              <button
                onClick={() => setBillingCycle('annually')}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'annually'
                    ? 'bg-white text-[var(--sage-green)] shadow-sm'
                    : 'text-gray-600 hover:text-[var(--sage-green)] hover:bg-white/20'
                }`}
              >
                {t('plans.pricing.annually')} 
                <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-0.5 ml-2 rounded-full">
                  {t('plans.pricing.savePercent')}
                </span>
              </button>
            </div>
          </motion.div>
          
          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all border ${
                  plan.popular ? 'border-[var(--sage-green)]' : 'border-gray-200'
                } relative bg-white transform hover:-translate-y-1 duration-300`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-[var(--sage-green)] text-white px-4 py-1 text-sm font-medium rounded-bl-xl">
                    {t('plans.pricing.popular')}
                  </div>
                )}
                
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-full mr-3 ${plan.popular ? 'bg-[var(--sage-green)]/10 text-[var(--sage-green)]' : 'bg-gray-100 text-gray-600'}`}>
                      {plan.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--sage-green)]">
                      {t(`plans.pricing.${plan.id}.name`)}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6 min-h-[3em]">
                    {t(`plans.pricing.${plan.id}.description`)}
                  </p>
                  
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">
                        ${billingCycle === 'monthly' ? plan.price.monthly : plan.price.annually}
                      </span>
                      {plan.price.monthly > 0 && (
                        <span className="text-gray-500 ml-2">
                          /{billingCycle === 'monthly' ? t('plans.pricing.month') : t('plans.pricing.year')}
                        </span>
                      )}
                    </div>
                    {billingCycle === 'annually' && plan.price.monthly > 0 && (
                      <p className="text-green-600 text-sm mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        {t('plans.pricing.saveAmount', { amount: (plan.price.monthly * 12 - plan.price.annually).toFixed(2) })}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    variant={plan.popular ? 'primary' : 'outline'}
                    fullWidth
                    size="lg"
                    className={plan.popular ? 'shadow-lg shadow-[var(--sage-green)]/20' : ''}
                  >
                    {t('plans.pricing.getStarted')}
                  </Button>
                </div>
                
                <div className="bg-gray-50 p-8 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">{t('plans.pricing.included')}</h4>
                  <ul className="space-y-3">
                    {plan.features.map((featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <FaCheck className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{t(`plans.pricing.${plan.id}.features.${featureIndex}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Extra selling point */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16 text-center max-w-3xl mx-auto p-6 rounded-lg border border-[var(--sage-green)]/30 bg-[var(--sage-green)]/5"
          >
            <h3 className="text-xl font-bold text-[var(--sage-green)] mb-2">
              {billingCycle === 'annually' ? 
                'Save with annual billing!' : 
                'Try Zafo risk-free with our 30-day money-back guarantee'}
            </h3>
            <p className="text-gray-700">
              {billingCycle === 'annually' ? 
                'Switch to annual billing and save up to 15% compared to monthly billing.' : 
                'All paid plans come with a 30-day money-back guarantee. No questions asked.'}
            </p>
            {billingCycle === 'monthly' && (
              <button 
                onClick={toggleBillingCycle}
                className="mt-3 text-[var(--sage-green)] font-medium hover:underline inline-flex items-center"
              >
                Switch to annual billing
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
} 