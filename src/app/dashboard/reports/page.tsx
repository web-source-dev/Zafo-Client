'use client';

import React from 'react';
import { useLanguage } from '../../../i18n/language-context';
import { Card, CardHeader, CardContent, CardTitle } from '../../../components/ui/Card';
import { ReportsIcon, EventsIcon } from '../../../components/layout/DashboardIcons';

// Mock data for reports - this would come from an API in a real application
const mockReports = [
  {
    id: 'r1',
    title: 'Event Participation Summary',
    description: 'Summary of all events you have participated in',
    icon: EventsIcon,
    lastUpdated: '2023-05-15',
    type: 'participation'
  },
  {
    id: 'r2',
    title: 'Volunteering Hours',
    description: 'Total hours volunteered in community events',
    icon: ReportsIcon,
    lastUpdated: '2023-05-10',
    type: 'volunteer'
  },
  {
    id: 'r3',
    title: 'Environmental Impact',
    description: 'Your contribution to environmental sustainability',
    icon: ReportsIcon,
    lastUpdated: '2023-04-22',
    type: 'impact'
  }
];

export default function ReportsPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--sage-green)]">
        {t('reports.title')}
      </h1>
      
      <p className="text-gray-600">
        {t('reports.description')}
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <div className="h-10 w-10 rounded-full bg-[var(--sage-green)] flex items-center justify-center">
                    <report.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-base">{report.title}</CardTitle>
                  <p className="text-xs text-gray-500">
                    {t('reports.last_updated')}: {report.lastUpdated}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {report.description}
              </p>
              <div className="text-sm text-[var(--sage-green)] font-medium">
                {t('reports.view_report')} →
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('reports.recent_activity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[var(--cognac)]">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('reports.event')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('reports.date')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('reports.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('reports.hours')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[var(--cognac)]">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Climate Action Workshop
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      May 5, 2023
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {t('reports.attended')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      2
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Recycling Awareness Day
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      April 22, 2023
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {t('reports.attended')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      4
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Green Energy Expo
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      March 10, 2023
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        {t('reports.missed')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      0
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('reports.impact_summary')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-green-800 font-medium text-sm">
                  {t('reports.volunteer_hours')}
                </p>
                <h3 className="text-2xl font-bold text-green-800 mt-1">
                  6
                </h3>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-blue-800 font-medium text-sm">
                  {t('reports.events_attended')}
                </p>
                <h3 className="text-2xl font-bold text-blue-800 mt-1">
                  2
                </h3>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-purple-800 font-medium text-sm">
                  {t('reports.community_impact')}
                </p>
                <h3 className="text-2xl font-bold text-purple-800 mt-1">
                  {t('reports.positive')}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 