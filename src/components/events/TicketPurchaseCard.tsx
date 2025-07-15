'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Event } from '@/services/event-service';
import ticketService, { TicketPurchaseRequest, TicketPurchaseResponse, TicketDetail } from '@/services/ticket-service';
import { useAuth } from '@/auth/auth-context';
import { useLanguage } from '@/i18n/language-context';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { formatDate } from '@/utils/dateUtils';

// Load Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface TicketPurchaseCardProps {
  event: Event;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const TicketPurchaseForm: React.FC<{ event: Event; onSuccess?: () => void; onCancel?: () => void }> = ({ 
  event, 
  onSuccess, 
  onCancel 
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [purchaseData, setPurchaseData] = useState<TicketPurchaseResponse | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [ticketDetails, setTicketDetails] = useState<TicketDetail[]>([
    { attendeeName: '', attendeeEmail: '', ticketNumber: 1 }
  ]);

  // Calculate ticket price (use event price or default)
  const ticketPrice = event.price.isFree ? 0 : event.price.amount;
  const totalTicketPrice = ticketPrice * quantity;
  // Platform fee is included in the ticket price (10% of total)
  const platformFee = Math.round(totalTicketPrice * 0.10 * 100) / 100;
  const organizerPayment = totalTicketPrice - platformFee;
  const totalAmount = totalTicketPrice; // Total amount is the ticket price (platform fee included)

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setQuantity(newQuantity);
    
    // Update ticket details array
    const newTicketDetails: TicketDetail[] = [];
    for (let i = 0; i < newQuantity; i++) {
      newTicketDetails.push({
        attendeeName: ticketDetails[i]?.attendeeName || '',
        attendeeEmail: ticketDetails[i]?.attendeeEmail || user?.email || '',
        ticketNumber: i + 1
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
      ticketNumber: index + 1
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
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(detail.attendeeEmail)) {
        setError(t('payment.invalidEmail', { ticketNumber: String(i + 1) }));
        return false;
      }
    }
    return true;
  };

  const handlePurchase = async () => {
    if (!stripe || !elements || !user) {
      setError(t('payment.stripeNotLoaded'));
      return;
    }

    // Validate ticket details
    if (!validateTicketDetails()) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create ticket purchase
      const purchaseRequest: TicketPurchaseRequest = {
        eventId: event._id,
        ticketPrice: ticketPrice,
        currency: event.price.currency || 'CHF',
        quantity: quantity,
        ticketDetails: ticketDetails
      };

      const response = await ticketService.createTicketPurchase(purchaseRequest);

      if (!response.success) {
        setError(response.message || t('payment.purchaseFailed'));
        return;
      }

      setPurchaseData(response.data!);

      // Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        response.data!.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || t('payment.stripeError'));
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm the payment with our backend
        const confirmResponse = await ticketService.confirmTicketPayment(response.data!.ticketId);

        if (confirmResponse.success) {
          // Show success message
          setError(null);
          if (onSuccess) {
            onSuccess();
          } else {
            router.push('/dashboard/tickets');
          }
        } else {
          setError(confirmResponse.message || t('payment.confirmationFailed'));
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

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--sage-green)] to-emerald-600 px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{t('payment.purchaseTicket')}</h2>
          <button
            onClick={handleCancel}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Event Info */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>{formatDate(new Date(event.startDate))}</span>
            <span>•</span>
            <span>{event.location.name}</span>
          </div>
        </div>

        {/* Quantity Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('payment.quantity')}
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
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('payment.attendeeDetails')}
          </label>
          <div className="space-y-4 max-h-60 overflow-y-auto">
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
        
        {/* Price Breakdown */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-3">{t('payment.priceBreakdown')}</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('payment.ticketPrice')} ({quantity} × {ticketPrice} {event.price.currency})</span>
              <span className="font-medium">{totalTicketPrice} {event.price.currency}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{t('payment.platformFee')} (10%)</span>
              <span>{platformFee} {event.price.currency}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{t('payment.organizerPayment')} (90%)</span>
              <span>{organizerPayment} {event.price.currency}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold text-lg">
                <span>{t('payment.total')}</span>
                <span className="text-[var(--sage-green)]">{totalAmount} {event.price.currency}</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Payment Form */}
        <div className="mb-6">
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

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isProcessing}
            className="flex-1"
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={isProcessing || !stripe}
            className="flex-1 bg-[var(--sage-green)] hover:bg-emerald-600"
          >
            {isProcessing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                {t('payment.processing')}
              </div>
            ) : (
              `${t('payment.purchase')} ${totalAmount} ${event.price.currency}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

const TicketPurchaseCard: React.FC<TicketPurchaseCardProps> = ({ event, onSuccess, onCancel }) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">{t('payment.loginRequired')}</h3>
          <p className="text-gray-600 mb-4">{t('payment.loginToPurchase')}</p>
          <Button onClick={() => window.location.href = '/login'} className="w-full">
            {t('common.login')}
          </Button>
        </div>
      </div>
    );
  }

  // Check if user is the organizer
  const eventOrganizerId = typeof event.organizer === 'string' 
    ? event.organizer 
    : event.organizer._id;
    
  if (user._id === eventOrganizerId) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">{t('payment.organizerCannotPurchase')}</h3>
          <p className="text-gray-600">{t('payment.organizerCannotPurchaseDesc')}</p>
        </div>
      </div>
    );
  }

  // Check if event is free
  if (event.price.isFree) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center">
          <div className="text-green-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">{t('payment.freeEvent')}</h3>
          <p className="text-gray-600 mb-4">{t('payment.freeEventDesc')}</p>
          <Button onClick={onSuccess} className="w-full">
            {t('payment.registerForFree')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Elements stripe={stripePromise}>
        <TicketPurchaseForm event={event} onSuccess={onSuccess} onCancel={onCancel} />
      </Elements>
    </div>
  );
};

export default TicketPurchaseCard; 