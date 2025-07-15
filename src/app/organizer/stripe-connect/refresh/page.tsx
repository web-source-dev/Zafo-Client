'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import { RefreshCw, ArrowRight, AlertCircle } from 'lucide-react';
import organizerService from '../../../../services/organizer-service';

export default function StripeConnectRefreshPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRefreshAccount = async () => {
    setIsLoading(true);
    try {
      const data = await organizerService.createAccountLink();
      window.location.href = data.accountLink;
    } catch (error) {
      console.error('Error refreshing account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push('/organizer/stripe-connect');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <RefreshCw className="h-16 w-16 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Complete Account Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                It looks like your Stripe Connect account setup was interrupted. 
                Click the button below to continue with the setup process.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-blue-800 text-sm">
                    You'll be redirected to Stripe to complete your account verification.
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleRefreshAccount}
                disabled={isLoading}
                className="w-full flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Continue Setup
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="w-full"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 