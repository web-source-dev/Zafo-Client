'use client';

import React from 'react';
import Head from 'next/head';
import { useLanguage } from '@/i18n/language-context';
import CareersSection from '@/components/sections/careers/CareersSection';

const CareersPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <>
      <Head>
        <title>{t('careers.pageTitle')} | {t('common.appName')}</title>
        <meta name="description" content={t('careers.metaDescription')} />
      </Head>
      
      <div className="bg-white">

        
        <CareersSection />
      </div>
    </>
  );
};

export default CareersPage; 