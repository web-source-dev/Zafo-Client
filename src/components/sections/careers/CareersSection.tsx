'use client';

import React from 'react';
import { useLanguage } from '@/i18n/language-context';
import Image from 'next/image';

const CareersSection: React.FC = () => {
  const { t } = useLanguage();

  const jobOpenings = [
    {
      id: 1,
      title: 'Software Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
    },
    {
      id: 2,
      title: 'Product Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
    },
    {
      id: 3,
      title: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
    },
  ];

  const benefits = [
    {
      icon: '/icons/remote.svg',
      title: t('careers.benefits.remote.title'),
      description: t('careers.benefits.remote.description'),
    },
    {
      icon: '/icons/health.svg',
      title: t('careers.benefits.health.title'),
      description: t('careers.benefits.health.description'),
    },
    {
      icon: '/icons/growth.svg',
      title: t('careers.benefits.growth.title'),
      description: t('careers.benefits.growth.description'),
    },
    {
      icon: '/icons/vacation.svg',
      title: t('careers.benefits.vacation.title'),
      description: t('careers.benefits.vacation.description'),
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Company Culture */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('careers.culture.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <p className="text-lg text-gray-600 mb-6">
              {t('careers.culture.description1')}
            </p>
            <p className="text-lg text-gray-600">
              {t('careers.culture.description2')}
            </p>
          </div>
          <div className="relative h-80 rounded-lg overflow-hidden">
            <Image
              src="/images/team-culture.jpg"
              alt={t('careers.culture.imageAlt')}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">{t('careers.benefits.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 mb-4 flex items-center justify-center bg-[var(--sage-green)] rounded-full">
                <Image src={benefit.icon} alt="" width={24} height={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Current Openings */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-10">{t('careers.openings.title')}</h2>
        
        {jobOpenings.length > 0 ? (
          <div className="space-y-4">
            {jobOpenings.map((job) => (
              <div 
                key={job.id} 
                className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600 mt-1">{job.department} • {job.location} • {job.type}</p>
                  </div>
                  <button 
                    className="mt-4 md:mt-0 px-6 py-2 bg-[var(--sage-green)] text-white rounded-md hover:bg-[var(--dark-sage-green)] transition-colors"
                  >
                    {t('careers.openings.applyButton')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-lg text-gray-600">{t('careers.openings.noOpenings')}</p>
            <p className="mt-2 text-gray-500">{t('careers.openings.checkBack')}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CareersSection; 