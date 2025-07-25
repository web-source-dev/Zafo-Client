'use client';

import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../i18n/language-context';
import { useDashboardNavigation } from '../../components/layout/DashboardNavigation';
import ProtectedRoute from '@/auth/protected-route';

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  // Use the centralized navigation hook for user dashboard
  const navigation = useDashboardNavigation('user');
  
  return (
    <ProtectedRoute userOnly>
      <DashboardLayout 
        title={t('dashboard.userDashboard')} 
        navigation={navigation}
    >
      {children}
    </DashboardLayout>
    </ProtectedRoute>
  );
} 