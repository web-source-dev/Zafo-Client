'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/auth/auth-context';
import { useLanguage } from '@/i18n/language-context';
import eventService, { Event, EventStats } from '@/services/event-service';
import ticketService, { Ticket } from '@/services/ticket-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { formatTime, formatDateRange } from '@/utils/dateUtils';
import { MapPin, Calendar, Clock, Users, Tag, Share2, Heart, ArrowLeft } from 'lucide-react';

export default function EventDetailPage() {
  const { t } = useLanguage();
  const { slug } = useParams();
  const router = useRouter();
  const { isAuthenticated, isOrganizer } = useAuth();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventStats, setEventStats] = useState<EventStats | null>(null);
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Fetch event details and user tickets when component mounts
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!slug) return;

      setIsLoading(true);
      try {
        const response = await eventService.getEvent(slug as string);
        if (response.success && response.data) {
          setEvent(response.data);
          
          // Fetch event statistics
          try {
            const statsResponse = await eventService.getEventStats(response.data._id);
            if (statsResponse.success && statsResponse.data) {
              setEventStats(statsResponse.data);
            }
          } catch (statsErr) {
            console.error('Error fetching event stats:', statsErr);
          }
          
                      // Check if event is saved
            if (isAuthenticated) {
              try {
                const savedResponse = await eventService.checkSavedEvent(response.data._id);
                if (savedResponse.success && savedResponse.data) {
                  setIsSaved(savedResponse.data.isSaved);
                }
              } catch (savedErr) {
                console.error('Error checking saved status:', savedErr);
              }
            }
          
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
    return <LoadingScreen />;
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

  // Navigate to ticket purchase page
  const handlePurchaseTickets = () => {
    router.push(`/payment/event/${event._id}`);
  };

  // Navigate to add more tickets page
  const handleAddMoreTickets = () => {
    router.push(`/payment/event/${event._id}?adding=true`);
  };

  // Handle save/unsave event
  const handleSaveEvent = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      if (isSaved) {
        await eventService.unsaveEvent(event._id);
        setIsSaved(false);
      } else {
        await eventService.saveEvent(event._id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Error saving/unsaving event:', err);
    }
  };

  // Handle share event
  const handleShareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.smallDescription,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        {event.coverImage ? (
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{event.title}</h1>
              <p className="text-xl md:text-2xl opacity-90">{event.smallDescription}</p>
            </div>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Link href="/events" className="flex items-center text-white hover:text-gray-200 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('events.detail.backToEvents')}
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareEvent}
            className="bg-white/90 hover:bg-white text-gray-800"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {t('events.detail.shareEvent')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveEvent}
            className={`${isSaved ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/90 hover:bg-white text-gray-800'}`}
          >
            <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? t('events.saved') || 'Saved' : t('events.save') || 'Save'}
          </Button>
        </div>

        {/* Event Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 md:p-8">
          <div className="container mx-auto">
            <div className="flex flex-wrap items-center gap-4 text-white">
              <Badge variant="default" className="bg-white/20 text-white border-white/30">
                {event.category}
              </Badge>
              <Badge variant={event.price.isFree ? 'success' : 'default'} className="bg-white/20 text-white border-white/30">
                {event.price.isFree ? t('events.free') : `${event.price.amount} ${event.price.currency}`}
              </Badge>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                {event.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Title and Description */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
              <p className="text-lg text-gray-600 mb-6">{event.smallDescription}</p>
              
              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-[var(--sage-green)]" />
                  <div>
                    <p className="text-sm text-gray-500">{t('events.detail.dateAndTime')}</p>
                    <p className="font-medium">{formatDateRange(new Date(event.startDate), new Date(event.endDate))}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-[var(--sage-green)]" />
                  <div>
                    <p className="text-sm text-gray-500">{t('events.detail.time') || 'Time'}</p>
                    <p className="font-medium">
                      {formatTime(new Date(event.startDate))} - {formatTime(new Date(event.endDate))}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-[var(--sage-green)]" />
                  <div>
                    <p className="text-sm text-gray-500">{t('events.detail.location')}</p>
                    <p className="font-medium">
                      {event.location.online ? t('events.detail.onlineEvent') : event.location.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-[var(--sage-green)]" />
                  <div>
                    <p className="text-sm text-gray-500">{t('events.detail.capacity')}</p>
                    <p className="font-medium">
                      {eventStats?.soldTickets || 0} / {event.capacity} {t('events.detail.sold')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* About Event */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">{t('events.detail.aboutThisEvent')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: event.aboutEvent }} />
                </div>
              </CardContent>
            </Card>

            {/* Speakers Section */}
            {event.speakers && event.speakers.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">{t('events.detail.speakers')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {event.speakers.map((speaker, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        {speaker.image ? (
                          <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                            <Image 
                              src={speaker.image} 
                              alt={speaker.name} 
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-[var(--sage-green)] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {speaker.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{speaker.name}</h4>
                          {speaker.role && <p className="text-sm text-[var(--sage-green)] font-medium mb-2">{speaker.role}</p>}
                          <p className="text-gray-600">{speaker.about}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Information */}
            {event.additionalFields && event.additionalFields.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">{t('events.detail.additionalInformation')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {event.additionalFields.map((field, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">{field.title}</h4>
                        <p className="text-gray-600">{field.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Refund Policy */}
            {event.refundPolicy && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">{t('events.detail.refundPolicy')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-700">{event.refundPolicy}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Event Info & Actions */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="shadow-sm border-2 border-[var(--sage-green)]/20">
              <CardHeader className="bg-[var(--sage-green)]/5">
                <CardTitle className="text-center text-[var(--sage-green)]">
                  {t('events.detail.pricing') || 'Pricing'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center">
                  {event.price.isFree ? (
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {t('events.free')}
                    </div>
                  ) : (
                    <div className="mb-2">
                      <div className="text-4xl font-bold text-gray-900">
                        {event.price.amount} {event.price.currency}
                      </div>
                      <div className="text-sm text-gray-500">
                        {t('events.detail.perTicket') || 'per ticket'}
                      </div>
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-3">
                    {t('events.detail.securePayment') || 'Secure payment processing'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Registration/RSVP Button */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
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
                  <div className="space-y-4">
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
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => router.push('/dashboard/tickets')}
                      >
                        {t('events.detail.viewMyTickets')}
                      </Button>
                      <Button 
                        className="w-full"
                        onClick={handleAddMoreTickets}
                        disabled={eventStats?.isSoldOut}
                      >
                        {t('events.detail.buyMore')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handlePurchaseTickets}
                    disabled={eventStats?.isSoldOut}
                  >
                    {eventStats?.isSoldOut ? t('events.detail.soldOut') : t('events.detail.register')}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Capacity & Stats */}
            {event.capacity && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>{t('events.detail.capacity')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t('events.detail.sold')}:</span>
                      <span className="font-semibold">{eventStats?.soldTickets || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t('events.detail.total')}:</span>
                      <span className="font-semibold">{event.capacity}</span>
                    </div>
                    <div className="flex justify-between items-center text-[var(--sage-green)]">
                      <span>{eventStats?.remainingCapacity || event.capacity} {t('events.detail.remaining')}</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-[var(--sage-green)] h-3 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${event.capacity > 0 ? (eventStats?.soldTickets || 0) / event.capacity * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                    
                    {eventStats?.isSoldOut && (
                      <div className="text-center">
                        <Badge variant="danger" className="text-sm">
                          {t('events.detail.soldOut')}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location Card with Map */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-[var(--sage-green)]" />
                  {t('events.detail.location')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {event.location.online ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="font-medium text-blue-900">{t('events.detail.onlineEvent')}</p>
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
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-gray-900 mb-2">{event.location.name}</p>
                      <address className="not-italic text-gray-600 text-sm">
                        {event.location.address.street}<br />
                        {event.location.address.city}, {event.location.address.state || ''} {event.location.address.postalCode}<br />
                        {event.location.address.country}
                      </address>
                    </div>
                    
                    {/* Map */}
                    <div className="h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                          `${event.location.address.street}, ${event.location.address.city}, ${event.location.address.state || ''} ${event.location.address.postalCode}, ${event.location.address.country}`
                        )}`}
                        title={`Map showing ${event.location.name}`}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Organizer Info */}
            {typeof event.organizer === 'object' && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>{t('events.detail.organizerInfo')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-[var(--sage-green)] flex items-center justify-center text-white font-bold text-lg">
                      {event.organizer.firstName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{organizerName}</p>
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

            {/* Edit Button for Organizers */}
            {isOrganizer && (
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <Button 
                    variant="outline" 
                    onClick={() => router.push(`/organizer/events/edit/${event._id}`)}
                    className="w-full"
                  >
                    {t('events.detail.editEvent')}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Success Message Modal */}
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