'use client';

import { usePathname } from 'next/navigation';
import { useLanguage } from '../../i18n/language-context';
import { 
  DashboardIcon, 
  UsersIcon, 
  RolesIcon, 
  SettingsIcon, 
  ReportsIcon,
  EventsIcon,
  ParticipantsIcon 
} from './DashboardIcons';

export type DashboardType = 'admin' | 'organizer' | 'user';

export interface NavigationItem {
  name: string;
  href: string;
  icon: (className: string) => React.ReactElement;
  current: boolean;
}

/**
 * Get navigation items for different dashboard types
 * @param dashboardType The type of dashboard (admin, organizer, user)
 * @returns Navigation items for the specified dashboard type
 */
export function useDashboardNavigation(dashboardType: DashboardType): NavigationItem[] {
  const { t } = useLanguage();
  const pathname = usePathname();

  // Admin Dashboard Navigation
  const adminNavigation: NavigationItem[] = [
    { 
      name: t('admin.overview'), 
      href: '/admin', 
      icon: DashboardIcon, 
      current: pathname === '/admin' 
    },
    { 
      name: t('admin.userManagement'), 
      href: '/admin/users', 
      icon: UsersIcon, 
      current: pathname?.startsWith('/admin/users') 
    },
    { 
      name: t('admin.role'), 
      href: '/admin/roles', 
      icon: RolesIcon, 
      current: pathname?.startsWith('/admin/roles') 
    },
    { 
      name: 'Refund Requests', 
      href: '/admin/refund-requests', 
      icon: ReportsIcon, 
      current: pathname?.startsWith('/admin/refund-requests') 
    },
    { 
      name: t('common.settings'), 
      href: '/admin/settings', 
      icon: SettingsIcon, 
      current: pathname?.startsWith('/admin/settings') 
    },
    { 
      name: t('admin.reports'), 
      href: '/admin/reports', 
      icon: ReportsIcon, 
      current: pathname?.startsWith('/admin/reports') 
    }
  ];

  // Organizer Dashboard Navigation
  const organizerNavigation: NavigationItem[] = [
    { 
      name: t('admin.overview'), 
      href: '/organizer', 
      icon: DashboardIcon, 
      current: pathname === '/organizer' 
    },
    { 
      name: t('organizer.createEvent'), 
      href: '/organizer/events/create', 
      icon: EventsIcon, 
      current: pathname?.startsWith('/organizer/events/create') 
    },
    { 
      name: t('organizer.participants'), 
      href: '/organizer/participants', 
      icon: ParticipantsIcon, 
      current: pathname?.startsWith('/organizer/participants') 
    },
    { 
      name: 'Refund Requests', 
      href: '/organizer/refund-requests', 
      icon: ReportsIcon, 
      current: pathname?.startsWith('/organizer/refund-requests') 
    },
    { 
      name: t('admin.reports'), 
      href: '/organizer/reports', 
      icon: ReportsIcon, 
      current: pathname?.startsWith('/organizer/reports') 
    }
  ];

  // User Dashboard Navigation
  const userNavigation: NavigationItem[] = [
    { 
      name: t('dashboard.overview'), 
      href: '/dashboard', 
      icon: DashboardIcon, 
      current: pathname === '/dashboard' 
    },
    { 
      name: t('dashboard.myEvents'), 
      href: '/dashboard/events', 
      icon: EventsIcon, 
      current: pathname?.startsWith('/dashboard/events') 
    },
    { 
      name: t('dashboard.myTickets'), 
      href: '/dashboard/tickets', 
      icon: EventsIcon, 
      current: pathname?.startsWith('/dashboard/tickets') 
    },
    { 
      name: t('dashboard.reports'), 
      href: '/dashboard/reports', 
      icon: ReportsIcon, 
      current: pathname?.startsWith('/dashboard/reports') 
    },
    { 
      name: t('dashboard.settings'), 
      href: '/dashboard/settings', 
      icon: SettingsIcon, 
      current: pathname?.startsWith('/dashboard/settings') 
    }
  ];

  // Return the appropriate navigation based on dashboard type
  switch (dashboardType) {
    case 'admin':
      return adminNavigation;
    case 'organizer':
      return organizerNavigation;
    case 'user':
    default:
      return userNavigation;
  }
} 