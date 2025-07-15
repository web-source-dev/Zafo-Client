'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/auth/auth-context';
import { useLanguage } from '@/i18n/language-context';
import eventService, { Event } from '@/services/event-service';
import ticketService, { Ticket } from '@/services/ticket-service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import TicketPurchaseCard from '@/components/events/TicketPurchaseCard';
import { formatDate, formatTime, formatDateRange } from '@/utils/dateUtils';

export default function EventDetailPage() {
  const { t } = useLanguage();
  const { slug } = useParams();
  const router = useRouter();
  const { isAuthenticated, isOrganizer } = useAuth();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attendeeCount, setAttendeeCount] = useState<number>(0);
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);
  const [showTicketPurchase, setShowTicketPurchase] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // Fetch event details and user tickets when component mounts
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!slug) return;

      setIsLoading(true);
      try {
        const response = await eventService.getEvent(slug as string);
        if (response.success && response.data) {
          setEvent(response.data);
          
          // Fetch user's tickets for this event if authenticated
          if (isAuthenticated) {
            try {
                          const ticketsResponse = await ticketService.getUserTickets();
            if (ticketsResponse.success && ticketsResponse.data) {
              const eventTickets = ticketsResponse.data.tickets.filter(
                (ticket) => {
                  const ticketEventId = typeof ticket.eventId === 'string' 
                    ? ticket.eventId 
                    : ticket.eventId._id;
                  return ticketEventId === response.data!._id;
                }
              );
              setUserTickets(eventTickets);
            }
            } catch (ticketErr) {
              console.error('Error fetching user tickets:', ticketErr);
            }
          }
        } else {
          setError(response.message || t('events.detail.eventNotFound'));
        }
      } catch (err) {
        setError(t('events.detail.error'));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [slug, t, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg" role="alert">
          <p className="text-lg font-medium mb-2">{t('events.detail.error')}</p>
          <p>{error || t('events.detail.eventNotFound')}</p>
          <div className="mt-4">
            <Button onClick={() => router.push('/events')}>{t('events.detail.backToEvents')}</Button>
          </div>
        </div>
      </div>
    );
  }

  // Format organizer name
  const organizerName = typeof event.organizer === 'object' 
    ? `${event.organizer.firstName} ${event.organizer.lastName}`
    : t('events.detail.organizer');

  // Check if user has already purchased a ticket
  const hasPurchasedTicket = userTickets.length > 0;
  const purchasedTicket = userTickets[0]; // Get the first ticket if user has multiple

  // Handle ticket purchase success
  const handlePurchaseSuccess = () => {
    setPurchaseSuccess(true);
    setShowTicketPurchase(false);
    // Refresh user tickets
    window.location.reload();
  };

  // Handle ticket purchase cancel
  const handlePurchaseCancel = () => {
    setShowTicketPurchase(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white w-full">
      {/* Event Header */}
      <div className="mb-6">
        <Link href="/events" className="text-[var(--sage-green)] hover:underline mb-4 inline-block">
          &larr; {t('events.detail.backToEvents')}
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
            <p className="text-lg text-gray-600 mb-2">{event.smallDescription}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="default">{event.category}</Badge>
              <Badge variant={event.price.isFree ? 'success' : 'info'}>
                {event.price.isFree ? t('events.free') : `${event.price.amount} ${event.price.currency}`}
              </Badge>
              <Badge variant="outline">{event.status}</Badge>
            </div>
          </div>
          
          {isOrganizer && (
            <div className="mt-4 md:mt-0">
              <Button 
                variant="outline" 
                onClick={() => router.push(`/organizer/events/edit/${event._id}`)}
                className="mr-2"
              >
                {t('events.detail.editEvent')}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Event Image */}
      <div className="w-full h-80 md:h-96 relative mb-8 rounded-lg overflow-hidden">
        {event.coverImage ? (
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-lg">{t('events.detail.noCoverImage')}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Event Details */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('events.detail.aboutThisEvent')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: event.aboutEvent }} />
              </div>
            </CardContent>
          </Card>

          {/* Speakers Section */}
          {event.speakers && event.speakers.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t('events.detail.speakers')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.speakers.map((speaker, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      {speaker.image ? (
                        <div className="relative h-16 w-16 rounded-full overflow-hidden">
                          <Image 
                            src={speaker.image} 
                            alt={speaker.name} 
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-lg">{speaker.name.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <h4 className="text-lg font-medium">{speaker.name}</h4>
                        {speaker.role && <p className="text-sm text-gray-500 mb-1">{speaker.role}</p>}
                        <p className="text-sm">{speaker.about}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Information */}
          {event.additionalFields && event.additionalFields.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t('events.detail.additionalInformation')}</CardTitle>
              </CardHeader>
              <CardContent>
                {event.additionalFields.map((field, index) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <h4 className="font-medium mb-1">{field.title}</h4>
                    <p>{field.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Refund Policy */}
          {event.refundPolicy && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t('events.detail.refundPolicy')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{event.refundPolicy}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Event Info */}
        <div>
          {/* Date & Time */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('events.detail.dateAndTime')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{formatDateRange(new Date(event.startDate), new Date(event.endDate))}</p>
              <p className="text-gray-600">
                {formatTime(new Date(event.startDate))} - {formatTime(new Date(event.endDate))}
              </p>
              
              {event.arriveBy && (
                <div className="mt-4">
                  <p className="text-sm font-medium">{t('events.detail.arriveBy')}</p>
                  <p className="text-sm">{event.arriveBy}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('events.detail.location')}</CardTitle>
            </CardHeader>
            <CardContent>
              {event.location.online ? (
                <div>
                  <p className="font-medium">{t('events.detail.onlineEvent')}</p>
                  {isAuthenticated && event.location.meetingLink && (
                    <a 
                      href={event.location.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[var(--sage-green)] hover:underline mt-2 inline-block"
                    >
                      {t('events.detail.joinEvent')}
                    </a>
                  )}
                </div>
              ) : (
                <div>
                  <p className="font-medium">{event.location.name}</p>
                  <address className="not-italic text-gray-600">
                    {event.location.address.street}<br />
                    {event.location.address.city}, {event.location.address.state || ''} {event.location.address.postalCode}<br />
                    {event.location.address.country}
                  </address>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Capacity */}
          {event.capacity && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t('events.detail.capacity')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t('events.detail.sold')}:</span>
                    <span className="font-medium">{attendeeCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('events.detail.total')}:</span>
                    <span className="font-medium">{event.capacity}</span>
                  </div>
                  <div className="flex justify-between text-[var(--sage-green)]">
                    <span>{event.capacity - attendeeCount} {t('events.detail.remaining')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Registration/RSVP Button */}
          <div className="mb-6">
            {!isAuthenticated ? (
              <Button 
                className="w-full" 
                size="lg" 
                variant="outline"
                onClick={() => router.push('/login')}
              >
                {t('events.detail.login')}
              </Button>
            ) : hasPurchasedTicket ? (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        {t('events.detail.ticketPurchased')}
                      </h3>
                      <p className="text-sm text-green-700 mt-1">
                        {purchasedTicket.paymentStatus === 'paid' 
                          ? t('events.detail.ticketConfirmed')
                          : t('events.detail.ticketPending')
                        }
                      </p>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/dashboard/tickets')}
                >
                  {t('events.detail.viewMyTickets')}
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => setShowTicketPurchase(true)}
              >
                {t('events.detail.register')}
              </Button>
            )}
          </div>

          {/* Share Button */}
          <div className="mb-6">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: event.title,
                    text: event.smallDescription,
                    url: window.location.href,
                  })
                }
              }}
            >
              {t('events.detail.shareEvent')}
            </Button>
          </div>

          {/* Organizer Info */}
          {typeof event.organizer === 'object' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('events.detail.organizerInfo')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    {event.organizer.firstName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{organizerName}</p>
                    <p className="text-sm text-gray-500">{t('events.detail.organizer')}</p>
                  </div>
                </div>
                {isAuthenticated && (
                  <Button variant="outline" className="w-full text-sm">
                    {t('events.detail.contactOrganizer')}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Ticket Purchase Modal */}
      {showTicketPurchase && event && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{t('payment.purchaseTicket')}</h2>
                <button
                  onClick={handlePurchaseCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <TicketPurchaseCard
                event={event}
                onSuccess={handlePurchaseSuccess}
                onCancel={handlePurchaseCancel}
              />
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {purchaseSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('events.detail.purchaseSuccess')}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {t('events.detail.purchaseSuccessDesc')}
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setPurchaseSuccess(false)}
                  className="flex-1"
                >
                  {t('common.close')}
                </Button>
                <Button
                  onClick={() => router.push('/dashboard/tickets')}
                  className="flex-1"
                >
                  {t('events.detail.viewMyTickets')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 