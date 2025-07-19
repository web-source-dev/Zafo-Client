'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '@/auth/auth-context';
import { useLanguage } from '@/i18n/language-context';
import eventService, { Event } from '@/services/event-service';
import ticketService, { 
  TicketPurchaseRequest, 
  TicketPurchaseResponse, 
  TicketDetail,
  Ticket,
  AddTicketsToExistingRequest,
  AddTicketsToExistingResponse,
  ConfirmAdditionalTicketRequest
} from '@/services/ticket-service';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { formatDate } from '@/utils/dateUtils';

// Load Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function TicketPurchasePage() {
  const { t } = useLanguage();
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [existingTicket, setExistingTicket] = useState<Ticket | null>(null);
  const [isAddingToExisting, setIsAddingToExisting] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // Get query parameters
  const existingTicketId = searchParams.get('existingTicketId');
  const isAdding = searchParams.get('adding') === 'true';

  // Fetch event details and check for existing tickets
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const response = await eventService.getEvent(id as string);
        if (response.success && response.data) {
          setEvent(response.data);
          
          // Check if user has existing tickets for this event
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
                
                if (eventTickets.length > 0) {
                  setExistingTicket(eventTickets[0]);
                  setIsAddingToExisting(true);
                }
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
  }, [id, t, isAuthenticated]);
  
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
  
  // Check if user is the organizer
  const eventOrganizerId = typeof event.organizer === 'string' 
    ? event.organizer 
    : event.organizer._id;
    
  if (user && user._id === eventOrganizerId) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg" role="alert">
          <p className="text-lg font-medium mb-2">{t('payment.organizerCannotPurchase')}</p>
          <p>{t('payment.organizerCannotPurchaseDesc')}</p>
          <div className="mt-4">
            <Button onClick={() => router.push(`/events/${event.slug}`)}>
              {t('events.detail.backToEvent')}
            </Button>
        </div>
        </div>
      </div>
    );
  }
  
  // Check if event is free
  if (event.price.isFree) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg" role="alert">
          <p className="text-lg font-medium mb-2">{t('payment.freeEvent')}</p>
          <p>{t('payment.freeEventDesc')}</p>
          <div className="mt-4">
            <Button onClick={() => router.push(`/events/${event.slug}`)}>
              {t('events.detail.backToEvent')}
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/events/${event.slug}`)}
            className="mb-4"
          >
            &larr; {t('events.detail.backToEvent')}
          </Button>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isAddingToExisting ? t('payment.addMoreTickets') : t('payment.purchaseTicket')}
            </h1>
            <p className="text-lg text-gray-600">{event.title}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Purchase Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isAddingToExisting ? t('payment.additionalAttendeeDetails') : t('payment.attendeeDetails')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Elements stripe={stripePromise}>
                  <TicketPurchaseForm 
                    event={event}
                    existingTicket={existingTicket}
                    isAddingToExisting={isAddingToExisting}
                    onSuccess={() => setPurchaseSuccess(true)}
                  />
                </Elements>
              </CardContent>
            </Card>
            </div>

          {/* Right Column - Event Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>{t('payment.eventSummary')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Event Info */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">{event.title}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{formatDate(new Date(event.startDate))}</p>
                      <p>{event.location.name}</p>
                    </div>
            </div>
            
                  {/* Price Info */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">{t('payment.ticketPrice')}</span>
                      <span className="font-medium">{event.price.amount} {event.price.currency}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">{t('payment.platformFee')} (10%)</span>
                      <span className="text-sm text-gray-500">
                        {Math.round(event.price.amount * 0.10 * 100) / 100} {event.price.currency}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{t('payment.total')}</span>
                        <span className="font-bold text-lg text-[var(--sage-green)]">
                          {event.price.amount} {event.price.currency}
              </span>
                      </div>
                    </div>
                  </div>

                  {/* Event Status */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{t('events.detail.status')}</span>
                      <Badge variant={event.status === 'published' ? 'success' : 'outline'}>
                        {event.status}
                      </Badge>
            </div>
          </div>
          
                  {/* Existing Ticket Info */}
                  {isAddingToExisting && existingTicket && (
                    <div className="border-t pt-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                          {t('payment.addingToExisting', { currentTickets: String(existingTicket.quantity) })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
          </div>
          
      {/* Success Modal */}
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
                  onClick={() => router.push(`/events/${event.slug}`)}
                  className="flex-1"
            >
                  {t('events.detail.backToEvent')}
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

// Ticket Purchase Form Component
const TicketPurchaseForm: React.FC<{
  event: Event;
  existingTicket: Ticket | null;
  isAddingToExisting: boolean;
  onSuccess: () => void;
}> = ({ event, existingTicket, isAddingToExisting, onSuccess }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [ticketDetails, setTicketDetails] = useState<TicketDetail[]>([
    { attendeeName: '', attendeeEmail: '', ticketNumber: '' }
  ]);

  // Calculate ticket price
  const ticketPrice = event.price.isFree ? 0 : event.price.amount;
  const totalTicketPrice = ticketPrice * quantity;
  const platformFee = Math.round(totalTicketPrice * 0.10 * 100) / 100;
  const organizerPayment = totalTicketPrice - platformFee;
  const totalAmount = totalTicketPrice;

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setQuantity(newQuantity);
    
    const newTicketDetails: TicketDetail[] = [];
    for (let i = 0; i < newQuantity; i++) {
      newTicketDetails.push({
        attendeeName: ticketDetails[i]?.attendeeName || '',
        attendeeEmail: ticketDetails[i]?.attendeeEmail || '',
        ticketNumber: ''
      });
    }
    setTicketDetails(newTicketDetails);
  };

  // Handle ticket detail change
  const handleTicketDetailChange = (index: number, field: 'attendeeName' | 'attendeeEmail', value: string) => {
    const newTicketDetails = [...ticketDetails];
    newTicketDetails[index] = {
      ...newTicketDetails[index],
      [field]: value,
      ticketNumber: ''
    };
    setTicketDetails(newTicketDetails);
  };

  // Validate ticket details
  const validateTicketDetails = (): boolean => {
    for (let i = 0; i < ticketDetails.length; i++) {
      const detail = ticketDetails[i];
      if (!detail.attendeeName.trim() || !detail.attendeeEmail.trim()) {
        setError(t('payment.missingTicketDetails', { ticketNumber: String(i + 1) }));
        return false;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(detail.attendeeEmail)) {
        setError(t('payment.invalidEmail', { ticketNumber: String(i + 1) }));
        return false;
      }
    }
    return true;
  };

  const handlePurchase = async () => {
    if (!stripe || !elements) {
      setError(t('payment.stripeNotLoaded'));
      return;
    }

    if (!validateTicketDetails()) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      let response;
      let clientSecret: string;

      if (isAddingToExisting && existingTicket) {
        // Add tickets to existing purchase
        const addRequest: AddTicketsToExistingRequest = {
          existingTicketId: existingTicket._id,
          additionalQuantity: quantity,
          additionalTicketDetails: ticketDetails
        };

        const addResponse = await ticketService.addTicketsToExistingPurchase(addRequest);

        if (!addResponse.success) {
          setError(addResponse.message || t('payment.purchaseFailed'));
          return;
        }

        response = addResponse;
        clientSecret = addResponse.data!.clientSecret;
      } else {
        // Create new ticket purchase
        const purchaseRequest: TicketPurchaseRequest = {
          eventId: event._id,
          ticketPrice: ticketPrice,
          currency: event.price.currency || 'CHF',
          quantity: quantity,
          ticketDetails: ticketDetails
        };

        const purchaseResponse = await ticketService.createTicketPurchase(purchaseRequest);

        if (!purchaseResponse.success) {
          setError(purchaseResponse.message || t('payment.purchaseFailed'));
          return;
        }

        response = purchaseResponse;
        clientSecret = purchaseResponse.data!.clientSecret;
      }

      // Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: `${user?.firstName} ${user?.lastName}`,
              email: user?.email,
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || t('payment.stripeError'));
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        if (isAddingToExisting && existingTicket) {
          // Confirm additional ticket payment
          const confirmRequest: ConfirmAdditionalTicketRequest = {
            existingTicketId: existingTicket._id,
            paymentIntentId: paymentIntent.id,
            additionalTicketDetails: ticketDetails
          };

          const confirmResponse = await ticketService.confirmAdditionalTicketPayment(confirmRequest);

          if (confirmResponse.success) {
            onSuccess();
          } else {
            setError(confirmResponse.message || t('payment.confirmationFailed'));
          }
        } else {
          // Confirm the payment for new purchase
          const purchaseData = response.data as TicketPurchaseResponse;
          const confirmResponse = await ticketService.confirmTicketPayment(purchaseData.ticketId);

          if (confirmResponse.success) {
            onSuccess();
          } else {
            setError(confirmResponse.message || t('payment.confirmationFailed'));
          }
        }
      } else {
        setError(t('payment.paymentNotCompleted'));
      }
    } catch (err) {
      console.error('Purchase error:', err);
      setError(t('payment.purchaseFailed'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quantity Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {isAddingToExisting ? t('payment.additionalQuantity') : t('payment.quantity')}
        </label>
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="w-12 h-12 rounded-full"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
            </Button>
          <div className="px-6 py-3 border-2 border-[var(--sage-green)] rounded-lg min-w-[80px] text-center">
            <span className="text-2xl font-bold text-[var(--sage-green)]">{quantity}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(quantity + 1)}
            className="w-12 h-12 rounded-full"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Ticket Details */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {isAddingToExisting ? t('payment.additionalAttendeeDetails') : t('payment.attendeeDetails')}
        </label>
        <div className="space-y-4">
          {ticketDetails.map((detail, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-[var(--sage-green)] text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  {index + 1}
                </div>
                <h4 className="font-medium text-gray-900">
                  {t('payment.ticket')} {index + 1}
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {t('payment.attendeeName')}
                  </label>
                  <Input
                    placeholder={t('payment.attendeeName')}
                    value={detail.attendeeName}
                    onChange={(e) => handleTicketDetailChange(index, 'attendeeName', e.target.value)}
                    className="text-md w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {t('payment.attendeeEmail')}
                  </label>
                  <Input
                    type="email"
                    placeholder={t('payment.attendeeEmail')}
                    value={detail.attendeeEmail}
                    onChange={(e) => handleTicketDetailChange(index, 'attendeeEmail', e.target.value)}
                    className="text-md w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Form */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {t('payment.cardDetails')}
        </label>
        <div className="border border-gray-300 rounded-lg p-4 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#374151',
                  '::placeholder': {
                    color: '#9CA3AF',
                  },
                },
                invalid: {
                  color: '#EF4444',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Purchase Button */}
      <Button
        onClick={handlePurchase}
        disabled={isProcessing || !stripe}
        className="w-full bg-[var(--sage-green)] hover:bg-emerald-600 py-3 text-lg"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
            {t('payment.processing')}
          </div>
        ) : (
          `${isAddingToExisting ? t('payment.addTickets') : t('payment.purchase')} ${totalAmount} ${event.price.currency}`
        )}
      </Button>
    </div>
  );
}; 