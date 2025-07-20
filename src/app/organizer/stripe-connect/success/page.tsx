'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import { CheckCircle, ArrowRight, CreditCard } from 'lucide-react';
import organizerService from '../../../../services/organizer-service';

interface StripeAccountStatus {
  hasAccount: boolean;
  status: 'not_setup' | 'pending' | 'active';
  accountId?: string;
  detailsSubmitted?: boolean;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
}

export default function StripeConnectSuccessPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [accountStatus, setAccountStatus] = useState<StripeAccountStatus | null>(null);

  useEffect(() => {
    // Check account status after successful onboarding
    checkAccountStatus();
  }, []);

  const checkAccountStatus = async () => {
    try {
      const data = await organizerService.getStripeAccountStatus();
      setAccountStatus(data);
    } catch (error) {
      console.error('Error checking account status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    router.push('/organizer/stripe-connect');
  };

  const handleGoToDashboard = () => {
    router.push('/organizer');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Account Setup Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Your Stripe Connect account has been successfully set up.
              </p>
              
              {accountStatus?.status === 'active' ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">
                      Your account is active and ready to receive payments!
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-yellow-800">
                      Your account is being verified. You&apos;ll receive payments once verification is complete.
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleContinue}
                className="w-full flex items-center justify-center"
              >
                Continue to Payment Setup
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              
              <Button
                onClick={handleGoToDashboard}
                variant="outline"
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 