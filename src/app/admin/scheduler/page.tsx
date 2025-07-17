'use client';

import React from 'react';
import SchedulerManagement from '../../../components/admin/SchedulerManagement';
import { useLanguage } from '../../../i18n/language-context';

export default function AdminSchedulerPage() {
  const { t } = useLanguage();

  return (
    <>
      <div className="pb-5 border-b border-[var(--cognac)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl leading-6 font-bold text-[var(--sage-green)]">
              {t('admin.scheduler')}
            </h2>
            <p className="mt-2 max-w-4xl text-sm text-black">
              {t('admin.schedulerDescription')}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <SchedulerManagement />
      </div>
    </>
  );
} 