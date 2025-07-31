'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/i18n/language-context';
import { useAuth } from '@/auth/auth-context';
import Button from '@/components/ui/Button';
import eventService, { Event } from '@/services/event-service';
import Image from 'next/image';
import { ArrowLeft, Edit, CreditCard, Users } from 'lucide-react';
import LoadingScreen from '@/components/ui/LoadingScreen';

// Extended Event interface to include pending_payment status
interface EventWithExtendedStatus extends Omit<Event, 'status'> {
  status: 'draft' | 'published' | 'canceled' | 'completed' | 'pending_payment';
}

export default function OrganizerEventDetailsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventWithExtendedStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!params.id) return;
      
      try {
        setIsLoading(true);
        const response = await eventService.getEvent(params.id as string);
        
        if (response.success && response.data) {
          setEvent(response.data as unknown as EventWithExtendedStatus);
          
          // Verify that this event belongs to the current user
          const eventOrganizerId = typeof response.data.organizer === 'string' 
            ? response.data.organizer 
            : response.data.organizer._id;
            
          const userId = user?._id?.toString();
          const organizerId = eventOrganizerId?.toString();
          
          if (userId !== organizerId && user?.role !== 'admin') {
            setError(t('events.unauthorized'));
            return;
          }
        } else {
          setError(response.message || t('events.notFound'));
        }
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error.message || t('common.error'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [params.id, t, user]);

  // Format date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString();
  };
  
  // Format time
  const formatTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get event category translation
  const getCategoryTranslation = (category: string): string => {
    return t(`events.categories.${category}`);
  };
  
  // Get event status translation
  const getStatusTranslation = (status: string): string => {
    return t(`events.status.${status}`);
  };
  
  // Get localized content
  const getLocalizedContent = (content: string | undefined): string => {
    if (!content) return '';
    return content;
  };

  // Handle complete payment
  const handleCompletePayment = () => {
    if (event) {
      router.push(`/payment/create/${event._id}`);
    }
  };

  // Handle edit event
  const handleEditEvent = () => {
    if (event) {
      router.push(`/organizer/events/edit/${event._id}`);
    }
  };

  // Handle view participants
  const handleViewParticipants = () => {
    if (event) {
      router.push(`/organizer/events/${event._id}/participants`);
    }
  };

  // Handle back to events
  const handleBackToEvents = () => {
    router.push('/organizer/events');
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error || t('events.notFound')}
          </div>
          <Button onClick={handleBackToEvents}>
            {t('events.backToEvents')}
          </Button>
        </div>
      </div>
    );
  }

  // Get event title
  const eventTitle = getLocalizedContent(event.title);
  const eventSmallDescription = getLocalizedContent(event.smallDescription);
  const eventAbout = getLocalizedContent(event.aboutEvent);
  const eventRefundPolicy = event.refundPolicy ? getLocalizedContent(event.refundPolicy) : undefined;
  const eventIncludes = event.eventIncludes ? getLocalizedContent(event.eventIncludes) : undefined;
  const eventArriveBy = event.arriveBy ? getLocalizedContent(event.arriveBy) : undefined;
  const eventDeliverBy = event.deliverBy ? getLocalizedContent(event.deliverBy) : undefined;
  const locationName = event.location.name ? getLocalizedContent(event.location.name) : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={handleBackToEvents}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('events.backToEvents')}
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--sage-green)] mb-2">
                {eventTitle}
              </h1>
              <p className="text-lg text-gray-600">{eventSmallDescription}</p>
            </div>
            
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              {event.status === 'pending_payment' && (
                <Button 
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  onClick={handleCompletePayment}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {t('payment.completePayment')}
                </Button>
              )}
              
              <Button 
                onClick={handleEditEvent}
              >
                <Edit className="h-4 w-4 mr-2" />
                {t('common.edit')}
              </Button>

              <Button 
                onClick={handleViewParticipants}
              >
                <Users className="h-4 w-4 mr-2" />
                {t('events.viewParticipants')}
              </Button>
            </div>
          </div>
        </div>

        {/* Event Status and Category */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className={`px-3 py-1 text-sm font-semibold rounded-full 
              ${event.status === 'published' ? 'bg-[var(--sage)] text-black' : 
                event.status === 'draft' ? 'bg-[var(--cognac)] text-black' : 
                event.status === 'pending_payment' ? 'bg-yellow-200 text-yellow-800' :
                'bg-[var(--taupe)] text-black'}`}>
              {getStatusTranslation(event.status)}
            </span>
            <span className="px-3 py-1 text-sm font-semibold rounded-full bg-[var(--sage-green)] text-white">
              {getCategoryTranslation(event.category)}
            </span>
          </div>
          
          {/* Payment required notice */}
          {event.status === 'pending_payment' && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4">
              {t('payment.pendingMessage')}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cover Image */}
            {event.coverImage && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <Image 
                  src={event.coverImage} 
                  alt={eventTitle} 
                  className="w-full h-64 object-cover"
                  width={800}
                  height={400}
                />
              </div>
            )}

            {/* Date and Time */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-[var(--sage-green)] mb-4">
                {t('events.dateAndTime')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-[var(--sage-green)]">{t('events.form.startDate')}</p>
                  <p className="text-black">{formatDate(event.startDate)}, {formatTime(event.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--sage-green)]">{t('events.form.endDate')}</p>
                  <p className="text-black">{formatDate(event.endDate)}, {formatTime(event.endDate)}</p>
                </div>
              </div>
            </div>

            {/* About this event */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-[var(--sage-green)] mb-4">
                {t('events.aboutEvent')}
              </h2>
              <div className="prose max-w-none">
                <p className="text-black whitespace-pre-line">{eventAbout}</p>
              </div>
            </div>

            {/* Speakers section */}
            {event.speakers && event.speakers.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-[var(--sage-green)] mb-4">
                  {t('events.speakers')}
                </h2>
                
                <div className="space-y-4">
                  {event.speakers.map((speaker, index) => (
                    <div key={index} className="border border-[var(--cognac)] rounded-lg p-4 flex">
                      {speaker.image && (
                        <div className="mr-4">
                          <Image 
                            src={speaker.image} 
                            alt={speaker.name} 
                            className="w-20 h-20 object-cover rounded-full"
                            width={80}
                            height={80}
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-black">{speaker.name}</h4>
                        {speaker.role && <p className="text-sm text-gray-600 mb-2">{speaker.role}</p>}
                        <p className="text-sm whitespace-pre-line text-black">{getLocalizedContent(speaker.about)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What this event includes */}
            {eventIncludes && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-[var(--sage-green)] mb-4">
                  {t('events.eventIncludes')}
                </h2>
                <p className="text-black whitespace-pre-line">{eventIncludes}</p>
              </div>
            )}

            {/* Additional fields */}
            {event.additionalFields && event.additionalFields.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-[var(--sage-green)] mb-4">
                  {t('events.additionalInfo')}
                </h2>
                
                <div className="space-y-4">
                  {event.additionalFields.map((field, index) => (
                    <div key={index} className="border border-[var(--cognac)] rounded-lg p-4">
                      <h4 className="font-medium text-black mb-2">{getLocalizedContent(field.title)}</h4>
                      <p className="text-sm whitespace-pre-line text-black">{getLocalizedContent(field.content)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery section */}
            {event.galleryImages && event.galleryImages.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-[var(--sage-green)] mb-4">
                  {t('events.form.galleryImages')}
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.galleryImages.map((imageUrl, index) => (
                    <Image 
                      key={index}
                      src={imageUrl} 
                      alt={`${eventTitle} - ${index + 1}`}
                      className="w-full border border-[var(--cognac)] h-40 object-cover rounded-lg"
                      width={300}
                      height={200}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-[var(--sage-green)] mb-4">
                  {t('events.form.tags')}
                </h2>
                
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-[rgba(83,94,75,0.1)] text-[var(--sage-green)] px-3 py-1 rounded-md text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Location */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-[var(--sage-green)] mb-4">
                {t('events.location')}
              </h2>
              
              {event.location.online ? (
                <div>
                  <p className="text-sm font-medium">{t('events.form.isOnline')}</p>
                  {event.location.meetingLink && (
                    <a 
                      href={event.location.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[var(--sage-green)] underline break-all"
                    >
                      {event.location.meetingLink}
                    </a>
                  )}
                </div>
              ) : (
                <div className="text-black">
                  <p className="font-medium">{locationName}</p>
                  <p>{event.location.address.street}</p>
                  <p>{event.location.address.postalCode} {event.location.address.city}</p>
                  <p>{event.location.address.country}</p>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-[var(--sage-green)] mb-4">
                {t('events.form.price')}
              </h2>
              <div className="flex items-center">
                <span className="text-2xl font-bold">
                  {new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: event.price.currency
                  }).format(event.price.amount)}
                </span>
              </div>
            </div>

            {/* Age range */}
            {event.ageRange && (event.ageRange.min || event.ageRange.max) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-[var(--sage-green)] mb-4">
                  {t('events.ageRange')}
                </h2>
                <p className="text-black">
                  {event.ageRange.min && event.ageRange.max 
                    ? `${event.ageRange.min} - ${event.ageRange.max} ${t('events.years')}` 
                    : event.ageRange.min 
                      ? `${t('events.minAge')}: ${event.ageRange.min} ${t('events.years')}` 
                      : `${t('events.maxAge')}: ${event.ageRange.max} ${t('events.years')}`}
                </p>
              </div>
            )}

            {/* Arrive by */}
            {eventArriveBy && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-[var(--sage-green)] mb-4">
                  {t('events.arriveBy')}
                </h2>
                <p className="text-black">{eventArriveBy}</p>
              </div>
            )}

            {/* Delivered by name */}
            {eventDeliverBy && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-[var(--sage-green)] mb-4">
                  {t('events.deliverBy')}
                </h2>
                <p className="text-black">{eventDeliverBy}</p>
              </div>
            )}

            {/* Refund policy */}
            {eventRefundPolicy && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-[var(--sage-green)] mb-4">
                  {t('events.refundPolicy')}
                </h2>
                <p className="text-black whitespace-pre-line">{eventRefundPolicy}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 