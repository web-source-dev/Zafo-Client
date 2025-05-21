'use client';

import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../i18n/language-context';
import { useDashboardNavigation } from '../../components/layout/DashboardNavigation';
import ProtectedRoute from '../../auth/protected-route';

export default function OrganizerDashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  // Use the centralized navigation hook for organizer dashboard
  const navigation = useDashboardNavigation('organizer');
  
  return (
    <ProtectedRoute organizerOnly>
      <DashboardLayout 
        title={t('organizer.dashboard')} 
        navigation={navigation}
      >
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
} 