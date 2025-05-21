'use client';

import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../i18n/language-context';
import { useDashboardNavigation } from '../../components/layout/DashboardNavigation';
import ProtectedRoute from '../../auth/protected-route';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  // Use the centralized navigation hook for admin dashboard
  const navigation = useDashboardNavigation('admin');
  
  return (
    <ProtectedRoute adminOnly>
      <DashboardLayout 
        title={t('admin.dashboard')} 
        navigation={navigation}
      >
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
} 