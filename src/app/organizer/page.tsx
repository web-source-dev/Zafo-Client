'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/auth-context';
import { useLanguage } from '../../i18n/language-context';
import { EventsIcon, ParticipantsIcon } from '../../components/layout/DashboardIcons';
import Button from '../../components/ui/Button';
import { useRouter } from 'next/navigation';
import eventService, { Event } from '../../services/event-service';
import EventDetailsModal from '../../components/events/EventDetailsModal';
import Image from 'next/image';
import DropdownMenu from '../../components/ui/DropdownMenu';
import { Eye, Edit, CheckCircle, CreditCard, Trash } from 'lucide-react';

// Type for the translation function
type TranslationFunction = (key: string, params?: Record<string, string>) => string;

// Extended Event type for UI purposes
interface UIEvent extends Omit<Event, 'status'> {
  id?: string;
  name?: string;
  date?: string;
  participants?: number;
  status: 'draft' | 'published' | 'canceled' | 'completed' | 'pending_payment';
}

// Event Card Component
const EventCard = ({ 
  event, 
  t, 
  onEdit, 
  onViewDetails, 
  onDelete,
  onMarkCompleted,
  isDeletingThis
}: { 
  event: UIEvent, 
  t: TranslationFunction, 
  onEdit: (id: number | string) => void,
  onViewDetails: (event: UIEvent) => void,
  onDelete: (id: number | string) => void,
  onMarkCompleted: (id: number | string) => void,
  isDeletingThis: boolean
}) => {
  const router = useRouter();
  
  // This translates the status for display
  const getTranslatedStatus = (status: string) => {
    if (status === 'published') return t('events.status.published');
    if (status === 'draft') return t('events.status.draft');
    if (status === 'completed') return t('events.status.completed');
    if (status === 'canceled') return t('events.status.canceled');
    if (status === 'pending_payment') return t('events.status.pendingPayment');
    return status;
  };

  // This formats the participant count with proper translation
  const formatParticipantCount = (count: number) => {
    return `${count} ${t('organizer.participants')}`;
  };

  // Handle edit button click
  const handleEdit = () => {
    onEdit(event._id);
  };
  
  // Handle view details click
  const handleViewDetails = () => {
    onViewDetails(event);
  };
  
  // Handle delete button click
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t('events.deleteConfirm'))) {
      onDelete(event._id);
    }
  };
  
  // Handle mark as completed button click
  const handleMarkAsCompleted = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkCompleted(event._id);
  };

  // Handle complete payment button click
  const handleCompletePayment = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/payment/event/${event._id}`);
  };
  
  // Get event small description by language
  const getLocalizedSmallDescription = () => {
    if (event.smallDescription) {
      return event.smallDescription;
    }
    if (event.aboutEvent) {
      return event.aboutEvent;
    }
    return '';
  };
  
  // Get event title by language
  const getLocalizedTitle = () => {
    if (event.title) {
      return event.title;
    }
    return event.name || t('events.untitledEvent');
  };
  
  // Format date
  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString();
  };

  // Check if the event is deletable (draft or canceled)
  const isDeletable = event.status === 'draft' || event.status === 'canceled' || event.status === 'pending_payment' || event.status === 'completed' || event.status === 'published';
  
  // Check if event has ended but not marked as completed/canceled
  const hasEnded = new Date(event.endDate) < new Date() && 
                  event.status !== 'completed' && 
                  event.status !== 'canceled';

  // Get event status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-[var(--sage)] text-black';
      case 'draft':
        return 'bg-[var(--cognac)] text-black';
      case 'canceled':
        return 'bg-red-200 text-red-800';
      case 'completed':
        return 'bg-blue-200 text-blue-800';
      case 'pending_payment':
        return 'bg-yellow-200 text-yellow-800';
      default:
        return 'bg-[var(--taupe)] text-black';
    }
  };

  return (
    <div className={`bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200 ${isDeletingThis ? 'opacity-60' : ''}`}>
      {/* Cover image if available */}
      {event.coverImage && (
        <div 
          className="h-40 w-full overflow-hidden cursor-pointer relative"
          onClick={handleViewDetails}
        >
          <Image 
            src={event.coverImage} 
            alt={getLocalizedTitle()} 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            width={300}
            height={150}
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 
              className="text-lg font-medium text-[var(--sage-green)] cursor-pointer hover:underline"
              onClick={handleViewDetails}
            >
              {getLocalizedTitle()}
            </h3>
            <p className="mt-1 text-sm text-black">
              {event.startDate 
                ? formatDate(event.startDate) 
                : event.date}
            </p>
          </div>
          <span 
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${getStatusColor(event.status)}`}
            title={hasEnded && event.status === 'published' ? t('events.status.endedTip') : ''}
          >
            {hasEnded && event.status === 'published' ? t('events.status.ended') : getTranslatedStatus(event.status)}
          </span>
        </div>
        
        {/* Short description preview */}
        <div className="mt-2">
          <p className="text-sm text-gray-600 line-clamp-2">
            {getLocalizedSmallDescription()}
          </p>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <ParticipantsIcon className="h-5 w-5 text-[var(--sage-green)] mr-2" />
              <span className="text-black">{formatParticipantCount(event.participants || 0)}</span>
            </div>
            <div>
              <DropdownMenu
                items={[
                  {
                    label: t('events.details'),
                    onClick: handleViewDetails,
                    icon: <Eye className="h-4 w-4" />,
                    disabled: isDeletingThis
                  },
                  {
                    label: t('organizer.manage'),
                    onClick: handleEdit,
                    icon: <Edit className="h-4 w-4" />,
                    disabled: isDeletingThis
                  },
                  ...(event.status === 'pending_payment' ? [{
                    label: t('payment.completePayment'),
                    onClick: handleCompletePayment,
                    icon: <CreditCard className="h-4 w-4" />,
                    disabled: isDeletingThis,
                    variant: 'warning' as const
                  }] : []),
                  ...(hasEnded && event.status === 'published' ? [{
                    label: t('events.markCompletedTip'),
                    onClick: handleMarkAsCompleted,
                    icon: <CheckCircle className="h-4 w-4" />,
                    disabled: isDeletingThis,
                    isLoading: isDeletingThis,
                    variant: 'success' as const
                  }] : []),
                  ...(isDeletable ? [{
                    label: t('events.quickDelete'),
                    onClick: handleDelete,
                    icon: <Trash className="h-4 w-4" />,
                    disabled: isDeletingThis,
                    isLoading: isDeletingThis,
                    variant: 'danger' as const
                  }] : [])
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function OrganizerPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState<UIEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<UIEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const router = useRouter();

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await eventService.getOrganizerEvents();
        
        if (response.success && response.data) {
          setEvents(response.data.events as unknown as UIEvent[]);
        } else {
          setError(response.message || t('common.error'));
        }
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error.message || t('common.error'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [t]);

  // Calculate stats
  const stats = {
    totalEvents: events.length.toString(),
    activeEvents: events.filter(e => e.status === 'published').length.toString(),
    participantsCount: events.reduce((sum, e) => sum + (e.participants || 0), 0).toString(),
    completedEvents: events.filter(e => e.status === 'completed').length.toString(),
    pendingPaymentEvents: events.filter(e => e.status === 'pending_payment').length.toString()
  };

  // Filter events by status and date for different tabs
  const currentDate = new Date();
  
  const upcomingEvents = events.filter(e => {
    // Check if end date is in the future
    const endDate = new Date(e.endDate);
    return endDate >= currentDate && (e.status === 'published' || e.status === 'draft' || e.status === 'pending_payment');
  });
  
  const pastEvents = events.filter(e => {
    // Check if end date is in the past or event is completed/canceled
    const endDate = new Date(e.endDate);
    return endDate < currentDate || e.status === 'completed' || e.status === 'canceled';
  });

  // Get all events for the "All Events" tab
  const allEvents = [...events];

  // Handle edit event
  const handleEditEvent = (id: string | number) => {
    router.push(`/organizer/events/edit/${id}`);
  };

  // Handle create event
  const handleCreateEvent = () => {
    router.push('/organizer/events/create');
  };
  
  // Handle view event details
  const handleViewEventDetails = (event: UIEvent) => {
    setSelectedEvent(event as any);
    setIsModalOpen(true);
  };
  
  // Handle delete event
  const handleDeleteEvent = async (id: string | number) => {
    try {
      setDeletingEventId(id.toString());
      setError(null);
      setSuccessMessage(null);
      const response = await eventService.deleteEvent(id.toString());
      
      if (response.success) {
        // Remove the deleted event from the state
        setEvents(events.filter(event => event._id !== id));
        setSuccessMessage(t('events.deleteSuccess'));
        
        // Auto-clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError(response.message || t('common.error'));
      }
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message || t('common.error'));
    } finally {
      setDeletingEventId(null);
    }
  };
  
  // Handle marking event as completed
  const handleMarkAsCompleted = async (id: string | number) => {
    try {
      setDeletingEventId(id.toString()); // Reuse the same state for loading indicator
      setError(null);
      setSuccessMessage(null);
      
      const response = await eventService.changeEventStatus(id.toString(), 'completed');
      
      if (response.success) {
        // Update the event status in the state
        setEvents(events.map(event => 
          event._id === id 
            ? { ...event, status: 'completed' } 
            : event
        ));
        setSuccessMessage(t('events.markCompletedSuccess'));
        
        // Auto-clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError(response.message || t('common.error'));
      }
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message || t('common.error'));
    } finally {
      setDeletingEventId(null);
    }
  };

  // Handle completing payment for an event
  const handleCompletePayment = (id: string | number) => {
    router.push(`/payment/event/${id}`);
  };
  
  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Welcome Message */}
      <div className="pb-5 border-b border-[var(--cognac)]">
        <h2 className="text-2xl leading-6 font-bold text-[var(--sage-green)]">
          {t('organizer.welcome', { name: user?.firstName || '' })}
        </h2>
        <p className="mt-2 max-w-4xl text-sm text-black">
          {t('organizer.subheading')}
        </p>
      </div>
      
      {/* Status Messages */}
      {error && (
        <div className="mt-4 mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mt-4 mb-4 bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded flex items-center">
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {successMessage}
        </div>
      )}

      {/* Payment Setup Alert */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">
                Set up your payment account
              </h3>
              <p className="text-sm text-blue-700">
                Connect your Stripe account to receive payments from ticket sales
              </p>
            </div>
          </div>
          <Button
            onClick={() => router.push('/organizer/stripe-connect')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Set up Payments
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-[var(--sage-green)]">
                <EventsIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-[var(--sage-green)] truncate">
                    {t('organizer.totalEvents')}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-black">
                      {stats.totalEvents}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-[var(--sage)]">
                <EventsIcon className="h-6 w-6 text-black" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-[var(--sage-green)] truncate">
                    {t('organizer.activeEvents')}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-black">
                      {stats.activeEvents}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-[var(--cognac)]">
                <ParticipantsIcon className="h-6 w-6 text-black" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-[var(--sage-green)] truncate">
                    {t('organizer.totalParticipants')}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-black">
                      {stats.participantsCount}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-[var(--taupe)]">
                <EventsIcon className="h-6 w-6 text-[var(--sage-green)]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-[var(--sage-green)] truncate">
                    {t('organizer.completedEvents')}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-black">
                      {stats.completedEvents}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-yellow-200">
                <EventsIcon className="h-6 w-6 text-yellow-800" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-[var(--sage-green)] truncate">
                    {t('organizer.pendingPayment')}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-black">
                      {stats.pendingPaymentEvents}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Tabs */}
      <div className="mt-8">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">Select a tab</label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full pl-3 pr-10 py-2 text-base border-[var(--cognac)] focus:outline-none focus:ring-[var(--sage-green)] focus:border-[var(--sage-green)] sm:text-sm rounded-md"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <option value="upcoming">{t('organizer.upcomingEvents')}</option>
            <option value="past">{t('organizer.pastEvents')}</option>
            <option value="all">{t('organizer.allEvents')}</option>
            <option value="refunds">{t('payment.refundRequest')}</option>
            <option value="create">{t('organizer.createEvent')}</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-[var(--cognac)]">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`${
                  activeTab === 'upcoming'
                    ? 'border-[var(--sage-green)] text-[var(--sage-green)]'
                    : 'border-transparent text-black hover:text-[var(--sage-green)] hover:border-[var(--cognac)]'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {t('organizer.upcomingEvents')}
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`${
                  activeTab === 'past'
                    ? 'border-[var(--sage-green)] text-[var(--sage-green)]'
                    : 'border-transparent text-black hover:text-[var(--sage-green)] hover:border-[var(--cognac)]'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {t('organizer.pastEvents')}
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`${
                  activeTab === 'all'
                    ? 'border-[var(--sage-green)] text-[var(--sage-green)]'
                    : 'border-transparent text-black hover:text-[var(--sage-green)] hover:border-[var(--cognac)]'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {t('organizer.allEvents')}
              </button>
              <button
                onClick={() => setActiveTab('refunds')}
                className={`${
                  activeTab === 'refunds'
                    ? 'border-[var(--sage-green)] text-[var(--sage-green)]'
                    : 'border-transparent text-black hover:text-[var(--sage-green)] hover:border-[var(--cognac)]'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {t('payment.refundRequest')}
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`${
                  activeTab === 'create'
                    ? 'border-[var(--sage-green)] text-[var(--sage-green)]'
                    : 'border-transparent text-black hover:text-[var(--sage-green)] hover:border-[var(--cognac)]'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {t('organizer.createEvent')}
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'upcoming' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-[var(--sage-green)]">
                {t('organizer.upcomingEvents')}
              </h3>
              <Button size="sm" onClick={handleCreateEvent}>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {t('organizer.newEvent')}
                </span>
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--sage-green)]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <EventCard 
                    key={event._id || event.id} 
                    event={event} 
                    t={t} 
                    onEdit={handleEditEvent}
                    onViewDetails={handleViewEventDetails}
                    onDelete={handleDeleteEvent}
                    onMarkCompleted={handleMarkAsCompleted}
                    isDeletingThis={deletingEventId === (event._id || event.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center text-gray-500">
                {t('organizer.noUpcomingEvents')}
                <div className="mt-4">
                  <Button onClick={handleCreateEvent}>
                    {t('organizer.createFirstEvent')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'past' && (
          <div>
            <h3 className="text-lg leading-6 font-medium text-[var(--sage-green)] mb-4">
              {t('organizer.pastEvents')}
            </h3>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--sage-green)]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            ) : pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event) => (
                  <EventCard 
                    key={event._id || event.id} 
                    event={event} 
                    t={t} 
                    onEdit={handleEditEvent}
                    onViewDetails={handleViewEventDetails}
                    onDelete={handleDeleteEvent}
                    onMarkCompleted={handleMarkAsCompleted}
                    isDeletingThis={deletingEventId === (event._id || event.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center text-gray-500">
                {t('organizer.noPastEvents')}
              </div>
            )}
          </div>
        )}

        {activeTab === 'all' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-[var(--sage-green)]">
                {t('organizer.allEvents')}
              </h3>
              <Button size="sm" onClick={handleCreateEvent}>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {t('organizer.newEvent')}
                </span>
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--sage-green)]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            ) : allEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {allEvents.map((event) => (
                  <EventCard 
                    key={event._id || event.id} 
                    event={event} 
                    t={t} 
                    onEdit={handleEditEvent}
                    onViewDetails={handleViewEventDetails}
                    onDelete={handleDeleteEvent}
                    onMarkCompleted={handleMarkAsCompleted}
                    isDeletingThis={deletingEventId === (event._id || event.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center text-gray-500">
                {t('organizer.noEvents')}
                <div className="mt-4">
                  <Button onClick={handleCreateEvent}>
                    {t('organizer.createFirstEvent')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'refunds' && (
          <div>
            <iframe src="/organizer/refund-requests" className="w-full min-h-[800px] border-none" title="Refund Requests" />
          </div>
        )}

        {activeTab === 'create' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-[var(--sage-green)]">
                {t('organizer.createNewEvent')}
              </h3>
              <div className="mt-2 max-w-xl text-sm text-black">
                <p>{t('organizer.createNewEventDescription')}</p>
              </div>
              <Button
                className="mt-5"
                onClick={handleCreateEvent}
              >
                {t('organizer.openAdvancedCreator')}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEdit={handleEditEvent}
      />
    </>
  );
} 