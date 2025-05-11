'use client';

import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../i18n/language-context';
import { 
  DashboardIcon, 
  EventsIcon, 
  SettingsIcon, 
  ReportsIcon 
} from '../../components/layout/DashboardIcons';

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  
  const navigation = [
    { 
      name: t('dashboard.overview'), 
      href: '/dashboard', 
      icon: DashboardIcon, 
      current: true 
    },
    { 
      name: t('dashboard.myEvents'), 
      href: '/dashboard/events', 
      icon: EventsIcon, 
      current: false 
    },
    { 
      name: t('dashboard.reports'), 
      href: '/dashboard/reports', 
      icon: ReportsIcon, 
      current: false 
    },
    { 
      name: t('dashboard.settings'), 
      href: '/dashboard/settings', 
      icon: SettingsIcon, 
      current: false 
    },
  ];

  return (
    <DashboardLayout 
      title={t('dashboard.userDashboard')} 
      navigation={navigation}
    >
      {children}
    </DashboardLayout>
  );
} 