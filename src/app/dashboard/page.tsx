'use client';

import React from 'react';
import { useLanguage } from '../../i18n/language-context';
import { useAuth } from '../../auth/auth-context';
import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import { DashboardIcon, EventsIcon, ParticipantsIcon } from '../../components/layout/DashboardIcons';

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();

  // This would be fetched from an API in a real application
  const userStats = {
    eventsRegistered: 5,
    upcomingEvents: 2,
    pastEvents: 3
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--sage-green)]">
          {t('dashboard.welcome', { name: user?.firstName || '' })}
        </h1>
        <p className="text-gray-600 mt-1">
          {t('dashboard.overview_description')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title={t('dashboard.events_registered')}
          value={userStats.eventsRegistered.toString()}
          icon={<EventsIcon className="h-6 w-6 text-[var(--sage-green)]" />}
        />
        <StatCard
          title={t('dashboard.upcoming_events')}
          value={userStats.upcomingEvents.toString()}
          icon={<DashboardIcon className="h-6 w-6 text-[var(--sage-green)]" />}
        />
        <StatCard
          title={t('dashboard.past_events')}
          value={userStats.pastEvents.toString()}
          icon={<ParticipantsIcon className="h-6 w-6 text-[var(--sage-green)]" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.upcoming_events')}</CardTitle>
          </CardHeader>
          <CardContent>
            {userStats.upcomingEvents > 0 ? (
              <ul className="divide-y divide-[var(--cognac)]">
                {/* This would be a mapped list of actual events from API */}
                <li className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Community Garden Workshop</h4>
                      <p className="text-sm text-gray-600">June 15, 2023 at 10:00 AM</p>
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {t('dashboard.registered')}
                      </span>
                    </div>
                  </div>
                </li>
                <li className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Sustainability Conference</h4>
                      <p className="text-sm text-gray-600">July 22, 2023 at 9:00 AM</p>
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {t('dashboard.registered')}
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            ) : (
              <p className="text-gray-500 italic">{t('dashboard.no_upcoming_events')}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.activity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-[var(--cognac)]">
              {/* This would be a mapped list of activity from API */}
              <li className="py-3">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-[var(--sage-green)] flex items-center justify-center">
                      <EventsIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {t('dashboard.registered_for_event')}
                    </p>
                    <p className="text-sm text-gray-500">
                      Community Garden Workshop
                    </p>
                    <p className="text-xs text-gray-400">
                      2 days ago
                    </p>
                  </div>
                </div>
              </li>
              <li className="py-3">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-[var(--sage-green)] flex items-center justify-center">
                      <EventsIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {t('dashboard.registered_for_event')}
                    </p>
                    <p className="text-sm text-gray-500">
                      Sustainability Conference
                    </p>
                    <p className="text-xs text-gray-400">
                      5 days ago
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 