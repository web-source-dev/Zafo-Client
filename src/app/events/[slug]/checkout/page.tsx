'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/auth/auth-context';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import eventService, { Event } from '@/services/event-service';
import ticketService from '@/services/ticket-service';
import Image from 'next/image';
import { Calendar, MapPin, User, ArrowLeft, CreditCard, FileText, Loader, Plus, Minus, Users } from 'lucide-react';
import Link from 'next/link';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Checkout Form Component
const CheckoutForm = ({ event, clientSecret, ticketOrderId, paymentIntentId, onSuccess, attendeeInfo }: {
  event: Event;
  clientSecret: string;
  ticketOrderId: string;
  paymentIntentId: string;
  attendeeInfo: Array<{name: string, email: string}>;
  onSuccess: (result: { pdfUrl: string }) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }
    
    setProcessing(true);
    setError(null);
    
    try {
      // Complete payment with card details
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }
      
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });
      
      if (paymentError) {
        setError(paymentError.message || 'Payment failed');
        setProcessing(false);
        return;
      }
      
      // If payment succeeded, complete the ticket purchase on the backend
      if (paymentIntent?.status === 'succeeded') {
        const response = await ticketService.completeTicketPurchase({
          paymentIntentId,
          ticketOrderId,
          attendeeInfo
        });
        
        if (response.success && response.data) {
          setSucceeded(true);
          toast.success('Payment successful! Your tickets are ready.');
          
          // Pass the PDF URL to the parent component
          onSuccess({
            pdfUrl: response.data.pdfUrl
          });
        } else {
          setError(response.message || 'Failed to complete ticket purchase');
        }
      } else {
        setError('Payment not completed. Please try again.');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'An error occurred while processing your payment');
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Card Details
        </label>
        <div className="p-3 border rounded-md bg-white">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
      
      <Button 
        type="submit" 
        disabled={processing || succeeded || !stripe} 
        className="w-full"
        size="lg"
      >
        {processing ? (
          <span className="flex items-center">
            <Loader className="animate-spin mr-2 h-4 w-4" />
            Processing...
          </span>
        ) : succeeded ? (
          'Payment Successful'
        ) : (
          `Pay ${event.price.isFree ? 'Free' : `${event.price.amount} ${event.price.currency}`}`
        )}
      </Button>
    </form>
  );
};

// Main Checkout Page Component
export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  // Payment state
  const [clientSecret, setClientSecret] = useState<string>('');
  const [ticketOrderId, setTicketOrderId] = useState<string>('');
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [initiatingPayment, setInitiatingPayment] = useState(false);
  
  // Capacity limits
  const [maxCapacity, setMaxCapacity] = useState(1);
  const [remainingCapacity, setRemainingCapacity] = useState(0);
  
  // Attendee information state
  const [attendeeInfo, setAttendeeInfo] = useState<Array<{name: string, email: string}>>([{name: '', email: ''}]);
  const [showAttendeeFields, setShowAttendeeFields] = useState(false);
  
  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!params.slug || typeof params.slug !== 'string') {
          setError('Invalid event slug');
          setLoading(false);
          return;
        }
        
        // Redirect to login if not authenticated
        if (!isAuthenticated) {
          router.push(`/login?redirect=/events/${params.slug}/checkout`);
          return;
        }
        
        const response = await eventService.getEvent(params.slug);
        if (response.success && response.data) {
          setEvent(response.data);
          
          // Set maximum capacity (for ticket quantity selection)
          setMaxCapacity(response.data.capacity);
          setRemainingCapacity(response.data.capacity);
        } else {
          setError(response.message || 'Failed to load event details');
        }
      } catch (err: any) {
        console.error('Error fetching event:', err);
        setError('An error occurred while loading the event');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [params.slug, isAuthenticated, router]);
  
  // Update attendee fields when quantity changes
  useEffect(() => {
    if (quantity > attendeeInfo.length) {
      // Add more attendee fields
      const newAttendeeInfo = [...attendeeInfo];
      for (let i = attendeeInfo.length; i < quantity; i++) {
        newAttendeeInfo.push({ name: '', email: '' });
      }
      setAttendeeInfo(newAttendeeInfo);
    } else if (quantity < attendeeInfo.length) {
      // Remove extra attendee fields
      setAttendeeInfo(attendeeInfo.slice(0, quantity));
    }
  }, [quantity]);
  
  // Handle quantity change
  const incrementQuantity = () => {
    if (quantity < remainingCapacity) {
      setQuantity(quantity + 1);
    } else {
      toast.error(`Only ${remainingCapacity} tickets available for this event`);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  // Handle attendee information updates
  const updateAttendeeInfo = (index: number, field: 'name' | 'email', value: string) => {
    const updatedInfo = [...attendeeInfo];
    updatedInfo[index] = { ...updatedInfo[index], [field]: value };
    setAttendeeInfo(updatedInfo);
  };
  
  // Initiate payment
  const initiatePayment = async () => {
    if (!event) return;
    
    setInitiatingPayment(true);
    setError(null);
    
    try {
      const response = await ticketService.initiateTicketPurchase({
        eventId: event._id,
        quantity
      });
      
      if (response.success && response.data) {
        // Set payment data for Stripe Elements
        setClientSecret(response.data.clientSecret);
        setTicketOrderId(response.data.ticketOrderId);
        setPaymentIntentId(response.data.paymentIntentId);
        
        // Show attendee fields for entering information before payment
        setShowAttendeeFields(true);
      } else {
        setError(response.message || 'Failed to initiate payment');
      }
    } catch (err: any) {
      console.error('Error initiating payment:', err);
      setError(err.message || 'An error occurred while setting up payment');
    } finally {
      setInitiatingPayment(false);
    }
  };
  
  // Handle successful payment
  const handlePaymentSuccess = (result: { pdfUrl: string }) => {
    setPaymentProcessed(true);
    setPdfUrl(result.pdfUrl);
  };
  
  // Handle view tickets click
  const handleViewTickets = () => {
    router.push('/tickets');
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--sage-green)]"></div>
      </div>
    );
  }
  
  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-semibold text-[var(--sage-green)] mb-4">
            {error || 'Event not found'}
          </h2>
          <p className="text-gray-600 mb-6">
            The event you're looking for might have been removed or is not available.
          </p>
          <Button onClick={() => router.push('/events')}>
            Back to Events
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-[var(--taupe)] min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <div className="mb-6">
          <Link href={`/events/${event.slug}`} className="inline-flex items-center text-[var(--sage-green)] hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Event
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6 text-[var(--sage-green)]">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Event image */}
                {event.coverImage && (
                  <div className="rounded-md overflow-hidden">
                    <Image
                      src={event.coverImage}
                      alt={event.title}
                      width={500}
                      height={300}
                      className="w-full h-48 object-contain"
                    />
                  </div>
                )}
                
                {/* Event details */}
                <div>
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.smallDescription}</p>
                </div>
                
                {/* Date and location */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-[var(--sage-green)]" />
                    <span>
                      {format(parseISO(event.startDate.toString()), 'EEEE, MMMM d, yyyy • h:mm a')}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-[var(--sage-green)]" />
                    <span>
                      {event.location.online 
                        ? 'Online Event' 
                        : `${event.location.name}, ${event.location.address.city}`}
                    </span>
                  </div>
                </div>
                
                {/* Price */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between mb-2">
                    <span>Ticket Price:</span>
                    <span>{event.price.isFree ? 'Free' : `${event.price.amount} ${event.price.currency}`}</span>
                  </div>
                  {clientSecret ? (
                    <>
                      <div className="flex justify-between mb-2">
                        <span>Quantity:</span>
                        <span>{quantity}</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2 border-t">
                        <span>Total:</span>
                        <span>
                          {event.price.isFree 
                            ? 'Free' 
                            : `${(event.price.amount * quantity).toFixed(2)} ${event.price.currency}`}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-1">
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                          Number of Tickets:
                        </label>
                        <div className="text-xs text-gray-600 flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{remainingCapacity} available</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center border rounded-md overflow-hidden bg-white">
                        <button 
                          type="button"
                          onClick={decrementQuantity}
                          disabled={quantity <= 1 || initiatingPayment}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        
                        <div className="flex-1 text-center py-2 font-medium">
                          {quantity}
                        </div>
                        
                        <button 
                          type="button"
                          onClick={incrementQuantity}
                          disabled={quantity >= remainingCapacity || initiatingPayment}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="flex justify-between font-bold mt-4 pt-2 border-t">
                        <span>Total:</span>
                        <span>
                          {event.price.isFree 
                            ? 'Free' 
                            : `${(event.price.amount * quantity).toFixed(2)} ${event.price.currency}`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              
              {!clientSecret && !paymentProcessed && (
                <CardFooter>
                  <Button 
                    onClick={initiatePayment} 
                    className="w-full"
                    disabled={initiatingPayment}
                  >
                    {initiatingPayment ? (
                      <span className="flex items-center">
                        <Loader className="animate-spin mr-2 h-4 w-4" />
                        Processing...
                      </span>
                    ) : (
                      'Continue to Payment'
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
          
          {/* Payment form or success message */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">
                  {paymentProcessed 
                    ? 'Order Successful!' 
                    : clientSecret 
                      ? showAttendeeFields ? 'Attendee Information' : 'Payment Details'
                      : 'Checkout'}
                </h2>
              </CardHeader>
              <CardContent>
                {paymentProcessed ? (
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-800">
                      <div className="flex items-center mb-2">
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Payment Successful!</span>
                      </div>
                      <p>Thank you for your purchase. Your tickets are ready.</p>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Your Tickets</h3>
                      
                      <div className="flex flex-col space-y-4">
                        {/* Download PDF button */}
                        {pdfUrl && (
                          <a 
                            href={pdfUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center justify-center bg-[var(--sage-green)] text-white py-2 px-4 rounded-md hover:bg-[#3a5233] transition-colors"
                          >
                            <FileText className="h-5 w-5 mr-2" />
                            Download Tickets (PDF)
                          </a>
                        )}
                        
                        {/* View all tickets button */}
                        <Button 
                          variant="outline" 
                          onClick={handleViewTickets}
                          className="inline-flex items-center justify-center"
                        >
                          <CreditCard className="h-5 w-5 mr-2" />
                          View All My Tickets
                        </Button>
                      </div>
                      
                      {/* Event information */}
                      <div className="mt-6 pt-6 border-t">
                        <h4 className="font-medium mb-2">Event Information</h4>
                        <p className="text-sm text-gray-600">
                          Please keep your tickets safe. You'll need to present them (either printed or on your mobile device) at the event.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : clientSecret ? (
                  showAttendeeFields ? (
                    <div className="space-y-6">
                      <p className="text-sm text-gray-600 mb-4">
                        Please enter attendee information for each ticket. This information will be printed on the tickets.
                      </p>
                      
                      <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-6">
                        {attendeeInfo.map((attendee, index) => (
                          <div key={index} className="p-4 border rounded-md bg-gray-50">
                            <h3 className="font-medium mb-3">Ticket #{index + 1}</h3>
                            
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Full Name
                                </label>
                                <input
                                  type="text"
                                  value={attendee.name}
                                  onChange={(e) => updateAttendeeInfo(index, 'name', e.target.value)}
                                  className="w-full p-2 border rounded-md"
                                  placeholder="Enter attendee name"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Email
                                </label>
                                <input
                                  type="email"
                                  value={attendee.email}
                                  onChange={(e) => updateAttendeeInfo(index, 'email', e.target.value)}
                                  className="w-full p-2 border rounded-md"
                                  placeholder="Enter attendee email"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex space-x-3 pt-4 border-t">
                        <Button onClick={() => setShowAttendeeFields(false)} className="flex-1">
                          Continue to Payment
                        </Button>
                        <Button variant="outline" onClick={() => setShowAttendeeFields(false)} className="flex-1">
                          Skip for Now
                        </Button>
                      </div>
                      
                      <p className="text-xs text-gray-500 italic">
                        Note: You can also update attendee information after purchase from your tickets page.
                      </p>
                    </div>
                  ) : (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <CheckoutForm 
                        event={event} 
                        clientSecret={clientSecret} 
                        ticketOrderId={ticketOrderId}
                        paymentIntentId={paymentIntentId}
                        attendeeInfo={attendeeInfo}
                        onSuccess={handlePaymentSuccess}
                      />
                    </Elements>
                  )
                ) : (
                  <div className="text-center py-6">
                    <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Ready to get your tickets?</h3>
                    <p className="text-gray-600 mb-4">
                      Select the number of tickets you want and continue to payment.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 