'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/auth-context';
import { useLanguage } from '../../../i18n/language-context';
import StripeConnectSetup from '../../../components/organizer/StripeConnectSetup';
import PaymentSummary from '../../../components/organizer/PaymentSummary';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { ArrowLeft, CreditCard, TrendingUp, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import organizerService from '../../../services/organizer-service';

interface StripeAccountStatus {
  hasAccount: boolean;
  status: 'not_setup' | 'pending' | 'active';
  accountId?: string;
  detailsSubmitted?: boolean;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
}

interface PaymentSummaryData {
  totalTickets: number;
  totalRevenue: number;
  platformFees: number;
  organizerPayments: number;
  pendingTransfers: number;
  completedTransfers: number;
  failedTransfers: number;
  totalAttendees: number;
  paidTickets: number;
  pendingTickets: number;
  refundedTickets: number;
}

export default function StripeConnectPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [accountStatus, setAccountStatus] = useState<StripeAccountStatus | null>(null);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'organizer') {
      router.push('/unauthorized');
      return;
    }
    fetchAccountStatus();
    fetchPaymentSummary();
  }, [user, router]);

  const fetchAccountStatus = async () => {
    try {
      const data = await organizerService.getStripeAccountStatus();
      setAccountStatus(data);
    } catch (error) {
      console.error('Error fetching account status:', error);
    }
  };

  const fetchPaymentSummary = async () => {
    try {
      const data = await organizerService.getPaymentSummary();
      setPaymentSummary(data);
    } catch (error) {
      console.error('Error fetching payment summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/organizer');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading payment information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={handleBack}
            variant="outline"
            className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center mb-4">
            <CreditCard className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Payment Setup</h1>
          </div>
          
          <p className="text-gray-600">
            Set up your Stripe Connect account to receive payments from ticket sales.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stripe Connect Setup */}
          <div className="lg:col-span-2">
            <StripeConnectSetup />
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {paymentSummary ? (
                  <div className="space-y-4">                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{t('payment.totalRevenue')}</span>
                      <span className="font-semibold text-green-600">
                        CHF {paymentSummary.totalRevenue.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{t('payment.platformFees')}</span>
                      <span className="font-semibold text-red-600">
                        CHF {paymentSummary.platformFees.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{t('payment.yourEarnings')}</span>
                      <span className="font-semibold text-blue-600">
                        CHF {paymentSummary.organizerPayments.toFixed(2)}
                      </span>
                    </div>
                    
                    <hr className="my-4" />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{t('payment.pendingTransfers')}</span>
                        <span className="font-semibold text-yellow-600">
                          {paymentSummary.pendingTransfers}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{t('payment.completedTransfers')}</span>
                        <span className="font-semibold text-green-600">
                          {paymentSummary.completedTransfers}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{t('payment.failedTransfers')}</span>
                        <span className="font-semibold text-red-600">
                          {paymentSummary.failedTransfers}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No payment data available</p>
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