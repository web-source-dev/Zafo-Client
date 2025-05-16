'use client';

import React from 'react';
import PlansHero from '@/components/sections/plans/Hero';
import PricingPlans from '@/components/sections/plans/PricingPlans';
import PlansFAQ from '@/components/sections/plans/FAQ';
import { useLanguage } from '@/i18n/language-context';
import Head from 'next/head';

export const metadata = {
  title: 'Pricing Plans | Zafo',
  description: 'Choose the perfect Zafo plan for your event needs. From free accounts to professional organizer plans, find the right option for you.'
};

const PlansPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <>
      <Head>
        <title>{t('plans.meta.title')}</title>
        <meta name="description" content={t('plans.meta.description')} />
      </Head>
      <main className="animate-fadeIn min-h-screen">
        <PlansHero />
        <PricingPlans />
        <PlansFAQ />
      </main>
    </>
  );
};

export default PlansPage; 