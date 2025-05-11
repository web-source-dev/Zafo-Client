'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../../i18n/language-context';
import { Card, CardHeader, CardContent, CardTitle } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/Tabs';

// Mock data for events - this would come from an API in a real application
const mockEvents = {
  upcoming: [
    {
      id: '1',
      title: 'Community Garden Workshop',
      date: 'June 15, 2023',
      time: '10:00 AM - 2:00 PM',
      location: 'Community Center',
      status: 'confirmed'
    },
    {
      id: '2',
      title: 'Sustainability Conference',
      date: 'July 22, 2023',
      time: '9:00 AM - 5:00 PM',
      location: 'Convention Center',
      status: 'confirmed'
    }
  ],
  past: [
    {
      id: '3',
      title: 'Climate Action Workshop',
      date: 'May 5, 2023',
      time: '2:00 PM - 4:00 PM',
      location: 'City Hall',
      status: 'attended'
    },
    {
      id: '4',
      title: 'Recycling Awareness Day',
      date: 'April 22, 2023',
      time: '11:00 AM - 3:00 PM',
      location: 'Park Plaza',
      status: 'attended'
    },
    {
      id: '5',
      title: 'Green Energy Expo',
      date: 'March 10, 2023',
      time: '10:00 AM - 6:00 PM',
      location: 'Exhibition Center',
      status: 'missed'
    }
  ]
};

export default function EventsPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('upcoming');

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusStyles = {
      confirmed: 'bg-blue-100 text-blue-800',
      attended: 'bg-green-100 text-green-800',
      missed: 'bg-red-100 text-red-800'
    };
    
    const statusText = {
      confirmed: t('events.confirmed'),
      attended: t('events.attended'),
      missed: t('events.missed')
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
        {statusText[status as keyof typeof statusText]}
      </span>
    );
  };

  // Event list component
  const EventList = ({ events }: { events: typeof mockEvents.upcoming }) => {
    if (events.length === 0) {
      return (
        <p className="text-gray-500 italic py-4">{t('events.no_events')}</p>
      );
    }

    return (
      <ul className="divide-y divide-[var(--cognac)]">
        {events.map((event) => (
          <li key={event.id} className="py-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{event.title}</h4>
                <div className="mt-1 text-sm text-gray-600 space-y-1">
                  <p>{event.date} • {event.time}</p>
                  <p>{event.location}</p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <StatusBadge status={event.status} />
                {activeTab === 'upcoming' && (
                  <Button variant="outline" size="sm">
                    {t('events.view_details')}
                  </Button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--sage-green)]">
        {t('dashboard.my_events')}
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('events.your_registered_events')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming" onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="upcoming">{t('events.upcoming')}</TabsTrigger>
              <TabsTrigger value="past">{t('events.past')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              <EventList events={mockEvents.upcoming} />
            </TabsContent>
            
            <TabsContent value="past">
              <EventList events={mockEvents.past} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 